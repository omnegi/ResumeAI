import json
import re
import uuid
from typing import TypedDict, Optional, Any

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

from app.config import settings

# Loaded once at import time and reused across requests (embedding models are heavy).
_embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)

# Side-channel for FAISS vectorstores: LangGraph enforces strict TypedDict schema
# and drops unknown keys between nodes. Since FAISS is not serializable we stash
# it here keyed by a per-run ID and clean it up after the pipeline finishes.
_vectorstore_cache: dict[str, Any] = {}


class RagState(TypedDict):
    run_id: str                      # key into _vectorstore_cache
    resume_text: str
    job_description: str
    retrieved_context: Optional[str]
    llm_raw_output: Optional[str]
    result: Optional[dict]


def _split_and_embed(state: RagState) -> RagState:
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(state["resume_text"])
    if not chunks:
        chunks = [state["resume_text"]]

    vectorstore = FAISS.from_texts(chunks, _embeddings)
    # Store in module-level cache — LangGraph won't drop it between nodes.
    _vectorstore_cache[state["run_id"]] = vectorstore
    return state


def _retrieve(state: RagState) -> RagState:
    vectorstore = _vectorstore_cache.get(state["run_id"])
    if vectorstore is None:
        raise RuntimeError("Vectorstore not found in cache — split_and_embed must run first.")
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    docs = retriever.invoke(state["job_description"])
    state["retrieved_context"] = "\n---\n".join(d.page_content for d in docs)
    return state


PROMPT_TEMPLATE = """You are an expert technical recruiter and resume reviewer.

Compare the RESUME CONTEXT below against the JOB DESCRIPTION and evaluate the fit.

RESUME CONTEXT (most relevant excerpts):
{context}

JOB DESCRIPTION:
{job_description}

Respond ONLY with valid JSON, no markdown fences, no extra text, in exactly this shape:
{{
  "match_score": <integer 0-100>,
  "strengths": ["short bullet", "short bullet"],
  "gaps": ["short bullet", "short bullet"],
  "suggestions": ["short bullet", "short bullet"],
  "weaknesses": ["short bullet", "short bullet"],
  "matching_skills": ["SkillName1", "SkillName2"],
  "missing_skills": ["SkillName1", "SkillName2"],
  "upskilling_resources": ["SkillName: resource suggestion", "SkillName: resource suggestion"],
  "detailed_review": {{
    "recruiter_summary": "Overall fit evaluation from a technical hiring manager's perspective (2-3 sentences)",
    "formatting_score": <integer 0-100 based on layout, readability, sections, and length>,
    "formatting_details": ["bullet point feedback on formatting", "bullet point feedback"],
    "impact_score": <integer 0-100 based on quantifiable metrics, action verbs, and results-oriented points>,
    "impact_details": ["bullet point feedback on accomplishments and impact", "bullet point feedback"],
    "keyword_density": [
      {{"keyword": "React", "count": 4, "importance": "high"}},
      {{"keyword": "Docker", "count": 0, "importance": "high"}}
    ]
  }}
}}
"""


def _analyze_with_llm(state: RagState) -> RagState:
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.2,
    )
    prompt = PROMPT_TEMPLATE.format(
        context=state["retrieved_context"],
        job_description=state["job_description"],
    )
    response = llm.invoke(prompt)
    state["llm_raw_output"] = response.content
    return state


def _parse_output(state: RagState) -> RagState:
    raw = state["llm_raw_output"] or "{}"
    cleaned = re.sub(r"^```json|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        parsed = {
            "match_score": None,
            "strengths": [],
            "gaps": [],
            "suggestions": [],
            "weaknesses": [],
            "matching_skills": [],
            "missing_skills": [],
            "upskilling_resources": [],
            "detailed_review": {},
            "note": "Could not parse structured output; see raw_feedback.",
        }
    state["result"] = parsed
    return state


def _build_graph():
    graph = StateGraph(RagState)
    graph.add_node("split_and_embed", _split_and_embed)
    graph.add_node("retrieve", _retrieve)
    graph.add_node("analyze_with_llm", _analyze_with_llm)
    graph.add_node("parse_output", _parse_output)

    graph.set_entry_point("split_and_embed")
    graph.add_edge("split_and_embed", "retrieve")
    graph.add_edge("retrieve", "analyze_with_llm")
    graph.add_edge("analyze_with_llm", "parse_output")
    graph.add_edge("parse_output", END)

    return graph.compile()


_rag_app = _build_graph()


def analyze_resume(resume_text: str, job_description: str) -> dict:
    """Public entrypoint used by the resume router."""
    run_id = str(uuid.uuid4())
    try:
        final_state = _rag_app.invoke(
            {
                "run_id": run_id,
                "resume_text": resume_text,
                "job_description": job_description,
            }
        )
    finally:
        # Always clean up the vectorstore to avoid unbounded memory growth.
        _vectorstore_cache.pop(run_id, None)

    result = final_state["result"] or {}
    detailed_review_dict = result.get("detailed_review", {})
    detailed_review_str = json.dumps(detailed_review_dict) if detailed_review_dict else None

    return {
        "match_score": result.get("match_score"),
        "strengths": "\n".join(result.get("strengths", [])) if isinstance(result.get("strengths"), list) else None,
        "gaps": "\n".join(result.get("gaps", [])) if isinstance(result.get("gaps"), list) else None,
        "suggestions": "\n".join(result.get("suggestions", [])) if isinstance(result.get("suggestions"), list) else None,
        "weaknesses": "\n".join(result.get("weaknesses", [])) if isinstance(result.get("weaknesses"), list) else None,
        "matching_skills": "\n".join(result.get("matching_skills", [])) if isinstance(result.get("matching_skills"), list) else None,
        "missing_skills": "\n".join(result.get("missing_skills", [])) if isinstance(result.get("missing_skills"), list) else None,
        "upskilling_resources": "\n".join(result.get("upskilling_resources", [])) if isinstance(result.get("upskilling_resources"), list) else None,
        "detailed_review": detailed_review_str,
        "raw_feedback": final_state.get("llm_raw_output"),
    }

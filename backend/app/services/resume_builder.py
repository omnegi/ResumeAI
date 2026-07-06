"""Resume Builder feature: turn structured user input into a polished resume,
optionally tailored to a target job description, using the Groq LLM directly
(no retrieval needed here — this is generation, not analysis)."""

from langchain_groq import ChatGroq

from app.config import settings
from app.schemas import BuildResumeRequest

PROMPT_TEMPLATE = """You are a professional resume writer.

Using the structured details below, write a clean, ATS-friendly resume in plain text.
Use clear section headers written in ALL CAPS on their own line (e.g. SUMMARY, SKILLS,
EXPERIENCE, EDUCATION, PROJECTS). Use "- " for bullet points under experience/projects.
Keep it concise, achievement-focused, and professional. Do not invent facts not implied
by the input. Do not include any preamble or explanation, output only the resume text.

CANDIDATE DETAILS:
Name: {full_name}
Email: {email}
Phone: {phone}
Location: {location}
Target role: {target_role}
Summary (optional draft from candidate): {summary}
Skills: {skills}

Education:
{education}

Experience:
{experience}

Projects: {projects}

{jd_block}
"""


def _format_education(items) -> str:
    if not items:
        return "None provided."
    lines = []
    for e in items:
        lines.append(
            f"- {e.degree}, {e.institution} ({e.start_year or '?'}-{e.end_year or 'present'}) {e.details or ''}"
        )
    return "\n".join(lines)


def _format_experience(items) -> str:
    if not items:
        return "None provided."
    lines = []
    for e in items:
        lines.append(
            f"- {e.role} at {e.company} ({e.start_date or '?'} - {e.end_date or 'present'}): {e.description or ''}"
        )
    return "\n".join(lines)


def build_resume(data: BuildResumeRequest) -> str:
    jd_block = (
        f"Tailor keywords and emphasis toward this job description:\n{data.job_description}"
        if data.job_description
        else ""
    )

    prompt = PROMPT_TEMPLATE.format(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone or "N/A",
        location=data.location or "N/A",
        target_role=data.target_role or "N/A",
        summary=data.summary or "N/A",
        skills=", ".join(data.skills) if data.skills else "N/A",
        education=_format_education(data.education),
        experience=_format_experience(data.experience),
        projects=data.projects or "N/A",
        jd_block=jd_block,
    )

    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.4,
    )
    response = llm.invoke(prompt)
    return response.content.strip()


TAILOR_PROMPT_TEMPLATE = """You are a conversational AI resume editor. Your task is to update the candidate's resume OR ask for clarification/details if the instruction is too broad or missing details.

CURRENT RESUME CONTENT:
\"\"\"
{current_content}
\"\"\"

CONVERSATION HISTORY:
{chat_history}

USER'S CURRENT INSTRUCTION:
{user_prompt}

CRITICAL RULES:
1. If the user's instruction is broad (e.g. "Help me add a new experience", "Add a project", "Change my education info") but does not provide details like company name, role/title, dates, or descriptions:
   - Do NOT modify the resume content. Keep "modified_content" EXACTLY the same as the CURRENT RESUME CONTENT.
   - Set "message" to a polite conversational response asking for the specific details needed to make the change (e.g. "Absolutely! Let's get a new work experience added. To start, could you share the basic details: 1. Company name, 2. Role/Title, 3. Location, 4. Start Date, 5. End Date. Once I have these, I'll add the entry right away!").
2. If the user's prompt (or their response when combined with the previous questions in the history) provides the details:
   - Perform the edits and update the resume text. Return the complete modified resume in "modified_content".
   - Set "message" to a brief summary explaining the change (e.g. "Added a new software developer experience at TechCorp.").

Respond ONLY with valid JSON in exactly this shape:
{{
  "modified_content": "Resume text",
  "message": "AI message response"
}}
"""

def tailor_resume_interactive(current_content: str, user_prompt: str, history: list = None) -> dict:
    import json
    import re
    
    # Format chat history
    history_str = ""
    if history:
      for h in history:
        sender_name = "User" if h.get("sender") == "user" else "Assistant"
        history_str += f"{sender_name}: {h.get('text')}\n"
    if not history_str:
      history_str = "None. This is the start of the conversation."

    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.3,
        model_kwargs={"response_format": {"type": "json_object"}}
    )
    prompt = TAILOR_PROMPT_TEMPLATE.format(
        current_content=current_content,
        chat_history=history_str,
        user_prompt=user_prompt,
    )
    response = llm.invoke(prompt)
    raw = response.content.strip()
    cleaned = re.sub(r"^```json|```$", "", raw, flags=re.MULTILINE).strip()
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback regex extraction if standard json.loads fails
        message_match = re.search(r'"message"\s*:\s*"(.*?)"', cleaned, re.DOTALL)
        content_match = re.search(r'"modified_content"\s*:\s*"(.*?)"', cleaned, re.DOTALL)
        
        message = message_match.group(1) if message_match else "I processed your request, but could not format the response properly."
        modified_content = content_match.group(1) if content_match else current_content
        
        # Unescape quotes and newlines
        message = message.replace('\\n', '\n').replace('\\"', '"')
        modified_content = modified_content.replace('\\n', '\n').replace('\\"', '"')
        
        parsed = {
            "modified_content": modified_content,
            "message": message
        }
    return parsed


# AI Resume Analyzer — Backend

FastAPI backend with **3 core features**:

1. **Resume Analyzer** — upload a resume (PDF/DOCX/TXT), then run a simple
   RAG pipeline (LangGraph + FAISS + HuggingFace embeddings + Groq LLM) that
   scores it against a job description and returns strengths/gaps/suggestions.
2. **Resume Builder** — fill in structured details (name, skills, experience,
   education...) and get an AI-generated, ATS-friendly resume as text + a
   downloadable PDF.
3. **Cover Letter Generator** — generate a tailored cover letter from one of
   your saved resumes + a job description, downloadable as PDF.

Plus: JWT authentication, a SQLite database (swap-able for Postgres), and a
`/dashboard/summary` endpoint for a frontend dashboard (counts, average match
score, recent activity).

---

## Tech stack

- **FastAPI** — API layer
- **LangGraph** — orchestrates the analyzer's RAG pipeline (linear: embed → retrieve → analyze → parse)
- **LangChain + langchain-groq** — LLM calls to Groq
- **HuggingFace `sentence-transformers/all-MiniLM-L6-v2`** — embeddings (local, free, no API key needed)
- **FAISS** — in-memory vector store per analysis request
- **SQLAlchemy + SQLite** — database / ORM
- **python-jose + passlib** — JWT auth + password hashing
- **reportlab** — PDF generation for builder & cover letter outputs

---

## Setup

```bash
cd resume-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# then edit .env and set GROQ_API_KEY (get one free at https://console.groq.com)
```

Run it:

```bash
uvicorn app.main:app --reload --port 8000
```

Open interactive API docs at: **http://localhost:8000/docs**

The SQLite DB file (`app.db`) and folders `uploads/` and `generated/` are
created automatically on first run.

---

## Auth flow

1. `POST /auth/register` — `{full_name, email, password}`
2. `POST /auth/login` — form-encoded `username` (= email) + `password` → returns `access_token`
3. Send `Authorization: Bearer <token>` header on every other request.

---

## Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET | `/auth/me` | Current user info |

### Feature 1 — Resume Analyzer (RAG)
| Method | Path | Description |
|---|---|---|
| POST | `/resume/upload` | Upload PDF/DOCX/TXT resume (multipart) |
| GET | `/resume/list` | List your uploaded/generated resumes |
| POST | `/resume/analyze` | `{resume_id, job_description}` → runs RAG pipeline, returns score + feedback |
| GET | `/resume/analyses` | List your past analyses |

### Feature 2 — Resume Builder
| Method | Path | Description |
|---|---|---|
| POST | `/builder/generate` | Structured resume data → generated text + PDF link |
| GET | `/builder/download/{resume_id}` | Download the generated PDF |

### Feature 3 — Cover Letter Generator
| Method | Path | Description |
|---|---|---|
| POST | `/cover-letter/generate` | `{resume_id, job_description, company_name}` → letter + PDF link |
| GET | `/cover-letter/download/{letter_id}` | Download the PDF |
| GET | `/cover-letter/list` | List your past cover letters |

### Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/summary` | Counts, average match score, recent resumes/analyses — feed this straight to a React dashboard |

---

## Notes on the RAG pipeline (kept intentionally simple)

`app/services/rag_pipeline.py` builds a 4-node linear LangGraph:

```
split_and_embed -> retrieve -> analyze_with_llm -> parse_output
```

- Resume text is chunked and embedded fresh per analysis request (no
  persistent vector DB — keeps things simple for v1; swap in Chroma/Pinecone
  later if you need persistence across requests).
- The job description is used as the retrieval query, so only the most
  relevant resume chunks reach the LLM — this is the actual "RAG" part.
- The Groq LLM is asked to return strict JSON (score, strengths, gaps,
  suggestions), which is parsed and stored in the `analyses` table.

## Next steps (when you're ready)

- Swap SQLite → Postgres by changing `DATABASE_URL` in `.env`.
- Add persistent per-user vector store if you want cross-session RAG memory.
- Frontend: React + TypeScript, calling these endpoints with the JWT stored
  in memory/httpOnly cookie.

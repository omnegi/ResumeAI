# ResumeAI - AI-Powered Career Platform

ResumeAI is a premium, full-stack AI career platform designed to help job seekers optimize their resumes, tailor them dynamically via chat, generate cover letters, and track application insights. It utilizes a state-of-the-art **Retrieval-Augmented Generation (RAG)** pipeline powered by Groq LLMs and local vector embeddings.

---

## 🌟 Core Features

### 1. 💬 Stateful Interactive Resume Tailor
- **Conversational Dialogue Agent:** When users issue broad instructions (e.g. *"Help me add a new experience"*), the chatbot dynamically asks sequential, structured follow-up questions instead of hallucinating missing data.
- **Interactive Workspace:** Live dual-panel workspace featuring an **Undo/Redo state stack**, **zoom scaling (50% - 150%)**, and suggested tailoring triggers.
- **ATS PDF Generator:** Generates a high-fidelity, two-column ATS-friendly ReportLab PDF layout mimicking the preview template on download.

### 2. 🔍 RAG-Powered Resume Analyzer
- **ATS Quality Audit:** Breakdown of strengths, weaknesses, formatting checks, and action lists.
- **Job Matching Matrix:** Matches resume text against target Job Descriptions using local FAISS vector store indexing and Sentence-Transformer embedding models.
- **Skills Gap Analysis:** Displays matching/missing keywords, upskilling paths, and structured course suggestions.

### 3. ✍️ AI Resume Builder & Cover Letter Writer
- **Structured Builder:** Form-driven UI converting career history directly to clean formatting.
- **Cover Letter Generator:** Contextual cover letters matched to target roles and company names with one click.

---

## 📂 Project Directory Structure

```
resume_AI/
├── backend/
│   ├── app/
│   │   ├── routers/         # API Endpoint controllers (auth, builder, resume, dashboard)
│   │   ├── services/        # Business logic (RAG pipeline, PDF utils, Groq integrations)
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models.py        # SQLite Database models
│   │   └── schemas.py       # Pydantic validation schemas
│   ├── tests/               # Pytest integration & unit test suites
│   ├── Dockerfile           # Backend container config
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client calls
│   │   ├── components/      # UI components (animations, guards, gauges)
│   │   ├── context/         # React Auth and Theme contexts
│   │   └── pages/           # Pages (Landing, Dashboard, ResumeTailor, UploadResume)
│   ├── Dockerfile           # Multi-stage production Nginx container
│   ├── vercel.json          # SPA rewrite configs for Vercel
│   └── tailwind.config.js   # Tailored theme configs
├── docker-compose.yml       # Complete stack orchestrator
├── render.yaml              # Render Blueprint deployment template
└── README.md                # This document
```

---

## 🗄️ Database Architecture (SQLite)

The system uses an SQLite instance (`backend/app.db`) managed via SQLAlchemy ORM.

### Key Entities:
1. **`users`:** Core user credentials and profile records.
2. **`resumes`:** Uploaded raw text, metadata, and generated ReportLab PDF target paths.
3. **`analyses`:** RAG comparison outputs (`match_score`, `strengths`, `gaps`, `weaknesses`, `missing_skills`, `detailed_review`).
4. **`cover_letters`:** Generated cover letter document records.

---

## ⚙️ Local Development Setup

### Backend (Python FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file containing:
   ```env
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=llama-3.3-70b-versatile
   SECRET_KEY=generate_a_long_random_string
   ALGORITHM=HS256
   DATABASE_URL=sqlite:///./app.db
   EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
   ```
5. Apply database schema migrations:
   ```bash
   python migrate.py
   ```
6. Start the API server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend (React + TypeScript + Vite)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing Suite

We use **Pytest** with mock clients to test database and router endpoints in isolation.

To run tests:
```powershell
cd backend
$env:PYTHONPATH="."
.\venv\Scripts\python -m pytest tests/ -v
```

---

## 🐳 Docker Deployment

You can build and deploy the entire multi-container service stack locally using Docker Compose:

```bash
# Build and run backend and frontend containers
docker-compose up --build
```
- **Backend API:** Available at `http://localhost:8000`
- **Frontend SPA (Nginx):** Available at `http://localhost:80`

---

## 🌐 Production Cloud Deployment

### 1. Backend (Render Blueprint)
1. Log in to your Render Account.
2. Select **New +** > **Blueprint**.
3. Select this repository. It will read `render.yaml` and configure database directories, persistent storage volumes, and environment paths.
4. Input your production `GROQ_API_KEY` when prompted and click Deploy.

### 2. Frontend (Vercel SPA)
1. Log in to Vercel and import this repository.
2. Select the `frontend` folder as the Root Directory.
3. Configure the following environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** *Your backend Render URL* (e.g. `https://resume-ai-backend.onrender.com`)
4. Deploy the project. The SPA fallback routes are managed automatically by `frontend/vercel.json`.

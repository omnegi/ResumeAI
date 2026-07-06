from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401 ensures models are registered before create_all
from app.routers import (
    auth_routes,
    resume_routes,
    builder_routes,
    cover_letter_routes,
    dashboard_routes,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Backend with 3 features: Resume Analyzer (RAG), Resume Builder, Cover Letter Generator",
    version="1.0.0",
)

# Allow all localhost origins during development (any port Vite might pick).
# Replace with explicit production origins when deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,        # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(resume_routes.router)
app.include_router(builder_routes.router)
app.include_router(cover_letter_routes.router)
app.include_router(dashboard_routes.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Resume Analyzer API"}

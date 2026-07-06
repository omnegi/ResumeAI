import os
import shutil
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app import models, schemas, auth
from app.config import settings
from app.database import get_db
from app.utils.file_parser import extract_text_from_file
from app.services.rag_pipeline import analyze_resume

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])

ALLOWED_EXT = {".pdf", ".docx", ".txt"}


@router.post("/upload", response_model=schemas.ResumeOut)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Unsupported file type. Allowed: {ALLOWED_EXT}")

    safe_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, safe_name)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        raw_text = extract_text_from_file(dest_path)
    except Exception as e:
        print(f"Error parsing file {file.filename}: {e}")  # Internal server logging
        raise HTTPException(status_code=400, detail="Could not parse the uploaded file. Please verify it is a valid, uncorrupted PDF, DOCX, or TXT document.")

    if not raw_text:
        raise HTTPException(400, "No extractable text found in file.")

    resume = models.Resume(
        owner_id=current_user.id,
        source="upload",
        filename=file.filename,
        file_path=dest_path,
        raw_text=raw_text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/list", response_model=list[schemas.ResumeOut])
def list_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Resume)
        .filter(models.Resume.owner_id == current_user.id)
        .order_by(models.Resume.created_at.desc())
        .all()
    )


@router.post("/analyze", response_model=schemas.AnalysisOut)
def analyze(
    payload: schemas.AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == payload.resume_id, models.Resume.owner_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(404, "Resume not found")

    result = analyze_resume(resume.raw_text, payload.job_description)

    analysis = models.Analysis(
        owner_id=current_user.id,
        resume_id=resume.id,
        job_description=payload.job_description,
        match_score=result.get("match_score"),
        strengths=result.get("strengths"),
        gaps=result.get("gaps"),
        suggestions=result.get("suggestions"),
        weaknesses=result.get("weaknesses"),
        matching_skills=result.get("matching_skills"),
        missing_skills=result.get("missing_skills"),
        upskilling_resources=result.get("upskilling_resources"),
        detailed_review=result.get("detailed_review"),
        raw_feedback=result.get("raw_feedback"),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


@router.get("/analyses", response_model=list[schemas.AnalysisOut])
def list_analyses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Analysis)
        .filter(models.Analysis.owner_id == current_user.id)
        .order_by(models.Analysis.created_at.desc())
        .all()
    )


@router.get("/{resume_id}/text")
def get_resume_text(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.owner_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(404, "Resume not found")
    return {"raw_text": resume.raw_text}


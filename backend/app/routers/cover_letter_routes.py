import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import models, schemas, auth
from app.database import get_db
from app.services.cover_letter import generate_cover_letter
from app.services.pdf_utils import text_to_pdf

router = APIRouter(prefix="/cover-letter", tags=["Cover Letter Generator"])


@router.post("/generate", response_model=schemas.CoverLetterOut)
def generate(
    payload: schemas.CoverLetterRequest,
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

    content = generate_cover_letter(resume.raw_text, payload.job_description, payload.company_name)

    filename = f"cover_letter_{uuid.uuid4().hex}.pdf"
    pdf_path = text_to_pdf(content, filename)

    letter = models.CoverLetter(
        owner_id=current_user.id,
        resume_id=resume.id,
        job_description=payload.job_description,
        company_name=payload.company_name,
        content=content,
        generated_pdf_path=pdf_path,
    )
    db.add(letter)
    db.commit()
    db.refresh(letter)

    return schemas.CoverLetterOut(
        id=letter.id,
        content=content,
        pdf_download_url=f"/cover-letter/download/{letter.id}",
        created_at=letter.created_at,
    )


@router.get("/download/{letter_id}")
def download_cover_letter(
    letter_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    letter = (
        db.query(models.CoverLetter)
        .filter(models.CoverLetter.id == letter_id, models.CoverLetter.owner_id == current_user.id)
        .first()
    )
    if not letter or not letter.generated_pdf_path:
        raise HTTPException(404, "Cover letter not found")

    return FileResponse(
        letter.generated_pdf_path,
        media_type="application/pdf",
        filename=f"cover_letter_{letter_id}.pdf",
    )


@router.get("/list", response_model=list[schemas.CoverLetterOut])
def list_cover_letters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    letters = (
        db.query(models.CoverLetter)
        .filter(models.CoverLetter.owner_id == current_user.id)
        .order_by(models.CoverLetter.created_at.desc())
        .all()
    )
    return [
        schemas.CoverLetterOut(
            id=l.id,
            content=l.content,
            pdf_download_url=f"/cover-letter/download/{l.id}",
            created_at=l.created_at,
        )
        for l in letters
    ]

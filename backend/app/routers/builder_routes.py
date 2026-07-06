import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import models, schemas, auth
from app.database import get_db
from app.services.resume_builder import build_resume
from app.services.pdf_utils import text_to_pdf

router = APIRouter(prefix="/builder", tags=["Resume Builder"])


@router.post("/generate", response_model=schemas.BuiltResumeOut)
def generate_resume(
    payload: schemas.BuildResumeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    content = build_resume(payload)

    filename = f"resume_{uuid.uuid4().hex}.pdf"
    pdf_path = text_to_pdf(content, filename)

    resume = models.Resume(
        owner_id=current_user.id,
        source="builder",
        filename=filename,
        generated_pdf_path=pdf_path,
        raw_text=content,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return schemas.BuiltResumeOut(
        id=resume.id,
        content=content,
        pdf_download_url=f"/builder/download/{resume.id}",
    )


@router.get("/download/{resume_id}")
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.owner_id == current_user.id)
        .first()
    )
    if not resume or not resume.generated_pdf_path:
        from fastapi import HTTPException
        raise HTTPException(404, "Generated resume not found")

    return FileResponse(
        resume.generated_pdf_path,
        media_type="application/pdf",
        filename=resume.filename or "resume.pdf",
    )


@router.post("/tailor", response_model=schemas.TailorResumeOut)
def tailor(
    payload: schemas.TailorResumeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    from app.services.resume_builder import tailor_resume_interactive
    from app.services.pdf_utils import text_to_pdf
    from fastapi import HTTPException
    
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == payload.resume_id, models.Resume.owner_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(404, "Resume not found")
        
    history_dicts = [h.model_dump() for h in payload.history]
    result = tailor_resume_interactive(payload.current_content, payload.prompt, history=history_dicts)
    modified_content = result.get("modified_content", payload.current_content)
    message = result.get("message", "Resume updated.")
    
    # Rebuild the PDF with the modified content
    filename = resume.filename or f"resume_{uuid.uuid4().hex}.pdf"
    pdf_path = text_to_pdf(modified_content, filename)
    
    # Update the database model
    resume.raw_text = modified_content
    resume.generated_pdf_path = pdf_path
    db.commit()
    
    return schemas.TailorResumeOut(
        modified_content=modified_content,
        message=message,
    )


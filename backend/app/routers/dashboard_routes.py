from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=schemas.DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    total_resumes = (
        db.query(func.count(models.Resume.id))
        .filter(models.Resume.owner_id == current_user.id)
        .scalar()
    )
    total_analyses = (
        db.query(func.count(models.Analysis.id))
        .filter(models.Analysis.owner_id == current_user.id)
        .scalar()
    )
    total_cover_letters = (
        db.query(func.count(models.CoverLetter.id))
        .filter(models.CoverLetter.owner_id == current_user.id)
        .scalar()
    )
    avg_score = (
        db.query(func.avg(models.Analysis.match_score))
        .filter(models.Analysis.owner_id == current_user.id)
        .scalar()
    )

    recent_analyses = (
        db.query(models.Analysis)
        .filter(models.Analysis.owner_id == current_user.id)
        .order_by(models.Analysis.created_at.desc())
        .limit(5)
        .all()
    )
    recent_resumes = (
        db.query(models.Resume)
        .filter(models.Resume.owner_id == current_user.id)
        .order_by(models.Resume.created_at.desc())
        .limit(5)
        .all()
    )

    return schemas.DashboardSummary(
        total_resumes=total_resumes or 0,
        total_analyses=total_analyses or 0,
        total_cover_letters=total_cover_letters or 0,
        average_match_score=round(avg_score, 1) if avg_score else None,
        recent_analyses=recent_analyses,
        recent_resumes=recent_resumes,
    )

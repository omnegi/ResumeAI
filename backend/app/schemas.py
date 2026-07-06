import datetime as dt
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: dt.datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Resume (upload / analyzer) ----------
class ResumeOut(BaseModel):
    id: int
    source: str
    filename: Optional[str]
    created_at: dt.datetime

    class Config:
        from_attributes = True


class AnalyzeRequest(BaseModel):
    resume_id: int
    job_description: str


class AnalysisOut(BaseModel):
    id: int
    resume_id: int
    job_description: str
    match_score: Optional[float]
    strengths: Optional[str]
    gaps: Optional[str]
    suggestions: Optional[str]
    weaknesses: Optional[str]
    matching_skills: Optional[str]
    missing_skills: Optional[str]
    upskilling_resources: Optional[str]
    detailed_review: Optional[str]
    created_at: dt.datetime

    class Config:
        from_attributes = True


# ---------- Resume Builder ----------
class Education(BaseModel):
    degree: str
    institution: str
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    details: Optional[str] = None


class Experience(BaseModel):
    role: str
    company: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class BuildResumeRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    target_role: Optional[str] = None
    skills: List[str] = []
    education: List[Education] = []
    experience: List[Experience] = []
    projects: Optional[str] = None
    job_description: Optional[str] = None  # optional, to tailor tone/keywords


class BuiltResumeOut(BaseModel):
    id: int
    content: str
    pdf_download_url: str

    class Config:
        from_attributes = True


class ChatMessage(BaseModel):
    sender: str
    text: str


class TailorResumeRequest(BaseModel):
    resume_id: int
    prompt: str
    current_content: str
    history: List[ChatMessage] = []


class TailorResumeOut(BaseModel):
    modified_content: str
    message: str


# ---------- Cover Letter ----------
class CoverLetterRequest(BaseModel):
    resume_id: int
    job_description: str
    company_name: Optional[str] = None


class CoverLetterOut(BaseModel):
    id: int
    content: str
    pdf_download_url: str
    created_at: dt.datetime

    class Config:
        from_attributes = True


# ---------- Dashboard ----------
class DashboardSummary(BaseModel):
    total_resumes: int
    total_analyses: int
    total_cover_letters: int
    average_match_score: Optional[float]
    recent_analyses: List[AnalysisOut]
    recent_resumes: List[ResumeOut]

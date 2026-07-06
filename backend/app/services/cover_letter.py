"""Cover Letter Generator feature: uses the candidate's existing resume text
plus a target job description to draft a tailored cover letter via Groq."""

from langchain_groq import ChatGroq

from app.config import settings

PROMPT_TEMPLATE = """You are a professional career coach writing a cover letter.

Write a compelling, concise (under 350 words) cover letter for the candidate below,
tailored to the job description. Address it professionally, reference 2-3 concrete
strengths from the resume that match the job, and close with a confident call to action.
Do not invent experience not present in the resume. Output only the letter text,
no preamble, no markdown fences.

CANDIDATE RESUME:
{resume_text}

COMPANY NAME: {company_name}

JOB DESCRIPTION:
{job_description}
"""


def generate_cover_letter(resume_text: str, job_description: str, company_name: str | None) -> str:
    prompt = PROMPT_TEMPLATE.format(
        resume_text=resume_text,
        company_name=company_name or "the hiring company",
        job_description=job_description,
    )

    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.5,
    )
    response = llm.invoke(prompt)
    return response.content.strip()

import os
from pypdf import PdfReader
from docx import Document


def extract_text_from_file(file_path: str) -> str:
    """Extract raw text from a PDF, DOCX, or TXT resume file."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        reader = PdfReader(file_path)
        return "\n".join(page.extract_text() or "" for page in reader.pages).strip()

    if ext == ".docx":
        doc = Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs).strip()

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()

    raise ValueError(f"Unsupported file type: {ext}. Use PDF, DOCX, or TXT.")

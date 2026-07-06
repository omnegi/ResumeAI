import os
import re
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from app.config import settings

def parse_resume_to_ats(text: str):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if not lines:
        return None

    name = lines[0]
    email = ""
    phone = ""
    location = ""
    linkedin = ""
    github = ""

    sections = {}
    current_section = "SUMMARY"

    section_keywords = [
        "EDUCATION", "TECHNICAL SKILLS", "SKILLS", "PROJECTS", 
        "EXPERIENCE", "WORK EXPERIENCE", "SUMMARY", "AWARDS", "LANGUAGES"
    ]

    for i in range(1, len(lines)):
        line = lines[i]
        upper_line = line.upper()
        
        # Match contacts
        if "@" in line and not email:
            email = re.sub(r"^[-\|\s:]+", "", line).strip()
            continue
        if any(char.isdigit() for char in line) and len(line) >= 10 and not phone:
            phone = re.sub(r"^[-\|\s:]+", "", line).strip()
            continue
        if ("linkedin.com" in line.lower() or "linkedin" in line.lower()) and not linkedin:
            linkedin = "LinkedIn"
            continue
        if ("github.com" in line.lower() or "github" in line.lower()) and not github:
            github = "GitHub"
            continue
        if any(loc in line for loc in ["India", "Delhi", "USA", "NY", "London"]) and not location:
            location = re.sub(r"^[-\|\s:]+", "", line).strip()
            continue

        matched_keyword = None
        for k in section_keywords:
            if upper_line == k or upper_line.startswith(k + " ") or upper_line.startswith(k + ":"):
                matched_keyword = k
                break
                
        if matched_keyword:
            current_section = matched_keyword
            sections[current_section] = []
        else:
            if current_section not in sections:
                sections[current_section] = []
            sections[current_section].append(line)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "location": location,
        "linkedin": linkedin,
        "github": github,
        "sections": sections
    }

def text_to_pdf(text: str, filename: str) -> str:
    path = os.path.join(settings.GENERATED_DIR, filename)
    parsed = parse_resume_to_ats(text)
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    name_style = ParagraphStyle(
        "NameStyle", parent=styles["Heading1"],
        fontSize=24, leading=28, textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica-Bold", spaceAfter=2
    )
    
    contact_style = ParagraphStyle(
        "ContactStyle", parent=styles["Normal"],
        fontSize=8.5, leading=12, textColor=colors.HexColor("#475569"),
        fontName="Helvetica"
    )
    
    sec_header_style = ParagraphStyle(
        "SecHeaderStyle", parent=styles["Heading2"],
        fontSize=10, leading=12, textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica-Bold", spaceBefore=4, spaceAfter=2
    )
    
    body_style = ParagraphStyle(
        "BodyStyle", parent=styles["Normal"],
        fontSize=8.5, leading=13, textColor=colors.HexColor("#1e293b"),
        fontName="Helvetica"
    )
    
    bold_body_style = ParagraphStyle(
        "BoldBodyStyle", parent=body_style,
        fontName="Helvetica-Bold"
    )

    doc = SimpleDocTemplate(
        path, pagesize=LETTER,
        topMargin=0.4 * inch, bottomMargin=0.4 * inch,
        leftMargin=0.5 * inch, rightMargin=0.5 * inch,
    )

    if not parsed:
        # Fallback to simple layout if parser fails
        fallback_style = ParagraphStyle("Fallback", parent=styles["Normal"], fontSize=10, leading=14)
        flowables = [Paragraph(line.replace("&", "&amp;").replace("<", "&lt;"), fallback_style) for line in text.split("\n")]
        doc.build(flowables)
        return path

    flowables = []

    # --- Header Name Block ---
    flowables.append(Paragraph(parsed["name"], name_style))
    
    # Header Contacts Block
    contact_parts = []
    if parsed["email"]: contact_parts.append(parsed["email"])
    if parsed["phone"]: contact_parts.append(parsed["phone"])
    if parsed["location"]: contact_parts.append(parsed["location"])
    if parsed["linkedin"]: contact_parts.append("LinkedIn")
    if parsed["github"]: contact_parts.append("GitHub")
    
    contacts_str = "  |  ".join(contact_parts)
    flowables.append(Paragraph(contacts_str, contact_style))
    flowables.append(Spacer(1, 8))
    
    # Thin division line below contact info
    hr = Table([[""]], colWidths=[7.5 * inch])
    hr.setStyle(TableStyle([('LINEBELOW', (0,0), (-1,-1), 1.5, colors.HexColor("#0f172a"))]))
    flowables.append(hr)
    flowables.append(Spacer(1, 10))

    # --- Left Column Elements (Education, Skills) ---
    left_flowables = []
    
    # Education
    edu_lines = parsed["sections"].get("EDUCATION")
    if edu_lines:
        edu_header = Table([[Paragraph("EDUCATION", sec_header_style)]], colWidths=[2.6 * inch])
        edu_header.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#0f172a")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 6)
        ]))
        left_flowables.append(edu_header)
        left_flowables.append(Spacer(1, 4))
        
        for line in edu_lines:
            safe = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            if line.startswith("-"):
                left_flowables.append(Paragraph(safe.replace("-", "").strip(), body_style))
            else:
                left_flowables.append(Paragraph(safe, bold_body_style))
            left_flowables.append(Spacer(1, 2))

    left_flowables.append(Spacer(1, 8))

    # Technical Skills
    skills_lines = parsed["sections"].get("TECHNICAL SKILLS") or parsed["sections"].get("SKILLS")
    if skills_lines:
        skills_header = Table([[Paragraph("TECHNICAL SKILLS", sec_header_style)]], colWidths=[2.6 * inch])
        skills_header.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#0f172a")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 6)
        ]))
        left_flowables.append(skills_header)
        left_flowables.append(Spacer(1, 4))
        
        for line in skills_lines:
            safe = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            left_flowables.append(Paragraph(safe, body_style))
            left_flowables.append(Spacer(1, 3))

    # --- Right Column Elements (Experience, Projects) ---
    right_flowables = []
    
    # Experience
    exp_lines = parsed["sections"].get("EXPERIENCE") or parsed["sections"].get("WORK EXPERIENCE")
    if exp_lines:
        exp_header = Table([[Paragraph("EXPERIENCE", sec_header_style)]], colWidths=[4.6 * inch])
        exp_header.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#0f172a")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 6)
        ]))
        right_flowables.append(exp_header)
        right_flowables.append(Spacer(1, 4))
        
        for line in exp_lines:
            safe = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            if line.startswith("-"):
                right_flowables.append(Paragraph(safe, body_style))
            else:
                right_flowables.append(Paragraph(safe, bold_body_style))
            right_flowables.append(Spacer(1, 2))

    right_flowables.append(Spacer(1, 8))

    # Projects
    proj_lines = parsed["sections"].get("PROJECTS")
    if proj_lines:
        proj_header = Table([[Paragraph("PROJECTS", sec_header_style)]], colWidths=[4.6 * inch])
        proj_header.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#0f172a")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 6)
        ]))
        right_flowables.append(proj_header)
        right_flowables.append(Spacer(1, 4))
        
        for line in proj_lines:
            safe = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            if line.startswith("-"):
                right_flowables.append(Paragraph(safe, body_style))
            else:
                right_flowables.append(Paragraph(safe, bold_body_style))
            right_flowables.append(Spacer(1, 2))

    # --- Assemble Columns in Table ---
    # Col widths: Left column 2.7 inch, Spacer 0.2 inch, Right column 4.6 inch (Total 7.5 inch width)
    cols_table = Table([[left_flowables, "", right_flowables]], colWidths=[2.7 * inch, 0.2 * inch, 4.6 * inch])
    cols_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    
    flowables.append(cols_table)
    
    doc.build(flowables)
    return path

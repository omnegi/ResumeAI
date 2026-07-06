export interface User {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

export interface Resume {
  id: number;
  source: "upload" | "builder";
  filename: string | null;
  created_at: string;
}

export interface Analysis {
  id: number;
  resume_id: number;
  job_description: string;
  match_score: number | null;
  strengths: string | null;
  gaps: string | null;
  suggestions: string | null;
  weaknesses: string | null;
  matching_skills: string | null;
  missing_skills: string | null;
  upskilling_resources: string | null;
  detailed_review: string | null;
  created_at: string;
}

export interface DashboardSummary {
  total_resumes: number;
  total_analyses: number;
  total_cover_letters: number;
  average_match_score: number | null;
  recent_analyses: Analysis[];
  recent_resumes: Resume[];
}

export interface Education {
  degree: string;
  institution: string;
  start_year?: string;
  end_year?: string;
  details?: string;
}

export interface Experience {
  role: string;
  company: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface BuildResumeRequest {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  target_role?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects?: string;
  job_description?: string;
}

export interface BuiltResumeOut {
  id: number;
  content: string;
  pdf_download_url: string;
}

export interface CoverLetterOut {
  id: number;
  content: string;
  pdf_download_url: string;
  created_at: string;
}

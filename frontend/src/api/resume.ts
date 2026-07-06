import { apiClient } from "./client";
import type { Resume, Analysis } from "@/types";

export async function uploadResume(file: File): Promise<Resume> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post("/resume/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listResumes(): Promise<Resume[]> {
  const { data } = await apiClient.get("/resume/list");
  return data;
}

export async function analyzeResume(resumeId: number, jobDescription: string): Promise<Analysis> {
  const { data } = await apiClient.post("/resume/analyze", {
    resume_id: resumeId,
    job_description: jobDescription,
  });
  return data;
}

export async function listAnalyses(): Promise<Analysis[]> {
  const { data } = await apiClient.get("/resume/analyses");
  return data;
}

export async function fetchResumeText(resumeId: number): Promise<string> {
  const { data } = await apiClient.get(`/resume/${resumeId}/text`);
  return data.raw_text;
}

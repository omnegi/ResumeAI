import { apiClient } from "./client";
import type { CoverLetterOut } from "@/types";

export async function generateCoverLetter(payload: {
  resume_id: number;
  job_description: string;
  company_name?: string;
}): Promise<CoverLetterOut> {
  const { data } = await apiClient.post("/cover-letter/generate", payload);
  return data;
}

export async function listCoverLetters(): Promise<CoverLetterOut[]> {
  const { data } = await apiClient.get("/cover-letter/list");
  return data;
}

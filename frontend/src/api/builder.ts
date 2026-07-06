import { apiClient, API_BASE_URL } from "./client";
import type { BuildResumeRequest, BuiltResumeOut } from "@/types";

export async function generateResume(payload: BuildResumeRequest): Promise<BuiltResumeOut> {
  const { data } = await apiClient.post("/builder/generate", payload);
  return data;
}

export function resumeDownloadUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export async function tailorResume(payload: {
  resume_id: number;
  prompt: string;
  current_content: string;
  history?: Array<{ sender: string; text: string }>;
}): Promise<{ modified_content: string; message: string }> {
  const { data } = await apiClient.post("/builder/tailor", payload);
  return data;
}

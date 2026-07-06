import { apiClient } from "./client";
import type { DashboardSummary } from "@/types";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get("/dashboard/summary");
  return data;
}

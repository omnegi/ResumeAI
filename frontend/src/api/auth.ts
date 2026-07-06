import { apiClient } from "./client";
import type { User } from "@/types";

export async function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function loginUser(email: string, password: string): Promise<string> {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const { data } = await apiClient.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data.access_token as string;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

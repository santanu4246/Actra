import { getToken } from "./auth-token";
import type {
  AuthResponse,
  LoginResponse,
  MeResponse,
  OnboardingPayload,
  PlanResponse,
} from "@/types/api";

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as any)?.error ?? `Request failed: ${res.status}`);
  }

  return data as T;
}

export const api = {
  auth: {
    signup: (payload: { name: string; email: string; password: string }) =>
      request<AuthResponse>("/auth/signup", { method: "POST", body: payload }),

    login: (payload: { email: string; password: string }) =>
      request<LoginResponse>("/auth/login", { method: "POST", body: payload }),

    me: () => request<MeResponse>("/auth/me", { auth: true }),
  },

  onboarding: {
    getPlan: () => request<PlanResponse>("/onboarding", { auth: true }),

    submit: (payload: OnboardingPayload) =>
      request<{ success: boolean }>("/onboarding", {
        method: "POST",
        body: payload,
        auth: true,
      }),
  },
};

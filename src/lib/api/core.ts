import type { ApiMethod, ApiHealthResponse } from "@/types/shared.types";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://omegaraisen-production-2031.up.railway.app/api/v1";

export { API_BASE };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiCall<T = any>(
  endpoint: string,
  method: ApiMethod = "GET",
  body?: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<T> {
  const token = localStorage.getItem("omega_token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeader, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `API Error ${response.status}: ${errorText || response.statusText}`
    );
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<ApiHealthResponse> {
  try {
    const base = API_BASE.replace("/api/v1", "");
    const res = await fetch(`${base}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("unhealthy");
    return res.json();
  } catch {
    return { status: "unhealthy" };
  }
}

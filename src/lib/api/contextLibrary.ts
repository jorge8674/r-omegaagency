// src/lib/api/contextLibrary.ts
// API calls for Context Library (/context/ endpoints)

import { apiCall } from "./core";

export type ContextScope = "global" | "client" | "department";

export interface ContextDocument {
  id: string;
  name: string;
  scope: ContextScope;
  client_id: string | null;
  department: string | null;
  tags: string[];
  content: string;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ListResponse {
  docs: ContextDocument[];
  data?: ContextDocument[];
  total: number;
}

interface SingleResponse {
  success: boolean;
  data: ContextDocument;
}

export interface CreateContextDocPayload {
  name: string;
  scope: ContextScope;
  client_id?: string;
  department?: string;
  tags?: string[];
  content: string;
}

export async function listContextDocs(
  scope?: ContextScope,
  clientId?: string,
  department?: string
): Promise<ListResponse> {
  const params = new URLSearchParams();
  if (scope) params.set("scope", scope);
  if (clientId) params.set("client_id", clientId);
  if (department) params.set("department", department);
  const qs = params.toString();
  return apiCall<ListResponse>(`/context/${qs ? `?${qs}` : ""}`);
}

export async function createContextDoc(
  payload: CreateContextDocPayload
): Promise<SingleResponse> {
  return apiCall<SingleResponse>(
    "/context/",
    "POST",
    payload as unknown as Record<string, unknown>
  );
}

export async function deleteContextDoc(
  docId: string
): Promise<{ success: boolean }> {
  return apiCall<{ success: boolean }>(`/context/${docId}/`, "DELETE");
}

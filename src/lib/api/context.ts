// src/lib/api/context.ts
// Responsabilidad única: HTTP calls al endpoint /context

import { apiCall } from "./core";
import type { ApiResponse } from "@/types/shared.types";

// ── Literal unions ──────────────────────────────────────
export type ToneOption =
  | "professional" | "casual" | "inspirational"
  | "educational" | "humorous" | "energetic";

export type GoalOption =
  | "sales" | "awareness" | "community" | "leads" | "retention";

export type PlatformOption =
  | "instagram" | "tiktok" | "facebook" | "linkedin" | "twitter";

// ── Audience value — covers string, string[], number ────
export type AudienceValue = string | string[] | number;

// ── Data shape (GET response) ───────────────────────────
export interface ClientContextData {
  id: string;
  client_id: string;
  version: number;
  business_name: string;
  industry: string;
  business_description: string | null;
  target_audience: Record<string, AudienceValue>;
  communication_tone: ToneOption;
  primary_goal: GoalOption | null;
  platforms: PlatformOption[];
  keywords: string[];
  forbidden_words: string[];
  forbidden_topics: string[];
  brand_colors: string[];
  logo_url: string | null;
  website_url: string | null;
  ai_generated_brief: string | null;
  custom_instructions: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Payloads (POST / PATCH) ─────────────────────────────
export interface ClientContextPayload {
  client_id: string;
  business_name: string;
  industry: string;
  business_description?: string;
  target_audience?: Record<string, AudienceValue>;
  communication_tone?: ToneOption;
  primary_goal?: GoalOption;
  platforms?: PlatformOption[];
  keywords?: string[];
  forbidden_words?: string[];
  forbidden_topics?: string[];
  brand_colors?: string[];
  website_url?: string;
  custom_instructions?: string;
  ai_generated_brief?: string;
}

export type ClientContextUpdatePayload = Partial<
  Omit<ClientContextPayload, "client_id">
>;

// ── API functions ───────────────────────────────────────
export function createClientContext(
  payload: ClientContextPayload
): Promise<ApiResponse<ClientContextData>> {
  return apiCall<ApiResponse<ClientContextData>>(
    "/context", "POST", payload as unknown as Record<string, unknown>
  );
}

export function getClientContext(
  clientId: string
): Promise<ApiResponse<ClientContextData>> {
  return apiCall<ApiResponse<ClientContextData>>(
    `/context/${clientId}`
  );
}

export function updateClientContext(
  clientId: string,
  payload: ClientContextUpdatePayload
): Promise<ApiResponse<ClientContextData>> {
  return apiCall<ApiResponse<ClientContextData>>(
    `/context/${clientId}`, "PATCH", payload as unknown as Record<string, unknown>
  );
}

export function generateClientBrief(
  clientId: string
): Promise<ApiResponse<ClientContextData>> {
  return apiCall<ApiResponse<ClientContextData>>(
    `/context/${clientId}/generate-brief`, "POST"
  );
}

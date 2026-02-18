import { apiCall } from "./core";

export type ContentType =
  | "post" | "caption" | "story" | "ad"
  | "reel_script" | "bio" | "hashtags" | "email" | "image";

export const CONTENT_TYPE_LABELS: Record<ContentType, { label: string; emoji: string; desc: string }> = {
  post:        { label: "Post",         emoji: "📝", desc: "Post completo para feed" },
  caption:     { label: "Caption",      emoji: "💬", desc: "Descripción atractiva" },
  story:       { label: "Story",        emoji: "⭕", desc: "Script para Story 15s" },
  ad:          { label: "Anuncio",      emoji: "📢", desc: "Anuncio publicitario" },
  reel_script: { label: "Reel/TikTok",  emoji: "🎬", desc: "Script para video corto" },
  bio:         { label: "Bio",          emoji: "👤", desc: "Biografía del perfil" },
  hashtags:    { label: "Hashtags",     emoji: "#️⃣", desc: "Set de 20-30 hashtags" },
  email:       { label: "Email",        emoji: "📧", desc: "Email de marketing" },
  image:       { label: "Imagen",      emoji: "",   desc: "Imagen con DALL-E 3" },
};

export interface GeneratedContent {
  id: string;
  client_id: string;
  account_id: string | null;
  context_id: string | null;
  content_type: ContentType;
  platform: string | null;
  prompt: string;
  generated_text: string;
  tokens_used: number;
  model_used: string;
  is_saved: boolean;
  created_at: string;
}

export type ImageStyle = "realistic" | "cartoon" | "minimal";

interface GenerateResponse {
  success: boolean;
  data?: GeneratedContent;
  message?: string;
}

interface ListResponse {
  success: boolean;
  data: GeneratedContent[];
  total: number;
}

export async function generateContent(
  accountId: string,
  contentType: ContentType,
  prompt: string,
  extraInstructions?: string
): Promise<GenerateResponse> {
  return apiCall<GenerateResponse>("/content-lab/generate/", "POST", {
    account_id: accountId,
    content_type: contentType,
    prompt,
    extra_instructions: extraInstructions || undefined,
  });
}

export async function listGeneratedContent(
  accountId?: string,
  clientId?: string,
  contentType?: ContentType
): Promise<ListResponse> {
  const params = new URLSearchParams();
  if (accountId) params.set("account_id", accountId);
  if (clientId) params.set("client_id", clientId);
  if (contentType) params.set("content_type", contentType);
  return apiCall<ListResponse>(`/content-lab/?${params.toString()}`);
}

export async function toggleSaveContent(contentId: string): Promise<GenerateResponse> {
  return apiCall<GenerateResponse>(`/content-lab/${contentId}/save/`, "PATCH");
}

export async function deleteContent(contentId: string): Promise<GenerateResponse> {
  return apiCall<GenerateResponse>(`/content-lab/${contentId}/`, "DELETE");
}

export async function generateImage(
  accountId: string,
  prompt: string,
  style: ImageStyle
): Promise<GenerateResponse> {
  const params = new URLSearchParams({
    account_id: accountId,
    prompt,
    style,
  });
  return apiCall<GenerateResponse>(
    `/content-lab/generate-image/?${params.toString()}`,
    "POST"
  );
}

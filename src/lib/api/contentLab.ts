import { apiCall } from "./core";

export type ContentType =
  | "post" | "caption" | "story" | "ad"
  | "reel_script" | "bio" | "hashtags" | "email" | "image" | "video";

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
  video:       { label: "Video/Reel",  emoji: "",   desc: "Video corto con IA" },
};

export interface VaultPromptUsed {
  id: string;
  name: string;
  technique: string;
  performance_score: number;
}

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
  vault_prompt_used?: VaultPromptUsed | null;
}

export type ImageStyle = "realistic" | "cartoon" | "minimal";
export type VideoStyle = "realistic" | "cinematic" | "animated";
export type VideoDuration = 5 | 10;
export type VideoProvider = "runway" | "kling" | "hunyuan" | "wan";

export const VIDEO_PROVIDER_LABELS: Record<VideoProvider, { label: string; badge: string }> = {
  runway:  { label: "Runway Gen-3",  badge: "Runway Gen-3" },
  kling:   { label: "Kling v2",      badge: "Kling v2" },
  hunyuan: { label: "Hunyuan",       badge: "Hunyuan" },
  wan:     { label: "Wan",           badge: "Wan" },
};

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

export interface AgentProvider {
  id: string;
  name: string;
  model: string;
  description: string;
  emoji: string;
}

export const FALLBACK_AGENTS: AgentProvider[] = [
  { id: "rex",    name: "REX",    model: "GPT-4o-mini",       description: "Rápido y eficiente",      emoji: "⚡" },
  { id: "nova",   name: "NOVA",   model: "Claude Sonnet 4.5", description: "Estratégico y preciso",   emoji: "👑" },
  { id: "atlas",  name: "ATLAS",  model: "GPT-4o",            description: "Creativo para marketing", emoji: "🌟" },
  { id: "luna",   name: "LUNA",   model: "Deepseek V3",       description: "Análisis técnico",        emoji: "🔬" },
  { id: "vera",   name: "VERA",   model: "Gemini 2.0 Flash",  description: "Datos y métricas",        emoji: "💎" },
  { id: "kira",   name: "KIRA",   model: "Llama 3.3 (Groq)",  description: "Conversacional, gratis",  emoji: "💬" },
  { id: "oracle", name: "ORACLE", model: "Deepseek R1",       description: "Razonamiento profundo",   emoji: "🔮" },
];

export async function fetchAgentProviders(): Promise<AgentProvider[]> {
  try {
    const data = await apiCall<AgentProvider[]>("/content-lab/providers/");
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_AGENTS;
  } catch {
    return FALLBACK_AGENTS;
  }
}

export async function generateText(
  accountId: string,
  contentType: string,
  brief: string,
  language?: string,
  agent?: string,
  clientId?: string
) {
  const params = new URLSearchParams({
    account_id: accountId,
    content_type: contentType,
    brief: brief,
    language: language || "es",
  });
  if (agent) params.set("agent", agent);
  if (clientId) params.set("client_id", clientId);
  return apiCall(`/content-lab/generate/?${params.toString()}`, "POST");
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

export interface ImageAttachment {
  type: "image";
  base64: string;
  name: string;
}

export async function generateImage(
  accountId: string,
  prompt: string,
  style: ImageStyle,
  attachments?: ImageAttachment[]
): Promise<GenerateResponse> {
  const imageAttachments = attachments?.filter((img) => Boolean(img.base64)) ?? [];
  console.warn("🔴 ATTACHMENTS:", JSON.stringify({
    count: imageAttachments.length,
    firstBase64Length: imageAttachments[0]?.base64?.length,
    mode: imageAttachments.length > 0 ? "EDIT" : "GENERATE",
  }));

  const params = new URLSearchParams({ account_id: accountId, prompt, style });
  if (imageAttachments.length > 0) {
    return apiCall<GenerateResponse>(`/content-lab/generate-image/?${params.toString()}`, "POST", {
      brief: prompt,
      prompt,
      style,
      attachments: imageAttachments.map((img) => ({ type: "image" as const, base64: img.base64, name: img.name })),
    });
  }

  return apiCall<GenerateResponse>(`/content-lab/generate-image/?${params.toString()}`, "POST");
}

export async function generateVideo(
  accountId: string,
  prompt: string,
  duration: VideoDuration,
  style: VideoStyle
): Promise<GenerateResponse> {
  const params = new URLSearchParams({
    account_id: accountId,
    prompt,
    duration: String(duration),
    style,
  });
  return apiCall<GenerateResponse>(
    `/content-lab/generate-video-runway/?${params.toString()}`,
    "POST"
  );
}

export async function generateVideoFal(
  accountId: string,
  prompt: string,
  duration: VideoDuration,
  model: "kling" | "hunyuan" | "wan"
): Promise<GenerateResponse> {
  const params = new URLSearchParams({
    account_id: accountId,
    prompt,
    duration: String(duration),
    model,
  });
  return apiCall<GenerateResponse>(
    `/content-lab/generate-video-fal/?${params.toString()}`,
    "POST"
  );
}

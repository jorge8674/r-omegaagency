import { apiCall } from "./core";
import type { BrandProfile } from "@/types/api-agents.types";
import type { AgentStatusResponse } from "@/types/shared.types";

const buildBrandProfile = (
  bv: Partial<BrandProfile>,
  brandName?: string
): BrandProfile => ({
  client_id: bv.client_id || brandName || "default",
  brand_name: bv.brand_name || brandName || "",
  tone: bv.tone || "professional",
  personality_traits: bv.personality_traits || ["trustworthy", "innovative", "helpful"],
  forbidden_words: bv.forbidden_words || [],
  required_keywords: bv.required_keywords || [],
  emoji_usage: bv.emoji_usage || "minimal",
  formality_level: bv.formality_level || 2,
  sample_posts: bv.sample_posts || [],
});

export const contentApi = {
  generateCaption: (prompt: string, platform: string, tone: string) =>
    apiCall("/content/generate-caption", "POST", { topic: prompt, platform, tone }),

  generateImage: (topic: string) =>
    apiCall("/content/generate-image", "POST", { prompt: topic }),

  generateHashtags: (content: string, platform: string) =>
    apiCall("/content/generate-hashtags", "POST", { topic: content, platform }),

  generateVideoScript: (topic: string, duration: number, platform: string) =>
    apiCall("/content/generate-video-script", "POST", { topic, duration_seconds: duration, platform }),

  contentAgentStatus: () =>
    apiCall<AgentStatusResponse>("/content/agent-status"),

  // ─── Strategy ─────────────────────────────────────────
  createCalendar: (data: Record<string, unknown>) =>
    apiCall("/strategy/create-calendar", "POST", data),

  optimizeTiming: (data: Record<string, unknown>) =>
    apiCall("/strategy/optimize-timing", "POST", data),

  analyzeStrategy: (data: Record<string, unknown>) =>
    apiCall("/strategy/analyze-strategy", "POST", data),

  strategyAgentStatus: () =>
    apiCall<AgentStatusResponse>("/strategy/agent-status"),

  // ─── Brand Voice ──────────────────────────────────────
  validateContent: (content: string, brandVoice: Partial<BrandProfile>, brandName?: string) =>
    apiCall("/brand-voice/validate-content", "POST", {
      content: content || "",
      brand_profile: buildBrandProfile(brandVoice, brandName),
    }),

  improveContent: (content: string, brandVoice: Partial<BrandProfile>, brandName?: string) =>
    apiCall("/brand-voice/improve-content", "POST", {
      content: content || "",
      brand_profile: buildBrandProfile(brandVoice, brandName),
    }),

  createBrandProfile: (brandName: string, description: string, samplePosts: string[] | string) =>
    apiCall("/brand-voice/create-profile", "POST", {
      client_name: brandName || "Cliente",
      brand_description: description || "",
      sample_posts: Array.isArray(samplePosts)
        ? samplePosts
        : (samplePosts || "").split("\n").filter(Boolean),
    }),

  // ─── Video ────────────────────────────────────────────
  writeScript: (data: Record<string, unknown>) =>
    apiCall("/video/write-script", "POST", data),

  generateVideoIdeas: (niche: string, platform: string) =>
    apiCall("/video/generate-ideas", "POST", { niche, platform, content_pillars: [] }),
};

export { buildBrandProfile };

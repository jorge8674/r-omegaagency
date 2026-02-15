import type { BrandProfile } from "@/types/api-agents.types";

export const buildBrandProfile = (
  bv: Partial<BrandProfile> | Record<string, unknown>,
  brandName?: string
): BrandProfile => ({
  client_id: (bv as Partial<BrandProfile>).client_id || brandName || "default",
  brand_name: (bv as Partial<BrandProfile>).brand_name || brandName || "",
  tone: (bv as Partial<BrandProfile>).tone || "professional",
  personality_traits: (bv as Partial<BrandProfile>).personality_traits || ["trustworthy", "innovative", "helpful"],
  forbidden_words: (bv as Partial<BrandProfile>).forbidden_words || [],
  required_keywords: (bv as Partial<BrandProfile>).required_keywords || [],
  emoji_usage: (bv as Partial<BrandProfile>).emoji_usage || "minimal",
  formality_level: (bv as Partial<BrandProfile>).formality_level || 2,
  sample_posts: (bv as Partial<BrandProfile>).sample_posts || [],
});

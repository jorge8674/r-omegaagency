/** Local types & constants for ContentGenerator module */

export type ContentLanguage = "es" | "en";

export interface PlatformOption {
  value: string;
  label: string;
}

export interface ToneOption {
  value: string;
  label: string;
}

export interface ScriptScene {
  title?: string;
  name?: string;
  description?: string;
  action?: string;
  dialogue?: string;
  duration?: string;
}

export interface BrandValidationResult {
  compliance_score: number;
  is_compliant: boolean;
  violations: string[];
  suggestions: string[];
  revised_content?: string;
}

export interface ContentGeneratorState {
  prompt: string;
  platform: string;
  tone: string;
  activeTab: string;
  language: ContentLanguage;
  generatingCaption: boolean;
  caption: string;
  generatingImage: boolean;
  imageUrl: string | null;
  generatingHashtags: boolean;
  hashtags: string[];
  scriptTopic: string;
  scriptDuration: number;
  generatingScript: boolean;
  scriptScenes: ScriptScene[];
  scriptRaw: string;
  validatingBrand: boolean;
  brandResult: BrandValidationResult | null;
}

export const PLATFORMS: PlatformOption[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
];

export const TONES: ToneOption[] = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "bold", label: "Bold" },
  { value: "luxury", label: "Luxury" },
  { value: "casual", label: "Casual" },
];

export const LANG_SUFFIX: Record<ContentLanguage, string> = {
  es: " | Responde completamente en español, contenido natural y auténtico en español.",
  en: " | Respond completely in English, natural and authentic English content.",
};

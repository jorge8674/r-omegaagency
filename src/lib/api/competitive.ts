import { apiCall } from "./core";
import type { TrendItem } from "@/types/api-agents.types";

const DEFAULT_TREND: TrendItem = {
  topic: "general",
  platform: "instagram",
  trend_score: 0.65,
  velocity: "rising",
  estimated_lifespan: "days",
  relevant_hashtags: [],
  content_angle: "Educational and entertaining",
  risk_level: "safe",
  audience_alignment: 0.75,
};

const normalizeTrend = (
  t: Partial<TrendItem>,
  niche: string,
  platform: string
): TrendItem => ({
  ...DEFAULT_TREND,
  ...t,
  topic: t.topic || niche,
  platform: t.platform || platform,
});

export const competitiveApi = {
  analyzeCompetitor: (name: string, platform: string, url?: string) =>
    apiCall("/competitive/analyze-competitor", "POST", {
      competitor_data: { name, platform, url: url || "" },
    }),

  generateBenchmark: (competitorResult: Record<string, unknown>) =>
    apiCall("/competitive/generate-benchmark", "POST", {
      client_data: { followers: 1000, engagement_rate: 0.03, posting_frequency: 3 },
      competitor_profile: {
        competitor_name: competitorResult.competitor_name || "",
        platform: competitorResult.platform || "instagram",
        estimated_followers: competitorResult.estimated_followers || null,
        avg_engagement_rate: competitorResult.avg_engagement_rate || null,
        posting_frequency: competitorResult.posting_frequency || "3x_week",
        content_types: competitorResult.content_types || [],
        top_hashtags: competitorResult.top_hashtags || [],
        best_performing_topics: competitorResult.best_performing_topics || [],
        peak_posting_hours: competitorResult.peak_posting_hours || [9, 12, 18, 20],
      },
    }),

  identifyGaps: (competitorResult: Record<string, unknown>, niche?: string) =>
    apiCall("/competitive/identify-gaps", "POST", {
      client_topics: ["contenido general"],
      competitor_topics: competitorResult.best_performing_topics || [],
      niche: niche || "general",
    }),

  // ─── Trends ───────────────────────────────────────────
  analyzeTrends: (niche: string, platform?: string) =>
    apiCall("/trends/analyze", "POST", {
      platform_data: { [platform || "instagram"]: ["reels", "stories", "carousels"] },
      client_niche: niche || "general",
    }),

  predictVirality: (content: string, platform: string) =>
    apiCall("/trends/predict-virality", "POST", {
      content_description: content || "",
      platform: platform || "instagram",
      target_audience: "general audience",
    }),

  findOpportunities: (trendsResult: Record<string, unknown>, niche: string, platform?: string) => {
    const raw = (trendsResult.data || trendsResult) as Partial<TrendItem>[];
    const trends =
      Array.isArray(raw) && raw.length > 0
        ? raw.map((t) => normalizeTrend(t, niche, platform || "instagram"))
        : [normalizeTrend({}, niche, platform || "instagram")];
    return apiCall("/trends/find-opportunities", "POST", {
      trends,
      client_niche: niche || "general",
      brand_profile: { name: "Cliente", niche: niche || "general", platform: platform || "instagram" },
    });
  },
};

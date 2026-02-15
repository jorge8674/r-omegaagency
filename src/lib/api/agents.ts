import { apiCall } from "./core";
import { buildBrandProfile } from "./helpers";
import type { AgentStatusResponse } from "@/types/shared.types";

export const agentsApi = {
  // ─── Strategy ─────────────────────────────────────────
  createCalendar: (data: Record<string, unknown>) =>
    apiCall("/strategy/create-calendar", "POST", data),
  optimizeTiming: (data: Record<string, unknown>) =>
    apiCall("/strategy/optimize-timing", "POST", data),
  analyzeStrategy: (data: Record<string, unknown>) =>
    apiCall("/strategy/analyze-strategy", "POST", data),
  strategyAgentStatus: () =>
    apiCall<AgentStatusResponse>("/strategy/agent-status"),

  // ─── Engagement ───────────────────────────────────────
  respondComment: (comment: string, platform: string, brandVoice: string) =>
    apiCall("/engagement/respond-comment", "POST", { comment, platform, brand_voice: brandVoice }),
  analyzeComment: (comment: string) =>
    apiCall("/engagement/analyze-comment", "POST", { comment }),
  detectCrisis: (comments: string[]) =>
    apiCall("/engagement/detect-crisis", "POST", { comments }),

  // ─── Monitor ──────────────────────────────────────────
  systemHealth: () => apiCall("/monitor/system-health"),
  agentsStatus: () => apiCall("/monitor/agents-status"),
  alerts: () => apiCall("/monitor/alerts"),

  // ─── Brand Voice ──────────────────────────────────────
  validateContent: (content: string, bv: Record<string, unknown>, brandName?: string) =>
    apiCall("/brand-voice/validate-content", "POST", {
      content: content || "",
      brand_profile: buildBrandProfile(bv, brandName),
    }),
  improveContent: (content: string, bv: Record<string, unknown>, brandName?: string) =>
    apiCall("/brand-voice/improve-content", "POST", {
      content: content || "",
      brand_profile: buildBrandProfile(bv, brandName),
    }),
  createBrandProfile: (brandName: string, description: string, samplePosts: string[] | string) =>
    apiCall("/brand-voice/create-profile", "POST", {
      client_name: brandName || "Cliente",
      brand_description: description || "",
      sample_posts: Array.isArray(samplePosts)
        ? samplePosts
        : (samplePosts || "").split("\n").filter(Boolean),
    }),

  // ─── Crisis ───────────────────────────────────────────
  assessCrisis: (signals: Record<string, unknown>) =>
    apiCall("/crisis/assess", "POST", {
      platform: signals.platform || "instagram",
      negative_comment_percentage: signals.negative_comment_percentage,
      complaint_velocity: signals.complaint_velocity,
      reach_of_negative_content: signals.reach_of_negative_content,
      media_involvement: signals.media_involvement || false,
      influencer_involvement: signals.influencer_involvement || false,
    }),
  draftStatement: (data: Record<string, unknown>) =>
    apiCall("/crisis/draft-statement", "POST", data),
  recoveryPlan: (assessment: Record<string, unknown>) =>
    apiCall("/crisis/recovery-plan", "POST", { assessment }),

  // ─── Reports ──────────────────────────────────────────
  generateMonthlyReport: (clientName?: string) =>
    apiCall("/reports/generate-monthly", "POST", {
      client_name: clientName || "Cliente OMEGA",
      metrics_data: { followers: 1000, engagement_rate: 0.03, reach: 5000, impressions: 8000 },
      previous_period_data: { followers: 900, engagement_rate: 0.025, reach: 4000, impressions: 7000 },
      agency_notes: "",
    }),
  generateCampaignReport: (data: Record<string, unknown>) =>
    apiCall("/reports/generate-campaign", "POST", data),

  // ─── Growth ───────────────────────────────────────────
  identifyOpportunities: (data: Record<string, unknown>) =>
    apiCall("/growth/identify-opportunities", "POST", data),
  quickWins: (niche: string, platform: string) =>
    apiCall("/growth/quick-wins", "POST", {
      account_data: { niche: niche || "general", followers: 1000, engagement_rate: 0.03, posting_frequency: "3x_week" },
      platform: platform || "instagram",
    }),

  // ─── Video ────────────────────────────────────────────
  writeScript: (data: Record<string, unknown>) =>
    apiCall("/video/write-script", "POST", data),
  generateVideoIdeas: (niche: string, platform: string) =>
    apiCall("/video/generate-ideas", "POST", { niche, platform, content_pillars: [] }),

  // ─── Scheduling ───────────────────────────────────────
  schedulePost: (data: Record<string, unknown>) =>
    apiCall("/scheduling/schedule-post", "POST", data),
  getQueue: (clientId: string) =>
    apiCall(`/scheduling/queue/${clientId}`),
  approvePost: (postId: string) =>
    apiCall("/scheduling/approve-post", "POST", { post_id: postId }),
  optimalTimes: (platform: string, timezone: string) =>
    apiCall("/scheduling/optimal-times", "POST", { platform, audience_timezone: timezone, content_type: "post" }),

  // ─── A/B Testing ──────────────────────────────────────
  designExperiment: (hypothesis: string, variant?: string, platform?: string) =>
    apiCall("/ab-testing/design-experiment", "POST", {
      hypothesis: hypothesis || "",
      variable: "content_format",
      base_content: { type: "post", description: variant || hypothesis || "" },
      platform: platform || "instagram",
    }),
  analyzeResults: (experiment: Record<string, unknown>) =>
    apiCall("/ab-testing/analyze-results", "POST", { experiment }),

  // ─── Orchestrator ─────────────────────────────────────
  systemState: () => apiCall("/orchestrator/system-state"),
  executeWorkflow: (workflowName: string, clientId: string, params: Record<string, unknown>) =>
    apiCall("/orchestrator/execute-workflow", "POST", { workflow_name: workflowName, client_id: clientId, params }),
};

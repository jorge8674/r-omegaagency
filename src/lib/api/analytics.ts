import { apiCall } from "./core";
import type { HistoricalDataPoint, MetricsSnapshot } from "@/types/api-agents.types";

// Builds deterministic baseline history from known metrics.
// likes/comments/shares are 0 until real platform data is available (Meta API).
const buildHistoricalData = (metrics: Partial<MetricsSnapshot>): HistoricalDataPoint[] =>
  Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toISOString().split("T")[0],
    followers: (metrics.followers || 1000) + i * 3,
    engagement_rate: metrics.engagement_rate || 0.03,
    reach: Math.floor((metrics.followers || 1000) * 0.3),
    impressions: Math.floor((metrics.followers || 1000) * 0.5),
    likes: 0,
    comments: 0,
    shares: 0,
  }));

const parseMetrics = (m: Record<string, unknown> | string) =>
  typeof m === "string" ? JSON.parse(m) : m;

export const analyticsApi = {
  analyzeMetrics: (data: Record<string, unknown> | string) =>
    apiCall("/analytics/analyze-metrics", "POST", { data: parseMetrics(data) }),

  generateInsights: (data: Record<string, unknown> | string) =>
    apiCall("/analytics/generate-insights", "POST", { metrics: parseMetrics(data) }),

  forecast: (data: Record<string, unknown> | string) => {
    const parsed = parseMetrics(data) as Record<string, unknown>;
    const metrics = (parsed.metrics || parsed) as Partial<MetricsSnapshot>;
    return apiCall("/analytics/forecast", "POST", {
      historical_data: buildHistoricalData(metrics),
      days_ahead: 30,
    });
  },

  getDashboardData: (data: Record<string, unknown>) =>
    apiCall("/analytics/dashboard-data", "POST", data),
};

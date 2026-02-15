import { apiCall } from "./core";
import type { HistoricalDataPoint, MetricsSnapshot } from "@/types/api-agents.types";

// TODO: Replace synthetic history with real data when Meta API is connected
const buildHistoricalData = (metrics: Partial<MetricsSnapshot>): HistoricalDataPoint[] =>
  Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toISOString().split("T")[0],
    followers: (metrics.followers || 1000) + i * 3,
    engagement_rate: (metrics.engagement_rate || 0.03) + Math.random() * 0.005,
    reach: Math.floor((metrics.followers || 1000) * (0.3 + Math.random() * 0.2)),
    impressions: Math.floor((metrics.followers || 1000) * (0.5 + Math.random() * 0.3)),
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 10),
    shares: Math.floor(Math.random() * 5),
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

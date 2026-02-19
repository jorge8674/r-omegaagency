import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";

interface GrowthPoint {
  date: string;
  followers: number;
}

interface EngagementPoint {
  platform: string;
  likes: number;
  comments: number;
  shares: number;
}

interface HeatmapPoint {
  day: string;
  hour: number;
  value: number;
}

interface TopPost {
  id: string;
  title: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
}

interface AnalyticsDashboard {
  total_followers: number;
  avg_engagement: number;
  best_time: string;
  growth_data: GrowthPoint[];
  engagement_data: EngagementPoint[];
  heatmap_data: HeatmapPoint[];
  top_posts: TopPost[];
}

async function fetchAnalyticsDashboard(
  clientId: string,
  dateRange: string
): Promise<AnalyticsDashboard> {
  const params = new URLSearchParams({ date_range: dateRange });
  if (clientId && clientId !== "all") params.set("client_id", clientId);
  return apiCall<AnalyticsDashboard>(
    `/analytics/dashboard/?${params.toString()}`
  );
}

export function useAnalyticsData(clientId = "all", dateRange = "30d") {
  const { data, isLoading: loading } = useQuery({
    queryKey: ["analytics", clientId, dateRange],
    queryFn: () => fetchAnalyticsDashboard(clientId, dateRange),
    refetchInterval: 60_000,
    retry: 1,
  });

  return {
    loading,
    totalFollowers: data?.total_followers ?? 0,
    avgEngagement: data?.avg_engagement ?? 0,
    bestTime: data?.best_time ?? "—",
    growthData: data?.growth_data ?? [],
    engagementData: data?.engagement_data ?? [],
    heatmapData: data?.heatmap_data ?? [],
    topPosts: data?.top_posts ?? [],
  };
}

import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import type { FeatureUsageData } from "../types";

interface FeatureUsageResponse {
  success: boolean;
  data: FeatureUsageData;
  error?: string;
}

export function useFeatureUsage(clientId: string) {
  return useQuery<FeatureUsageData>({
    queryKey: ["feature-usage", clientId],
    queryFn: async () => {
      const res = await apiCall<FeatureUsageResponse>(
        `/feature-usage/${clientId}/`
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load feature usage");
      }
      return res.data;
    },
    enabled: !!clientId,
    retry: 1,
    staleTime: 30000,
  });
}

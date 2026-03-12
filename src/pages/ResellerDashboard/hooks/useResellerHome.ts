import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { useOmegaAuth } from "@/contexts/AuthContext";
import type { ResellerHomeData } from "../types";

interface ApiResponse {
  success: boolean;
  data: ResellerHomeData;
}

export function useResellerHome() {
  const { user } = useOmegaAuth();
  const resellerId = user?.id;

  return useQuery<ResellerHomeData>({
    queryKey: ["reseller-home", resellerId],
    queryFn: async () => {
      const res = await apiCall<ApiResponse>(
        `/reseller/${resellerId}/home/`,
        "GET"
      );
      return res.data;
    },
    enabled: !!resellerId,
    retry: 1,
  });
}

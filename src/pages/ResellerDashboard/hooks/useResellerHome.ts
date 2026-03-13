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
  const resellerId = user?.reseller_id 
    ?? localStorage.getItem("omega_reseller_id") 
    ?? undefined;

  return useQuery<ResellerHomeData | null>({
    queryKey: ["reseller-home", resellerId],
    queryFn: async () => {
      try {
        const res = await apiCall<ApiResponse>(
          `/reseller/${resellerId}/home/`,
          "GET"
        );
        return res.data;
      } catch (err: any) {
        if (err?.status === 406) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!resellerId,
    retry: 0,
  });
}

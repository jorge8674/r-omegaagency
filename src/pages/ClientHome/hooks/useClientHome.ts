import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import type { ClientHomeData } from "../types";

interface ClientHomeResponse {
  success: boolean;
  data: ClientHomeData;
  error?: string;
}

export function useClientHome(clientId: string) {
  return useQuery<ClientHomeData>({
    queryKey: ["client-home", clientId],
    queryFn: async () => {
      const res = await apiCall<ClientHomeResponse>(`/clients/${clientId}/home/`);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load client home");
      }
      return res.data;
    },
    enabled: !!clientId,
    refetchInterval: 60000,
    retry: 1,
    staleTime: 30000,
  });
}

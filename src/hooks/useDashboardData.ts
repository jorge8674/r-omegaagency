import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";

interface ClientItem { id: string; name: string; }
interface ClientsApiResponse { success: boolean; data: ClientItem[]; total: number; }

export function useDashboardData() {
  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await apiCall<ClientsApiResponse>("/clients/", "GET");
      return res.data ?? [];
    },
  });

  return {
    loading: isLoading,
    activeClients: 0,
    totalFollowers: 0,
    connectedAccounts: 0,
    totalAccounts: 0,
    platformCounts: [],
    recentClients: [],
    recentAccounts: [],
    clients: data ?? [],
    socialAccounts: [],
  };
}

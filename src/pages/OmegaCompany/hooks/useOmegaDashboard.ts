import { useQuery } from "@tanstack/react-query";
import { omegaApi } from "@/lib/api/omega";

const REFETCH = 60000;

export function useOmegaDashboard() {
  const dashboard = useQuery({
    queryKey: ["omega-dashboard"],
    queryFn: () => omegaApi.getDashboard(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  const resellers = useQuery({
    queryKey: ["omega-resellers"],
    queryFn: () => omegaApi.getResellers(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  const activity = useQuery({
    queryKey: ["omega-activity"],
    queryFn: () => omegaApi.getActivity(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  const revenue = useQuery({
    queryKey: ["omega-revenue"],
    queryFn: () => omegaApi.getRevenue(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  const refetchAll = () => {
    dashboard.refetch();
    resellers.refetch();
    activity.refetch();
    revenue.refetch();
  };

  return {
    stats: dashboard.data,
    statsLoading: dashboard.isLoading,
    statsError: dashboard.isError,
    resellers: resellers.data ?? [],
    resellersLoading: resellers.isLoading,
    activity: activity.data ?? [],
    activityLoading: activity.isLoading,
    revenue: revenue.data,
    revenueLoading: revenue.isLoading,
    refetchAll,
    lastUpdated: new Date(),
  };
}

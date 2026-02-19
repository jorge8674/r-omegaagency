import { useQuery } from "@tanstack/react-query";
import { omegaApi, type OmegaDashboardStats } from "@/lib/api/omega";

const REFETCH = 60000;

export function useOmegaDashboard() {
  // dashboard endpoint has a backend bug (500) — retry:0 to avoid blocking UI
  const dashboard = useQuery({
    queryKey: ["omega-dashboard"],
    queryFn: () => omegaApi.getDashboard(),
    refetchInterval: REFETCH,
    retry: 0,
    staleTime: 0,
  });

  // resellers endpoint has same backend bug (500) — retry:0
  const resellers = useQuery({
    queryKey: ["omega-resellers"],
    queryFn: () => omegaApi.getResellers(),
    refetchInterval: REFETCH,
    retry: 0,
    staleTime: 0,
  });

  const activity = useQuery({
    queryKey: ["omega-activity"],
    queryFn: () => omegaApi.getActivity(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  // revenue returns 200 — use as fallback for MRR/ARR when dashboard fails
  const revenue = useQuery({
    queryKey: ["omega-revenue"],
    queryFn: () => omegaApi.getRevenue(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  // Compose stats: prefer dashboard data, fall back to revenue for MRR/ARR
  const stats: OmegaDashboardStats | undefined = dashboard.data
    ? dashboard.data
    : revenue.data
    ? {
        mrr: revenue.data.mrr,
        arr: revenue.data.arr,
        total_clients: 0,
        active_clients: 0,
        new_clients_this_month: 0,
        total_resellers: 0,
        active_resellers: 0,
        trial_resellers: 0,
        content_generated_month: 0,
        content_breakdown: {},
        videos_generated: 0,
        agent_executions: 0,
        agent_success_rate: 0,
        top_agents: [],
      }
    : undefined;


  const refetchAll = () => {
    dashboard.refetch();
    resellers.refetch();
    activity.refetch();
    revenue.refetch();
  };

  return {
    stats,
    // loading only while revenue is pending (dashboard may always fail)
    statsLoading: revenue.isLoading && dashboard.isLoading,
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


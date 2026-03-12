import { useQuery } from "@tanstack/react-query";
import { omegaApi, type OmegaDashboardStats, type OmegaActivity } from "@/lib/api/omega";
import { apiCall } from "@/lib/api/core";

const REFETCH = 60000;

interface SentinelAgent {
  status: string;
  last_run: string;
  issues: number;
  security_score: number;
}

interface SentinelStatus {
  security_score: number;
  status: string;
  last_scan: string;
  agents: Record<string, SentinelAgent>;
  deploy_decision: string;
  active_issues: Array<{ severity: string; type: string; message: string }>;
}

export function useOmegaDashboard() {
  const dashboard = useQuery({
    queryKey: ["omega-dashboard"],
    queryFn: () => omegaApi.getDashboard(),
    refetchInterval: REFETCH,
    retry: 0,
    staleTime: 0,
  });

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

  const revenue = useQuery({
    queryKey: ["omega-revenue"],
    queryFn: () => omegaApi.getRevenue(),
    refetchInterval: REFETCH,
    retry: 1,
    staleTime: 0,
  });

  const sentinel = useQuery<SentinelStatus | null>({
    queryKey: ["sentinel-status"],
    queryFn: async () => {
      try {
        return await apiCall<SentinelStatus>("/sentinel/status/");
      } catch {
        return null;
      }
    },
    refetchInterval: REFETCH,
    retry: 0,
    staleTime: 0,
  });

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
    sentinel.refetch();
  };

  const activityList: OmegaActivity[] = Array.isArray(activity.data)
    ? activity.data
    : (activity.data as { activities?: OmegaActivity[] } | undefined)?.activities ?? [];

  const resellersList = Array.isArray(resellers.data) ? resellers.data : [];

  return {
    stats,
    statsLoading: revenue.isLoading && dashboard.isLoading,
    statsError: dashboard.isError,
    resellers: resellersList,
    resellersLoading: resellers.isLoading,
    activity: activityList,
    activityLoading: activity.isLoading,
    revenue: revenue.data,
    revenueLoading: revenue.isLoading,
    sentinelLoading: sentinel.isLoading,
    refetchAll,
    lastUpdated: new Date(),
  };
}

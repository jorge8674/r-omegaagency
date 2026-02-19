import { useQuery } from "@tanstack/react-query";
import { listAgents } from "@/lib/api/agentsCrud";
import type { Agent, AgentDepartment } from "../types";
import { useMemo } from "react";

export function useAgents() {
  const {
    data: raw,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["agents-list"],
    queryFn: listAgents,
    retry: 1,
    staleTime: 30_000,
  });

  const agents: Agent[] = useMemo(() => {
    if (!raw) return [];
    return raw.data ?? [];
  }, [raw]);

  const grouped = useMemo(() => {
    const map: Record<string, Agent[]> = {};
    for (const a of agents) {
      const dept = a.department || "nucleo";
      if (!map[dept]) map[dept] = [];
      map[dept].push(a);
    }
    return map;
  }, [agents]);

  const stats = useMemo(() => ({
    total: agents.length,
    active: agents.filter((a) => a.status === "active").length,
    running: agents.filter((a) => a.status === "running").length,
    avgSuccess: agents.length
      ? Math.round(agents.reduce((s, a) => s + (a.success_rate ?? 0), 0) / agents.length)
      : 0,
  }), [agents]);

  return { agents, grouped, stats, isLoading, isError, refetch };
}

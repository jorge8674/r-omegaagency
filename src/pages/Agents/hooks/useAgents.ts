import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listAgents } from "@/lib/api/agentsCrud";
import type { Agent, AgentDepartment } from "../types";

export function useAgents() {
  const [deptFilter, setDeptFilter] = useState<AgentDepartment | "all">("all");
  const [search, setSearch] = useState("");

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
    return raw.items ?? [];
  }, [raw]);

  const filtered = useMemo(() => {
    let list = agents;
    if (deptFilter !== "all") {
      list = list.filter((a) => a.department === deptFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [agents, deptFilter, search]);

  const grouped = useMemo(() => {
    const map: Record<string, Agent[]> = {};
    for (const a of filtered) {
      const dept = a.department || "núcleo";
      if (!map[dept]) map[dept] = [];
      map[dept].push(a);
    }
    return map;
  }, [filtered]);

  const stats = useMemo(
    () => ({
      total: agents.length,
      active: agents.filter((a) => a.status === "active").length,
      running: agents.filter((a) => a.status === "running").length,
      byDept: agents.reduce<Record<string, number>>((acc, a) => {
        acc[a.department] = (acc[a.department] || 0) + 1;
        return acc;
      }, {}),
    }),
    [agents],
  );

  return {
    agents, filtered, grouped, stats,
    isLoading, isError, refetch,
    deptFilter, setDeptFilter,
    search, setSearch,
  };
}

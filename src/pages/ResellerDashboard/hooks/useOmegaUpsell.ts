import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import { omegaApi, type OrgChart } from "@/lib/api/omega";
import {
  agentPrice,
  type AgentCardData,
  type DeptData,
} from "../utils/agentPricing";

// ─── Hook: fetch + state + mutation ─────────────────────
// R-DDD-001: Zero JSX, zero UI imports

export function useOmegaUpsell(resellerId: string) {
  const { toast } = useToast();

  const [contractAgent, setContractAgent] = useState<AgentCardData | null>(null);
  const [contractDept, setContractDept] = useState<DeptData | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { data: orgChart, isLoading } = useQuery<OrgChart>({
    queryKey: ["org-chart-upsell"],
    queryFn: () => omegaApi.getOrgChart(),
    retry: 1,
    staleTime: 300_000,
  });

  // ── Derive flat lists with defensive guards ───────────
  const allAgents: AgentCardData[] = [];
  const deptMap = new Map<string, AgentCardData[]>();

  if (orgChart) {
    const dirs = Array.isArray(orgChart.directors) ? orgChart.directors : [];
    for (const d of dirs) {
      if (!d || typeof d !== "object") continue;
      const entry: AgentCardData = {
        code: d.code,
        name: d.name,
        department: d.department,
        role: "director",
      };
      allAgents.push(entry);
      const list = deptMap.get(d.department) ?? [];
      list.push(entry);

      const subs = Array.isArray(d.sub_agents) ? d.sub_agents : [];
      for (const sa of subs) {
        if (!sa || typeof sa !== "object") continue;
        const sub: AgentCardData = {
          code: sa.code,
          name: sa.name,
          department: d.department,
          role: "sub_agent",
        };
        allAgents.push(sub);
        list.push(sub);
      }
      deptMap.set(d.department, list);
    }
  }

  const departments: DeptData[] = Array.from(deptMap.entries()).map(
    ([dept, agents]) => ({
      dept,
      agents,
      total: agents.reduce((s, a) => s + agentPrice(a.code, a.role), 0),
    }),
  );

  // ── Mutation ──────────────────────────────────────────
  const submitUpsell = async (payload: Record<string, unknown>) => {
    setSending(true);
    try {
      await apiCall("/upsell/solicitud/", "POST", payload);
      toast({
        title: "✅ Solicitud enviada",
        description: `${String(payload.item_name)} estará activo en menos de 24 horas.`,
        className: "border-amber-500/30 bg-amber-950/80 text-amber-100",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
      setContractAgent(null);
      setContractDept(null);
      setMessage("");
    }
  };

  return {
    isLoading,
    allAgents,
    departments,
    contractAgent,
    setContractAgent,
    contractDept,
    setContractDept,
    message,
    setMessage,
    sending,
    submitUpsell,
    resellerId,
  } as const;
}

export type OmegaUpsellHook = ReturnType<typeof useOmegaUpsell>;

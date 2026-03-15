import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { omegaApi, type OrgDirector, type OrgSubAgent } from "@/lib/api/omega";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";

export interface MarketplaceAgent {
  code: string;
  name: string;
  department: string;
  role: "director" | "sub_agent";
  status: string;
  description?: string;
  active: boolean;          // already purchased
}

export interface SolicitudPayload {
  agent_code: string;
  agent_name: string;
  department: string;
  client_note: string;
}

export function useMarketplace() {
  const { user } = useOmegaAuth();
  const { toast } = useToast();
  const resellerId = user?.reseller_id ?? localStorage.getItem("omega_reseller_id") ?? "";

  const [selected, setSelected] = useState<MarketplaceAgent | null>(null);
  const [sending, setSending] = useState(false);

  const { data: orgChart, isLoading } = useQuery({
    queryKey: ["marketplace-org-chart"],
    queryFn: () => omegaApi.getOrgChart(),
    staleTime: 300_000,
  });

  // For now treat all agents as available (not purchased)
  // A future API can return reseller's active agent codes
  const agents: MarketplaceAgent[] = [];
  const deptSet = new Set<string>();

  if (orgChart) {
    for (const d of orgChart.directors) {
      deptSet.add(d.department);
      agents.push(mapDirector(d));
      for (const s of d.sub_agents) {
        agents.push(mapSub(s, d.department));
      }
    }
  }

  const departments = Array.from(deptSet);

  async function submitSolicitud(payload: SolicitudPayload) {
    setSending(true);
    try {
      await apiCall("/omega/approval-requests/", "POST", {
        type: "agent_purchase_request",
        reseller_id: resellerId,
        agent_code: payload.agent_code,
        agent_name: payload.agent_name,
        department: payload.department,
        client_note: payload.client_note,
      });
      toast({
        title: "✅ Solicitud enviada",
        description: `Tu solicitud para ${payload.agent_name} fue recibida.`,
        className: "border-amber-500/30 bg-amber-950/80 text-amber-100",
      });
    } catch {
      toast({ title: "Error al enviar solicitud", variant: "destructive" });
    } finally {
      setSending(false);
      setSelected(null);
    }
  }

  return { agents, departments, isLoading, selected, setSelected, sending, submitSolicitud };
}

function mapDirector(d: OrgDirector): MarketplaceAgent {
  return {
    code: d.code, name: d.name, department: d.department,
    role: "director", status: d.status, active: false,
  };
}

function mapSub(s: OrgSubAgent, dept: string): MarketplaceAgent {
  return {
    code: s.code, name: s.name, department: dept,
    role: "sub_agent", status: s.status, description: s.description, active: false,
  };
}

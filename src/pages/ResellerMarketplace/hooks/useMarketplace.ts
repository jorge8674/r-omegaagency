import { useState, useCallback } from "react";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";

export interface MarketplaceAgent {
  code: string;
  name: string;
  department: string;
  role: "director" | "sub_agent";
  status: string;
  description?: string;
  active: boolean;
}

export interface SolicitudPayload {
  agent_code: string;
  agent_name: string;
  department: string;
  client_note: string;
}

/**
 * Returns a set of active agent codes for this reseller.
 * TODO: Replace with real API call to get reseller's purchased agents.
 */
function useActiveAgentCodes(): Set<string> {
  // Future: fetch from /reseller/agents/active/ endpoint
  return new Set<string>();
}

export function useMarketplace() {
  const { user } = useOmegaAuth();
  const { toast } = useToast();
  const resellerId = user?.reseller_id ?? localStorage.getItem("omega_reseller_id") ?? "";

  const [selected, setSelected] = useState<MarketplaceAgent | null>(null);
  const [sending, setSending] = useState(false);
  const activeAgents = useActiveAgentCodes();

  const isAgentActive = useCallback(
    (code: string) => activeAgents.has(code),
    [activeAgents]
  );

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

  return { isAgentActive, selected, setSelected, sending, submitSolicitud };
}

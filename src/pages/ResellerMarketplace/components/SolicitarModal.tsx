import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { agentPrice } from "@/pages/ResellerDashboard/utils/agentPricing";
import type { MarketplaceAgent, SolicitudPayload } from "../hooks/useMarketplace";

interface Props {
  agent: MarketplaceAgent | null;
  onClose: () => void;
  onSubmit: (p: SolicitudPayload) => void;
  sending: boolean;
}

export function SolicitarModal({ agent, onClose, onSubmit, sending }: Props) {
  const [note, setNote] = useState("");

  if (!agent) return null;

  const price = agentPrice(agent.code, agent.role);

  return (
    <Dialog open onOpenChange={(v) => { if (!v) { onClose(); setNote(""); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{agent.name}</DialogTitle>
          <DialogDescription>
            {agent.department} · {agent.role === "director" ? "Director" : "Agente"} ·{" "}
            <span className="text-amber-400 font-semibold">
              {price ? `$${price.toLocaleString()}/mes` : "Contactar para precio"}
            </span>
          </DialogDescription>
        </DialogHeader>

        {agent.description && (
          <p className="text-xs text-muted-foreground">{agent.description}</p>
        )}

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Para qué cliente lo necesitas?"
          className="min-h-[80px]"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            disabled={sending}
            onClick={() => onSubmit({
              agent_code: agent.code,
              agent_name: agent.name,
              department: agent.department,
              client_note: note,
            })}
          >
            {sending ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

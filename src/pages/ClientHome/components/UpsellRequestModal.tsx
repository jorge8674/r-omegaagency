/* Upsell Request Modal — simple 450px modal */
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UpsellPayload } from "../types";
import { useUpsellRequest } from "../hooks/useUpsellRequest";

interface Props {
  open: boolean;
  onClose: () => void;
  clientId: string;
  currentPlan: string;
  item: Omit<UpsellPayload, "client_id" | "current_plan" | "client_message"> | null;
}

export default function UpsellRequestModal({ open, onClose, clientId, currentPlan, item }: Props) {
  const [message, setMessage] = useState("");
  const mutation = useUpsellRequest();

  if (!item) return null;

  const handleSubmit = () => {
    mutation.mutate(
      {
        client_id: clientId,
        current_plan: currentPlan,
        request_type: item.request_type,
        item_name: item.item_name,
        item_code: item.item_code,
        monthly_price: item.monthly_price,
        new_monthly_total: item.new_monthly_total,
        client_message: message || undefined,
      },
      { onSuccess: () => { setMessage(""); onClose(); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Solicitar {item.item_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-2xl font-bold text-primary">
            ${item.monthly_price.toLocaleString()}/mes adicional
          </p>
          {item.new_monthly_total > 0 && (
            <p className="text-sm text-muted-foreground">
              Tu nuevo total: <strong>${item.new_monthly_total.toLocaleString()}/mes</strong>
            </p>
          )}

          <Textarea
            placeholder="Cuéntanos sobre tu negocio (opcional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />

          {mutation.isError && (
            <p className="text-sm text-destructive">{mutation.error?.message}</p>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enviando..." : "Enviar solicitud"}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            El equipo de OMEGA procesará tu solicitud en menos de 24h
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

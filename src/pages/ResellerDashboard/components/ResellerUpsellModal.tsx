import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { UpsellOpportunity, ResellerUpsellPayload } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  opportunity: UpsellOpportunity | null;
  currentPlan: string;
  onSubmit: (payload: ResellerUpsellPayload) => void;
  isPending: boolean;
}

export function ResellerUpsellModal({
  open, onOpenChange, opportunity, currentPlan, onSubmit, isPending,
}: Props) {
  const [msg, setMsg] = useState("");

  if (!opportunity) return null;

  const handleSubmit = () => {
    onSubmit({
      client_id: opportunity.client_id,
      client_name: opportunity.client_name,
      current_plan: currentPlan,
      request_type: opportunity.type,
      item_name: opportunity.cta,
      item_code: opportunity.type,
      monthly_price: opportunity.potential_revenue_min,
      new_monthly_total: opportunity.potential_revenue_min,
      client_message: msg || undefined,
    });
    setMsg("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            Proponer upgrade a {opportunity.client_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{opportunity.message}</p>
          <p className="text-sm">
            Revenue potencial:{" "}
            <strong className="text-[hsl(var(--success))]">
              +${opportunity.potential_revenue_min}–${opportunity.potential_revenue_max}/mes
            </strong>
          </p>
          <Textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Mensaje adicional (opcional)..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-primary-foreground"
          >
            {isPending ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

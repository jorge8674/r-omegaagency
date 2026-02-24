import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowUpRight, Receipt } from "lucide-react";
import type { ClientDetailData } from "../hooks/useClientDetail";

interface Props {
  client: ClientDetailData;
}

const SUB_STYLE: Record<string, { label: string; cls: string }> = {
  active: { label: "Activa", cls: "border-green-500/50 text-green-400 bg-green-500/10" },
  past_due: { label: "Vencida", cls: "border-red-500/50 text-red-400 bg-red-500/10" },
  canceled: { label: "Cancelada", cls: "border-border text-muted-foreground bg-muted/30" },
  trial: { label: "Trial", cls: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
};

const PLAN_PRICE: Record<string, number> = { enterprise: 780, pro: 380, basic: 120 };

export function ClientBillingTab({ client }: Props) {
  const plan = client.plan ?? "basic";
  const subStatus = client.trial_active ? "trial" : "active";
  const style = SUB_STYLE[subStatus] ?? SUB_STYLE.active;
  const price = client.monthly_budget_total ?? PLAN_PRICE[plan] ?? 0;
  const isBasic = plan === "basic";

  return (
    <div className="space-y-4">
      {isBasic && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm font-semibold text-yellow-400">Upgrade disponible</p>
                <p className="text-xs text-muted-foreground">Desbloquea más agentes y contenido con Pro o Enterprise</p>
              </div>
            </div>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs">Upgrade</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/30 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-yellow-400" /> Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Estado</span>
              <Badge variant="outline" className={style.cls}>{style.label}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Plan</span>
              <span className="text-sm font-semibold capitalize">{plan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Precio mensual</span>
              <span className="text-sm font-semibold">${price}</span>
            </div>
            {client.trial_ends_at && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Trial termina</span>
                <span className="text-xs">{new Date(client.trial_ends_at).toLocaleDateString()}</span>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs gap-1.5">
              Cambiar Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Receipt className="h-4 w-4 text-yellow-400" /> Historial de pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
            <Receipt className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Historial no disponible aún</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, CheckCircle2, Clock } from "lucide-react";
import type { ResellerDetailData } from "../hooks/useResellerDetail";

interface Props { reseller: ResellerDetailData }

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ResellerBillingTab({ reseller }: Props) {
  const rate = reseller.omega_commission_rate ?? 0;
  const pct = rate < 1 ? rate * 100 : rate;
  const mrr = reseller.monthly_revenue_reported ?? 0;
  const commission = mrr * (rate < 1 ? rate : rate / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-border/30 bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-amber-400" /> Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Estado</span>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">Activa</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Plan</span>
            <span className="text-sm font-semibold capitalize">{reseller.plan ?? "starter"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Licencia mensual</span>
            <span className="text-sm font-semibold">{fmt(reseller.monthly_license ?? 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Setup fee</span>
            <span className="flex items-center gap-1 text-xs">
              {reseller.setup_fee_paid
                ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Pagado</>
                : <><Clock className="h-3.5 w-3.5 text-yellow-400" /> Pendiente</>}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Comisión ({pct}%)</span>
            <span className="text-sm font-semibold text-amber-400">{fmt(commission)}/mes</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/30 bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-amber-400" /> Historial de facturas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
          <Receipt className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">Historial no disponible aún</p>
          <Button variant="outline" size="sm" className="mt-2 text-xs">Solicitar reporte</Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Crown, Users, DollarSign, Percent } from "lucide-react";
import type { ResellerDetailData } from "../hooks/useResellerDetail";

interface Props { reseller: ResellerDetailData }

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const PLAN_PRICE: Record<string, string> = {
  enterprise: "$4,200/mes",
  pro: "$1,800/mes",
  starter: "$600/mes",
};

export function ResellerMetricCards({ reseller }: Props) {
  const plan = (reseller.plan ?? "starter").toLowerCase();
  const mrr = reseller.monthly_revenue_reported ?? 0;
  const rate = reseller.omega_commission_rate ?? 0;
  const commission = mrr * (rate / 100);

  const cards = [
    { icon: Crown, label: "Plan", value: plan, sub: PLAN_PRICE[plan] ?? "—" },
    { icon: Users, label: "Clientes", value: `${reseller.clients_count} activos`, sub: "" },
    { icon: DollarSign, label: "MRR Generado", value: fmt(mrr), sub: "/mes" },
    { icon: Percent, label: "Comisión", value: fmt(commission), sub: `(${rate}%)` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/30 bg-card/60 hover:border-amber-500/30 transition-colors">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <c.icon className="h-4 w-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-sm font-semibold capitalize truncate">{c.value}</p>
              {c.sub && <p className="text-xs text-muted-foreground">{c.sub}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, DollarSign, Percent, Crown, UserMinus } from "lucide-react";
import type { ResellerStatsData } from "../hooks/useResellerDetail";

interface Props { stats: ResellerStatsData | undefined; loading: boolean }

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ResellerStatsTab({ stats, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <TrendingUp className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Estadísticas no disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const churnColor = (stats.churn_rate ?? 0) > 10 ? "text-red-400" : "text-emerald-400";

  const cards = [
    { icon: Users, label: "Total clientes", value: String(stats.total_clients ?? 0), sub: "" },
    { icon: Users, label: "Activos", value: String(stats.active_clients ?? 0), sub: `de ${stats.total_clients ?? 0}` },
    { icon: DollarSign, label: "MRR Generado", value: fmt(stats.mrr ?? 0), sub: "", cls: "text-amber-400" },
    { icon: Percent, label: "Comisión del mes", value: fmt(stats.commission_month ?? 0), sub: "" },
    { icon: UserMinus, label: "Churn rate", value: `${stats.churn_rate ?? 0}%`, sub: "", cls: churnColor },
    { icon: Crown, label: "Plan más popular", value: stats.top_plan ?? "—", sub: "", capitalize: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/30 bg-card/60 hover:border-amber-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="h-4 w-4 text-amber-400" />
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
            <p className={`text-xl font-bold ${c.cls ?? ""} ${c.capitalize ? "capitalize" : ""}`}>{c.value}</p>
            {c.sub && <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

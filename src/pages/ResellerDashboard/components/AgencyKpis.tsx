import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, FileText, AlertTriangle, Heart } from "lucide-react";
import type { ResellerKpis } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

interface Props {
  kpis: ResellerKpis | undefined;
  activeClients: number;
  loading: boolean;
}

export function AgencyKpis({ kpis, activeClients, loading }: Props) {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/30 bg-card/60">
            <CardContent className="pt-5 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const alertColor =
    kpis.active_alerts === 0 ? "text-emerald-400" : kpis.active_alerts <= 2 ? "text-yellow-400" : "text-destructive";

  const cards = [
    {
      icon: DollarSign,
      label: "MRR Generado",
      value: `${fmt(kpis.mrr_generated)}/mes`,
      sub: kpis.mrr_delta !== 0
        ? `${kpis.mrr_delta > 0 ? "↑" : "↓"} ${fmt(Math.abs(kpis.mrr_delta))} vs mes anterior`
        : "Revenue total de tus clientes",
      subCls: kpis.mrr_delta > 0 ? "text-emerald-400" : kpis.mrr_delta < 0 ? "text-destructive" : "text-muted-foreground",
    },
    {
      icon: FileText,
      label: "Posts del Mes",
      value: String(kpis.total_posts_month),
      sub: `Para ${activeClients} clientes activos`,
      subCls: "text-muted-foreground",
    },
    {
      icon: AlertTriangle,
      label: "Alertas Activas",
      value: String(kpis.active_alerts),
      valueCls: alertColor,
      sub: "Redes no conectadas · Posts vencidos",
      subCls: "text-muted-foreground",
    },
    {
      icon: Heart,
      label: "Salud General",
      value: `${kpis.healthy_clients}/${activeClients}`,
      sub: "",
      subCls: "",
      dots: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/30 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
            <c.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className={`text-xl font-bold font-display ${c.valueCls ?? ""}`}>{c.value}</p>
            {c.dots ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />{kpis.healthy_clients}</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400" />{kpis.warning_clients}</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />{kpis.critical_clients}</span>
              </div>
            ) : (
              <p className={`text-[11px] ${c.subCls}`}>{c.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

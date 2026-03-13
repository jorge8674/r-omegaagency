import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, FileText, AlertTriangle, Heart } from "lucide-react";
import type { ResellerKpis } from "../types";
import type { KpiDrawerType } from "./KpiDrawer";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(n);

interface Props {
  kpis: ResellerKpis | undefined;
  activeClients: number;
  loading: boolean;
  onKpiClick?: (type: KpiDrawerType) => void;
}

export function AgencyKpis({ kpis, activeClients, loading, onKpiClick }: Props) {
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

  const deltaText = kpis.mrr_delta > 0
    ? `↑ +${fmt(kpis.mrr_delta)} vs mes anterior`
    : kpis.mrr_delta < 0
      ? `↓ ${fmt(kpis.mrr_delta)} vs mes anterior`
      : "Sin cambio vs mes anterior";

  const deltaCls = kpis.mrr_delta > 0
    ? "text-[hsl(var(--success))]"
    : kpis.mrr_delta < 0
      ? "text-destructive"
      : "text-muted-foreground";

  const alertCls = kpis.active_alerts === 0
    ? "text-[hsl(var(--success))]"
    : kpis.active_alerts <= 2
      ? "text-[hsl(var(--warning))]"
      : "text-destructive";

  const cards: Array<{ icon: any; label: string; value: string; valueCls?: string; sub: string; subCls: string; dots?: boolean; drawerType: KpiDrawerType }> = [
    {
      icon: DollarSign,
      label: "MRR Generado",
      drawerType: "mrr",
      value: `${fmt(kpis.mrr_generated)}/mes`,
      sub: deltaText,
      subCls: deltaCls,
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
      valueCls: alertCls,
      sub: "Redes no conectadas · Posts vencidos",
      subCls: "text-muted-foreground",
    },
    {
      icon: Heart,
      label: "Salud General",
      value: `${kpis.healthy_clients}/${activeClients} saludables`,
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
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {c.label}
            </CardTitle>
            <c.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className={`text-xl font-bold font-display ${c.valueCls ?? ""}`}>
              {c.value}
            </p>
            {c.dots ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                  {kpis.healthy_clients}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--warning))]" />
                  {kpis.warning_clients}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  {kpis.critical_clients}
                </span>
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

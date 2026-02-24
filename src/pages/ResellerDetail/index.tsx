import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LayoutDashboard, Users, CreditCard, BarChart3, Activity } from "lucide-react";
import { useResellerDetail } from "./hooks/useResellerDetail";
import { ResellerHeader } from "./components/ResellerHeader";
import { ResellerMetricCards } from "./components/ResellerMetricCards";
import { ResellerClientsTab } from "./components/ResellerClientsTab";
import { ResellerBillingTab } from "./components/ResellerBillingTab";
import { ResellerStatsTab } from "./components/ResellerStatsTab";
import { ResellerActivityTab } from "./components/ResellerActivityTab";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  enterprise: { label: "Enterprise", cls: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  pro: { label: "Pro", cls: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  starter: { label: "Starter", cls: "border-border text-muted-foreground bg-muted/30" },
};

export default function ResellerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reseller, clients, stats, activity } = useResellerDetail(id);

  if (reseller.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reseller.data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Reseller no encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/resellers")}>
          Volver a Resellers
        </Button>
      </div>
    );
  }

  const r = reseller.data;
  const clientsList = Array.isArray(clients.data) ? clients.data : [];
  const plan = (r.plan ?? "starter").toLowerCase();
  const pb = PLAN_BADGE[plan] ?? PLAN_BADGE.starter;
  const rate = r.omega_commission_rate ?? 0;
  const pct = rate < 1 ? rate * 100 : rate;
  const mrr = r.monthly_revenue_reported ?? 0;
  const commission = mrr * (rate < 1 ? rate : rate / 100);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <ResellerHeader reseller={r} />
      <ResellerMetricCards reseller={r} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview" className="gap-1.5 text-xs">
            <LayoutDashboard className="h-3.5 w-3.5" /> Resumen
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> Clientes
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5 text-xs">
            <CreditCard className="h-3.5 w-3.5" /> Billing
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> Stats
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5 text-xs">
            <Activity className="h-3.5 w-3.5" /> Actividad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 space-y-4">
              <Card className="border-border/30 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm font-semibold">Información de la agencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Agencia", value: r.agency_name },
                    { label: "Contacto", value: r.owner_name },
                    { label: "Email", value: r.owner_email },
                    { label: "Teléfono", value: r.phone },
                    { label: "Incorporación", value: format(new Date(r.created_at), "d MMM yyyy", { locale: es }) },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start py-1.5 border-b border-border/10 last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-medium text-right max-w-[60%] truncate">{row.value || "—"}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/30 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm font-semibold">Últimos 5 clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {clients.isLoading ? (
                    <Skeleton className="h-20 rounded" />
                  ) : clientsList.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">Sin clientes</p>
                  ) : (
                    <div className="space-y-1.5">
                      {clientsList.slice(0, 5).map((c) => {
                        const ps = PLAN_BADGE[(c.plan ?? "starter").toLowerCase()] ?? PLAN_BADGE.starter;
                        return (
                          <div key={c.id} onClick={() => navigate(`/clients/${c.id}`)}
                            className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-card/80 cursor-pointer transition-colors">
                            <span className="text-xs font-medium truncate flex-1">{c.name}</span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${ps.cls}`}>{ps.label}</Badge>
                            <div className={`h-1.5 w-1.5 rounded-full ${c.active ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Card className="border-border/30 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm font-semibold">Plan & Comisión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Plan", value: <Badge variant="outline" className={pb.cls}>{pb.label}</Badge> },
                    { label: "Licencia mensual", value: fmt(r.monthly_license ?? 0) },
                    { label: "Commission rate", value: `${pct}%` },
                    { label: "Comisión estimada", value: <span className="text-amber-400 font-semibold">{fmt(commission)}/mes</span> },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-border/10 last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-semibold">{row.value}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs"
                    onClick={() => {
                      const tabEl = document.querySelector('[data-state][value="billing"]') as HTMLElement | null;
                      tabEl?.click();
                    }}>
                    Ver Billing completo
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-border/30 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm font-semibold">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Clientes activos", value: `${clientsList.filter((c) => c.active).length} / ${clientsList.length}` },
                    { label: "Slug", value: r.slug },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-border/10 last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-medium">{row.value || "—"}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <ResellerClientsTab clients={clientsList} loading={clients.isLoading} />
        </TabsContent>
        <TabsContent value="billing">
          <ResellerBillingTab reseller={r} />
        </TabsContent>
        <TabsContent value="stats">
          <ResellerStatsTab stats={stats.data} loading={stats.isLoading} />
        </TabsContent>
        <TabsContent value="activity">
          <ResellerActivityTab activity={Array.isArray(activity.data) ? activity.data : []} loading={activity.isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

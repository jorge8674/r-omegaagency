import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LayoutDashboard, Bot, FileText, CreditCard, Activity } from "lucide-react";
import { useClientDetail } from "./hooks/useClientDetail";
import { ClientHeader } from "./components/ClientHeader";
import { ClientMetricCards } from "./components/ClientMetricCards";
import { ClientAgentsTab } from "./components/ClientAgentsTab";
import { ClientContentTab } from "./components/ClientContentTab";
import { ClientBillingTab } from "./components/ClientBillingTab";
import { ClientActivityTab } from "./components/ClientActivityTab";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, agents, content, activity } = useClientDetail(id);

  if (client.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!client.data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Cliente no encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/clients")}>
          Volver a Clientes
        </Button>
      </div>
    );
  }

  const c = client.data;
  const agentsList = Array.isArray(agents.data) ? agents.data : [];
  const contentList = Array.isArray(content.data) ? content.data : [];

  return (
    <div className="space-y-6">
      <ClientHeader client={c} />
      <ClientMetricCards client={c} agents={agentsList} content={contentList} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview" className="gap-1.5 text-xs">
            <LayoutDashboard className="h-3.5 w-3.5" /> Resumen
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-1.5 text-xs">
            <Bot className="h-3.5 w-3.5" /> Agentes
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" /> Contenido
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5 text-xs">
            <CreditCard className="h-3.5 w-3.5" /> Billing
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
                  <CardTitle className="font-display text-sm font-semibold">Información del negocio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Empresa", value: c.company },
                    { label: "Email", value: c.email },
                    { label: "Teléfono", value: c.phone },
                    { label: "Notas", value: c.notes },
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
                  <CardTitle className="font-display text-sm font-semibold">Actividad reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  {activity.isLoading ? (
                    <Skeleton className="h-20 rounded" />
                  ) : (
                    <ClientActivityTab
                      activity={Array.isArray(activity.data) ? activity.data.slice(0, 5) : []}
                      loading={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Card className="border-border/30 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm font-semibold">Plan & Billing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Plan", value: c.plan ?? "basic" },
                    { label: "Presupuesto", value: c.monthly_budget_total ? `$${c.monthly_budget_total}` : "—" },
                    { label: "Inicio", value: new Date(c.created_at).toLocaleDateString() },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-border/10 last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-semibold capitalize">{row.value}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs">Cambiar Plan</Button>
                </CardContent>
              </Card>
              <Card className="border-border/30 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm font-semibold">Reseller</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {c.reseller_id ? `Reseller: ${c.reseller_id}` : "Cliente directo"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <ClientAgentsTab agents={agentsList} loading={agents.isLoading} clientId={id ?? ""} clientName={c.name} onRefetch={() => agents.refetch()} />
        </TabsContent>
        <TabsContent value="content">
          <ClientContentTab content={contentList} loading={content.isLoading} />
        </TabsContent>
        <TabsContent value="billing">
          <ClientBillingTab client={c} />
        </TabsContent>
        <TabsContent value="activity">
          <ClientActivityTab activity={Array.isArray(activity.data) ? activity.data : []} loading={activity.isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

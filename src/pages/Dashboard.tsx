import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, checkBackendHealth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Activity, Bot, AlertTriangle, Workflow, Loader2, Play, RefreshCw,
  CheckCircle2, XCircle, Server,
} from "lucide-react";

const WORKFLOWS = [
  { name: "full_content_pipeline", label: "Full Content Pipeline", description: "Genera contenido completo" },
  { name: "crisis_response", label: "Crisis Response", description: "Respuesta de crisis automatizada" },
  { name: "weekly_client_report", label: "Weekly Client Report", description: "Reporte semanal de clientes" },
  { name: "trend_to_content", label: "Trend to Content", description: "Convierte trends en contenido" },
  { name: "competitive_analysis", label: "Competitive Analysis", description: "Análisis competitivo completo" },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null);

  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => checkBackendHealth(),
    refetchInterval: 30000,
  });

  const { data: systemStats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ["system-stats"],
    queryFn: async () => {
      const res = await fetch(
        "https://omegaraisen-production-2031.up.railway.app/api/v1/system/stats",
        { headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error(`Stats error ${res.status}`);
      const data = await res.json() as {
        total_endpoints: number;
        total_agents: number;
        active_agents: number;
        total_clients: number;
        content_generated_today: number;
        agent_executions_today: number;
      };
      return data;
    },
    refetchInterval: 30000,
    staleTime: 0,
    retry: 0,
  });

  const { data: systemState, isLoading: stateLoading, refetch: refetchState } = useQuery({
    queryKey: ["system-state"],
    queryFn: () => api.systemState(),
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: agentsData, isLoading: agentsLoading, refetch: refetchAgents } = useQuery({
    queryKey: ["agents-status"],
    queryFn: () => api.agentsStatus(),
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => api.alerts(),
    refetchInterval: 30000,
    retry: 1,
  });


  const loading = stateLoading && agentsLoading && alertsLoading && healthLoading;
  const isOnline = health?.status === "healthy";

  // Backend returns { success, data: { agents: { name: "status", ... } } }
  const rawAgents = agentsData?.data?.agents ?? agentsData?.agents ?? agentsData ?? {};
  const agentsList: { name: string; status: string }[] = Array.isArray(rawAgents)
    ? rawAgents
    : typeof rawAgents === "object" && rawAgents !== null
      ? Object.entries(rawAgents).map(([name, status]) => ({ name, status: status as string }))
      : [];
  const agentsOnline = agentsList.filter((a) => a.status === "operational" || a.status === "online" || a.status === "active").length;
  const totalAgents = agentsList.length || systemState?.total_agents || 15;
  const alertsList = alerts?.data?.alerts ?? (Array.isArray(alerts) ? alerts : []);
  const alertCount = alertsList.length || alerts?.data?.active_count || 0;
  const activeWorkflows = systemState?.data?.active_workflows ?? systemState?.active_workflows ?? 0;

  const handleExecuteWorkflow = async (workflowName: string) => {
    setExecutingWorkflow(workflowName);
    try {
      await api.executeWorkflow(workflowName, "default", {});
      toast({ title: "✅ Workflow iniciado", description: `${workflowName} ejecutándose...` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setExecutingWorkflow(null);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([refetchHealth(), refetchState(), refetchAgents(), refetchAlerts(), refetchStats()]);
    setRefreshing(false);
    toast({ title: "✅ Actualizado", description: "Datos del sistema refrescados" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Conectando con el sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Centro de control OmegaRaisen</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
            <span className="text-xs">{isOnline ? 'Sistema Online' : 'Sin conexión'}</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshAll} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Bot className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Agentes Online</p>
              <div className="flex items-center gap-1.5">
                {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                  <>
                    <p className="text-2xl font-display font-bold">
                      {systemStats ? `${systemStats.active_agents}/${systemStats.total_agents}` : "—/—"}
                    </p>
                    {statsError && (
                      <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                      </TooltipTrigger><TooltipContent>Error cargando stats</TooltipContent></Tooltip></TooltipProvider>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endpoints</p>
              <div className="flex items-center gap-1.5">
                {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                  <>
                    <p className="text-2xl font-display font-bold">
                      {systemStats ? `${systemStats.total_endpoints}` : "—"}
                    </p>
                    {statsError && (
                      <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                      </TooltipTrigger><TooltipContent>Error cargando stats</TooltipContent></Tooltip></TooltipProvider>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
              <Workflow className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workflows Activos</p>
              <p className="text-2xl font-display font-bold">{activeWorkflows}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${alertCount > 0 ? 'bg-destructive/10' : 'bg-success/10'}`}>
              <AlertTriangle className={`h-5 w-5 ${alertCount > 0 ? 'text-destructive' : 'text-success'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alertas</p>
              <p className="text-2xl font-display font-bold">{alertCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Agents list */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Agentes del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {agentsList.length > 0 ? (
                agentsList.map((agent: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      {agent.status === "operational" || agent.status === "online" || agent.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm font-medium">{agent.name || agent.agent_name || `Agent ${i + 1}`}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {agent.status || "unknown"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isOnline ? "Sistema operativo — sin datos de agentes" : "Backend no disponible"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workflows */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {WORKFLOWS.map((wf) => (
                <div key={wf.name} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{wf.label}</p>
                    <p className="text-xs text-muted-foreground">{wf.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 shrink-0"
                    disabled={executingWorkflow === wf.name}
                    onClick={() => handleExecuteWorkflow(wf.name)}
                  >
                    {executingWorkflow === wf.name ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alertsList.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertsList.map((alert: any, i: number) => (
                <div key={i} className="rounded-lg bg-background/50 px-3 py-2 border border-destructive/20">
                  <p className="text-sm font-medium">{alert.title || alert.message || JSON.stringify(alert)}</p>
                  {alert.description && <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

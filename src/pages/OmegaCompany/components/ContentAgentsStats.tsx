import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Bot, Video } from "lucide-react";
import { apiCall } from "@/lib/api/core";
import type { OmegaDashboardStats } from "@/lib/api/omega";

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoy";
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}

function AgentLastActivity({ code }: { code: string }) {
  const { data } = useQuery({
    queryKey: ["agent-last-activity", code],
    queryFn: () => apiCall<{ items: { event_type: string; created_at: string }[] }>(`/omega/activity/?limit=1&agent_code=${code}`),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const item = data?.items?.[0];
  const text = item ? `${item.event_type} · ${timeAgo(item.created_at)}` : "Sin actividad reciente";

  return <p className="text-xs text-muted-foreground mt-1">→ {text}</p>;
}

interface Props {
  stats: OmegaDashboardStats | undefined;
  loading: boolean;
}

export function ContentAgentsStats({ stats, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const breakdown = stats?.content_breakdown ?? {};
  const topAgents = stats?.top_agents ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Content column */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Contenido Generado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total este mes</span>
            <span className="text-2xl font-bold">{stats?.content_generated_month ?? "—"}</span>
          </div>
          {stats?.videos_generated !== undefined && (
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Videos generados</span>
              <Badge variant="secondary" className="ml-auto">
                {stats.videos_generated}
              </Badge>
            </div>
          )}
          {Object.keys(breakdown).length > 0 && (
            <div className="space-y-1.5 pt-1">
              {Object.entries(breakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-muted-foreground">{type}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
          {!stats && (
            <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
          )}
        </CardContent>
      </Card>

      {/* Agents column */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4 text-primary" />
            Agentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ejecuciones totales</span>
            <span className="text-2xl font-bold">{stats?.agent_executions ?? "—"}</span>
          </div>
          {stats?.agent_success_rate !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tasa de éxito</span>
              <Badge
                variant={stats.agent_success_rate >= 90 ? "default" : "secondary"}
              >
                {stats.agent_success_rate.toFixed(1)}%
              </Badge>
            </div>
          )}
          {topAgents.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-medium text-muted-foreground">Top agentes</p>
              {topAgents.slice(0, 5).map((a) => (
                <div key={a.name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{a.name}</span>
                  <span className="font-medium">{a.executions}</span>
                </div>
              ))}
            </div>
          )}
          {!stats && (
            <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

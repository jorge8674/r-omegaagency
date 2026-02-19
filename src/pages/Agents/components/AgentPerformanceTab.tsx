import { useQuery } from "@tanstack/react-query";
import { getAgentExecutions } from "@/lib/api/agentsCrud";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { Agent } from "../types";

interface Props {
  agent: Agent;
}

export function AgentPerformanceTab({ agent }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["agent-executions", agent.id],
    queryFn: () => getAgentExecutions(agent.id),
    retry: 1,
  });

  const executions = data?.data ?? [];
  const last5 = executions.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Metrics summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border/50 p-3 text-center">
          <p className="text-2xl font-bold">{agent.total_tasks ?? 0}</p>
          <p className="text-xs text-muted-foreground">Total tareas</p>
        </div>
        <div className="rounded-lg border border-border/50 p-3 text-center">
          <p className="text-2xl font-bold">{agent.success_rate ?? 0}%</p>
          <p className="text-xs text-muted-foreground">Tasa de éxito</p>
        </div>
        <div className="rounded-lg border border-border/50 p-3 text-center">
          <p className="text-2xl font-bold">{agent.avg_response_time_ms ?? 0}ms</p>
          <p className="text-xs text-muted-foreground">Tiempo promedio</p>
        </div>
      </div>

      {/* Recent executions */}
      <div>
        <h4 className="text-sm font-medium mb-2">Últimas ejecuciones</h4>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : last5.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">Sin ejecuciones recientes</p>
        ) : (
          <div className="space-y-2">
            {last5.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-2.5 text-xs">
                {ex.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                ) : ex.status === "error" ? (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-warning shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{ex.input_summary || "Ejecución"}</p>
                  <p className="text-muted-foreground truncate">{ex.output_summary}</p>
                </div>
                <span className="text-muted-foreground shrink-0">{ex.duration_ms}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

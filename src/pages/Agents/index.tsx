import { useState } from "react";
import { Bot, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "./hooks/useAgents";
import { AgentCard } from "./components/AgentCard";
import { AgentDetailModal } from "./components/AgentDetailModal";
import { DEPARTMENT_LABELS } from "./types";
import type { Agent } from "./types";

export default function AgentsPage() {
  const { grouped, stats, isLoading, isError, refetch } = useAgents();
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> Sistema de Agentes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} agentes · {stats.active} activos · {stats.running} ejecutando · {stats.avgSuccess}% éxito promedio
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refrescar
        </Button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">Error al cargar agentes</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Reintentar</Button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      )}

      {/* Grouped grid */}
      {!isLoading && !isError && Object.entries(grouped).map(([dept, agents]) => (
        <div key={dept}>
          <h2 className="text-lg font-semibold mb-3 capitalize">
            {DEPARTMENT_LABELS[dept] || dept}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onViewDetails={setSelected} />
            ))}
          </div>
        </div>
      ))}

      {/* Detail modal */}
      <AgentDetailModal
        agent={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

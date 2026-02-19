import { useState } from "react";
import { Bot, RefreshCw, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "./hooks/useAgents";
import { AgentCard } from "./components/AgentCard";
import { AgentDetailModal } from "./components/AgentDetailModal";
import { DEPARTMENTS, DEPARTMENT_LABELS } from "./types";
import type { Agent, AgentDepartment } from "./types";

export default function AgentsPage() {
  const {
    grouped, stats, isLoading, isError, refetch,
    deptFilter, setDeptFilter, search, setSearch,
  } = useAgents();
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> Sistema de Agentes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} agentes · {stats.active} activos · {stats.running} ejecutando
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refrescar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar agente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm" variant={deptFilter === "all" ? "default" : "outline"}
            className="h-7 text-xs"
            onClick={() => setDeptFilter("all")}
          >
            Todos <Badge variant="secondary" className="ml-1 text-[10px]">{stats.total}</Badge>
          </Button>
          {DEPARTMENTS.map((dept) => (
            <Button
              key={dept} size="sm"
              variant={deptFilter === dept ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setDeptFilter(dept as AgentDepartment)}
            >
              {DEPARTMENT_LABELS[dept]}
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {stats.byDept[dept] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">Error al cargar agentes</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Reintentar</Button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Grid */}
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

      {/* Modal */}
      <AgentDetailModal
        agent={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

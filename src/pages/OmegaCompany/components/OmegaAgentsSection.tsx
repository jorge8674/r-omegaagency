import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bot, ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "@/pages/Agents/hooks/useAgents";
import {
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  STATUS_DOT,
  type AgentDepartment,
} from "@/pages/Agents/types";
import type { Agent } from "@/pages/Agents/types";

// ── helpers ─────────────────────────────────────────────────────────────────
function deptHealthColor(agents: Agent[]): string {
  if (!agents.length) return "bg-muted-foreground";
  const active = agents.filter((a) => a.status === "active" || a.status === "running").length;
  const ratio = active / agents.length;
  if (ratio === 1) return "bg-emerald-500";
  if (ratio >= 0.5) return "bg-amber-400";
  return "bg-destructive";
}

const STATUS_BADGE: Record<string, string> = {
  active:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  running:  "bg-amber-400/15  text-amber-400  border-amber-400/30",
  inactive: "bg-muted/40      text-muted-foreground border-border/30",
  error:    "bg-destructive/15 text-destructive border-destructive/30",
};

// ── sub-components ───────────────────────────────────────────────────────────
function DeptAccordion({ dept, agents }: { dept: string; agents: Agent[] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = agents.filter((a) => a.status === "active" || a.status === "running").length;

  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className={`h-2 w-2 rounded-full shrink-0 ${deptHealthColor(agents)}`} />
        <span className="flex-1 text-sm font-medium">
          {DEPARTMENT_LABELS[dept] ?? dept}
        </span>
        <span className="text-xs text-muted-foreground">
          {active}/{agents.length} activos
        </span>
        {open
          ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border/30 divide-y divide-border/20">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-2 px-4 py-1.5 hover:bg-muted/20 cursor-pointer"
              onClick={() => navigate("/agents")}
            >
              <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[agent.status]}`} />
              <span className="flex-1 truncate text-xs">{agent.name}</span>
              <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[agent.status] ?? STATUS_BADGE.inactive}`}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────
export function OmegaAgentsSection() {
  const navigate = useNavigate();
  const {
    stats, grouped, isLoading,
    deptFilter, setDeptFilter,
    search, setSearch,
  } = useAgents();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const allDepts = Object.keys(grouped) as AgentDepartment[];
  const filterDepts: Array<AgentDepartment | "all"> = ["all", ...DEPARTMENTS.filter((d) => grouped[d]?.length)];

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Bot className="h-4 w-4 text-primary" />
        <span>
          <span className="font-semibold text-foreground">{stats.active + stats.running}</span>
          /{stats.total} activos
        </span>
        <span className="ml-auto cursor-pointer text-xs hover:underline underline-offset-2"
          onClick={() => navigate("/agents")}>
          Ver panel completo →
        </span>
      </div>

      {/* Search + Dept Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="h-8 w-36 rounded-md border border-border/50 bg-background pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Dept filter chips */}
        {filterDepts.map((dept) => {
          const count = dept === "all" ? stats.total : (grouped[dept]?.length ?? 0);
          const active = dept === "all" ? deptFilter === "all" : deptFilter === dept;
          return (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50"
              }`}
            >
              {dept === "all" ? "Todos" : (DEPARTMENT_LABELS[dept] ?? dept)}
              <span className={`rounded-full px-1.5 text-[10px] font-bold ${active ? "bg-primary-foreground/20" : "bg-muted"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dept accordions */}
      {allDepts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Bot className="mb-2 h-8 w-8 opacity-30" />
          <p className="text-sm">Sin agentes disponibles</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allDepts.map((dept) => (
            <DeptAccordion key={dept} dept={dept} agents={grouped[dept]} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Bot } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAgents } from "@/pages/Agents/hooks/useAgents";
import { DEPARTMENT_LABELS, STATUS_DOT } from "@/pages/Agents/types";
import type { Agent } from "@/pages/Agents/types";

function deptHealthColor(agents: Agent[]): string {
  if (agents.length === 0) return "bg-muted-foreground";
  const active = agents.filter((a) => a.status === "active" || a.status === "running").length;
  const ratio = active / agents.length;
  if (ratio === 1) return "bg-emerald-500";
  if (ratio >= 0.5) return "bg-amber-400";
  return "bg-destructive";
}

const STATUS_BADGE_CLS: Record<string, string> = {
  active:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  running:  "bg-amber-400/15 text-amber-400 border-amber-400/30",
  inactive: "bg-muted/40 text-muted-foreground border-border/30",
  error:    "bg-destructive/15 text-destructive border-destructive/30",
};

export function OmegaAgentsSection() {
  const navigate = useNavigate();
  const { grouped, stats, isLoading } = useAgents();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (dept: string) =>
    setOpen((prev) => ({ ...prev, [dept]: !prev[dept] }));

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const depts = Object.keys(grouped);

  return (
    <div className="space-y-2">
      {/* Summary row */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
        <Bot className="h-4 w-4 text-primary" />
        <span>
          <span className="font-semibold text-foreground">{stats.active + stats.running}</span>
          /{stats.total} activos
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span
          className="cursor-pointer text-xs underline-offset-2 hover:underline"
          onClick={() => navigate("/agents")}
        >
          Ver panel completo →
        </span>
      </div>

      {/* Department accordions */}
      {depts.map((dept) => {
        const agents = grouped[dept];
        const active = agents.filter((a) => a.status === "active" || a.status === "running").length;
        const isOpen = open[dept] ?? false;
        const healthDot = deptHealthColor(agents);
        const label = DEPARTMENT_LABELS[dept] ?? dept;

        return (
          <div key={dept} className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden">
            {/* Dept header */}
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
              onClick={() => toggle(dept)}
            >
              <div className={`h-2 w-2 rounded-full shrink-0 ${healthDot}`} />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">
                {active}/{agents.length} activos
              </span>
              {isOpen
                ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>

            {/* Agent list */}
            {isOpen && (
              <div className="border-t border-border/30 divide-y divide-border/20">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-2 px-4 py-1.5 hover:bg-muted/20 cursor-pointer"
                    onClick={() => navigate("/agents")}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[agent.status]}`} />
                    <span className="flex-1 truncate text-xs">{agent.name}</span>
                    <span
                      className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE_CLS[agent.status] ?? STATUS_BADGE_CLS.inactive}`}
                    >
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {depts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Bot className="mb-2 h-8 w-8 opacity-30" />
          <p className="text-sm">Sin agentes disponibles</p>
        </div>
      )}
    </div>
  );
}

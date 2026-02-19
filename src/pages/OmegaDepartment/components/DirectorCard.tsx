// 92 lines
import { type OrgDirector, type OrgAgentStatus } from "@/lib/api/omega";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Star } from "lucide-react";

const STATUS_DOT: Record<OrgAgentStatus, string> = {
  active:      "bg-emerald-500 animate-pulse",
  online:      "bg-emerald-500 animate-pulse",
  in_task:     "bg-amber-400 animate-pulse",
  idle:        "bg-muted-foreground",
  in_training: "bg-blue-400 animate-pulse",
  inactive:    "bg-muted-foreground/50",
  error:       "bg-destructive",
};

const DEPT_STYLE: Record<string, { border: string; text: string; bg: string }> = {
  marketing:  { border: "border-orange-500/50",  text: "text-orange-400",  bg: "bg-orange-500/5" },
  tech:       { border: "border-blue-500/50",    text: "text-blue-400",    bg: "bg-blue-500/5" },
  operations: { border: "border-green-500/50",   text: "text-green-400",   bg: "bg-green-500/5" },
  finance:    { border: "border-emerald-500/50", text: "text-emerald-400", bg: "bg-emerald-500/5" },
  community:  { border: "border-purple-500/50",  text: "text-purple-400",  bg: "bg-purple-500/5" },
  futures:    { border: "border-indigo-500/50",  text: "text-indigo-400",  bg: "bg-indigo-500/5" },
  people:     { border: "border-pink-500/50",    text: "text-pink-400",    bg: "bg-pink-500/5" },
};

interface Props {
  director: OrgDirector;
}

export function DirectorCard({ director }: Props) {
  const dept = director.department.toLowerCase();
  const style = DEPT_STYLE[dept] ?? { border: "border-border/50", text: "text-foreground", bg: "bg-muted/5" };
  const active = director.sub_agents.filter((a) =>
    ["active", "online", "in_task"].includes(a.status)
  ).length;
  const total = director.sub_agents.length;

  const healthPct = total > 0 ? Math.round((active / total) * 100) : 0;
  const healthColor = healthPct >= 80
    ? "bg-emerald-500"
    : healthPct >= 50
    ? "bg-amber-400"
    : "bg-destructive";

  return (
    <div className={`rounded-2xl border-2 ${style.border} ${style.bg} p-5 space-y-4`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full shrink-0 ${STATUS_DOT[director.status] ?? STATUS_DOT.idle}`} />
          <div>
            <p className={`font-mono text-lg font-bold ${style.text}`}>{director.code}</p>
            <p className="text-sm text-muted-foreground leading-tight">{director.name}</p>
          </div>
        </div>
        <Badge variant="outline" className={`border ${style.border} ${style.text} text-xs`}>
          Director
        </Badge>
      </div>

      {/* Department label */}
      <p className="text-xs text-muted-foreground capitalize font-medium">
        Departamento: <span className={`${style.text}`}>{director.department}</span>
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border/30 bg-muted/10 p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Users className="h-3 w-3 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">{active}/{total}</p>
          <p className="text-[9px] text-muted-foreground">Agentes</p>
        </div>
        <div className="rounded-lg border border-border/30 bg-muted/10 p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap className="h-3 w-3 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">{director.tasks_today}</p>
          <p className="text-[9px] text-muted-foreground">Tasks hoy</p>
        </div>
        <div className="rounded-lg border border-border/30 bg-muted/10 p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="h-3 w-3 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">{director.performance_score}</p>
          <p className="text-[9px] text-muted-foreground">Score</p>
        </div>
      </div>

      {/* Health bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Salud del departamento</span>
          <span>{healthPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/30">
          <div className={`h-1.5 rounded-full ${healthColor} transition-all`} style={{ width: `${healthPct}%` }} />
        </div>
      </div>
    </div>
  );
}

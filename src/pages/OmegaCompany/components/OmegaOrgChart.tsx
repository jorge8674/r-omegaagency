import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, ChevronDown, ChevronRight, Crown, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { omegaApi, type OrgDirector, type OrgSubAgent, type OrgAgentStatus } from "@/lib/api/omega";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// ── Status dot ──────────────────────────────────────────────────────────────
const STATUS_DOT: Record<OrgAgentStatus, string> = {
  active:      "bg-emerald-500 animate-pulse",
  online:      "bg-emerald-500 animate-pulse",
  in_task:     "bg-amber-400 animate-pulse",
  idle:        "bg-muted-foreground",
  in_training: "bg-blue-400 animate-pulse",
  inactive:    "bg-muted-foreground/50",
  error:       "bg-destructive",
};

const STATUS_BADGE: Record<OrgAgentStatus, string> = {
  active:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  online:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  in_task:     "bg-amber-400/15 text-amber-400 border-amber-400/30",
  idle:        "bg-muted/40 text-muted-foreground border-border/30",
  in_training: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  inactive:    "bg-muted/30 text-muted-foreground/60 border-border/20",
  error:       "bg-destructive/15 text-destructive border-destructive/30",
};

// ── Department colours ───────────────────────────────────────────────────────
const DEPT_COLOR: Record<string, string> = {
  ceo:        "border-yellow-500/60 bg-yellow-500/5",
  marketing:  "border-orange-500/60 bg-orange-500/5",
  tech:       "border-blue-500/60 bg-blue-500/5",
  operations: "border-green-500/60 bg-green-500/5",
  finance:    "border-emerald-500/60 bg-emerald-500/5",
  community:  "border-purple-500/60 bg-purple-500/5",
  futures:    "border-indigo-500/60 bg-indigo-500/5",
  people:     "border-pink-500/60 bg-pink-500/5",
};
const DEPT_TITLE: Record<string, string> = {
  ceo:        "text-yellow-400",
  marketing:  "text-orange-400",
  tech:       "text-blue-400",
  operations: "text-green-400",
  finance:    "text-emerald-400",
  community:  "text-purple-400",
  futures:    "text-indigo-400",
  people:     "text-pink-400",
};

// ── Sub-agent row ────────────────────────────────────────────────────────────
function SubAgentRow({ agent }: { agent: OrgSubAgent }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-default items-center gap-2 px-3 py-1 hover:bg-muted/20 rounded">
            <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[agent.status] ?? STATUS_DOT.idle}`} />
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">{agent.code}</span>
            <span className="flex-1 truncate text-xs">{agent.name}</span>
            <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[agent.status] ?? STATUS_BADGE.idle}`}>
              {agent.status}
            </span>
          </div>
        </TooltipTrigger>
        {agent.description && (
          <TooltipContent side="left" className="max-w-[220px] text-xs">
            {agent.description}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

// ── Director card ────────────────────────────────────────────────────────────
function DirectorCard({ director }: { director: OrgDirector }) {
  const [open, setOpen] = useState(false);
  const dept = director.department.toLowerCase();
  const colorBorder = DEPT_COLOR[dept] ?? "border-border/50 bg-muted/5";
  const colorTitle  = DEPT_TITLE[dept] ?? "text-foreground";
  const active = director.sub_agents.filter(
    (a) => a.status === "active" || a.status === "online" || a.status === "in_task"
  ).length;

  return (
    <div className={`rounded-xl border ${colorBorder} overflow-hidden`}>
      <button
        className="w-full text-left p-3 hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[director.status] ?? STATUS_DOT.idle}`} />
            <div>
              <p className={`font-mono text-xs font-bold ${colorTitle}`}>{director.code}</p>
              <p className="text-xs text-muted-foreground leading-tight">{director.name}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] shrink-0">Director</Badge>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-2.5 w-2.5" />
            {active}/{director.sub_agents.length}
          </span>
          <span>Tasks: {director.tasks_today}</span>
          {director.performance_score > 0 && (
            <span>Perf: {director.performance_score}/100</span>
          )}
          <span className="ml-auto">
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        </div>
      </button>
      {open && director.sub_agents.length > 0 && (
        <div className="border-t border-border/30 py-1">
          {director.sub_agents.map((a) => (
            <SubAgentRow key={a.id} agent={a} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function OmegaOrgChart() {
  const [fetchedAt, setFetchedAt] = useState(new Date());

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["omega-org-chart"],
    queryFn: () => omegaApi.getOrgChart(),
    retry: 0,
    staleTime: 60_000,
  });

  const handleRefresh = () => { refetch(); setFetchedAt(new Date()); };

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  }

  const directors = data?.directors ?? [];
  const totalAgents = data?.total_agents ?? directors.reduce((s, d) => s + 1 + d.sub_agents.length, 0);
  const totalDepts  = data?.total_departments ?? directors.length;

  return (
    <div className="space-y-4">
      {/* Subheader */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{totalAgents}</span> agentes |{" "}
          <span className="font-semibold text-foreground">{totalDepts}</span> departamentos
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(fetchedAt, { addSuffix: true, locale: es })}
          </span>
          <Button size="sm" variant="outline" className="h-6 gap-1 px-2 text-xs" onClick={handleRefresh}>
            <RefreshCw className="h-3 w-3" /> Actualizar
          </Button>
        </div>
      </div>

      {/* NOVA — CEO */}
      {data?.ceo && (
        <div className="flex justify-center">
          <div className="rounded-xl border-2 border-yellow-500/60 bg-yellow-500/10 px-6 py-3 text-center shadow-sm shadow-yellow-500/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span className="font-mono text-sm font-bold text-yellow-400">{data.ceo.code}</span>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[9px]">CEO</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{data.ceo.name}</p>
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online 24/7</span>
            </div>
          </div>
        </div>
      )}

      {/* Directors grid */}
      {directors.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {directors.map((d) => <DirectorCard key={d.id} director={d} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Crown className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-sm">Sin datos del org chart</p>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { OrgDirector, OrgSubAgent, OrgAgentStatus } from "@/lib/api/omega";
import type { MarketplaceAgent } from "../hooks/useMarketplace";
import { LockOverlay } from "./LockOverlay";

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

function SubAgentRow({ agent, locked, onSolicitar }: {
  agent: OrgSubAgent;
  locked: boolean;
  onSolicitar: (a: MarketplaceAgent) => void;
}) {
  return (
    <div className={`relative ${locked ? "opacity-60" : ""}`}>
      {locked && (
        <LockOverlay onSolicitar={() => onSolicitar({
          code: agent.code, name: agent.name, department: "",
          role: "sub_agent", status: agent.status, description: agent.description, active: false,
        })} />
      )}
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
    </div>
  );
}

interface Props {
  director: OrgDirector;
  locked: boolean;
  isAgentActive: (code: string) => boolean;
  onSolicitar: (a: MarketplaceAgent) => void;
}

export function MarketplaceDirectorCard({ director, locked, isAgentActive, onSolicitar }: Props) {
  const [open, setOpen] = useState(false);
  const dept = director.department.toLowerCase();
  const colorBorder = DEPT_COLOR[dept] ?? "border-border/50 bg-muted/5";
  const colorTitle = DEPT_TITLE[dept] ?? "text-foreground";
  const active = director.sub_agents.filter(
    (a) => a.status === "active" || a.status === "online" || a.status === "in_task"
  ).length;

  return (
    <div className={`relative rounded-xl border ${colorBorder} overflow-hidden ${locked ? "opacity-60" : ""}`}>
      {locked && (
        <LockOverlay onSolicitar={() => onSolicitar({
          code: director.code, name: director.name, department: director.department,
          role: "director", status: director.status, active: false,
        })} />
      )}
      <button
        className="w-full text-left p-3 hover:bg-muted/20 transition-colors"
        onClick={() => !locked && setOpen((v) => !v)}
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
          <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5" />{active}/{director.sub_agents.length}</span>
          <span>Tasks: {director.tasks_today}</span>
          {director.performance_score > 0 && <span>Perf: {director.performance_score}/100</span>}
          <span className="ml-auto">
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        </div>
      </button>
      {open && director.sub_agents.length > 0 && (
        <div className="border-t border-border/30 py-1">
          {director.sub_agents.map((a) => (
            <SubAgentRow
              key={a.id}
              agent={a}
              locked={!isAgentActive(a.code)}
              onSolicitar={onSolicitar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

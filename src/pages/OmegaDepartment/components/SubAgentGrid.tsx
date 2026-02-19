// 88 lines
import { type OrgSubAgent, type OrgAgentStatus } from "@/lib/api/omega";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Bot, Zap } from "lucide-react";

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

function AgentDrawer({ agent, open, onClose }: { agent: OrgSubAgent; open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[360px] sm:w-[420px]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            {agent.name}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[agent.status] ?? STATUS_DOT.idle}`} />
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[agent.status] ?? STATUS_BADGE.idle}`}>
              {agent.status}
            </span>
            <span className="font-mono text-xs text-muted-foreground ml-auto">{agent.code}</span>
          </div>
          {agent.description && (
            <div className="rounded-lg border border-border/40 bg-muted/10 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Agente ID: <span className="font-mono text-foreground">{agent.id}</span></span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SubAgentGrid({ agents }: { agents: OrgSubAgent[] }) {
  const [selected, setSelected] = useState<OrgSubAgent | null>(null);

  if (!agents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Bot className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">Sin sub-agentes</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelected(agent)}
            className="text-left rounded-xl border border-border/40 bg-muted/5 p-3 hover:bg-muted/15 hover:border-border/70 transition-all duration-150 space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[agent.status] ?? STATUS_DOT.idle}`} />
              <span className="font-mono text-[10px] text-muted-foreground">{agent.code}</span>
              <Badge variant="outline" className={`ml-auto text-[9px] ${STATUS_BADGE[agent.status] ?? STATUS_BADGE.idle}`}>
                {agent.status}
              </Badge>
            </div>
            <p className="text-xs font-medium text-foreground leading-tight">{agent.name}</p>
            {agent.description && (
              <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{agent.description}</p>
            )}
          </button>
        ))}
      </div>
      {selected && (
        <AgentDrawer agent={selected} open={!!selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { agentPrice, type AgentCardData } from "../utils/agentPricing";

// ─── Pure presentational grid of agents ─────────────────
// R-DDD-001: Zero fetch, zero state, zero business logic

interface Props {
  agents: AgentCardData[];
  onContract: (agent: AgentCardData) => void;
}

export function AgentGrid({ agents, onContract }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {agents.map((a) => (
        <div
          key={a.code}
          className="flex items-center justify-between gap-2 rounded-xl border border-border/30 bg-secondary/20 p-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{a.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {a.code} · {a.department}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className="text-[10px] border-amber-500/30 text-amber-300"
            >
              ${agentPrice(a.code, a.role).toLocaleString()}/mes
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1"
              onClick={() => onContract(a)}
            >
              <Plus className="h-3 w-3" /> Agregar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

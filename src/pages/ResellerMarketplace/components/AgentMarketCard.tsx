import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck } from "lucide-react";
import type { MarketplaceAgent } from "../hooks/useMarketplace";

interface Props {
  agent: MarketplaceAgent;
  onSolicitar: (agent: MarketplaceAgent) => void;
}

export function AgentMarketCard({ agent, onSolicitar }: Props) {
  const isActive = agent.active;

  return (
    <div
      className={`rounded-xl border p-4 space-y-2 transition-colors ${
        isActive
          ? "border-primary/40 bg-card/80"
          : "border-border/30 bg-secondary/10 grayscale"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold truncate">{agent.name}</p>
        {isActive ? (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
            <ShieldCheck className="h-3 w-3 mr-1" /> Activo
          </Badge>
        ) : (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {agent.department} · {agent.role === "director" ? "Director" : "Agente"}
      </p>

      {agent.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>
      )}

      {!isActive && (
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 text-xs mt-1"
          onClick={() => onSolicitar(agent)}
        >
          Solicitar
        </Button>
      )}
    </div>
  );
}

import { Bot, Play, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Agent } from "../types";
import { STATUS_DOT, DEPARTMENT_LABELS } from "../types";

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
}

export function AgentCard({ agent, onViewDetails }: AgentCardProps) {
  return (
    <Card
      className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all cursor-pointer group"
      onClick={() => onViewDetails(agent)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight">{agent.name}</h3>
              <p className="text-[11px] text-muted-foreground">{agent.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${STATUS_DOT[agent.status]}`} />
            <span className="text-[10px] text-muted-foreground capitalize">{agent.status}</span>
          </div>
        </div>

        {/* Department badge */}
        <Badge variant="secondary" className="text-[10px]">
          {DEPARTMENT_LABELS[agent.department] || agent.department}
        </Badge>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>

        {/* Metrics */}
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Tareas: </span>
            <span className="font-medium">{agent.total_tasks ?? 0}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Éxito: </span>
            <span className="font-medium">{agent.success_rate ?? 0}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm" variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={(e) => { e.stopPropagation(); onViewDetails(agent); }}
          >
            <Eye className="h-3 w-3 mr-1" /> Detalles
          </Button>
          <Button
            size="sm"
            className="flex-1 h-7 text-xs"
            onClick={(e) => { e.stopPropagation(); onViewDetails(agent); }}
          >
            <Play className="h-3 w-3 mr-1" /> Ejecutar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

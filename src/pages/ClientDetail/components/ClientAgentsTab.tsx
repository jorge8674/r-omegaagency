import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Plus, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { ClientAgent } from "../hooks/useClientDetail";
import { AgentAssignModal } from "./AgentAssignModal";

interface Props {
  agents: ClientAgent[];
  loading: boolean;
  clientId: string;
  clientName: string;
  onRefetch: () => void;
}

export function ClientAgentsTab({ agents, loading, clientId, clientName, onRefetch }: Props) {
  const [assignOpen, setAssignOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
      </div>
    );
  }

  const safe = Array.isArray(agents) ? agents : [];
  const active = safe.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-syne text-sm font-semibold">
            {safe.length > 0 ? "Agentes contratados por este cliente" : "Este cliente no tiene agentes activos"}
          </h3>
          {safe.length > 0 && (
            <p className="text-xs text-muted-foreground">{active} de {safe.length} agentes activos</p>
          )}
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAssignOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Asignar Agentes
        </Button>
      </div>

      {safe.length === 0 ? (
        <Card className="border-border/30 bg-card/60">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Bot className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Usa el botón de arriba para asignar agentes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {safe.map((agent) => (
            <Card key={agent.id} className="border-border/30 bg-card/60 hover:border-primary/30 transition-colors">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold truncate">{agent.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">Tipo: {agent.type}</p>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${agent.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                  <span className="text-xs capitalize">{agent.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {agent.last_used
                      ? formatDistanceToNow(new Date(agent.last_used), { addSuffix: true, locale: es })
                      : "Sin uso"}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5">{agent.executions} exec</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AgentAssignModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        clientId={clientId}
        clientName={clientName}
        onAssigned={onRefetch}
      />
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Plus, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { ClientAgent } from "../hooks/useClientDetail";

interface Props {
  agents: ClientAgent[];
  loading: boolean;
}

export function ClientAgentsTab({ agents, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
      </div>
    );
  }

  const safe = Array.isArray(agents) ? agents : [];

  if (safe.length === 0) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Bot className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Este cliente no tiene agentes activos</p>
          <Button variant="outline" size="sm" className="gap-1.5 mt-2">
            <Plus className="h-3.5 w-3.5" /> Asignar Agentes
          </Button>
        </CardContent>
      </Card>
    );
  }

  const active = safe.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm font-semibold">Agentes contratados por este cliente</h3>
        <p className="text-xs text-muted-foreground">{active} de {safe.length} agentes activos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {safe.map((agent) => (
          <Card key={agent.id} className="border-border/30 bg-card/60 hover:border-yellow-500/30 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold truncate">{agent.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">Tipo: {agent.type}</p>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${agent.status === "active" ? "bg-green-500" : "bg-muted-foreground/40"}`} />
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
    </div>
  );
}

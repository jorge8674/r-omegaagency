import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AgentReport } from "../types";

interface Props {
  reports: AgentReport[];
  loading: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

export function AgentReports({ reports, loading }: Props) {
  if (loading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="pt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" /> Últimos reportes de agentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(reports ?? []).length === 0 ? (
          <div className="flex flex-col items-center py-10 text-muted-foreground">
            <Bot className="h-10 w-10 opacity-30 mb-2" />
            <p className="text-sm font-medium">Los agentes están analizando.</p>
            <p className="text-xs mt-1">Los reportes aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 rounded-xl border border-border/30 bg-secondary/20 p-3"
              >
                <Badge variant="outline" className="shrink-0 text-[10px] mt-0.5">
                  {r.agent_code}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{r.client_name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.summary}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                  <Clock className="h-3 w-3" /> {timeAgo(r.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

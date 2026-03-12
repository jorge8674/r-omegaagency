import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import type { AgentReport } from "../types";

interface Props {
  reports: AgentReport[];
  loading: boolean;
}

export function AgentReports({ reports, loading }: Props) {
  if (loading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardHeader><CardTitle className="text-base">Últimos reportes de agentes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-display">Últimos reportes de agentes</CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Bot className="h-10 w-10 opacity-30" />
            <p className="text-sm text-center">Los agentes están analizando. Los reportes aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(reports ?? []).slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-start gap-3 rounded-lg border border-border/30 bg-secondary/20 p-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.client_name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

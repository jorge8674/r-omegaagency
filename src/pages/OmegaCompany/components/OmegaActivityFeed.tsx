import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { OmegaActivity } from "@/lib/api/omega";

interface Props {
  activity: OmegaActivity[];
  loading: boolean;
}

// Map backend type → label
const TYPE_LABEL: Record<string, string> = {
  content_generated: "Contenido",
  post_scheduled: "Programado",
  agent_execution: "Agente",
  agent_executed: "Agente",
  client_created: "Cliente",
  reseller_created: "Reseller",
  video_generated: "Video",
};

const TYPE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  content_generated: "default",
  post_scheduled: "secondary",
  agent_execution: "outline",
  agent_executed: "outline",
  client_created: "default",
  reseller_created: "default",
  video_generated: "secondary",
};

export function OmegaActivityFeed({ activity, loading }: Props) {
  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = activity.slice(0, 20);

  return (
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" />
          Actividad del Sistema
          {activity.length > 0 && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {activity.length} eventos
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Activity className="mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">Sin actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={`${item.timestamp}-${idx}`}
                className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 px-3 py-2"
              >
                <Badge
                  variant={TYPE_VARIANT[item.type] ?? "outline"}
                  className="shrink-0 text-[10px]"
                >
                  {TYPE_LABEL[item.type] ?? item.type}
                </Badge>
                <p className="flex-1 truncate text-xs">{item.description}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

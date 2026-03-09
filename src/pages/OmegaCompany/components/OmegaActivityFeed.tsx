import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
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
  agent_task: "Tarea",
  client_created: "Cliente",
  reseller_created: "Reseller",
  video_generated: "Video",
};

// Custom color classes per type
const TYPE_COLOR: Record<string, string> = {
  content_generated: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  post_scheduled:    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  agent_execution:   "bg-blue-500/20 text-blue-400 border-blue-500/30",
  agent_executed:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  agent_task:        "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  client_created:    "bg-primary/20 text-primary border-primary/30",
  reseller_created:  "bg-primary/20 text-primary border-primary/30",
  video_generated:   "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// Action label by type
const ACTION_LABEL: Record<string, string> = {
  content_generated: "Contenido generado",
  post_scheduled:    "Post programado",
  agent_execution:   "Agente ejecutado",
  agent_executed:    "Agente ejecutado",
  agent_task:        "Tarea de agente",
  client_created:    "Cliente creado",
  reseller_created:  "Reseller creado",
  video_generated:   "Video generado",
};

const STATUS_ICON: Record<string, string> = {
  completed:   "✅",
  in_progress: "🔄",
  failed:      "❌",
};

function formatTokens(n: number): string {
  return n >= 1000 ? `${n.toLocaleString("es-ES")} tokens` : `${n} tokens`;
}

/** Build rich description: "AGENT → Client — Action — Mar 28" */
function formatActivityLine(item: OmegaActivity): string {
  const agent = item.agent_code?.toUpperCase();
  const client = item.client_name;
  const action = ACTION_LABEL[item.type];

  // Try to format a short date like "Mar 28"
  let shortDate = "";
  try {
    shortDate = format(new Date(item.timestamp), "MMM dd", { locale: es });
  } catch {
    shortDate = "";
  }

  // If we have structured fields, use the rich format
  if (agent || client) {
    const parts: string[] = [];
    if (agent) parts.push(agent);
    if (client) {
      parts.push(`→ ${client}`);
    }
    if (action) {
      parts.push(`— ${action}`);
    } else {
      // Fallback to raw description
      parts.push(`— ${item.description}`);
    }
    if (shortDate) parts.push(`— ${shortDate}`);
    return parts.join(" ");
  }

  // Fallback: use description as-is but append short date
  if (action && shortDate) {
    return `${action} — ${shortDate}`;
  }

  return item.description;
}

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
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLOR[item.type] ?? "bg-muted/40 text-muted-foreground border-border/30"}`}
                >
                  {TYPE_LABEL[item.type] ?? item.type}
                </span>
                <p className="flex-1 truncate text-xs">{formatActivityLine(item)}</p>
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

import { useQuery } from "@tanstack/react-query";
import { omegaApi, type OmegaActivity } from "@/lib/api/omega";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { SentinelHistoryFeed } from "./SentinelHistoryFeed";

const TYPE_BADGE: Record<string, string> = {
  content_generated: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  agent_execution:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  agent_task:        "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  post_scheduled:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  video_generated:   "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const TYPE_LABEL: Record<string, string> = {
  content_generated: "Contenido",
  agent_execution:   "Agente",
  agent_task:        "Tarea",
  post_scheduled:    "Programado",
  video_generated:   "Video",
};

const STATUS_ICON: Record<string, string> = {
  completed:   "✅",
  in_progress: "🔄",
  failed:      "❌",
};

// Agent codes per department for filtering
const DEPT_AGENTS: Record<string, string[]> = {
  marketing: ["DANI", "DUDA", "LOLA", "LUAN", "MALU", "MAYA", "RAFA", "SARA"],
  security: [
    "SENTINEL", "VAULT", "PULSE_MONITOR", "FORTRESS", "CIPHER",
    "PHANTOM", "IRONWALL", "TRACE", "SHIELD", "WATCHDOG",
    "LOCKBOX", "SENTRY", "AEGIS",
  ],
};

function formatTokens(n: number): string {
  return n >= 1000 ? `${n.toLocaleString("es-ES")} tokens` : `${n} tokens`;
}

function formatLine(item: OmegaActivity): string {
  if (item.type === "agent_task") {
    const icon = STATUS_ICON[item.status ?? ""] ?? "⚙️";
    const tokens = item.tokens_used ? ` (${formatTokens(item.tokens_used)})` : "";
    return `${icon} ${item.description}${tokens}`;
  }
  return item.description;
}

interface Props {
  dept: string;
}

export function DeptActivityFeed({ dept }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["omega-activity"],
    queryFn: () => omegaApi.getActivity(),
    staleTime: 60_000,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  const allActivity: OmegaActivity[] = data?.activities ?? [];

  // Filter by department agent codes when available
  const deptAgents = DEPT_AGENTS[dept.toLowerCase()];
  const filtered = allActivity
    .filter((a) => {
      if (deptAgents && a.agent_code) {
        return deptAgents.includes(a.agent_code.toUpperCase());
      }
      // Fallback: match department name in description
      return a.description?.toLowerCase().includes(dept.toLowerCase());
    })
    .slice(0, 20);

  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Activity className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">Sin actividad reciente</p>
      </div>
    );
  }

  const isSecurity = dept.toLowerCase() === "security";

  // Security dept uses SentinelHistoryFeed exclusively (agents don't write to omega_activity)
  if (isSecurity) {
    return <SentinelHistoryFeed />;
  }

  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Activity className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">Sin actividad reciente</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {filtered.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border/30 bg-muted/5 px-3 py-2">
            <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${TYPE_BADGE[item.type] ?? "bg-muted/30 text-muted-foreground border-border/30"}`}>
              {TYPE_LABEL[item.type] ?? item.type}
            </span>
            <div className="flex-1 min-w-0">
              {item.agent_code && (
                <span className="text-[10px] font-medium text-muted-foreground">{item.agent_code} · </span>
              )}
              <span className="text-xs text-foreground leading-snug">{formatLine(item)}</span>
              {item.description && item.description.length > 0 && item.type !== "agent_task" && (
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {item.description.slice(0, 80)}{item.description.length > 80 ? "…" : ""}
                </p>
              )}
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

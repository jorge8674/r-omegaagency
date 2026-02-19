import { useQuery } from "@tanstack/react-query";
import { getAgentLogs } from "@/lib/api/agentsCrud";
import { Loader2 } from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  info: "text-primary",
  warning: "text-warning",
  error: "text-destructive",
};

interface Props {
  agentId: string;
}

export function AgentLogsTab({ agentId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["agent-logs", agentId],
    queryFn: () => getAgentLogs(agentId),
    retry: 1,
  });

  const logs = (data?.data ?? []).slice(0, 20);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (logs.length === 0) {
    return <p className="text-xs text-muted-foreground py-8 text-center">Sin logs disponibles</p>;
  }

  return (
    <div className="space-y-1 font-mono text-[11px]">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2 rounded px-2 py-1.5 bg-secondary/30 hover:bg-secondary/60">
          <span className="text-muted-foreground shrink-0 w-[140px]">
            {new Date(log.timestamp).toLocaleString("es-PR", { hour12: false })}
          </span>
          <span className={`shrink-0 w-[60px] uppercase font-semibold ${LEVEL_COLORS[log.level] || ""}`}>
            {log.level}
          </span>
          <span className="text-foreground break-all">{log.message}</span>
        </div>
      ))}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ShieldCheck } from "lucide-react";

interface ScanEntry {
  scan_type?: string;
  score?: number;
  created_at?: string;
  triggered_by?: string;
}

interface HistoryResponse {
  scans?: ScanEntry[];
  items?: ScanEntry[];
}

function triggerLabel(t?: string): string {
  if (!t) return "manual";
  return t.includes("cron") ? "cron" : "manual";
}

export function SentinelHistoryFeed() {
  const { data, isLoading } = useQuery<ScanEntry[]>({
    queryKey: ["sentinel-history"],
    queryFn: async () => {
      const res = await apiCall<HistoryResponse>("/sentinel/history/?limit=3");
      return res?.scans ?? res?.items ?? [];
    },
    staleTime: 5 * 60_000,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const scans = data ?? [];
  if (!scans.length) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Últimos scans
      </p>
      {scans.map((scan, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2"
        >
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground leading-snug">
              {scan.scan_type ?? "full"} scan — Score: {scan.score ?? "—"}/100
              <span className="ml-1.5 text-muted-foreground">
                ({triggerLabel(scan.triggered_by)})
              </span>
            </p>
          </div>
          {scan.created_at && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true, locale: es })}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

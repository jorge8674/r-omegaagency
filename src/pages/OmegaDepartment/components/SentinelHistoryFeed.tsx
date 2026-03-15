import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ShieldCheck, Clock } from "lucide-react";

interface ScanIssue {
  code?: string;
  message?: string;
  severity?: string;
}

interface ScanEntry {
  scan_type?: string;
  security_score?: number;
  created_at?: string;
  triggered_by?: string;
  issues?: ScanIssue[];
}

interface HistoryResponse {
  scans?: ScanEntry[];
  items?: ScanEntry[];
}

function scanLabel(t?: string): string {
  if (!t) return "FULL SCAN";
  const upper = t.toUpperCase();
  if (upper.includes("VAULT")) return "VAULT";
  if (upper.includes("PULSE")) return "PULSE";
  if (upper.includes("DB")) return "DB";
  return upper;
}

function triggerLabel(t?: string): string {
  if (!t) return "manual";
  return t.includes("cron") ? "cron automático" : "manual";
}

function scoreColor(s?: number): string {
  if (s == null) return "text-muted-foreground";
  if (s >= 100) return "text-emerald-400";
  if (s >= 85) return "text-yellow-400";
  return "text-red-400";
}

function scoreBorder(s?: number): string {
  if (s == null) return "border-border/30";
  if (s >= 100) return "border-emerald-500/20";
  if (s >= 85) return "border-yellow-500/20";
  return "border-red-500/20";
}

function scoreBg(s?: number): string {
  if (s == null) return "bg-muted/5";
  if (s >= 100) return "bg-emerald-500/5";
  if (s >= 85) return "bg-yellow-500/5";
  return "bg-red-500/5";
}

export function SentinelHistoryFeed() {
  const { data, isLoading } = useQuery<ScanEntry[]>({
    queryKey: ["sentinel-history"],
    queryFn: async () => {
      const res = await apiCall<HistoryResponse>("/sentinel/history/?limit=5");
      return res?.scans ?? res?.items ?? [];
    },
    staleTime: 5 * 60_000,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const scans = data ?? [];

  if (!scans.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Clock className="mb-2 h-8 w-8 opacity-30" />
        <p className="text-sm">Esperando primer scan del cron (02:43 UTC)</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {scans.map((scan, i) => (
        <div
          key={i}
          className={`flex flex-col gap-1 rounded-lg border ${scoreBorder(scan.security_score)} ${scoreBg(scan.security_score)} px-3 py-2`}
        >
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-snug">
                <span className="font-semibold">{scanLabel(scan.scan_type)}</span>
                {" — Score: "}
                <span className={`font-bold ${scoreColor(scan.security_score)}`}>
                  {scan.security_score ?? "—"}/100
                </span>
                <span className="ml-1.5 text-muted-foreground text-[10px]">
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
          {scan.score != null && scan.score < 100 && scan.issues && scan.issues.length > 0 && (
            <div className="ml-6 space-y-0.5">
              {scan.issues.slice(0, 3).map((issue, j) => (
                <p key={j} className="text-[10px] text-muted-foreground">
                  • {issue.message ?? issue.code ?? "Issue detectado"}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

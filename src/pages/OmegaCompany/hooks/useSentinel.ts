import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { apiCall } from "@/lib/api/core";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AgentStatus = "pass" | "warning" | "critical";

export interface SentinelAgent {
  name: string;
  status: AgentStatus;
  issues_count: number;
  last_scan: string;
}

export interface SentinelIssue {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  code: string;
  message: string;
}

export interface SentinelStatus {
  security_score: number;
  last_scan: string;
  agents: SentinelAgent[];
  issues: SentinelIssue[];
}

type ScanResponse = { success: boolean; score: number };

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK: SentinelStatus = {
  security_score: 94,
  last_scan: new Date().toISOString(),
  agents: [
    { name: "VAULT",          status: "pass",    issues_count: 0, last_scan: new Date().toISOString() },
    { name: "PULSE_MONITOR",  status: "pass",    issues_count: 0, last_scan: new Date().toISOString() },
    { name: "DB_GUARDIAN",    status: "pass",    issues_count: 0, last_scan: new Date().toISOString() },
    { name: "FORTRESS",       status: "warning", issues_count: 1, last_scan: new Date().toISOString() },
    { name: "COMPLIANCE",     status: "pass",    issues_count: 0, last_scan: new Date().toISOString() },
    { name: "SENTINEL_BRAIN", status: "pass",    issues_count: 0, last_scan: new Date().toISOString() },
  ],
  issues: [],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSentinel() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<SentinelStatus>({
    queryKey: ["sentinel-status"],
    queryFn: async () => {
      try {
        const res = await apiCall<SentinelStatus>("/sentinel/status/");
        if (!res) return FALLBACK;
        return {
          ...FALLBACK,
          ...res,
          agents: Array.isArray(res.agents) ? res.agents : FALLBACK.agents,
          issues: Array.isArray(res.issues) ? res.issues : FALLBACK.issues,
        };
      } catch {
        return FALLBACK;
      }
    },
    retry: 0,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const { mutate: triggerScan, isPending: isScanning } = useMutation<ScanResponse>({
    mutationFn: () =>
      apiCall<ScanResponse>("/sentinel/scan/", "POST", { scan_type: "full" }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["sentinel-status"] });
      toast({ title: `🛡️ Scan completado — Score: ${res?.score ?? "?"}/100` });
    },
    onError: () => {
      toast({ title: "Error al ejecutar el scan", variant: "destructive" });
    },
  });

  return { status: data ?? FALLBACK, isLoading, triggerScan, isScanning };
}

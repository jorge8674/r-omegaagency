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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSentinel() {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<SentinelStatus | null>({
    queryKey: ["sentinel-status"],
    queryFn: async () => {
      const res = await apiCall<SentinelStatus>("/sentinel/status/");
      if (!res) return null;
      return {
        security_score: res.security_score ?? 0,
        last_scan: res.last_scan ?? new Date().toISOString(),
        agents: Array.isArray(res.agents) ? res.agents : [],
        issues: Array.isArray(res.issues) ? res.issues : [],
      };
    },
    retry: 1,
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

  return { status: data ?? null, isLoading, isError, triggerScan, isScanning };
}

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api/core";
import { OmegaDirectorBar } from "./OmegaDirectorBar";
import { saveReport } from "@/pages/OmegaDepartment/hooks/useOmegaDepartment";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { SolicitudesListResponse } from "../types/solicitudes";

const QUERY_KEYS_TO_REFRESH = [
  ["omega-system"],
  ["admin-solicitudes"],
  ["admin-solicitudes-badge"],
  ["reseller-home"],
  ["omega-stats"],
  ["omega-resellers"],
  ["omega-activity"],
  ["omega-revenue"],
  ["omega-sentinel"],
];

export function OmegaCompanyHeader() {
  const [refreshing, setRefreshing] = useState(false);
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const queryClient = useQueryClient();

  const { data: solData } = useQuery<SolicitudesListResponse>({
    queryKey: ["admin-solicitudes-badge"],
    queryFn: () => apiCall<SolicitudesListResponse>("/admin/solicitudes/?status=pending"),
    retry: 1,
    refetchInterval: 60_000,
  });
  const pendingBadge = solData?.pending_count ?? 0;

  const handleGlobalRefresh = useCallback(async () => {
    setRefreshing(true);
    setFlashColor(null);
    try {
      await Promise.all(
        QUERY_KEYS_TO_REFRESH.map((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        )
      );
      setLastUpdated(new Date());
      setFlashColor("green");
    } catch (err: any) {
      setFlashColor("red");
      try {
        const report = {
          id: crypto.randomUUID(),
          department: "omega-system",
          director: "OMEGA System",
          content: `Fallo al refrescar queries a las ${format(new Date(), "HH:mm:ss", { locale: es })}.\n\nError: ${err?.message || "Desconocido"}`,
          createdAt: new Date().toISOString(),
          format: "markdown" as const,
        };
        saveReport(report);
        window.dispatchEvent(new Event("omega_report_added"));
      } catch { /* silent */ }
    } finally {
      setRefreshing(false);
      setTimeout(() => setFlashColor(null), 1500);
    }
  }, [queryClient]);

  const refreshBtnClass = flashColor === "green"
    ? "text-green-400 border-green-400/50"
    : flashColor === "red"
      ? "text-red-400 border-red-400/50"
      : "";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">OMEGA Company</h1>
              <Badge variant="outline" className="border-primary/50 text-primary text-xs font-semibold">Super Admin</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Raisen Agency · Vista global del sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Actualizado: {format(lastUpdated, "HH:mm:ss", { locale: es })}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGlobalRefresh}
            disabled={refreshing}
            className={`gap-2 transition-colors duration-300 ${refreshBtnClass}`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="space-y-2 pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Sistema de agentes OMEGA</p>
        <OmegaDirectorBar />
      </div>
    </div>
  );
}

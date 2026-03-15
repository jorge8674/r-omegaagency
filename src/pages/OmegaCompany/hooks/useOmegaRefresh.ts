import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { saveReport } from "@/pages/OmegaDepartment/hooks/useOmegaDepartment";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

export function useOmegaRefresh() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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

  return {
    refreshing,
    lastUpdated,
    refreshBtnClass,
    handleGlobalRefresh,
  };
}

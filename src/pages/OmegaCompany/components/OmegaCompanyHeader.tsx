import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OmegaDirectorBar } from "./OmegaDirectorBar";
import { useOmegaRefresh } from "../hooks/useOmegaRefresh";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function OmegaCompanyHeader() {
  const { refreshing, lastUpdated, refreshBtnClass, handleGlobalRefresh } = useOmegaRefresh();

  return (
    <div className="flex flex-col gap-6">
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

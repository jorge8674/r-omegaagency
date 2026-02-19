// 18 lines — OmegaReportes: placeholder (contenido se genera dinámicamente en ReportsTab)
import { FileText } from "lucide-react";

export function OmegaReportes() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <FileText className="mb-3 h-10 w-10 opacity-20" />
      <p className="text-sm">Sin reportes aún</p>
      <p className="text-xs mt-1 opacity-60">
        Ve a un departamento y usa &quot;Solicitar Reporte&quot; para generarlos.
      </p>
    </div>
  );
}

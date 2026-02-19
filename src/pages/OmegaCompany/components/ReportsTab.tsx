// 60 lines
import { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import { ReportGenerator } from "@/pages/OmegaDepartment/components/ReportGenerator";
import { loadReports, deleteReport, type DeptReport } from "@/pages/OmegaDepartment/hooks/useOmegaDepartment";

export function ReportsTab() {
  const [reports, setReports] = useState<DeptReport[]>([]);

  useEffect(() => {
    setReports(loadReports());
    // Re-sync when localStorage changes (e.g. from dept page)
    const handler = () => setReports(loadReports());
    window.addEventListener("storage", handler);
    window.addEventListener("omega_report_added", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("omega_report_added", handler);
    };
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteReport(id);
    setReports(loadReports());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Reportes generados
        </h2>
        {reports.length > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {reports.length}
          </span>
        )}
      </div>
      <ReportGenerator reports={reports} onDelete={handleDelete} />
    </div>
  );
}

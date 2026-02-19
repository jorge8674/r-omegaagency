// 68 lines
import { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import { ReportGenerator } from "@/pages/OmegaDepartment/components/ReportGenerator";
import { loadReports, deleteReport, saveReport, type DeptReport } from "@/pages/OmegaDepartment/hooks/useOmegaDepartment";
import { omegaApi } from "@/lib/api/omega";

async function syncReportsFromBackend(): Promise<DeptReport[] | null> {
  try {
    const res = await omegaApi.loadNovaData("reports");
    const content = res?.content;
    if (Array.isArray(content) && content.length > 0) return content as DeptReport[];
    return null;
  } catch { return null; }
}

export function ReportsTab() {
  const [reports, setReports] = useState<DeptReport[]>([]);

  const refresh = useCallback(() => setReports(loadReports()), []);

  useEffect(() => {
    refresh();
    // Try to merge remote reports (remote wins if more recent)
    syncReportsFromBackend().then((remote) => {
      if (remote) {
        const local = loadReports();
        const merged = [...remote, ...local.filter((l) => !remote.find((r) => r.id === l.id))];
        merged.forEach((r) => saveReport(r));
        setReports(loadReports());
      }
    });

    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener("omega_report_added", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("omega_report_added", handler);
    };
  }, [refresh]);

  const handleDelete = useCallback((id: string) => {
    deleteReport(id);
    const updated = loadReports();
    setReports(updated);
    omegaApi.saveNovaData("reports", updated).catch(() => {});
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

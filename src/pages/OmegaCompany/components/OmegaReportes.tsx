import { useState, useEffect, useCallback } from "react";
import { FileText, Trash2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { loadReports, deleteReport, type DeptReport } from "@/pages/OmegaDepartment/hooks/useOmegaDepartment";
import { omegaApi } from "@/lib/api/omega";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) +
      " " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function downloadMd(report: DeptReport) {
  const blob = new Blob([report.content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-${report.department}-${report.id.slice(0, 6)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OmegaReportes() {
  const [reports, setReports] = useState<DeptReport[]>([]);
  const [viewing, setViewing] = useState<DeptReport | null>(null);

  const refresh = useCallback(() => setReports(loadReports()), []);

  useEffect(() => {
    refresh();
    // Merge remote reports
    omegaApi.loadNovaData("reports").then((res) => {
      const remote = res?.content;
      if (Array.isArray(remote) && remote.length > 0) {
        const local = loadReports();
        const merged = [...(remote as DeptReport[]), ...local.filter((l) => !(remote as DeptReport[]).find((r) => r.id === l.id))];
        merged.forEach((r) => {
          const existing = loadReports();
          if (!existing.find((e) => e.id === r.id)) {
            localStorage.setItem("omega_reports", JSON.stringify([...existing, r]));
          }
        });
        setReports(loadReports());
      }
    }).catch(() => {});

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

  if (reports.length === 0) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Historial de Reportes
        </h2>
        <Badge variant="secondary" className="ml-auto text-[10px]">{reports.length}</Badge>
      </div>

      <div className="space-y-2">
        {reports.map((r) => (
          <Card key={r.id} className="border-border/40 bg-card/60">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold truncate">{r.director}</span>
                  <Badge variant="outline" className="text-[10px]">{r.department}</Badge>
                  {r.client_name && (
                    <Badge variant="secondary" className="text-[10px]">{r.client_name}</Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(r.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewing(r)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => downloadMd(r)}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {viewing?.director} — {viewing?.department}
            </DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/30 rounded-lg p-4 border border-border/30">
            {viewing?.content}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}

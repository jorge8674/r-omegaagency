// 85 lines
import { useState } from "react";
import { FileText, Download, Eye, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type DeptReport } from "../hooks/useOmegaDepartment";

interface Props {
  reports: DeptReport[];
  onDelete: (id: string) => void;
}

function ReportViewModal({ report, onClose }: { report: DeptReport; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {report.department} · {report.director}
          </DialogTitle>
        </DialogHeader>
        <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-mono bg-muted/10 rounded-lg p-4 border border-border/30">
          {report.content}
        </pre>
      </DialogContent>
    </Dialog>
  );
}

function downloadMd(report: DeptReport): void {
  const blob = new Blob([report.content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-${report.department}-${report.createdAt.slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportGenerator({ reports, onDelete }: Props) {
  const [viewing, setViewing] = useState<DeptReport | null>(null);

  if (!reports.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <FileText className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">No hay reportes generados</p>
        <p className="text-xs mt-1 opacity-60">Usa el botón "Solicitar Reporte" en cada departamento</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/5 px-4 py-3">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {r.department.charAt(0).toUpperCase() + r.department.slice(1)} · {r.director}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(r.createdAt).toLocaleString("es-ES")}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewing(r)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => downloadMd(r)}>
                <Download className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(r.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {viewing && <ReportViewModal report={viewing} onClose={() => setViewing(null)} />}
    </>
  );
}

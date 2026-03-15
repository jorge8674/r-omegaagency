// ReportGenerator — report list + modal with sentinel-aware activity
import { useState, useEffect } from "react";
import { FileText, Download, Eye, Trash2, Activity, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { type DeptReport } from "../hooks/useOmegaDepartment";
import { omegaApi, type OmegaActivity } from "@/lib/api/omega";
import { apiCall } from "@/lib/api/core";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Props { reports: DeptReport[]; onDelete: (id: string) => void; }

interface ScanEntry {
  scan_type?: string;
  security_score?: number;
  created_at?: string;
  issues?: { code?: string; message?: string }[];
}

function scoreColor(s?: number): string {
  if (s == null) return "text-muted-foreground";
  if (s >= 100) return "text-emerald-400";
  if (s >= 85) return "text-yellow-400";
  return "text-red-400";
}

function scanLabel(t?: string): string {
  return t ? t.toUpperCase() : "FULL SCAN";
}

/* ── Sentinel activity for security reports ── */
function SentinelActivity({ loading, scans }: { loading: boolean; scans: ScanEntry[] }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 rounded-md bg-muted/20 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!scans.length) {
    return (
      <p className="text-xs text-muted-foreground py-4 text-center opacity-60">
        Sin scans recientes de seguridad
      </p>
    );
  }
  return (
    <div className="space-y-1.5">
      {scans.map((scan, i) => (
        <div key={i} className="flex flex-col gap-1 rounded-lg border border-border/30 bg-muted/20 px-3 py-2">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <p className="text-xs text-foreground flex-1">
              <span className="font-semibold">{scanLabel(scan.scan_type)}</span>
              {" — Score: "}
              <span className={`font-bold ${scoreColor(scan.security_score)}`}>
                {scan.security_score ?? "—"}/100
              </span>
            </p>
            {scan.created_at && (
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true, locale: es })}
              </span>
            )}
          </div>
          {scan.security_score != null && scan.security_score < 100 && scan.issues?.length ? (
            <div className="ml-6 space-y-0.5">
              {scan.issues.slice(0, 3).map((issue, j) => (
                <p key={j} className="text-[10px] text-muted-foreground">
                  • {issue.message ?? issue.code ?? "Issue detectado"}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ── General activity for non-security reports ── */
function GeneralActivity({ loading, activities }: { loading: boolean; activities: OmegaActivity[] }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 rounded-md bg-muted/20 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!activities.length) {
    return (
      <p className="text-xs text-muted-foreground py-4 text-center opacity-60">
        Sin actividad reciente para este agente/departamento
      </p>
    );
  }
  return (
    <div className="space-y-1.5">
      {activities.map((a, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 px-3 py-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <p className="text-xs text-foreground flex-1 truncate">{a.description}</p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true, locale: es })}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Modal ── */
function ReportViewModal({ report, onClose }: { report: DeptReport; onClose: () => void }) {
  const isSecurity = report.department.toLowerCase() === "security";
  const [activities, setActivities] = useState<OmegaActivity[]>([]);
  const [scans, setScans] = useState<ScanEntry[]>([]);
  const [loadingAct, setLoadingAct] = useState(true);

  useEffect(() => {
    setLoadingAct(true);
    if (isSecurity) {
      apiCall<{ scans?: ScanEntry[]; items?: ScanEntry[] }>("/sentinel/history/?limit=3")
        .then((res) => setScans(res?.scans ?? res?.items ?? []))
        .catch(() => setScans([]))
        .finally(() => setLoadingAct(false));
    } else {
      omegaApi.getActivity()
        .then((res) => {
          const list = Array.isArray(res) ? res : (res?.activities ?? []);
          const dept = report.department.toLowerCase();
          const filtered = list.filter((a: OmegaActivity) => {
            const desc = (a.description ?? "").toLowerCase();
            return desc.includes(dept) || desc.includes(report.director.toLowerCase())
              || (report.client_id && a.client_id === report.client_id);
          });
          setActivities(filtered.slice(0, 5));
        })
        .catch(() => setActivities([]))
        .finally(() => setLoadingAct(false));
    }
  }, [report, isSecurity]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {report.department} · {report.director}
            {report.client_name && (
              <Badge variant="secondary" className="ml-2 text-[10px]">
                <User className="h-3 w-3 mr-1" />{report.client_name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-mono bg-muted/10 rounded-lg p-4 border border-border/30">
          {report.content}
        </pre>
        <Separator className="my-2 opacity-40" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isSecurity ? <ShieldCheck className="h-4 w-4 text-primary" /> : <Activity className="h-4 w-4 text-primary" />}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isSecurity ? "Scans de Seguridad" : "Actividad Real"}
            </h3>
          </div>
          {isSecurity
            ? <SentinelActivity loading={loadingAct} scans={scans} />
            : <GeneralActivity loading={loadingAct} activities={activities} />
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Download helper ── */
function downloadMd(report: DeptReport): void {
  const blob = new Blob([report.content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-${report.department}-${report.createdAt.slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Report list ── */
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
              <p className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleString("es-ES")}</p>
            </div>
            <Badge variant={r.client_name ? "secondary" : "outline"} className="text-[10px] shrink-0">
              <User className="h-3 w-3 mr-1" />{r.client_name || "Global"}
            </Badge>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewing(r)}><Eye className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => downloadMd(r)}><Download className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
      {viewing && <ReportViewModal report={viewing} onClose={() => setViewing(null)} />}
    </>
  );
}

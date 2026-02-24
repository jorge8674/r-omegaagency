import { useNavigate } from "react-router-dom";
import { Users, Eye, Users2, BarChart2, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { OmegaReseller } from "@/lib/api/omega";

interface Props { resellers: OmegaReseller[]; loading: boolean }

const STATUS_STYLE: Record<string, { label: string; dot: string }> = {
  active:    { label: "Activo",     dot: "bg-emerald-500" },
  trial:     { label: "Trial",      dot: "bg-yellow-400" },
  suspended: { label: "Suspendido", dot: "bg-destructive" },
};

const PLAN_STYLE: Record<string, { label: string; className: string }> = {
  enterprise: { label: "Enterprise", className: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  pro:        { label: "Pro",        className: "border-blue-500/50  text-blue-400  bg-blue-500/10"  },
  starter:    { label: "Starter",    className: "border-border/50    text-muted-foreground bg-muted/30" },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function ResellerCard({ r, onNavigate }: { r: OmegaReseller; onNavigate: (path: string) => void }) {
  const initials = r.agency_name.charAt(0).toUpperCase();
  const ss = STATUS_STYLE[r.status] ?? { label: r.status, dot: "bg-muted-foreground/40" };
  const plan = (r.plan ?? "starter").toLowerCase();
  const ps = PLAN_STYLE[plan] ?? PLAN_STYLE.starter;
  const isActive = r.status === "active";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3 hover:bg-card/80 transition-colors group">
      {/* Avatar */}
      <div className="h-9 w-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-amber-400">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold truncate">{r.agency_name}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${ps.className}`}>
            {ps.label}
          </Badge>
          <div className={`h-2 w-2 rounded-full shrink-0 ${ss.dot}`} />
        </div>
        <div className="flex flex-wrap gap-x-3 mt-0.5 text-[11px] text-muted-foreground">
          <span className="truncate max-w-[200px] font-mono text-[10px]">{r.slug}</span>
          <span className="flex items-center gap-0.5">
            <Users2 className="h-3 w-3" />
            {r.clients_count} clientes
          </span>
          <span className="text-emerald-400">{fmt(r.mrr)} MRR</span>
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Ver detalle" onClick={() => onNavigate(`/resellers/${r.id}`)}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Ver clientes" onClick={() => onNavigate(`/clients?reseller=${r.id}`)}>
          <Users className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Reporte">
          <BarChart2 className="h-3.5 w-3.5" />
        </Button>
        {isActive && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10" title="Suspender">
                <Ban className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Suspender reseller?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se suspenderá el acceso de {r.agency_name}. Sus clientes quedarán inactivos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Suspender
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

export function ResellersTable({ resellers, loading }: Props) {
  const navigate = useNavigate();

  if (loading) return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  );

  const list = Array.isArray(resellers) ? resellers : [];

  if (list.length === 0) return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed border-border/40 rounded-xl">
      <Users className="mb-2 h-10 w-10 opacity-30" />
      <p className="text-sm">Sin resellers registrados</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {list.map((r) => (
        <ResellerCard key={r.id} r={r} onNavigate={navigate} />
      ))}
    </div>
  );
}

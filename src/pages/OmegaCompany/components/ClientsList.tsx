import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Users2, Eye, Bot, BarChart2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiCall } from "@/lib/api/core";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OmegaClient {
  id: string;
  name: string;
  business_name?: string | null;
  email?: string | null;
  phone?: string | null;
  plan?: string | null;
  active?: boolean | null;
  reseller_id?: string | null;
  reseller_name?: string | null;
}

interface ClientsResponse { clients: OmegaClient[]; total: number }

const PLAN_STYLE: Record<string, { label: string; className: string }> = {
  enterprise: { label: "Enterprise", className: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  pro:        { label: "Pro",        className: "border-blue-500/50  text-blue-400  bg-blue-500/10"  },
  basic:      { label: "Basic",      className: "border-border/50    text-muted-foreground bg-muted/30" },
  starter:    { label: "Starter",    className: "border-border/50    text-muted-foreground bg-muted/30" },
};

function ClientCard({ c, onNavigate }: { c: OmegaClient; onNavigate: (id: string) => void }) {
  const initials = (c.business_name ?? c.name).charAt(0).toUpperCase();
  const plan = (c.plan ?? "basic").toLowerCase();
  const ps = PLAN_STYLE[plan] ?? PLAN_STYLE.basic;
  const isActive = c.active !== false;

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3 hover:bg-card/80 transition-colors cursor-pointer group"
      onClick={() => onNavigate(c.id)}
    >
      {/* Avatar */}
      <div className="h-9 w-9 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-yellow-400">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold truncate">{c.business_name ?? c.name}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${ps.className}`}>
            {ps.label}
          </Badge>
          <div className={`h-2 w-2 rounded-full shrink-0 ${isActive ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
        </div>
        <div className="flex flex-wrap gap-x-3 mt-0.5 text-[11px] text-muted-foreground">
          {c.email && <span className="truncate max-w-[180px]">{c.email}</span>}
          {c.phone && <span>{c.phone}</span>}
          {c.reseller_name && <span className="text-primary/60">via {c.reseller_name}</span>}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Ver cliente" onClick={() => onNavigate(c.id)}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Agentes activos">
          <Bot className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Reporte del cliente">
          <BarChart2 className="h-3.5 w-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10" title="Eliminar">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará {c.business_name ?? c.name} del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function ClientsList() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["omega-clients"],
    queryFn: () => apiCall<ClientsResponse>("/omega/clients/"),
    staleTime: 60_000,
    retry: 0,
  });

  if (isLoading) return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  );

  const clients = Array.isArray(data?.clients) ? data.clients : [];

  if (clients.length === 0) return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed border-border/40 rounded-xl">
      <Users2 className="mb-2 h-10 w-10 opacity-30" />
      <p className="text-sm">Sin clientes registrados</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <ClientCard key={c.id} c={c} onNavigate={(id) => navigate(`/clients/${id}`)} />
      ))}
    </div>
  );
}

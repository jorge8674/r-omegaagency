import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, InboxIcon, CheckCircle } from "lucide-react";
import { useAdminSolicitudes } from "../hooks/useAdminSolicitudes";
import { SolicitudCard } from "./SolicitudCard";
import { SolicitudConfirmModal } from "./SolicitudConfirmModal";
import { SolicitudesSummary } from "./SolicitudesSummary";
import type { SolicitudResponse } from "../types/solicitudes";

type FilterTab = "all" | "pending" | "accepted" | "declined";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "accepted", label: "Aceptadas" },
  { id: "declined", label: "Declinadas" },
];

export function SolicitudesPanel() {
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [confirmTarget, setConfirmTarget] = useState<SolicitudResponse | null>(null);
  const [confirmMode, setConfirmMode] = useState<"accept" | "decline">("accept");

  const {
    solicitudes, total, pendingCount, monthlyRevenue,
    isLoading, isError, refetch,
    accept, decline, accepting, declining,
  } = useAdminSolicitudes(filter);

  const acceptedCount = filter === "all"
    ? solicitudes.filter((s) => s.status === "accepted").length
    : 0;
  const declinedCount = filter === "all"
    ? solicitudes.filter((s) => s.status === "declined").length
    : 0;

  const handleAcceptClick = (id: string) => {
    const s = solicitudes.find((x) => x.id === id);
    if (s) { setConfirmTarget(s); setConfirmMode("accept"); }
  };

  const handleDeclineClick = (id: string) => {
    const s = solicitudes.find((x) => x.id === id);
    if (s) { setConfirmTarget(s); setConfirmMode("decline"); }
  };

  const handleConfirm = async () => {
    if (!confirmTarget) return;
    try {
      if (confirmMode === "accept") await accept(confirmTarget.id);
      else await decline(confirmTarget.id);
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">Solicitudes de Upsell</h2>
        <p className="text-sm text-muted-foreground">
          {pendingCount} pendientes · ${monthlyRevenue.toLocaleString()}/mes cobrados este mes
        </p>
      </div>

      {/* Summary */}
      <SolicitudesSummary
        total={total}
        pendingCount={pendingCount}
        acceptedCount={acceptedCount}
        declinedCount={declinedCount}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              filter === tab.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50"
            }`}
          >
            {tab.label}
            {tab.id === "pending" && pendingCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0">{pendingCount}</Badge>
            )}
            {tab.id === "all" && <span className="text-xs">({total})</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-3">Error al cargar solicitudes</p>
          <Button variant="outline" onClick={() => refetch()}>Reintentar</Button>
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {filter === "pending" ? (
            <><CheckCircle className="h-10 w-10 mx-auto mb-3 text-success" /><p>Todo al día. No hay solicitudes pendientes.</p></>
          ) : (
            <><InboxIcon className="h-10 w-10 mx-auto mb-3" /><p>Aún no has recibido solicitudes de upsell.</p></>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((s) => (
            <SolicitudCard
              key={s.id}
              solicitud={s}
              onAccept={handleAcceptClick}
              onDecline={handleDeclineClick}
              accepting={accepting}
              declining={declining}
            />
          ))}
        </div>
      )}

      <SolicitudConfirmModal
        solicitud={confirmTarget}
        mode={confirmMode}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

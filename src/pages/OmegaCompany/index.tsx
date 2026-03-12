import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, BarChart2, Network, Activity, FileText, Brain, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiCall } from "@/lib/api/core";
import { useOmegaDashboard } from "./hooks/useOmegaDashboard";
import { RevenueCards } from "./components/RevenueCards";
import { ResellersTable } from "./components/ResellersTable";
import { ClientsList } from "./components/ClientsList";
import { ContentAgentsStats } from "./components/ContentAgentsStats";
import { OmegaActivityFeed } from "./components/OmegaActivityFeed";
import { OmegaOrgChart } from "./components/OmegaOrgChart";
import { OmegaDirectorBar } from "./components/OmegaDirectorBar";
import { ReportsTab } from "./components/ReportsTab";
import { AgentMemoryViewer } from "./components/AgentMemoryViewer";
import { SolicitudesPanel } from "./components/SolicitudesPanel";
import { UpcomingPosts } from "./components/UpcomingPosts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { SolicitudesListResponse } from "./types/solicitudes";

type Section = "resumen" | "organizacion" | "actividad" | "reportes" | "memoria" | "solicitudes";

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "resumen",       label: "Resumen",       icon: BarChart2 },
  { id: "organizacion",  label: "Organización",  icon: Network   },
  { id: "actividad",     label: "Actividad",     icon: Activity  },
  { id: "reportes",      label: "Reportes",      icon: FileText  },
  { id: "memoria",       label: "Memorias IA",   icon: Brain     },
  { id: "solicitudes",   label: "Solicitudes",   icon: Bell      },
];

export default function OmegaCompany() {
  const [active, setActive] = useState<Section>("resumen");

  const {
    stats, statsLoading,
    resellers, resellersLoading,
    activity, activityLoading,
    sentinelLoading,
    refetchAll, lastUpdated,
  } = useOmegaDashboard();

  const { data: solData } = useQuery<SolicitudesListResponse>({
    queryKey: ["admin-solicitudes-badge"],
    queryFn: () => apiCall<SolicitudesListResponse>("/admin/solicitudes/?status=pending"),
    retry: 1,
    refetchInterval: 60_000,
  });
  const pendingBadge = solData?.pending_count ?? 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
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
          <Button size="sm" variant="outline" onClick={refetchAll} disabled={sentinelLoading} className="gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${sentinelLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Sistema de agentes OMEGA</p>
        <OmegaDirectorBar />
      </div>

      <Separator className="opacity-30" />

      {/* Section Chips */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-4">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              active === id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {id === "solicitudes" && pendingBadge > 0 && (
              <Badge className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0 ml-0.5">{pendingBadge}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === "resumen" && (
        <div className="space-y-6">
          <RevenueCards stats={stats} loading={statsLoading} />
          <Separator className="opacity-40" />
          <SectionTitle>Resellers</SectionTitle>
          <ResellersTable resellers={resellers} loading={resellersLoading} />
          <Separator className="opacity-40" />
          <SectionTitle>Clientes</SectionTitle>
          <ClientsList />
          <Separator className="opacity-40" />
          <SectionTitle>Contenido &amp; Agentes</SectionTitle>
          <ContentAgentsStats stats={stats} loading={statsLoading} />
        </div>
      )}

      {active === "organizacion" && (
        <div className="space-y-3">
          <SectionTitle>OMEGA Organization</SectionTitle>
          <OmegaOrgChart />
        </div>
      )}

      {active === "actividad" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OmegaActivityFeed activity={activity} loading={activityLoading} />
          <UpcomingPosts />
        </div>
      )}

      {active === "reportes" && <ReportsTab />}
      {active === "memoria" && <AgentMemoryViewer />}
      {active === "solicitudes" && <SolicitudesPanel />}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>
  );
}

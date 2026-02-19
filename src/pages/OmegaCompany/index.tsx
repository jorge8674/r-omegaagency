import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOmegaDashboard } from "./hooks/useOmegaDashboard";
import { RevenueCards } from "./components/RevenueCards";
import { ResellersTable } from "./components/ResellersTable";
import { ContentAgentsStats } from "./components/ContentAgentsStats";
import { OmegaActivityFeed } from "./components/OmegaActivityFeed";
import { OmegaAgentsSection } from "./components/OmegaAgentsSection";
import { OmegaOrgChart } from "./components/OmegaOrgChart";
import { UpcomingPosts } from "./components/UpcomingPosts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function OmegaCompany() {
  const {
    stats,
    statsLoading,
    resellers,
    resellersLoading,
    activity,
    activityLoading,
    refetchAll,
    lastUpdated,
  } = useOmegaDashboard();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">OMEGA Company</h1>
              <Badge variant="outline" className="border-primary/50 text-primary text-xs font-semibold">
                Super Admin
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Raisen Agency · Vista global del sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Actualizado: {format(lastUpdated, "HH:mm:ss", { locale: es })}
          </span>
          <Button size="sm" variant="outline" onClick={refetchAll} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Section 1 — Revenue Cards */}
      <RevenueCards stats={stats} loading={statsLoading} />

      <Separator className="opacity-40" />

      {/* Section 2 — Resellers Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Resellers
        </h2>
        <ResellersTable resellers={resellers} loading={resellersLoading} />
      </div>

      <Separator className="opacity-40" />

      {/* Section 3 — Content & Agents */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Contenido & Agentes
        </h2>
        <ContentAgentsStats stats={stats} loading={statsLoading} />
      </div>

      <Separator className="opacity-40" />

      {/* Section 3b — Live Agents */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          🤖 Sistema de Agentes
        </h2>
        <OmegaAgentsSection />
      </div>

      <Separator className="opacity-40" />

      <Separator className="opacity-40" />

      {/* Section 4 — OMEGA Organization */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          OMEGA Organization
        </h2>
        <OmegaOrgChart />
      </div>

      <Separator className="opacity-40" />

      {/* Section 5 & 6 — Activity + Upcoming */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OmegaActivityFeed activity={activity} loading={activityLoading} />
        <UpcomingPosts />
      </div>
    </div>
  );
}

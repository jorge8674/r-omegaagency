import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, BarChart2, Network, Activity, FileText, Brain, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOmegaDashboard } from "@/pages/OmegaCompany/hooks/useOmegaDashboard";
import { RevenueCards } from "@/pages/OmegaCompany/components/RevenueCards";
import { ResellersTable } from "@/pages/OmegaCompany/components/ResellersTable";
import { ClientsList } from "@/pages/OmegaCompany/components/ClientsList";
import { ContentAgentsStats } from "@/pages/OmegaCompany/components/ContentAgentsStats";
import { OmegaActivityFeed } from "@/pages/OmegaCompany/components/OmegaActivityFeed";
import { UpcomingPosts } from "@/pages/OmegaCompany/components/UpcomingPosts";
import { ReportsTab } from "@/pages/OmegaCompany/components/ReportsTab";
import { AgentMemoryViewer } from "@/pages/OmegaCompany/components/AgentMemoryViewer";
import { MarketplaceDirectorBar } from "./components/MarketplaceDirectorBar";
import { MarketplaceOrgChart } from "./components/MarketplaceOrgChart";
import { SolicitarModal } from "./components/SolicitarModal";
import { useMarketplace } from "./hooks/useMarketplace";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Section = "resumen" | "organizacion" | "actividad" | "reportes" | "memoria";

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "resumen",       label: "Resumen",       icon: BarChart2 },
  { id: "organizacion",  label: "Organización",  icon: Network   },
  { id: "actividad",     label: "Actividad",     icon: Activity  },
  { id: "reportes",      label: "Reportes",      icon: FileText  },
  { id: "memoria",       label: "Memorias IA",   icon: Brain     },
];

export default function ResellerMarketplace() {
  const [active, setActive] = useState<Section>("organizacion");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const queryClient = useQueryClient();
  const marketplace = useMarketplace();

  const {
    stats, statsLoading,
    resellers, resellersLoading,
    activity, activityLoading,
  } = useOmegaDashboard();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["marketplace-org-chart"] });
      await queryClient.invalidateQueries({ queryKey: ["omega-dashboard"] });
      setLastUpdated(new Date());
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Marketplace de Agentes</h1>
            <Badge variant="outline" className="border-primary/50 text-primary text-xs font-semibold">Catálogo</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Activa agentes y departamentos para potenciar tu agencia</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Actualizado: {format(lastUpdated, "HH:mm:ss", { locale: es })}
          </span>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="space-y-2 pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Sistema de agentes OMEGA</p>
        <MarketplaceDirectorBar isAgentActive={marketplace.isAgentActive} onSolicitar={marketplace.setSelected} />
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
          <MarketplaceOrgChart isAgentActive={marketplace.isAgentActive} onSolicitar={marketplace.setSelected} />
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

      <SolicitarModal
        agent={marketplace.selected}
        onClose={() => marketplace.setSelected(null)}
        onSubmit={marketplace.submitSolicitud}
        sending={marketplace.sending}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>;
}

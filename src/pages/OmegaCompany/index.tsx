// 143 lines
import { useState } from "react";
import { RefreshCw, BarChart2, Network, Activity, FileText, Cpu, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOmegaDashboard } from "./hooks/useOmegaDashboard";
import { RevenueCards } from "./components/RevenueCards";
import { ResellersTable } from "./components/ResellersTable";
import { ContentAgentsStats } from "./components/ContentAgentsStats";
import { OmegaActivityFeed } from "./components/OmegaActivityFeed";
import { OmegaOrgChart } from "./components/OmegaOrgChart";
import { OmegaDirectorBar } from "./components/OmegaDirectorBar";
import { ReportsTab } from "./components/ReportsTab";
import { AgentMemoryViewer } from "./components/AgentMemoryViewer";
import { UpcomingPosts } from "./components/UpcomingPosts";
import { SentinelDashboard } from "./components/SentinelDashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Section = "resumen" | "organizacion" | "actividad" | "reportes" | "memoria";

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "resumen",      label: "Resumen",      icon: BarChart2 },
  { id: "organizacion", label: "Organización", icon: Network   },
  { id: "actividad",    label: "Actividad",    icon: Activity  },
  { id: "reportes",     label: "Reportes",     icon: FileText  },
  { id: "memoria",      label: "Memorias IA",  icon: Brain     },
];

export default function OmegaCompany() {
  const [active, setActive] = useState<Section>("resumen");

  const {
    stats, statsLoading,
    resellers, resellersLoading,
    activity, activityLoading,
    refetchAll, lastUpdated,
  } = useOmegaDashboard();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="h-6 w-6 text-primary shrink-0" />
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

      {/* ── NOVA + Director Bar ───────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Sistema de agentes OMEGA
        </p>
        <OmegaDirectorBar />
      </div>

      <Separator className="opacity-30" />

      {/* ── Section Chips ────────────────────────────────────────── */}
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

      {/* ── Content ──────────────────────────────────────────────── */}
      {active === "resumen" && (
        <div className="space-y-6">
          <RevenueCards stats={stats} loading={statsLoading} />
          <Separator className="opacity-40" />
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resellers
            </h2>
            <ResellersTable resellers={resellers} loading={resellersLoading} />
          </div>
          <Separator className="opacity-40" />
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contenido &amp; Agentes
            </h2>
            <ContentAgentsStats stats={stats} loading={statsLoading} />
          </div>
        </div>
      )}

      {active === "organizacion" && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            OMEGA Organization
          </h2>
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
    </div>
  );
}

import { useState } from "react";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useResellerHome } from "./hooks/useResellerHome";
import { useResellerUpsell } from "./hooks/useResellerUpsell";
import { AgencyHeader } from "./components/AgencyHeader";
import { AgencyKpis } from "./components/AgencyKpis";
import { AgentReports } from "./components/AgentReports";
import { ClientsList } from "./components/ClientsList";
import { UpsellOpportunities } from "./components/UpsellOpportunities";
import { CampaignReports } from "./components/CampaignReports";
import { OmegaUpsell } from "./components/OmegaUpsell";
import { KpiDrawer, type KpiDrawerType } from "./components/KpiDrawer";
import { NovaDrawer } from "./components/NovaDrawer";
import { ResellerUpsellModal } from "./components/ResellerUpsellModal";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import type { UpsellOpportunity } from "./types";

export default function ResellerDashboard() {
  const { user } = useOmegaAuth();
  const queryClient = useQueryClient();
  const resellerId = user?.reseller_id ?? localStorage.getItem("omega_reseller_id") ?? user?.id ?? "";

  const { data, isLoading } = useResellerHome();
  const upsellMutation = useResellerUpsell();

  const [addClientOpen, setAddClientOpen] = useState(false);
  const [novaOpen, setNovaOpen] = useState(false);
  const [upsellOpp, setUpsellOpp] = useState<UpsellOpportunity | null>(null);
  const [kpiDrawer, setKpiDrawer] = useState<KpiDrawerType>(null);

  if (!resellerId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Inicia sesión para ver tu dashboard</p>
      </div>
    );
  }

  const profile = data?.profile;
  const kpis = data?.kpis;
  const clients = data?.clients ?? [];
  const reports = data?.agent_reports ?? [];
  const opportunities = data?.upsell_opportunities ?? [];

  return (
    <div className="space-y-6 pb-20">
      <AgencyHeader profile={profile} loading={isLoading} />

      <AgencyKpis
        kpis={kpis}
        activeClients={profile?.active_clients ?? 0}
        loading={isLoading}
        onKpiClick={(type) => setKpiDrawer(type)}
      />

      <AgentReports reports={reports} loading={isLoading} />

      <ClientsList
        clients={clients}
        activeCount={profile?.active_clients ?? 0}
        loading={isLoading}
        onAddClient={() => setAddClientOpen(true)}
      />

      <UpsellOpportunities
        opportunities={opportunities}
        loading={isLoading}
        onPropose={(opp) => setUpsellOpp(opp)}
      />

      <CampaignReports clients={clients} loading={isLoading} />

      <OmegaUpsell resellerId={resellerId} />

      <KpiDrawer
        type={kpiDrawer}
        onClose={() => setKpiDrawer(null)}
        clients={clients}
        kpis={kpis}
      />

      <AddClientModal
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        resellerId={resellerId}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["reseller-home", resellerId] })
        }
      />

      <NovaDrawer
        open={novaOpen}
        onOpenChange={setNovaOpen}
        agencyName={profile?.company ?? "Mi Agencia"}
      />

      <ResellerUpsellModal
        open={!!upsellOpp}
        onOpenChange={(v) => !v && setUpsellOpp(null)}
        opportunity={upsellOpp}
        currentPlan={
          clients.find((c) => c.id === upsellOpp?.client_id)?.plan ??
          data?.profile?.plan ??
          "basic"
        }
        onSubmit={(payload) => upsellMutation.mutate(payload)}
        isPending={upsellMutation.isPending}
      />
    </div>
  );
}

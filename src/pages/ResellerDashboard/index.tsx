import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { QuickActions } from "./components/QuickActions";
import { NovaDrawer } from "./components/NovaDrawer";
import { ResellerUpsellModal } from "./components/ResellerUpsellModal";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import type { UpsellOpportunity } from "./types";

export default function ResellerDashboard() {
  const { user } = useOmegaAuth();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const resellerId = searchParams.get("reseller_id") || user?.reseller_id || "";

  const { data, isLoading } = useResellerHome(resellerId);
  const upsellMutation = useResellerUpsell();

  const [addClientOpen, setAddClientOpen] = useState(false);
  const [novaOpen, setNovaOpen] = useState(false);
  const [upsellOpp, setUpsellOpp] = useState<UpsellOpportunity | null>(null);

  if (!resellerId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No se proporcionó reseller_id</p>
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
      {/* Block 1 — Agency Identity */}
      <AgencyHeader profile={profile} loading={isLoading} />

      {/* Block 2 — KPIs */}
      <AgencyKpis kpis={kpis} activeClients={profile?.active_clients ?? 0} loading={isLoading} />

      {/* Block 3 — Agent Reports */}
      <AgentReports reports={reports} loading={isLoading} />

      {/* Block 4 — Clients List */}
      <ClientsList
        clients={clients}
        activeCount={profile?.active_clients ?? 0}
        loading={isLoading}
        onAddClient={() => setAddClientOpen(true)}
      />

      {/* Block 5 — Upsell Opportunities */}
      <UpsellOpportunities
        opportunities={opportunities}
        loading={isLoading}
        onPropose={(opp) => setUpsellOpp(opp)}
      />

      {/* Block 6 — Campaign Reports */}
      <CampaignReports clients={clients} loading={isLoading} />

      {/* Block 7 — Quick Actions */}
      <QuickActions
        resellerId={resellerId}
        onAddClient={() => setAddClientOpen(true)}
        onOpenNova={() => setNovaOpen(true)}
      />

      {/* Modals / Drawers */}
      <AddClientModal
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        resellerId={resellerId}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["reseller-home", resellerId] })}
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
        resellerId={resellerId}
        onSubmit={(payload) => upsellMutation.mutate(payload)}
        isPending={upsellMutation.isPending}
      />
    </div>
  );
}

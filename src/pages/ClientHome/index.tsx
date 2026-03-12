/* ClientHome — 7-block orchestrator page */
import { useState, useCallback } from "react";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { useClientHome } from "./hooks/useClientHome";
import { useFeatureUsage } from "./hooks/useFeatureUsage";
import { useSubBrands } from "./hooks/useSubBrands";
import IdentityHeader from "./components/IdentityHeader";
import BrandSelector from "./components/BrandSelector";
import KpiCards from "./components/KpiCards";
import ScheduledContent from "./components/ScheduledContent";
import MetricsAlerts from "./components/MetricsAlerts";
import UpsellSection from "./components/UpsellSection";
import QuickActions from "./components/QuickActions";
import AgentCatalogModal from "./components/AgentCatalogModal";
import UpsellRequestModal from "./components/UpsellRequestModal";
import type { UpsellPayload } from "./types";

export default function ClientHome() {
  const { user } = useOmegaAuth();
  const clientId = user?.client_id || user?.id || "";
  const { data, isLoading } = useClientHome(clientId);
  const { data: usage, isLoading: usageLoading } = useFeatureUsage(clientId);
  const { data: subBrands = [] } = useSubBrands(clientId);

  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [upsellItem, setUpsellItem] = useState<Omit<UpsellPayload, "client_id" | "current_plan" | "client_message"> | null>(null);

  const profile = data?.profile;
  const plan = profile?.plan || "basic";
  const accounts = data?.social_accounts || [];
  const posts = data?.upcoming_posts || [];
  const stats = data?.stats || { total_posts: 0, connected_accounts: 0, this_month_posts: 0 };

  const handleUpsellRequest = useCallback(
    (item: Omit<UpsellPayload, "client_id" | "current_plan">) => setUpsellItem(item),
    []
  );

  const handleOpenNova = useCallback(() => {
    const btn = document.querySelector<HTMLButtonElement>('[aria-label="Abrir chat con NOVA"]');
    btn?.click();
  }, []);

  if (!clientId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No se pudo identificar el cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Block 1 — Identity */}
      <IdentityHeader profile={profile} loading={isLoading} />

      {/* Brand Selector — only if 2+ brands */}
      <BrandSelector
        brands={subBrands}
        activeBrandId={activeBrandId}
        onSelect={setActiveBrandId}
        clientId={clientId}
      />

      {/* Block 2 — KPIs */}
      <KpiCards
        usage={usage}
        accounts={accounts}
        nextPosts={posts}
        loading={isLoading || usageLoading}
        onUpsell={() => handleUpsellRequest({
          request_type: "plan_upgrade", item_name: "Ampliar límite",
          item_code: "LIMIT_INCREASE", monthly_price: 0, new_monthly_total: 0,
        })}
      />

      {/* Block 3 */}
      <ScheduledContent posts={posts} accounts={accounts} loading={isLoading} />

      {/* Block 4 */}
      <MetricsAlerts profile={profile} accounts={accounts} stats={stats} loading={isLoading} />

      {/* Block 5 */}
      <UpsellSection
        plan={plan}
        clientId={clientId}
        onRequestUpsell={handleUpsellRequest}
        onOpenCatalog={() => setCatalogOpen(true)}
      />

      {/* Block 6 */}
      <QuickActions plan={plan} usage={usage} onOpenNova={handleOpenNova} />

      {/* Modals */}
      <AgentCatalogModal
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onRequestAgent={(item) => { setCatalogOpen(false); setUpsellItem(item); }}
      />
      <UpsellRequestModal
        open={!!upsellItem}
        onClose={() => setUpsellItem(null)}
        clientId={clientId}
        currentPlan={plan}
        item={upsellItem}
      />
    </div>
  );
}

/* Block 4 — Metrics + Alerts (2 columns desktop / 1 mobile) */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ClientProfile, SocialAccount, ClientHomeStats } from "../types";

interface Props {
  profile: ClientProfile | undefined;
  accounts: SocialAccount[];
  stats: ClientHomeStats;
  loading: boolean;
}

export default function MetricsAlerts({ profile, accounts, stats, loading }: Props) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card"><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        <Card className="bg-card"><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
      </div>
    );
  }

  const disconnected = accounts.filter((a) => !a.connected);
  const trialDays = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 0;
  const hasAlerts = disconnected.length > 0 || (profile?.trial_active && trialDays <= 7);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Metrics */}
      <Card className="bg-card">
        <CardHeader><CardTitle className="text-lg font-display">Métricas</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <MetricRow label="Seguidores totales" value="—" />
          <MetricRow label="Posts publicados" value={String(stats.this_month_posts)} />
          <MetricRow label="Engagement" value="—" />
          <MetricRow label="Alcance promedio" value="—" />
          <p className="text-[11px] text-muted-foreground mt-2">Conecta Meta para ver métricas</p>
          <Button size="sm" variant="outline" onClick={() => navigate("/media")}>
            <Link2 className="h-3 w-3 mr-1" /> Conectar Meta
          </Button>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="bg-card">
        <CardHeader><CardTitle className="text-lg font-display">Alertas Activas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {!hasAlerts ? (
            <div className="flex items-center gap-2 text-success text-sm">
              <CheckCircle2 className="h-4 w-4" /> Sistema operando normalmente
            </div>
          ) : (
            <>
              {disconnected.map((a) => (
                <AlertRow key={a.id} text={`${a.platform} no conectada`} />
              ))}
              {profile?.trial_active && trialDays <= 7 && (
                <AlertRow text={`Trial vence en ${trialDays} días`} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function AlertRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-warning text-sm">
      <AlertTriangle className="h-4 w-4 shrink-0" /> {text}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { ResellerProfile } from "../types";

const PLAN_LABEL: Record<string, string> = {
  starter: "AGENCY STARTER",
  growth: "AGENCY GROWTH",
  scale: "AGENCY SCALE",
};

const PAY_STATUS: Record<string, { icon: React.ReactNode; text: string; cls: string }> = {
  ok: { icon: <CheckCircle2 className="h-4 w-4" />, text: "Al día", cls: "text-emerald-400" },
  upcoming: { icon: <Clock className="h-4 w-4" />, text: "Pago próximo (5 días)", cls: "text-yellow-400" },
  overdue: { icon: <AlertTriangle className="h-4 w-4" />, text: "Pago vencido", cls: "text-destructive" },
};

interface Props {
  profile: ResellerProfile | undefined;
  loading: boolean;
}

export function AgencyHeader({ profile, loading }: Props) {
  if (loading || !profile) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  const initials = profile.company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const plan = (profile.reseller_plan ?? "starter").toLowerCase();
  const label = PLAN_LABEL[plan] ?? PLAN_LABEL.starter;
  const pct = profile.max_clients > 0 ? (profile.active_clients / profile.max_clients) * 100 : 0;
  const nearLimit = pct >= 80;
  const ps = PAY_STATUS[profile.payment_status] ?? PAY_STATUS.ok;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold tracking-tight truncate">{profile.company}</h1>
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs">
              {label}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm">
            <span className="text-muted-foreground">
              {profile.active_clients} de {profile.max_clients} clientes activos
            </span>
            <span className={`flex items-center gap-1 ${ps.cls}`}>
              {ps.icon} {ps.text}
            </span>
          </div>
        </div>
      </div>

      <Progress value={pct} className="h-2" />

      {nearLimit && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Estás cerca del límite — considera un plan más amplio para seguir creciendo
        </div>
      )}
    </div>
  );
}

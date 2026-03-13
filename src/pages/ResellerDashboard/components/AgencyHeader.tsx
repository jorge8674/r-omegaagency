import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { ResellerProfile } from "../types";

const PLAN_LABEL: Record<string, string> = {
  agency_starter: "AGENCY STARTER",
  agency_growth: "AGENCY GROWTH",
  agency_scale: "AGENCY SCALE",
  starter: "AGENCY STARTER",
  growth: "AGENCY GROWTH",
  scale: "AGENCY SCALE",
};

const PAY_STATUS: Record<string, { icon: React.ReactNode; text: string; cls: string }> = {
  active: { icon: <CheckCircle2 className="h-4 w-4" />, text: "Al día", cls: "text-[hsl(var(--success))]" },
  ok: { icon: <CheckCircle2 className="h-4 w-4" />, text: "Al día", cls: "text-[hsl(var(--success))]" },
  warning: { icon: <Clock className="h-4 w-4" />, text: "Pago próximo", cls: "text-[hsl(var(--warning))]" },
  upcoming: { icon: <Clock className="h-4 w-4" />, text: "Pago próximo", cls: "text-[hsl(var(--warning))]" },
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

  const initials = (profile.company ?? "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AG";

  const planKey = (profile.reseller_plan ?? "starter").toLowerCase();
  const label = PLAN_LABEL[planKey] ?? PLAN_LABEL.starter;
  const pct = profile.max_clients > 0
    ? Math.round((profile.active_clients / profile.max_clients) * 100)
    : 0;
  const nearLimit = pct >= 80;
  const ps = PAY_STATUS[profile.payment_status] ?? PAY_STATUS.active;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-[hsl(225_20%_15%)] border border-border/50 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold tracking-tight truncate">
              {profile.company}
            </h1>
            <Badge
              variant="outline"
              className="border-primary/50 text-primary bg-primary/10 text-xs font-semibold"
            >
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
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Estás cerca del límite — considera un plan más amplio para seguir creciendo
        </div>
      )}
    </div>
  );
}

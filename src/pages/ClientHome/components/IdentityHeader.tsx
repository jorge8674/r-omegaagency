/* Block 1 — Identity + Plan Status Header */
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_LIMITS, PLAN_BADGE_STYLE } from "../constants";
import type { ClientProfile } from "../types";

interface Props {
  profile: ClientProfile | undefined;
  loading: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function trialDaysLeft(trialEnds?: string): number {
  if (!trialEnds) return 0;
  const diff = new Date(trialEnds).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function IdentityHeader({ profile, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const plan = PLAN_LIMITS[profile.plan] || PLAN_LIMITS.basic;
  const badgeStyle = PLAN_BADGE_STYLE[profile.plan] || PLAN_BADGE_STYLE.basic;
  const isTrial = profile.trial_active;
  const isPastDue = profile.subscription_status === "past_due";
  const daysLeft = trialDaysLeft(profile.trial_ends_at);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground font-bold text-lg shrink-0">
          {getInitials(profile.name || profile.company || "?")}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-bold tracking-tight truncate">
            {profile.name || profile.company}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge className={badgeStyle}>{plan.label}</Badge>
            <span className="text-sm text-muted-foreground">{plan.price}</span>
            {!isTrial && !isPastDue && (
              <span className="flex items-center gap-1 text-xs text-success">
                <CircleDot className="h-3 w-3" /> Online
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trial banner */}
      {isTrial && (
        <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <p className="text-sm text-warning flex-1">
            Trial: {daysLeft} días restantes
          </p>
          <Button size="sm" variant="outline" className="border-warning text-warning hover:bg-warning/20">
            Activar plan
          </Button>
        </div>
      )}

      {/* Past due banner */}
      {isPastDue && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive flex-1">Pago pendiente</p>
          <Button size="sm" variant="destructive">
            Actualizar pago
          </Button>
        </div>
      )}
    </div>
  );
}

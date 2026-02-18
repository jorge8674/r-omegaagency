import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useOmegaAuth } from "@/contexts/AuthContext";

/* ─── Plan limits ─────────────────────────────────── */

const PLAN_DAILY_LIMITS: Record<string, number> = {
  basic: 2,
  basico_97: 2,
  pro: 5,
  pro_197: 5,
  enterprise: Infinity,
  enterprise_497: Infinity,
};

function resolvePlanLimit(plan: string | undefined): number {
  if (!plan) return 2;
  const key = plan.toLowerCase().trim();
  return PLAN_DAILY_LIMITS[key] ?? 2;
}

/* ─── Hook ────────────────────────────────────────── */

export interface DailyLimitsResult {
  used: number;
  limit: number;
  remaining: number;
  canSchedule: boolean;
  isLoading: boolean;
  planLabel: string;
}

export function useDailyLimits(scheduledAt: string): DailyLimitsResult {
  const { user } = useOmegaAuth();

  const dateStr = useMemo(() => {
    if (!scheduledAt) return null;
    try {
      return format(new Date(scheduledAt), "yyyy-MM-dd");
    } catch {
      return null;
    }
  }, [scheduledAt]);

  const { data: postsCount = 0, isLoading } = useQuery({
    queryKey: ["daily-post-count", dateStr],
    queryFn: async () => {
      if (!dateStr) return 0;
      const dayStart = `${dateStr}T00:00:00`;
      const dayEnd = `${dateStr}T23:59:59`;

      const { count, error } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .gte("scheduled_at", dayStart)
        .lte("scheduled_at", dayEnd);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!dateStr,
  });

  const limit = resolvePlanLimit(user?.plan);
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - postsCount);
  const canSchedule = remaining > 0;

  const planLabel = limit === Infinity
    ? "Enterprise (ilimitado)"
    : `${(user?.plan ?? "basic").replace(/_\d+/, "")} (${limit}/dia)`;

  return { used: postsCount, limit, remaining, canSchedule, isLoading, planLabel };
}

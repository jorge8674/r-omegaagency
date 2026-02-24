import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, UserPlus, CreditCard, ArrowUpDown, ShieldOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { ResellerActivityItem } from "../hooks/useResellerDetail";

interface Props { activity: ResellerActivityItem[]; loading: boolean }

const ACTION_ICON: Record<string, typeof Activity> = {
  new_client: UserPlus,
  payment: CreditCard,
  plan_change: ArrowUpDown,
  suspension: ShieldOff,
};

export function ResellerActivityTab({ activity, loading }: Props) {
  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;
  }

  const safe = Array.isArray(activity) ? activity : [];

  if (safe.length === 0) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Activity className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin actividad registrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-1">
      {safe.slice(0, 20).map((item) => {
        const Icon = ACTION_ICON[item.action] ?? Activity;
        return (
          <div key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/20 bg-card/40 hover:border-amber-500/20 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Icon className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{item.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

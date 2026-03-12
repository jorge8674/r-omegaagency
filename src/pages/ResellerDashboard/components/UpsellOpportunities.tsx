import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, AlertTriangle, TrendingDown } from "lucide-react";
import type { UpsellOpportunity } from "../types";

const TYPE_ICON: Record<string, React.ReactNode> = {
  near_limit: <Lightbulb className="h-5 w-5 text-yellow-400" />,
  onboarding: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
  churn_risk: <TrendingDown className="h-5 w-5 text-destructive" />,
};

interface Props {
  opportunities: UpsellOpportunity[];
  loading: boolean;
  onPropose: (opp: UpsellOpportunity) => void;
}

export function UpsellOpportunities({ opportunities, loading, onPropose }: Props) {
  if (loading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="pt-6 space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" /> Oportunidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Sin oportunidades detectadas esta semana.
          </p>
        ) : (
          <div className="space-y-2">
            {(opportunities ?? []).map((o) => (
              <div key={`${o.client_id}-${o.type}`} className="flex items-start gap-3 rounded-xl border border-border/30 bg-secondary/20 p-3">
                <div className="shrink-0 mt-0.5">{TYPE_ICON[o.type] ?? TYPE_ICON.near_limit}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{o.client_name}</p>
                  <p className="text-xs text-muted-foreground">{o.message}</p>
                  <p className="text-xs text-emerald-400 mt-1">
                    +${o.potential_revenue_min}–${o.potential_revenue_max}/mes
                  </p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={() => onPropose(o)}>
                  {o.cta}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

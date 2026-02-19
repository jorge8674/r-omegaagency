import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Users, Building2 } from "lucide-react";
import type { OmegaDashboardStats } from "@/lib/api/omega";

interface Props {
  stats: OmegaDashboardStats | undefined;
  loading: boolean;
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string;
  value: React.ReactNode;
  sub: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

export function RevenueCards({ stats, loading }: Props) {
  const fmt = (n: number | undefined | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(n ?? 0));

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-6">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const mrr = Number(stats?.mrr ?? 0);
  const arr = Number(stats?.arr ?? 0);
  const activeClients = stats?.active_clients ?? 0;
  const newClients = stats?.new_clients_this_month ?? 0;
  const activeResellers = stats?.active_resellers ?? 0;
  const trialResellers = stats?.trial_resellers ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        title="MRR"
        value={fmt(mrr)}
        sub="desde Stripe"
        icon={DollarSign}
      />
      <StatCard
        title="ARR"
        value={fmt(arr)}
        sub="proyectado"
        icon={TrendingUp}
      />
      <StatCard
        title="Clientes"
        value={activeClients}
        sub={`+${newClients} este mes`}
        icon={Users}
      />
      <StatCard
        title="Resellers"
        value={activeResellers}
        sub={`${trialResellers} en trial`}
        icon={Building2}
      />
    </div>
  );
}

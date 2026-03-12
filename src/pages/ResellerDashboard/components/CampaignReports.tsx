import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ResellerClient } from "../types";

interface Props {
  clients: ResellerClient[];
  loading: boolean;
}

interface CampaignRow {
  name: string;
  activeCampaigns: number;
  postsThisMonth: number;
  trend: "up" | "down" | "flat";
}

export function CampaignReports({ clients, loading }: Props) {
  if (loading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="pt-6 space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const rows: CampaignRow[] = clients
    .filter((c) => c.upcoming_posts.length > 0 || c.stats.posts_this_month > 0)
    .map((c) => ({
      name: c.name,
      activeCampaigns: c.upcoming_posts.filter((p) => p.status === "scheduled").length,
      postsThisMonth: c.stats.posts_this_month,
      trend: c.stats.posts_this_month > 5 ? "up" : c.stats.posts_this_month === 0 ? "down" : "flat",
    }));

  const TrendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
  const trendCls = { up: "text-emerald-400", down: "text-destructive", flat: "text-muted-foreground" };

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-display flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" /> Reportes de Campaña
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Sin datos de campaña suficientes aún.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Cliente</TableHead>
                <TableHead className="text-xs text-center">Campañas</TableHead>
                <TableHead className="text-xs text-center">Posts</TableHead>
                <TableHead className="text-xs text-center">Tendencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const Icon = TrendIcon[r.trend];
                return (
                  <TableRow key={r.name}>
                    <TableCell className="text-sm font-medium">{r.name}</TableCell>
                    <TableCell className="text-center text-sm">{r.activeCampaigns}</TableCell>
                    <TableCell className="text-center text-sm">{r.postsThisMonth}</TableCell>
                    <TableCell className="text-center">
                      <Icon className={`h-4 w-4 mx-auto ${trendCls[r.trend]}`} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

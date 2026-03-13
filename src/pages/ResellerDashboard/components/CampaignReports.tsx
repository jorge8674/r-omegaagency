import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BarChart2 } from "lucide-react";
import type { ResellerClient } from "../types";

const HEALTH_DOT: Record<string, string> = {
  green: "bg-[hsl(var(--success))]",
  yellow: "bg-[hsl(var(--warning))]",
  red: "bg-destructive",
};

interface Props {
  clients: ResellerClient[];
  loading: boolean;
}

export function CampaignReports({ clients, loading }: Props) {
  if (loading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="pt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const rows = (clients ?? [])
    .filter((c) => c.stats)
    .map((c) => ({
      name: c.name,
      posts: c.stats?.posts_this_month ?? 0,
      connected: c.stats?.connected_accounts ?? 0,
      total: c.stats?.total_accounts ?? 0,
      health: c.health ?? "green",
    }));

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-display flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" /> Reportes de Campaña
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Sin datos de campaña suficientes aún.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Cliente</TableHead>
                <TableHead className="text-xs text-center">Posts</TableHead>
                <TableHead className="text-xs text-center">Redes</TableHead>
                <TableHead className="text-xs text-center">Salud</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="text-sm font-medium">{r.name}</TableCell>
                  <TableCell className="text-center text-sm">{r.posts}</TableCell>
                  <TableCell className="text-center text-sm">
                    {r.connected}/{r.total}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${HEALTH_DOT[r.health] ?? HEALTH_DOT.green}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

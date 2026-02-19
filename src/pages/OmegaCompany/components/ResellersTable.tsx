import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Users, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { OmegaReseller } from "@/lib/api/omega";

interface Props {
  resellers: OmegaReseller[];
  loading: boolean;
}

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Activo", variant: "default" },
  trial: { label: "Trial", variant: "outline" },
  suspended: { label: "Suspendido", variant: "destructive" },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ResellersTable({ resellers, loading }: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (resellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="mb-2 h-10 w-10 opacity-30" />
        <p className="text-sm">Sin resellers registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reseller</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Clientes</TableHead>
            <TableHead className="text-right">MRR</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resellers.map((r) => {
            const badge = STATUS_BADGE[r.status] ?? { label: r.status, variant: "secondary" as const };
            return (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.agency_name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.slug}</TableCell>
                <TableCell>{r.plan ?? "—"}</TableCell>
                <TableCell className="text-right">{r.clients_count}</TableCell>
                <TableCell className="text-right">{fmt(r.mrr)}</TableCell>
                <TableCell>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/landing/${r.slug}`, "_blank")}
                      title="Ver landing"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/admin/resellers`)}
                      title="Ver clientes"
                    >
                      <Users className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      title="Suspender"
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

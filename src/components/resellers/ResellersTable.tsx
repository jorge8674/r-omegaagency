import { Building2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { type Reseller, statusConfig } from "@/hooks/useAdminResellers";

interface ResellersTableProps {
  resellers: Reseller[];
  isLoading: boolean;
  onSuspend: (reseller: Reseller) => void;
}

export function ResellersTable({ resellers, isLoading, onSuspend }: ResellersTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agencia</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Comisión</TableHead>
          <TableHead>Mora</TableHead>
          <TableHead>Suspender</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resellers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
              No hay resellers registrados
            </TableCell>
          </TableRow>
        ) : (
          resellers.map((r) => {
            const sc = statusConfig[r.status] || statusConfig.pending;
            const commission = (r.monthly_revenue_reported || 0) * (r.omega_commission_rate || 0.3);
            const isOverdue = r.days_overdue > 7;
            return (
              <TableRow key={r.id} className={isOverdue ? "bg-warning/5" : ""}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{r.agency_name}</p>
                      <p className="text-xs text-muted-foreground">/{r.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{r.owner_name}</p>
                    <p className="text-xs text-muted-foreground">{r.owner_email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${(r.monthly_revenue_reported || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-primary">
                  ${commission.toLocaleString()}
                </TableCell>
                <TableCell>
                  {r.days_overdue > 0 ? (
                    <Badge variant="outline" className={isOverdue ? "bg-destructive/20 text-destructive border-destructive/30" : "bg-warning/20 text-warning border-warning/30"}>
                      {r.days_overdue}d
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Al día</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch checked={r.suspend_switch} onCheckedChange={() => onSuspend(r)} />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary/80"
                    onClick={() => navigate(`/reseller/dashboard?reseller_id=${r.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

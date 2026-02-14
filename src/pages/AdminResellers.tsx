import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2, DollarSign, AlertTriangle, Users, Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Reseller {
  id: string;
  slug: string;
  agency_name: string;
  owner_name: string;
  owner_email: string;
  status: string;
  white_label_active: boolean;
  omega_commission_rate: number;
  monthly_revenue_reported: number;
  payment_due_date: string | null;
  days_overdue: number;
  suspend_switch: boolean;
  clients_migrated: boolean;
  created_at: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-success/20 text-success border-success/30" },
  suspended: { label: "Suspendido", className: "bg-destructive/20 text-destructive border-destructive/30" },
  pending: { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
  trial: { label: "Trial", className: "bg-chart-3/20 text-[hsl(var(--chart-3))] border-[hsl(var(--chart-3))]/30" },
};

export default function AdminResellers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [suspendTarget, setSuspendTarget] = useState<Reseller | null>(null);

  const { data: resellers = [], isLoading } = useQuery<Reseller[]>({
    queryKey: ["admin-resellers"],
    queryFn: () => api.getResellers().then((r: any) => r?.resellers || r?.data || r || []),
    retry: 1,
  });

  const suspendMutation = useMutation({
    mutationFn: (reseller: Reseller) =>
      api.updateResellerStatus(reseller.id, {
        suspend_switch: !reseller.suspend_switch,
        status: reseller.suspend_switch ? "active" : "suspended",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resellers"] });
      toast({ title: "Estado actualizado", description: "El estado del reseller se actualizó correctamente." });
      setSuspendTarget(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo actualizar el estado.", variant: "destructive" });
      setSuspendTarget(null);
    },
  });

  const totalRevenue = resellers.reduce((s, r) => s + (r.monthly_revenue_reported || 0), 0);
  const totalCommission = resellers.reduce(
    (s, r) => s + (r.monthly_revenue_reported || 0) * (r.omega_commission_rate || 0.3), 0
  );
  const overdueCount = resellers.filter((r) => r.days_overdue > 0).length;

  const kpis = [
    { title: "Total Resellers", value: resellers.length, icon: Building2 },
    { title: "Revenue Reportado", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Comisión OMEGA", value: `$${totalCommission.toLocaleString()}`, icon: DollarSign },
    { title: "Con Mora", value: overdueCount, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Resellers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión global de agencias reseller
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue Alert Banner */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm text-warning">
            <span className="font-semibold">{overdueCount} reseller{overdueCount > 1 ? "s" : ""}</span> con mora
            de más de 7 días. Revisa los pagos pendientes.
          </p>
        </div>
      )}

      {/* Resellers Table */}
      <Card className="glass">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
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
                      <TableRow
                        key={r.id}
                        className={isOverdue ? "bg-warning/5" : ""}
                      >
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
                          <Badge variant="outline" className={sc.className}>
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${(r.monthly_revenue_reported || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-primary">
                          ${commission.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {r.days_overdue > 0 ? (
                            <Badge
                              variant="outline"
                              className={
                                isOverdue
                                  ? "bg-destructive/20 text-destructive border-destructive/30"
                                  : "bg-warning/20 text-warning border-warning/30"
                              }
                            >
                              {r.days_overdue}d
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Al día</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={r.suspend_switch}
                            onCheckedChange={() => setSuspendTarget(r)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:text-primary/80"
                            onClick={() => navigate(`/reseller/${r.id}/dashboard`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Suspend Confirmation Dialog */}
      <AlertDialog open={!!suspendTarget} onOpenChange={() => setSuspendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspendTarget?.suspend_switch ? "Reactivar" : "Suspender"} servicio
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspendTarget?.suspend_switch
                ? `¿Reactivar el acceso de "${suspendTarget.agency_name}" y todos sus clientes?`
                : `¿Suspender "${suspendTarget?.agency_name}"? Esto bloqueará el acceso de la agencia y sus clientes finales.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={
                suspendTarget?.suspend_switch
                  ? "bg-success hover:bg-success/90"
                  : "bg-destructive hover:bg-destructive/90"
              }
              onClick={() => suspendTarget && suspendMutation.mutate(suspendTarget)}
            >
              {suspendTarget?.suspend_switch ? "Reactivar" : "Suspender"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

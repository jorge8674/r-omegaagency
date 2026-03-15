import { useState } from "react";
import { Building2, Eye, MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { type Reseller, statusConfig } from "@/hooks/useAdminResellers";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ResellersTableProps {
  resellers: Reseller[];
  isLoading: boolean;
  onSuspend: (reseller: Reseller) => void;
}

export function ResellersTable({ resellers, isLoading, onSuspend }: ResellersTableProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteReseller(deleteTarget);
      queryClient.invalidateQueries({ queryKey: ["admin-resellers"] });
      toast({ title: "Reseller eliminado" });
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" });
    }
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/reseller/dashboard?reseller_id=${r.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/resellers/${r.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSuspend(r)}>
                          <Power className="mr-2 h-4 w-4" />{r.suspend_switch ? "Activar" : "Desactivar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(r.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar reseller?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El reseller y sus datos asociados serán eliminados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Plus } from "lucide-react";
import { useAdminResellers } from "@/hooks/useAdminResellers";
import { ResellersTable } from "@/components/resellers/ResellersTable";

export default function AdminResellers() {
  const {
    resellers, isLoading, apiResponse,
    suspendTarget, setSuspendTarget,
    createOpen, setCreateOpen,
    form, setForm,
    suspendMutation, createMutation,
    handleCreate, kpis,
  } = useAdminResellers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Resellers</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión global de agencias reseller</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Nuevo Reseller
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Nuevo Reseller</DialogTitle>
              <DialogDescription>Registra una nueva agencia reseller en OMEGA.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="mi-agencia" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency_name">Nombre de la Agencia</Label>
                <Input id="agency_name" placeholder="Agencia XYZ" value={form.agency_name} onChange={(e) => setForm({ ...form, agency_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_name">Nombre del Owner</Label>
                <Input id="owner_name" placeholder="Juan Pérez" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_email">Email del Owner</Label>
                <Input id="owner_email" type="email" placeholder="owner@agencia.com" value={form.owner_email} onChange={(e) => setForm({ ...form, owner_email: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando…" : "Crear Reseller"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold font-display">{kpi.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {(apiResponse?.with_mora ?? 0) > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm text-warning">
            <span className="font-semibold">{apiResponse?.with_mora} reseller{(apiResponse?.with_mora ?? 0) > 1 ? "s" : ""}</span> con mora de más de 7 días.
          </p>
        </div>
      )}

      <Card className="glass">
        <CardContent className="p-0">
          <ResellersTable resellers={resellers} isLoading={isLoading} onSuspend={setSuspendTarget} />
        </CardContent>
      </Card>

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
              className={suspendTarget?.suspend_switch ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"}
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

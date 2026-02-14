import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  Users, DollarSign, CalendarDays, Eye, Plus, UserPlus,
  Settings, Ban, CheckCircle, AlertTriangle, UserCircle,
} from "lucide-react";
import { AddClientModal } from "@/components/dashboard/AddClientModal";

interface ResellerData {
  reseller: {
    id: string;
    agency_name: string;
    status: string;
    monthly_revenue_reported: number;
    omega_commission_rate: number;
    payment_due_date: string | null;
    days_overdue: number;
    suspend_switch: boolean;
  };
  branding: {
    logo_url: string | null;
  } | null;
  clients: Array<{
    id: string;
    name: string;
    plan: string | null;
    active: boolean;
  }>;
  agents: Array<{
    id: string;
    name: string;
    email: string;
    status: string | null;
  }>;
  active_clients_count: number;
}

const statusBanner: Record<string, { icon: React.ReactNode; text: string; className: string; blocking?: boolean }> = {
  active: {
    icon: <CheckCircle className="h-5 w-5" />,
    text: "Cuenta al día",
    className: "border-success/40 bg-success/10 text-success",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    text: "Pago próximo a vencer",
    className: "border-warning/40 bg-warning/10 text-warning",
  },
  suspended: {
    icon: <Ban className="h-5 w-5" />,
    text: "Cuenta suspendida. Contacta a OMEGA.",
    className: "border-destructive bg-destructive/20 text-destructive",
    blocking: true,
  },
};

export default function ResellerDashboard() {
  const { user } = useOmegaAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resellerId = user?.reseller_id || "";
  const [addClientOpen, setAddClientOpen] = useState(false);

  const { data, isLoading, error } = useQuery<ResellerData>({
    queryKey: ["reseller-dashboard", resellerId],
    queryFn: () => api.getResellerDashboard(resellerId),
    enabled: !!resellerId,
    retry: 1,
  });

  if (!resellerId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No se proporcionó reseller_id</p>
      </div>
    );
  }

  const reseller = data?.reseller;
  const branding = data?.branding;
  const clients = data?.clients || [];
  const agents = data?.agents || [];
  const activeCount = data?.active_clients_count ?? clients.filter((c) => c.active).length;
  const revenue = reseller?.monthly_revenue_reported || 0;
  const commission = revenue * (reseller?.omega_commission_rate || 0.3);
  const status = reseller?.status || "active";
  const banner = statusBanner[status] || statusBanner.active;

  const kpis = [
    { title: "Clientes Activos", value: activeCount, icon: Users },
    { title: "Revenue Este Mes", value: `$${revenue.toLocaleString()}`, icon: DollarSign },
    { title: "Comisión a OMEGA", value: `$${commission.toLocaleString()}`, icon: DollarSign },
    {
      title: "Próximo Pago",
      value: reseller?.payment_due_date
        ? new Date(reseller.payment_due_date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })
        : "—",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6 relative pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : branding?.logo_url ? (
          <img
            src={branding.logo_url}
            alt={reseller?.agency_name}
            className="h-10 max-w-[180px] object-contain"
          />
        ) : (
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {reseller?.agency_name || "Agencia"}
          </h1>
        )}
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
          Panel de Agencia
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
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

      {/* Status Banner */}
      {!isLoading && (
        <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${banner.className}`}>
          {banner.icon}
          <p className="text-sm font-medium">{banner.text}</p>
        </div>
      )}

      {/* Suspended overlay */}
      {banner.blocking && !isLoading && (
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
            <p className="text-destructive font-display font-bold text-lg">Acceso bloqueado</p>
          </div>
        </div>
      )}

      {/* Wrap content sections — if suspended, blur them */}
      <div className={banner.blocking && !isLoading ? "opacity-30 pointer-events-none select-none" : ""}>
        {/* Mis Clientes */}
        <Card className="glass mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Mis Clientes</CardTitle>
            <Button
              size="sm"
              className="gradient-primary text-primary-foreground"
              onClick={() => setAddClientOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Agregar Cliente
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Users className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">Aún no tienes clientes registrados</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                          {c.plan || "Básico"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            c.active
                              ? "bg-success/20 text-success border-success/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {c.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary"
                          onClick={() =>
                            toast({ title: "Próximamente", description: `Dashboard de ${c.name} en desarrollo.` })
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" /> Ver Dashboard
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Mi Equipo */}
        <Card className="glass mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Mi Equipo</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast({ title: "Próximamente", description: "Función disponible próximamente. Contacta a OMEGA para agregar agentes." })}
            >
              <UserPlus className="h-4 w-4 mr-1" /> Agregar Agente
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : agents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <UserCircle className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">Aún no tienes agentes registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {agents.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        a.status === "active"
                          ? "bg-success/20 text-success border-success/30 text-xs"
                          : "bg-muted text-muted-foreground text-xs"
                      }
                    >
                      {a.status === "active" ? "Activo" : a.status || "—"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mi Cuenta con OMEGA */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-display text-lg">Mi Cuenta con OMEGA</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-48" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={
                      status === "active"
                        ? "bg-success/20 text-success border-success/30"
                        : status === "suspended"
                        ? "bg-destructive/20 text-destructive border-destructive/30"
                        : "bg-warning/20 text-warning border-warning/30"
                    }
                  >
                    {status === "active" ? "Activo" : status === "suspended" ? "Suspendido" : "Advertencia"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Comisión Rate</p>
                  <p className="text-sm font-mono font-medium">
                    {((reseller?.omega_commission_rate || 0.3) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Días en Mora</p>
                  <p className={`text-sm font-mono font-medium ${(reseller?.days_overdue || 0) > 0 ? "text-destructive" : ""}`}>
                    {reseller?.days_overdue || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Próximo Pago</p>
                  <p className="text-sm font-mono font-medium">
                    {reseller?.payment_due_date
                      ? new Date(reseller.payment_due_date).toLocaleDateString("es-MX")
                      : "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddClientModal
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        resellerId={resellerId}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["reseller-dashboard", resellerId] })}
      />
    </div>
  );
}

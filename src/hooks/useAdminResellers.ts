import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Building2, DollarSign, AlertTriangle } from "lucide-react";

export interface Reseller {
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

export interface ResellersResponse {
  resellers: Reseller[];
  total: number;
  active: number;
  suspended: number;
  with_mora: number;
}

export const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-success/20 text-success border-success/30" },
  suspended: { label: "Suspendido", className: "bg-destructive/20 text-destructive border-destructive/30" },
  pending: { label: "Pendiente", className: "bg-warning/20 text-warning border-warning/30" },
  trial: { label: "Trial", className: "bg-chart-3/20 text-[hsl(var(--chart-3))] border-[hsl(var(--chart-3))]/30" },
};

export const emptyForm = { slug: "", agency_name: "", owner_email: "", owner_name: "" };

export function useAdminResellers() {
  const queryClient = useQueryClient();
  const [suspendTarget, setSuspendTarget] = useState<Reseller | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: apiResponse, isLoading } = useQuery<ResellersResponse>({
    queryKey: ["admin-resellers"],
    queryFn: () => api.getResellers().then((r: any) => {
      const source = r?.data ?? r;
      const list = Array.isArray(source) ? source : (source?.resellers ?? []);
      return {
        resellers: list,
        total: source?.count ?? source?.total ?? list.length,
        active: source?.active ?? list.filter((x: any) => x.status === 'active').length,
        suspended: source?.suspended ?? list.filter((x: any) => x.status === 'suspended').length,
        with_mora: source?.with_mora ?? list.filter((x: any) => (x.days_overdue ?? 0) > 7).length,
      };
    }),
    retry: 1,
  });

  const resellers = apiResponse?.resellers ?? [];

  const suspendMutation = useMutation({
    mutationFn: (reseller: Reseller) =>
      api.updateResellerStatus(reseller.id, {
        suspend_switch: !reseller.suspend_switch,
        status: reseller.suspend_switch ? "active" : "suspended",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resellers"] });
      toast({ title: "Estado actualizado" });
      setSuspendTarget(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo actualizar el estado.", variant: "destructive" });
      setSuspendTarget(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof emptyForm) => api.createReseller(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resellers"] });
      toast({ title: "Reseller creado", description: `${form.agency_name} registrado correctamente.` });
      setForm(emptyForm);
      setCreateOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Error al crear", description: err?.message || "Intenta de nuevo.", variant: "destructive" });
    },
  });

  const handleCreate = () => {
    if (!form.slug || !form.agency_name || !form.owner_email || !form.owner_name) {
      toast({ title: "Campos requeridos", description: "Completa todos los campos.", variant: "destructive" });
      return;
    }
    createMutation.mutate(form);
  };

  const totalRevenue = resellers.reduce((s, r) => s + (r.monthly_revenue_reported || 0), 0);
  const totalCommission = resellers.reduce(
    (s, r) => s + (r.monthly_revenue_reported || 0) * (r.omega_commission_rate || 0.3), 0
  );

  const kpis = [
    { title: "Total Resellers", value: apiResponse?.total ?? resellers.length, icon: Building2 },
    { title: "Revenue Reportado", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Comisión OMEGA", value: `$${totalCommission.toLocaleString()}`, icon: DollarSign },
    { title: "Con Mora", value: apiResponse?.with_mora ?? 0, icon: AlertTriangle },
  ];

  return {
    resellers, isLoading, apiResponse,
    suspendTarget, setSuspendTarget,
    createOpen, setCreateOpen,
    form, setForm,
    suspendMutation, createMutation,
    handleCreate, kpis,
  };
}

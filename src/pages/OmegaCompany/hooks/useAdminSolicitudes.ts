import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import type {
  SolicitudesListResponse,
  SolicitudActionResponse,
} from "../types/solicitudes";

const QK = "admin-solicitudes";

export function useAdminSolicitudes(statusFilter: string) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const query = useQuery<SolicitudesListResponse>({
    queryKey: [QK, statusFilter],
    queryFn: () => {
      const qs = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      return apiCall<SolicitudesListResponse>(
        `/admin/solicitudes/${qs}`
      );
    },
    retry: 1,
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) =>
      apiCall<SolicitudActionResponse>(
        `/admin/solicitudes/${id}/accept/`,
        "PATCH"
      ),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: [QK] });
      toast({
        title: `${res.data.item_name} activado`,
        description: `Stripe cobró $${res.data.monthly_price.toLocaleString()}/mes.`,
      });
    },
    onError: (err: Error) => {
      const isStripe = err.message.toLowerCase().includes("stripe");
      toast({
        title: isStripe ? "Error de pago" : "Error al procesar",
        description: isStripe ? err.message : "Intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const declineMutation = useMutation({
    mutationFn: (id: string) =>
      apiCall<SolicitudActionResponse>(
        `/admin/solicitudes/${id}/decline/`,
        "PATCH"
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK] });
      toast({ title: "Solicitud declinada" });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return {
    solicitudes: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    pendingCount: query.data?.pending_count ?? 0,
    monthlyRevenue: query.data?.monthly_revenue_upsell ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    accept: acceptMutation.mutateAsync,
    decline: declineMutation.mutateAsync,
    accepting: acceptMutation.isPending,
    declining: declineMutation.isPending,
  };
}

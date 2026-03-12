import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import type { ResellerUpsellPayload } from "../types";

export function useResellerUpsell() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: ResellerUpsellPayload) =>
      apiCall<{ success: boolean }>(
        "/upsell/solicitud/",
        "POST",
        payload as unknown as Record<string, unknown>
      ),
    onSuccess: (_data, vars) => {
      toast({
        title: "Solicitud enviada",
        description: `Solicitud enviada para ${vars.client_name}.`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error al enviar solicitud",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}

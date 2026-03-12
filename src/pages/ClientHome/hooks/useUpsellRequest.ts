import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import type { UpsellPayload } from "../types";

export function useUpsellRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpsellPayload) =>
      apiCall<{ success: boolean; message?: string }>(
        "/upsell/solicitud/",
        "POST",
        payload as unknown as Record<string, unknown>
      ),
    onSuccess: () => {
      toast({
        title: "Solicitud enviada",
        description: "Te contactaremos pronto.",
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

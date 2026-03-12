import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SolicitudResponse } from "../types/solicitudes";

interface Props {
  solicitud: SolicitudResponse | null;
  mode: "accept" | "decline";
  onConfirm: () => void;
  onCancel: () => void;
}

export function SolicitudConfirmModal({ solicitud, mode, onConfirm, onCancel }: Props) {
  if (!solicitud) return null;
  const isAccept = mode === "accept";

  return (
    <AlertDialog open={!!solicitud} onOpenChange={() => onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAccept ? "¿Confirmar cobro?" : "¿Declinar solicitud?"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm">
              {isAccept ? (
                <>
                  <p><strong>Cliente:</strong> {solicitud.client_name}</p>
                  <p><strong>Agente:</strong> {solicitud.item_name}</p>
                  <p><strong>Cobro mensual:</strong> ${solicitud.monthly_price.toLocaleString()}/mes</p>
                  <p><strong>Nuevo total:</strong> ${solicitud.new_monthly_total.toLocaleString()}/mes</p>
                  <p className="text-muted-foreground pt-1">
                    Stripe usará el método de pago ya registrado del cliente.
                  </p>
                </>
              ) : (
                <p>¿Estás seguro de que deseas declinar esta solicitud de <strong>{solicitud.client_name}</strong>?</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={isAccept ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"}
          >
            {isAccept ? "Confirmar y cobrar" : "Declinar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

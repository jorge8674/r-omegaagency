import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Mail, Loader2, User, Tag, DollarSign } from "lucide-react";
import type { SolicitudResponse } from "../types/solicitudes";
import { PLAN_LABELS, REQUEST_TYPE_LABELS } from "../types/solicitudes";

interface Props {
  solicitud: SolicitudResponse;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  accepting: boolean;
  declining: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "border-l-4 border-l-chart-4 bg-chart-4/5",
  accepted: "border-l-4 border-l-success bg-success/5",
  declined: "border-l-4 border-l-destructive bg-destructive/5",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-chart-4/20 text-chart-4 border-chart-4/30" },
  accepted: { label: "Aceptada", className: "bg-success/20 text-success border-success/30" },
  declined: { label: "Declinada", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function SolicitudCard({ solicitud, onAccept, onDecline, accepting, declining }: Props) {
  const s = solicitud;
  const badge = STATUS_BADGES[s.status] ?? STATUS_BADGES.pending;
  const timeAgo = formatDistanceToNow(new Date(s.created_at), { addSuffix: true, locale: es });

  return (
    <Card className={`rounded-xl shadow-sm ${STATUS_STYLES[s.status] ?? ""}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <Badge variant="outline" className="text-xs">{s.item_code}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InfoRow icon={User} label="Cliente" value={s.client_name} />
          <InfoRow icon={Mail} label="Email" value={s.client_email} />
          <InfoRow icon={Tag} label="Plan actual" value={PLAN_LABELS[s.current_plan] ?? s.current_plan} />
          <InfoRow icon={Tag} label="Tipo" value={REQUEST_TYPE_LABELS[s.request_type] ?? s.request_type} />
          <InfoRow icon={DollarSign} label="Solicita" value={s.item_name} />
          <InfoRow icon={DollarSign} label="Precio adicional" value={`$${s.monthly_price.toLocaleString()}/mes`} />
          <InfoRow icon={DollarSign} label="Nuevo total" value={`$${s.new_monthly_total.toLocaleString()}/mes`} />
        </div>

        {s.client_message && (
          <p className="text-sm italic text-muted-foreground border-l-2 border-border pl-3">
            "{s.client_message}"
          </p>
        )}

        {s.status === "pending" && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" onClick={() => onAccept(s.id)} disabled={accepting}>
              {accepting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
              Aceptar y cobrar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDecline(s.id)} disabled={declining}>
              {declining ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <X className="h-4 w-4 mr-1" />}
              Declinar
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={`mailto:${s.client_email}?subject=Tu solicitud de ${s.item_name} en OMEGA`}>
                <Mail className="h-4 w-4 mr-1" /> Contactar
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}

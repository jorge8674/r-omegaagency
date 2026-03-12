import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, BarChart2, Palette, MessageCircle } from "lucide-react";

interface Props {
  resellerId: string;
  onAddClient: () => void;
  onOpenNova: () => void;
}

export function QuickActions({ resellerId, onAddClient, onOpenNova }: Props) {
  const navigate = useNavigate();

  const actions = [
    { icon: UserPlus, label: "Nuevo Cliente", onClick: onAddClient },
    {
      icon: BarChart2,
      label: "Reportes Globales",
      onClick: () => navigate("/analytics"),
    },
    {
      icon: Palette,
      label: "Mi Branding",
      onClick: () => navigate(`/reseller/branding?reseller_id=${resellerId}`),
    },
    { icon: MessageCircle, label: "NOVA Panel Completo", onClick: onOpenNova },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((a) => (
        <Button
          key={a.label}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center gap-2 border-border/30 bg-card/50 hover:bg-card/80"
          onClick={a.onClick}
        >
          <a.icon className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium">{a.label}</span>
        </Button>
      ))}
    </div>
  );
}

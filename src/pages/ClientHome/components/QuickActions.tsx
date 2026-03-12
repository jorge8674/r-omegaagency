/* Block 6 — Quick Actions */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FeatureUsageData } from "../types";

interface Props {
  plan: string;
  usage: FeatureUsageData | undefined;
  onOpenNova: () => void;
}

export default function QuickActions({ plan, usage, onOpenNova }: Props) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Button
        size="lg"
        className="h-14 justify-start gap-3"
        onClick={() => navigate("/content-lab")}
      >
        <Sparkles className="h-5 w-5" /> Generar Contenido
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-14 justify-start gap-3"
        onClick={() => navigate("/calendar")}
      >
        <Calendar className="h-5 w-5" /> Ver Calendario
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-14 justify-start gap-3 relative"
        onClick={onOpenNova}
      >
        <MessageSquare className="h-5 w-5" /> Hablar con NOVA
        {plan === "basic" && usage && (
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {usage.msgs_used}/{usage.msgs_limit}
          </Badge>
        )}
      </Button>
    </div>
  );
}

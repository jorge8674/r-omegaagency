import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSolicitar: () => void;
}

export function LockOverlay({ onSolicitar }: Props) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-background/60 backdrop-blur-[2px]">
      <Lock className="h-5 w-5 text-muted-foreground" />
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs gap-1"
        onClick={(e) => {
          e.stopPropagation();
          onSolicitar();
        }}
      >
        Solicitar
      </Button>
    </div>
  );
}

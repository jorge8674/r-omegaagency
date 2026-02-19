import { Calendar, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  blockCount: number;
  onExpand: () => void;
}

export function ScheduleMinBar({ blockCount, onExpand }: Props) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Button onClick={onExpand} className="shadow-lg gap-2 px-6 rounded-full">
        <Calendar className="h-4 w-4" />
        Agendando ({blockCount} {blockCount === 1 ? "bloque" : "bloques"})
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}

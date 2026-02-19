import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCalendarBlocks } from "../hooks/useCalendarBlocks";
import type { ScheduleContentType } from "@/lib/api/calendar";

interface ScheduleModalProps {
  open: boolean;
  result: { generated_text: string; content_type: string };
  accountId: string;
  onClose: () => void;
}

const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

export function ScheduleModal({ open, result, accountId, onClose }: ScheduleModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("09:00");
  const { scheduleBlock, submitting } = useCalendarBlocks();

  const preview = result.generated_text.split("\n").slice(0, 3).join("\n").slice(0, 200);

  const handleSubmit = async (): Promise<void> => {
    if (!date) return;
    const ok = await scheduleBlock({
      account_id: accountId,
      content_type: (result.content_type === "image" ? "post" : result.content_type) as ScheduleContentType,
      text_content: result.generated_text,
      hashtags: [],
      scheduled_date: format(date, "yyyy-MM-dd"),
      scheduled_time: `${time}:00`,
    });
    if (ok) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" /> Agendar contenido
          </DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
          {preview}{result.generated_text.length > 200 && "…"}
        </div>

        {/* Date picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Selecciona fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Clock className="h-4 w-4" /> Hora
          </label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-60">
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!date || submitting}>
            {submitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            Enviar a Calendario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

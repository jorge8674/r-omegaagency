import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2, Minus, Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCalendarBlocks } from "@/pages/Calendar/hooks/useCalendarBlocks";
import { useToast } from "@/hooks/use-toast";
import { ScheduleBlockCard } from "./ScheduleBlockCard";
import type { ScheduleBlock } from "../hooks/useScheduleBlocks";
import type { ScheduleContentType } from "@/lib/api/calendar";

interface ScheduleModalProps {
  open: boolean;
  blocks: ScheduleBlock[];
  activeIndex: number;
  limits: { maxBlocks: number; maxItems: number };
  accountId: string;
  onSetActive: (i: number) => void;
  onConfirmBlock: (i: number) => void;
  onDeleteBlock: (i: number) => void;
  onRemoveItem: (blockIdx: number, itemIdx: number) => void;
  onCreateBlock: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onSuccess: () => void;
}

const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

export function ScheduleModal({
  open, blocks, activeIndex, limits, accountId,
  onSetActive, onConfirmBlock, onDeleteBlock, onRemoveItem,
  onCreateBlock, onMinimize, onClose, onSuccess,
}: ScheduleModalProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");
  const [expandedBlock, setExpandedBlock] = useState<number | null>(0);
  const { scheduleBlock, submitting } = useCalendarBlocks();

  const anyConfirmed = blocks.some(b => b.confirmed);

  const handleSubmit = async (): Promise<void> => {
    if (!accountId) {
      toast({ title: "Selecciona una cuenta social", variant: "destructive" });
      return;
    }
    if (!date) return;

    for (const block of blocks.filter(b => b.confirmed)) {
      const text = block.items.map(i => i.generated_text).join("\n\n---\n\n");
      const ct = (block.items[0]?.content_type || "post") as string;
      const ok = await scheduleBlock({
        account_id: accountId,
        content_type: (ct === "image" ? "post" : ct) as ScheduleContentType,
        text_content: text,
        hashtags: [],
        scheduled_date: format(date, "yyyy-MM-dd"),
        scheduled_time: `${time}:00`,
      });
      if (!ok) return;
    }
    onSuccess();
  };

  const canSubmit = anyConfirmed && !!date;
  const maxLabel = limits.maxBlocks === 999 ? "∞" : String(limits.maxBlocks);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> Agendar contenido
            </DialogTitle>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onMinimize}>
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Blocks section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Bloques ({blocks.length}/{maxLabel})
            </span>
            {blocks.length < limits.maxBlocks && (
              <Button variant="outline" size="sm" onClick={onCreateBlock}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Nuevo Bloque
              </Button>
            )}
          </div>

          {blocks.map((block, i) => (
            <ScheduleBlockCard
              key={block.id} block={block} index={i}
              maxItems={limits.maxItems} active={i === activeIndex}
              expanded={expandedBlock === i}
              onToggle={() => setExpandedBlock(p => (p === i ? null : i))}
              onActivate={() => onSetActive(i)}
              onConfirm={() => onConfirmBlock(i)}
              onDelete={() => onDeleteBlock(i)}
              onRemoveItem={(idx) => onRemoveItem(i, idx)}
            />
          ))}

          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Haz click en "Agendar" en un contenido para agregarlo aquí
            </p>
          )}
        </div>

        {/* Date & Time — visible only after confirmation */}
        {anyConfirmed && (
          <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-border/50">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(
                    "w-full justify-start text-left",
                    !date && "text-muted-foreground",
                  )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Selecciona fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single" selected={date} onSelect={setDate}
                    disabled={(d) => d < new Date()} initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" /> Hora
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Enviar a Calendario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Calendar as CalendarIcon, Loader2, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendarBlocks } from "@/pages/Calendar/hooks/useCalendarBlocks";
import { useToast } from "@/hooks/use-toast";
import { ScheduleBlockCard } from "./ScheduleBlockCard";
import type { ScheduleBlock } from "../hooks/useScheduleBlocks";
import type { ScheduleContentType } from "@/lib/api/calendar";
import { format } from "date-fns";

interface ScheduleModalProps {
  open: boolean;
  blocks: ScheduleBlock[];
  activeBlockId: string | null;
  limits: { maxBlocks: number; maxItems: number };
  planLabel: string;
  accountId: string;
  onSetActive: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onRemoveItem: (blockId: string, itemIdx: number) => void;
  onCreateBlock: () => void;
  onSetDateTime: (id: string, date?: string, time?: string) => void;
  onConfirmAll: () => void;
  onMarkSent: (id: string) => void;
  onMinimize: () => void;
  onClose: () => void;
}

const STEPS = ["Bloques", "Fecha/Hora", "Enviar"];

export function ScheduleModal({
  open, blocks, activeBlockId, limits, planLabel, accountId,
  onSetActive, onDeleteBlock, onRemoveItem, onCreateBlock,
  onSetDateTime, onConfirmAll, onMarkSent, onMinimize, onClose,
}: ScheduleModalProps) {
  const { toast } = useToast();
  const { scheduleBlock, submitting } = useCalendarBlocks();

  const allConfirmed = blocks.length > 0 && blocks.every(b => b.confirmed || b.items.length === 0);
  const allHaveDate = blocks.filter(b => b.confirmed).every(b => !!b.date);
  const currentStep = !allConfirmed ? 0 : !allHaveDate ? 1 : 2;

  const handleSend = async (): Promise<void> => {
    if (!accountId) {
      toast({ title: "Selecciona una cuenta social", variant: "destructive" });
      return;
    }
    const toSend = blocks.filter(b => b.confirmed && !b.sent && b.date);
    for (const block of toSend) {
      const text = block.items.map(i => i.generated_text).join("\n\n---\n\n");
      const ct = (block.items[0]?.content_type || "post") as string;
      const ok = await scheduleBlock({
        account_id: accountId,
        content_type: (ct === "image" ? "post" : ct) as ScheduleContentType,
        text_content: text,
        hashtags: [],
        scheduled_date: block.date!,
        scheduled_time: `${block.time}:00`,
      });
      if (!ok) return;
      onMarkSent(block.id);
    }
    toast({ title: "Bloques enviados al calendario ✓" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" /> Agendar contenido
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">{planLabel} · Paso {currentStep + 1} de 3</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onMinimize}>
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          {/* Stepper */}
          <div className="flex items-center gap-2 mt-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                  i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{i + 1}</span>
                <span className={cn("text-xs", i <= currentStep ? "text-foreground font-medium" : "text-muted-foreground")}>{s}</span>
                {i < STEPS.length - 1 && <span className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Blocks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bloques ({blocks.length}/{limits.maxBlocks === 999 ? "∞" : limits.maxBlocks})</span>
            {blocks.length < limits.maxBlocks && (
              <Button variant="outline" size="sm" onClick={onCreateBlock}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Nuevo Bloque
              </Button>
            )}
          </div>
          {blocks.map((block, i) => (
            <ScheduleBlockCard
              key={block.id} block={block} index={i}
              maxItems={limits.maxItems}
              isActive={block.id === activeBlockId}
              onActivate={() => onSetActive(block.id)}
              onDelete={() => onDeleteBlock(block.id)}
              onRemoveItem={(idx) => onRemoveItem(block.id, idx)}
              onDateChange={(d) => onSetDateTime(block.id, d)}
              onTimeChange={(t) => onSetDateTime(block.id, undefined, t)}
            />
          ))}
          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Haz click en "Agendar" en un contenido para agregarlo aquí
            </p>
          )}
        </div>

        {/* Footer — 2 CTAs */}
        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="secondary" className="flex-1"
            onClick={onConfirmAll}
            disabled={blocks.length === 0 || allConfirmed}
          >
            Confirmar Bloques
          </Button>
          <Button
            className="flex-1"
            onClick={handleSend}
            disabled={!allConfirmed || !allHaveDate || submitting}
          >
            {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Enviar a Calendario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

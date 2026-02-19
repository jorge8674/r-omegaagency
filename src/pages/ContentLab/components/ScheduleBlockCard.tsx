import { format } from "date-fns";
import { Trash2, Calendar as CalIcon, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ScheduleBlock } from "../hooks/useScheduleBlocks";

interface Props {
  block: ScheduleBlock;
  index: number;
  maxItems: number;
  isActive: boolean;
  onActivate: () => void;
  onDelete: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onDateChange: (date?: string) => void;
  onTimeChange: (time: string) => void;
}

const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

export function ScheduleBlockCard({
  block, index, maxItems, isActive,
  onActivate, onDelete, onRemoveItem, onDateChange, onTimeChange,
}: Props) {
  const filled = block.items.length;
  const dots = Array.from({ length: Math.min(maxItems, 10) }, (_, i) => i < filled);
  const dateObj = block.date ? new Date(block.date + "T00:00:00") : undefined;

  const borderClass = block.confirmed
    ? "border-accent ring-1 ring-accent/30"
    : isActive ? "border-primary ring-1 ring-primary/30" : "border-border/50";

  return (
    <div className={cn("rounded-lg border p-3 cursor-pointer transition-colors", borderClass)} onClick={onActivate}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Bloque {index + 1}</span>
          <span className="flex gap-0.5">
            {dots.map((f, i) => (
              <span key={i} className={cn("w-2 h-2 rounded-full", f ? "bg-primary" : "bg-muted-foreground/30")} />
            ))}
          </span>
          <span className="text-xs text-muted-foreground">{filled}/{maxItems === 999 ? "∞" : maxItems}</span>
          {block.confirmed && <span className="text-xs text-green-500 font-medium">✓</span>}
          {block.sent && <span className="text-xs text-blue-500 font-medium">Enviado</span>}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Expanded content — only when active */}
      {isActive && block.items.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-muted/30 rounded p-2 text-xs">
              <span className="flex-1 line-clamp-2 whitespace-pre-wrap">
                {item.content_type === "image" ? "🖼️ Imagen" : "📄"} {item.generated_text.slice(0, 120)}
                {item.generated_text.length > 120 && "…"}
              </span>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 shrink-0 text-destructive" onClick={(e) => { e.stopPropagation(); onRemoveItem(i); }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Date/time — expanded if active, summary if not */}
      {isActive ? (
        <div className="mt-3 grid sm:grid-cols-2 gap-3 border-t border-border/30 pt-3" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1"><CalIcon className="h-3 w-3" /> Fecha</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("w-full justify-start text-left text-xs", !dateObj && "text-muted-foreground")}>
                  {dateObj ? format(dateObj, "PPP") : "Seleccionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateObj} onSelect={(d) => onDateChange(d ? format(d, "yyyy-MM-dd") : undefined)} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> Hora</label>
            <Select value={block.time} onValueChange={onTimeChange}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-60">
                {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : block.date ? (
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          <CalIcon className="h-3 w-3" /> {block.date} <Clock className="h-3 w-3 ml-1" /> {block.time}
        </p>
      ) : null}
    </div>
  );
}

import { ChevronDown, ChevronUp, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScheduleBlock } from "../hooks/useScheduleBlocks";

interface Props {
  block: ScheduleBlock;
  index: number;
  maxItems: number;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onActivate: () => void;
  onConfirm: () => void;
  onDelete: () => void;
  onRemoveItem: (itemIndex: number) => void;
}

export function ScheduleBlockCard({
  block, index, maxItems, active, expanded,
  onToggle, onActivate, onConfirm, onDelete, onRemoveItem,
}: Props) {
  const filled = block.items.length;
  const dots = Array.from({ length: Math.min(maxItems, 10) }, (_, i) => i < filled);

  return (
    <div
      className={`rounded-lg border p-3 cursor-pointer transition-colors ${
        active ? "border-primary bg-primary/5" : "border-border/50"
      } ${block.confirmed ? "ring-1 ring-green-500/30" : ""}`}
      onClick={onActivate}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Bloque {index + 1}</span>
          <span className="flex gap-0.5">
            {dots.map((f, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${f ? "bg-primary" : "bg-muted-foreground/30"}`}
              />
            ))}
          </span>
          <span className="text-xs text-muted-foreground">
            {filled}/{maxItems === 999 ? "∞" : maxItems}
          </span>
          {block.confirmed && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
        </div>

        <div className="flex items-center gap-1">
          {!block.confirmed && (
            <Button
              variant="ghost" size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => { e.stopPropagation(); onConfirm(); }}
            >
              ✓ Confirmar
            </Button>
          )}
          <Button
            variant="ghost" size="sm"
            className="h-6 w-6 p-0 text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <button
            className="p-0.5"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && block.items.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-muted/30 rounded p-2 text-xs">
              <span className="flex-1 line-clamp-2 whitespace-pre-wrap">
                {item.generated_text.slice(0, 120)}
                {item.generated_text.length > 120 && "…"}
              </span>
              <Button
                variant="ghost" size="sm"
                className="h-5 w-5 p-0 shrink-0 text-destructive"
                onClick={(e) => { e.stopPropagation(); onRemoveItem(i); }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Incomplete warning */}
      {block.confirmed && filled < maxItems && (
        <p className="text-[10px] text-muted-foreground mt-1">
          ⚠ Bloque confirmado con {maxItems - filled} espacio(s) libre(s)
        </p>
      )}
    </div>
  );
}

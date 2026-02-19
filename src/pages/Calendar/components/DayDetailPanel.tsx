import { useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCalendarBlocks } from "../hooks/useCalendarBlocks";
import { STATUS_LABELS } from "../types";

interface DayDetailPanelProps {
  open: boolean;
  date: Date;
  accountId?: string;
  onClose: () => void;
  onRefresh: () => void;
}

export function DayDetailPanel({ open, date, accountId, onClose, onRefresh }: DayDetailPanelProps) {
  const { blocks, blocksLoading, fetchBlocks, confirmBlock, deleteBlock } = useCalendarBlocks();

  useEffect(() => {
    if (open) {
      const d = format(date, "yyyy-MM-dd");
      fetchBlocks(accountId, d, d);
    }
  }, [open, date, accountId, fetchBlocks]);

  const handleConfirm = async (id: string): Promise<void> => {
    const ok = await confirmBlock(id);
    if (ok) {
      const d = format(date, "yyyy-MM-dd");
      fetchBlocks(accountId, d, d);
      onRefresh();
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const ok = await deleteBlock(id);
    if (ok) {
      const d = format(date, "yyyy-MM-dd");
      fetchBlocks(accountId, d, d);
      onRefresh();
    }
  };

  const statusVariant = (s: string) => {
    if (s === "published") return "default" as const;
    if (s === "scheduled") return "secondary" as const;
    if (s === "failed") return "destructive" as const;
    return "outline" as const;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {format(date, "EEEE d MMMM yyyy", { locale: es })}
          </DialogTitle>
        </DialogHeader>

        {blocksLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No hay bloques para este día
          </p>
        ) : (
          <div className="space-y-3">
            {blocks.map((block) => (
              <div key={block.id} className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {block.scheduled_time?.slice(0, 5) ?? "--:--"} · {block.content_type}
                  </span>
                  <Badge variant={statusVariant(block.status)}>
                    {STATUS_LABELS[block.status] ?? block.status}
                  </Badge>
                </div>
                <p className="text-sm line-clamp-3 whitespace-pre-wrap">
                  {block.text_content}
                </p>
                <div className="flex gap-2 justify-end">
                  {block.status === "draft" && (
                    <Button size="sm" variant="outline" onClick={() => handleConfirm(block.id)}>
                      <CheckCircle className="mr-1 h-3.5 w-3.5" /> Confirmar
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(block.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

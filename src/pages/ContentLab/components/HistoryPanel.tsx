import { Bookmark } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ContentTypeIcon } from "@/components/icons/ContentTypeIcon";
import type { ContentType, GeneratedContent } from "@/lib/api/contentLab";

interface HistoryPanelProps {
  history: GeneratedContent[];
  onSelect: (item: GeneratedContent) => void;
}

export function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
      <h3 className="font-semibold text-sm">Historial reciente</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <span className="shrink-0">
              <ContentTypeIcon type={item.content_type as ContentType} size={16} className="text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.prompt}</p>
              <p className="text-xs text-muted-foreground truncate">
                {item.generated_text.slice(0, 80)}...
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {item.is_saved && <Bookmark className="h-3.5 w-3.5 fill-current text-primary" />}
              <PlatformIcon platform={item.platform || ""} size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Copy, Bookmark, RotateCcw, Trash2, CheckCircle,
  Download, Sparkles, Calendar as CalendarIcon,
} from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ContentTypeIcon } from "@/components/icons/ContentTypeIcon";
import { CONTENT_TYPE_LABELS, type ContentType, type GeneratedContent } from "@/lib/api/contentLab";

interface ResultPanelProps {
  result: GeneratedContent | null;
  copied: boolean;
  isGenerating: boolean;
  onCopy: () => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: () => void;
}

export function ResultPanel({
  result, copied, isGenerating,
  onCopy, onSave, onDelete, onRegenerate,
}: ResultPanelProps) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="rounded-lg border border-dashed border-border/50 bg-card/50 p-12 text-center">
        <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          Selecciona una cuenta, elige el tipo de contenido<br />y escribe el tema para generar
        </p>
      </div>
    );
  }

  const isImage = result.content_type === "image";
  const typeLabel = CONTENT_TYPE_LABELS[result.content_type as ContentType]?.label;

  const handleSchedule = (): void => {
    const params = new URLSearchParams({
      content_id: result.id,
      account_id: result.account_id || "",
      content_type: isImage ? "post" : result.content_type,
      text: result.generated_text.slice(0, 500),
    });
    navigate(`/calendar?tab=schedule&${params.toString()}`);
  };

  const scheduleButton = (
    <Button variant="outline" size="sm" onClick={handleSchedule} disabled={!result.account_id}>
      <CalendarIcon className="mr-1 h-4 w-4" /> Agendar
    </Button>
  );

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={result.content_type as ContentType} size={16} className="text-primary" />
          <span className="font-semibold capitalize">{typeLabel}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <PlatformIcon platform={result.platform || ""} size={12} /> {result.platform}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{result.tokens_used} tokens</span>
      </div>

      {isImage ? (
        <div className="space-y-3">
          <img src={result.generated_text} alt="AI Generated" className="w-full rounded-lg border border-border/50" loading="lazy" />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onCopy}>
              {copied ? <CheckCircle className="mr-1 h-4 w-4 text-green-500" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied ? "Copiado" : "Copiar URL"}
            </Button>
            <a href={result.generated_text} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Descargar</Button>
            </a>
            {scheduleButton}
            <Button variant="outline" size="sm" onClick={() => onSave(result.id)}>
              <Bookmark className={`mr-1 h-4 w-4 ${result.is_saved ? "fill-current" : ""}`} />
              {result.is_saved ? "Guardado" : "Guardar"}
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive ml-auto" onClick={() => onDelete(result.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed">
            {result.generated_text}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onCopy}>
              {copied ? <CheckCircle className="mr-1 h-4 w-4 text-green-500" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            {scheduleButton}
            <Button variant="outline" size="sm" onClick={() => onSave(result.id)}>
              <Bookmark className={`mr-1 h-4 w-4 ${result.is_saved ? "fill-current" : ""}`} />
              {result.is_saved ? "Guardado" : "Guardar"}
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isGenerating}>
              <RotateCcw className="mr-1 h-4 w-4" /> Regenerar
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive ml-auto" onClick={() => onDelete(result.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

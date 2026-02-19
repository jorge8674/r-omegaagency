import { Button } from "@/components/ui/button";
import {
  Copy, Bookmark, RotateCcw, Trash2, CheckCircle,
  Download, Calendar as CalendarIcon,
  Lightbulb, TrendingUp, Flame, Loader2,
} from "lucide-react";
import type { GeneratedContent } from "@/lib/api/contentLab";
import type { AnalysisType } from "../hooks/useResultAnalysis";

interface ResultActionsProps {
  result: GeneratedContent;
  copied: boolean;
  isGenerating: boolean;
  analysisLoading: AnalysisType | null;
  onCopy: () => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: () => void;
  onAnalysis: (type: AnalysisType) => void;
  onSchedule: () => void;
}

const ANALYSIS_BUTTONS: { type: AnalysisType; label: string; icon: typeof Lightbulb }[] = [
  { type: "insight", label: "Insight", icon: Lightbulb },
  { type: "forecast", label: "Forecast", icon: TrendingUp },
  { type: "virality", label: "Viralidad", icon: Flame },
];

export function ResultActions({
  result, copied, isGenerating, analysisLoading,
  onCopy, onSave, onDelete, onRegenerate, onAnalysis, onSchedule,
}: ResultActionsProps) {
  const isImage = result.content_type === "image";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Copy */}
      <Button variant="outline" size="sm" onClick={onCopy}>
        {copied
          ? <CheckCircle className="mr-1 h-4 w-4 text-primary" />
          : <Copy className="mr-1 h-4 w-4" />}
        {copied ? "Copiado" : isImage ? "Copiar URL" : "Copiar"}
      </Button>

      {/* Download (image only) */}
      {isImage && (
        <a href={result.generated_text} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" /> Descargar
          </Button>
        </a>
      )}

      {/* Analysis buttons */}
      {ANALYSIS_BUTTONS.map(({ type, label, icon: Icon }) => (
        <Button
          key={type} variant="outline" size="sm"
          onClick={() => onAnalysis(type)}
          disabled={analysisLoading !== null}
        >
          {analysisLoading === type
            ? <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            : <Icon className="mr-1 h-4 w-4" />}
          {label}
        </Button>
      ))}

      {/* Schedule — calls parent handler */}
      <Button variant="outline" size="sm" onClick={onSchedule}>
        <CalendarIcon className="mr-1 h-4 w-4" /> Agendar
      </Button>

      {/* Save */}
      <Button variant="outline" size="sm" onClick={() => onSave(result.id)}>
        <Bookmark className={`mr-1 h-4 w-4 ${result.is_saved ? "fill-current" : ""}`} />
        {result.is_saved ? "Guardado" : "Guardar"}
      </Button>

      {/* Regenerate (text only) */}
      {!isImage && (
        <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isGenerating}>
          <RotateCcw className="mr-1 h-4 w-4" /> Regenerar
        </Button>
      )}

      {/* Delete */}
      <Button
        variant="ghost" size="sm"
        className="text-destructive hover:text-destructive ml-auto"
        onClick={() => onDelete(result.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

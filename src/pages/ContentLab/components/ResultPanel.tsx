import { useState } from "react";
import { Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ContentTypeIcon } from "@/components/icons/ContentTypeIcon";
import { CONTENT_TYPE_LABELS, type ContentType, type GeneratedContent } from "@/lib/api/contentLab";
import { ResultActions } from "./ResultActions";
import { useResultAnalysis, type AnalysisType } from "../hooks/useResultAnalysis";

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
  const { analysisLoading, analysisResults, runAnalysis } = useResultAnalysis();
  const [expandedAnalysis, setExpandedAnalysis] = useState<AnalysisType | null>(null);

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

  const handleAnalysis = (type: AnalysisType): void => {
    if (analysisResults[type]) {
      setExpandedAnalysis(prev => (prev === type ? null : type));
      return;
    }
    runAnalysis(type, result.generated_text, result.platform || "instagram", result.content_type);
    setExpandedAnalysis(type);
  };

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
      {/* Header */}
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

      {/* Content */}
      {isImage ? (
        <img src={result.generated_text} alt="AI Generated" className="w-full rounded-lg border border-border/50" loading="lazy" />
      ) : (
        <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed">
          {result.generated_text}
        </div>
      )}

      {/* Actions */}
      <ResultActions
        result={result}
        copied={copied}
        isGenerating={isGenerating}
        analysisLoading={analysisLoading}
        onCopy={onCopy}
        onSave={onSave}
        onDelete={onDelete}
        onRegenerate={onRegenerate}
        onAnalysis={handleAnalysis}
      />

      {/* Analysis result */}
      {expandedAnalysis && analysisResults[expandedAnalysis] && (
        <div className="bg-muted/20 rounded-lg p-3 text-xs whitespace-pre-wrap border border-border/30 max-h-60 overflow-y-auto">
          <span className="font-semibold text-primary capitalize">{expandedAnalysis}:</span>
          <pre className="mt-1 text-muted-foreground">{analysisResults[expandedAnalysis]}</pre>
        </div>
      )}
    </div>
  );
}

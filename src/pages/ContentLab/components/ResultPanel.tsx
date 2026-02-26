import { Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ContentTypeIcon } from "@/components/icons/ContentTypeIcon";
import { CONTENT_TYPE_LABELS, FALLBACK_AGENTS, type ContentType, type GeneratedContent } from "@/lib/api/contentLab";
import { ResultActions } from "./ResultActions";
import { VideoResult } from "./VideoResult";
import { useResultAnalysis, type AnalysisType } from "../hooks/useResultAnalysis";
import { ForecastDisplay, ViralityDisplay, InsightDisplay } from "./AnalysisDisplay";

interface ResultPanelProps {
  result: GeneratedContent | null;
  copied: boolean;
  isGenerating: boolean;
  onCopy: () => void;
  onDelete: (id: string) => void;
  onRegenerate: () => void;
  onSchedule?: () => void;
}

export function ResultPanel({
  result, copied, isGenerating,
  onCopy, onDelete, onRegenerate, onSchedule,
}: ResultPanelProps) {
  const { analysisLoading, analysisResults, runAnalysis } = useResultAnalysis();
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
  const isVideo = result.content_type === "video";
  const meta = CONTENT_TYPE_LABELS[result.content_type as ContentType];
  const typeLabel = meta?.label ?? result.content_type;

  const handleAnalysis = (type: AnalysisType): void => {
    if (analysisResults[type]) return;
    runAnalysis(type, result.generated_text, result.platform || "instagram", result.content_type);
  };

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={result.content_type as ContentType} size={16} className="text-primary" />
          <span className="font-semibold">{typeLabel}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <PlatformIcon platform={result.platform || ""} size={12} /> {result.platform}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {(() => {
            const r = result as GeneratedContent & { agent?: string; model_used?: string; mode?: string };
            const parts: string[] = [];
            if (isImage) {
              parts.push(r.mode === "edit" ? "✏️ Editado con GPT-Image-1" : "🎨 Generado con DALL-E 3");
            } else {
              const agent = FALLBACK_AGENTS.find(a => a.id === r.agent);
              if (agent) parts.push(`${agent.emoji} ${agent.name}`);
              if (r.model_used) parts.push(r.model_used);
            }
            if (r.tokens_used) parts.push(`${r.tokens_used} tokens`);
            return parts.join(" · ") || `${r.tokens_used} tokens`;
          })()}
        </span>
      </div>

      {isVideo ? (
        <VideoResult videoUrl={result.generated_text} />
      ) : isImage ? (
        <img src={result.generated_text} alt="AI Generated" className="w-full rounded-lg border border-border/50" loading="lazy" />
      ) : (
        <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed">
          {result.generated_text}
        </div>
      )}

      <ResultActions
        result={result} copied={copied} isGenerating={isGenerating}
        analysisLoading={analysisLoading}
        onCopy={onCopy} onDelete={onDelete}
        onRegenerate={onRegenerate} onAnalysis={handleAnalysis}
        onSchedule={onSchedule || (() => {})}
      />

      <div className="space-y-2">
        {analysisResults.insight && <InsightDisplay data={analysisResults.insight as Record<string, unknown>} />}
        {analysisResults.forecast && <ForecastDisplay data={analysisResults.forecast as Record<string, unknown>} />}
        {analysisResults.virality && <ViralityDisplay data={analysisResults.virality as Record<string, unknown>} />}
      </div>
    </div>
  );
}

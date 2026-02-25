import { BarChart3, Flame, Lightbulb, Heart, MessageCircle, Share2, Eye, TrendingUp } from "lucide-react";
// Badge used by ForecastDisplay and ViralityDisplay
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/* ---------- Forecast ---------- */
interface ForecastData {
  predicted_engagement?: { likes?: number; comments?: number; shares?: number; reach?: number; engagement_rate?: number };
  ai_prediction?: string;
  confidence_level?: string;
}

export function ForecastDisplay({ data }: { data: ForecastData }) {
  const e = data.predicted_engagement ?? {};
  const fmt = (n?: number) => (n ?? 0).toLocaleString();

  return (
    <div className="rounded-lg border border-border/40 bg-card p-4 space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-primary" /> Predicción de Engagement
        </span>
        {data.confidence_level && (
          <Badge variant="outline" className="text-xs capitalize">{data.confidence_level}</Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat icon={Heart} label="Likes" value={fmt(e.likes)} />
        <Stat icon={MessageCircle} label="Comments" value={fmt(e.comments)} />
        <Stat icon={Share2} label="Shares" value={fmt(e.shares)} />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {fmt(e.reach)} alcance</span>
        <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {(e.engagement_rate ?? 0).toFixed(1)}% engagement</span>
      </div>

      {data.ai_prediction && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-2">{data.ai_prediction}</p>
      )}
    </div>
  );
}

/* ---------- Virality ---------- */
interface ViralityData {
  virality_score?: number;
  virality_level?: string;
  ai_analysis?: string;
  key_factors?: Record<string, number>;
  recommendations?: string[];
}

export function ViralityDisplay({ data }: { data: ViralityData }) {
  const score = data.virality_score ?? 0;
  const factors = data.key_factors ?? {};

  return (
    <div className="rounded-lg border border-border/40 bg-card p-4 space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-orange-500" /> Potencial Viral
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Score: {score.toFixed(1)}</span>
          {data.virality_level && <Badge variant="outline" className="text-xs capitalize">{data.virality_level}</Badge>}
        </div>
      </div>

      {Object.keys(factors).length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Factores clave</span>
          {Object.entries(factors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs w-28 truncate capitalize">{key.replace(/_/g, " ")}</span>
              <Progress value={Math.min(val * 100, 100)} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(val * 100)}%</span>
            </div>
          ))}
        </div>
      )}

      {data.recommendations && data.recommendations.length > 0 && (
        <div className="border-t border-border/30 pt-2 space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Recomendaciones</span>
          <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
            {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {data.ai_analysis && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-2">{data.ai_analysis}</p>
      )}
    </div>
  );
}

/* ---------- Insight ---------- */
interface InsightData {
  insights?: string;
  ai_analysis?: string;
  content_metrics?: { length?: number; estimated_read_time_seconds?: number };
  [key: string]: unknown;
}

export function InsightDisplay({ data }: { data: InsightData }) {
  const metrics = data.content_metrics;

  return (
    <div className="rounded-lg border border-border/40 bg-card p-4 space-y-3 text-sm">
      <span className="font-semibold flex items-center gap-1.5">
        <Lightbulb className="h-4 w-4 text-yellow-500" /> Insight
      </span>

      {metrics && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{metrics.length?.toLocaleString()} caracteres</span>
          {metrics.estimated_read_time_seconds != null && (
            <span>~{Math.ceil(metrics.estimated_read_time_seconds / 60)} min lectura</span>
          )}
        </div>
      )}

      {data.insights && (
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-border/30">
          {data.insights}
        </div>
      )}

      {data.ai_analysis && (
        <div className="border-t border-border/30 pt-2 space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Análisis IA</span>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.ai_analysis}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function Stat({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/30 p-2">
      <Icon className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-0.5" />
      <span className="block font-semibold">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

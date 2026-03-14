import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, TrendingUp } from "lucide-react";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin", "youtube"];

interface TrendsTabProps {
  trendNiche: string;
  setTrendNiche: (v: string) => void;
  trendPlatform: string;
  setTrendPlatform: (v: string) => void;
  analyzingTrends: boolean;
  trendsResult: any;
  viralContent: string;
  setViralContent: (v: string) => void;
  predictingVirality: boolean;
  viralResult: any;
  onAnalyzeTrends: () => void;
  onPredictVirality: () => void;
}

export function TrendsTab({
  trendNiche, setTrendNiche, trendPlatform, setTrendPlatform,
  analyzingTrends, trendsResult, viralContent, setViralContent,
  predictingVirality, viralResult, onAnalyzeTrends, onPredictVirality,
}: TrendsTabProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Análisis de Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-sm">Nicho</Label>
            <Input value={trendNiche} onChange={(e) => setTrendNiche(e.target.value)} placeholder="ej: fitness, moda..." />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Plataforma</Label>
            <Select value={trendPlatform} onValueChange={setTrendPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="w-full gradient-primary" onClick={onAnalyzeTrends} disabled={analyzingTrends || !trendNiche}>
          {analyzingTrends && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analizar Trends
        </Button>
        {trendsResult && (
          <div className="space-y-3 mt-4">
            {(trendsResult.data || trendsResult || []).map((t: any, i: number) => (
              <div key={i} className="bg-secondary/30 rounded-lg p-3 flex items-start justify-between">
                <div>
                  <p className="font-medium capitalize">{t.topic}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.content_angle}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {t.relevant_hashtags?.map((h: string, j: number) => (
                      <span key={j} className="text-xs text-primary">{h}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold text-primary-foreground ${
                    t.velocity === 'rising' ? 'bg-green-600' :
                    t.velocity === 'peak' ? 'bg-yellow-600' : 'bg-muted'
                  }`}>
                    {t.velocity?.toUpperCase()}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Score: {(t.trend_score * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-border pt-3 space-y-3">
          <Label className="text-sm">Predecir Viralidad</Label>
          <Textarea placeholder="Describe tu contenido..." value={viralContent} onChange={(e) => setViralContent(e.target.value)} rows={2} />
          <Button variant="outline" className="w-full" onClick={onPredictVirality} disabled={predictingVirality || !viralContent}>
            {predictingVirality && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predecir Viralidad
          </Button>
          {viralResult && (() => {
            const v = viralResult?.data || viralResult;
            return (
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 rounded-full px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-primary">{((v.virality_score || 0) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">Virality Score</p>
                  </div>
                  <div className="bg-secondary/30 rounded-full px-4 py-2 text-center">
                    <p className="text-2xl font-bold">{v.predicted_reach_multiplier || 0}x</p>
                    <p className="text-xs text-muted-foreground">Reach Multiplier</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-primary mb-2">✅ Factores de éxito</p>
                    {v.key_success_factors?.map((f: string, i: number) => <p key={i} className="text-sm">• {f}</p>)}
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-destructive mb-2">⚠️ Riesgos</p>
                    {v.risk_factors?.map((r: string, i: number) => <p key={i} className="text-sm">• {r}</p>)}
                  </div>
                </div>
                {v.platform_fit && (
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">Platform Fit</p>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(v.platform_fit).map(([platform, score]: [string, any]) => (
                        <div key={platform} className="text-center">
                          <p className="text-sm font-bold capitalize">{platform}</p>
                          <p className="text-xs text-primary">{((score || 0) * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}

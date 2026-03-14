import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin", "youtube"];

interface CompetitorsTabProps {
  competitorName: string;
  setCompetitorName: (v: string) => void;
  competitorPlatform: string;
  setCompetitorPlatform: (v: string) => void;
  competitorData: string;
  setCompetitorData: (v: string) => void;
  analyzingCompetitor: boolean;
  competitorResult: any;
  benchmarking: boolean;
  benchmarkResult: any;
  identifyingGaps: boolean;
  gapsResult: any;
  onAnalyze: () => void;
  onBenchmark: () => void;
  onGaps: () => void;
}

export function CompetitorsTab({
  competitorName, setCompetitorName, competitorPlatform, setCompetitorPlatform,
  competitorData, setCompetitorData, analyzingCompetitor, competitorResult,
  benchmarking, benchmarkResult, identifyingGaps, gapsResult,
  onAnalyze, onBenchmark, onGaps,
}: CompetitorsTabProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Analizar Competidor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-sm">Nombre</Label>
            <Input value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder="@competidor" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Plataforma</Label>
            <Select value={competitorPlatform} onValueChange={setCompetitorPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Textarea placeholder="Datos observados (opcional)..." value={competitorData} onChange={(e) => setCompetitorData(e.target.value)} rows={3} />
        <Button className="w-full gradient-primary" onClick={onAnalyze} disabled={analyzingCompetitor || !competitorName}>
          {analyzingCompetitor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analizar Competidor
        </Button>
        {competitorResult && (() => {
          const cr = competitorResult?.data || competitorResult;
          return (
            <div className="space-y-4 mt-4">
              <div className="flex gap-3 flex-wrap">
                <span className="px-3 py-1 bg-primary rounded text-sm font-bold text-primary-foreground">{cr.competitor_name}</span>
                <span className="px-3 py-1 bg-secondary rounded text-sm text-secondary-foreground">📅 {cr.posting_frequency}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Tipos de contenido</p>
                  {cr.content_types?.map((t: string, i: number) => <span key={i} className="block text-sm">• {t}</span>)}
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Top Hashtags</p>
                  {cr.top_hashtags?.map((h: string, i: number) => <span key={i} className="block text-sm text-primary">• {h}</span>)}
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Temas que funcionan</p>
                  {cr.best_performing_topics?.map((t: string, i: number) => <span key={i} className="block text-sm">• {t}</span>)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onBenchmark} disabled={benchmarking}>
                  {benchmarking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Benchmark
                </Button>
                <Button variant="outline" className="flex-1" onClick={onGaps} disabled={identifyingGaps}>
                  {identifyingGaps && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Content Gaps
                </Button>
              </div>
            </div>
          );
        })()}
        {benchmarkResult && (() => {
          const b = benchmarkResult?.data || benchmarkResult;
          return (
            <div className="space-y-4 mt-4">
              <div className="flex gap-3 flex-wrap items-center">
                <span className="px-3 py-1 bg-primary rounded text-sm font-bold text-primary-foreground">{b.client_name} vs {b.competitor_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Tus métricas</p>
                  <p className="text-sm">Followers: <span className="font-bold">{b.client_metrics?.followers?.toLocaleString()}</span></p>
                  <p className="text-sm">Engagement: <span className="font-bold">{((b.client_metrics?.engagement_rate || 0) * 100).toFixed(1)}%</span></p>
                  <p className="text-sm">Frecuencia: <span className="font-bold">{b.client_metrics?.posting_frequency}/sem</span></p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Competidor</p>
                  <p className="text-sm">Followers: <span className="font-bold">{b.competitor_metrics?.followers?.toLocaleString()}</span></p>
                  <p className="text-sm">Engagement: <span className="font-bold">{((b.competitor_metrics?.engagement_rate || 0) * 100).toFixed(1)}%</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-primary mb-2">💪 Tus ventajas</p>
                  {b.client_advantages?.map((a: string, i: number) => <p key={i} className="text-sm">• {a}</p>)}
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-destructive mb-2">⚡ Ventajas del competidor</p>
                  {b.competitor_advantages?.map((a: string, i: number) => <p key={i} className="text-sm">• {a}</p>)}
                </div>
              </div>
              {b.opportunities?.length > 0 && (
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-primary mb-2">🚀 Oportunidades</p>
                  <div className="flex gap-2 flex-wrap">
                    {b.opportunities.map((o: string, i: number) => <Badge key={i} variant="secondary">{o}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        {gapsResult && (() => {
          const g = gapsResult?.data || gapsResult;
          return (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-primary mb-2">✅ Oportunidades sin explotar</p>
                  {g.untapped_opportunities?.map((o: string, i: number) => <p key={i} className="text-sm">• {o}</p>)}
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-primary mb-2">📌 Pilares recomendados</p>
                  {g.recommended_content_pillars?.map((p: string, i: number) => <p key={i} className="text-sm">• {p}</p>)}
                </div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  Tamaño de oportunidad: <span className="text-primary ml-1 font-bold">{g.estimated_opportunity_size?.toUpperCase()}</span>
                </p>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}

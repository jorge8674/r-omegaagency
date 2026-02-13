import { useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, TrendingUp, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin", "youtube"];

export default function Competitive() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Competitors tab
  const [competitorName, setCompetitorName] = useState("");
  const [competitorPlatform, setCompetitorPlatform] = useState("instagram");
  const [competitorData, setCompetitorData] = useState("");
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);
  const [competitorResult, setCompetitorResult] = useState<any>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);
  const [identifyingGaps, setIdentifyingGaps] = useState(false);
  const [gapsResult, setGapsResult] = useState<any>(null);

  // Trends tab
  const [trendNiche, setTrendNiche] = useState("");
  const [trendPlatform, setTrendPlatform] = useState("instagram");
  const [analyzingTrends, setAnalyzingTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<any>(null);
  const [viralContent, setViralContent] = useState("");
  const [predictingVirality, setPredictingVirality] = useState(false);
  const [viralResult, setViralResult] = useState<any>(null);

  // Opportunities tab
  const [findingOpps, setFindingOpps] = useState(false);
  const [oppsResult, setOppsResult] = useState<any>(null);

  const handleAnalyzeCompetitor = async () => {
    setAnalyzingCompetitor(true);
    try {
      const result = await api.analyzeCompetitor(competitorName, competitorPlatform, competitorData || '');
      setCompetitorResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzingCompetitor(false);
    }
  };

  const handleBenchmark = async () => {
    setBenchmarking(true);
    try {
      const result = await api.generateBenchmark({ competitor: competitorResult, platform: competitorPlatform });
      setBenchmarkResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setBenchmarking(false);
    }
  };

  const handleGaps = async () => {
    setIdentifyingGaps(true);
    try {
      const result = await api.identifyGaps({ competitor: competitorResult, platform: competitorPlatform });
      setGapsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIdentifyingGaps(false);
    }
  };

  const handleAnalyzeTrends = async () => {
    setAnalyzingTrends(true);
    try {
      const result = await api.analyzeTrends({ niche: trendNiche, platform: trendPlatform });
      setTrendsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzingTrends(false);
    }
  };

  const handlePredictVirality = async () => {
    setPredictingVirality(true);
    try {
      const result = await api.predictVirality(viralContent, trendPlatform);
      setViralResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPredictingVirality(false);
    }
  };

  const handleFindOpportunities = async () => {
    setFindingOpps(true);
    try {
      const result = await api.findOpportunities({ niche: trendNiche || "social media", platform: trendPlatform });
      setOppsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFindingOpps(false);
    }
  };

  const ResultBlock = ({ data }: { data: any }) => (
    <div className="rounded-lg bg-secondary/50 p-3 mt-3">
      <pre className="text-sm whitespace-pre-wrap overflow-x-auto">{typeof data === "string" ? data : JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Competitive Intelligence</h1>
        <p className="text-muted-foreground">Análisis de competidores, trends y oportunidades</p>
      </div>

      <Tabs defaultValue="competitors">
        <TabsList>
          <TabsTrigger value="competitors">Competidores</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-4 mt-4">
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
              <Button className="w-full gradient-primary" onClick={handleAnalyzeCompetitor} disabled={analyzingCompetitor || !competitorName}>
                {analyzingCompetitor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analizar Competidor
              </Button>
              {competitorResult && (() => {
                const cr = competitorResult?.data || competitorResult;
                return (
                  <div className="space-y-4 mt-4">
                    <div className="flex gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-primary rounded text-sm font-bold text-primary-foreground">
                        {cr.competitor_name}
                      </span>
                      <span className="px-3 py-1 bg-secondary rounded text-sm text-secondary-foreground">
                        📅 {cr.posting_frequency}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Tipos de contenido</p>
                        {cr.content_types?.map((t: string, i: number) => (
                          <span key={i} className="block text-sm">• {t}</span>
                        ))}
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Top Hashtags</p>
                        {cr.top_hashtags?.map((h: string, i: number) => (
                          <span key={i} className="block text-sm text-primary">• {h}</span>
                        ))}
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Temas que funcionan</p>
                        {cr.best_performing_topics?.map((t: string, i: number) => (
                          <span key={i} className="block text-sm">• {t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={handleBenchmark} disabled={benchmarking}>
                        {benchmarking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Benchmark
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleGaps} disabled={identifyingGaps}>
                        {identifyingGaps && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Content Gaps
                      </Button>
                    </div>
                  </div>
                );
              })()}
              {benchmarkResult && <ResultBlock data={benchmarkResult} />}
              {gapsResult && <ResultBlock data={gapsResult} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
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
              <Button className="w-full gradient-primary" onClick={handleAnalyzeTrends} disabled={analyzingTrends || !trendNiche}>
                {analyzingTrends && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analizar Trends
              </Button>
              {trendsResult && <ResultBlock data={trendsResult} />}

              <div className="border-t border-border pt-3 space-y-3">
                <Label className="text-sm">Predecir Viralidad</Label>
                <Textarea placeholder="Describe tu contenido..." value={viralContent} onChange={(e) => setViralContent(e.target.value)} rows={2} />
                <Button variant="outline" className="w-full" onClick={handlePredictVirality} disabled={predictingVirality || !viralContent}>
                  {predictingVirality && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Predecir Viralidad
                </Button>
                {viralResult && <ResultBlock data={viralResult} />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4 mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Oportunidades de Contenido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gradient-primary" onClick={handleFindOpportunities} disabled={findingOpps}>
                {findingOpps && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Encontrar Oportunidades
              </Button>
              {oppsResult && <ResultBlock data={oppsResult} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

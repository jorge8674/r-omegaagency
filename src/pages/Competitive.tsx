import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lightbulb } from "lucide-react";
import { useCompetitive } from "@/hooks/useCompetitive";
import { CompetitorsTab } from "@/components/competitive/CompetitorsTab";
import { TrendsTab } from "@/components/competitive/TrendsTab";

export default function Competitive() {
  const c = useCompetitive();

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
          <CompetitorsTab
            competitorName={c.competitorName}
            setCompetitorName={c.setCompetitorName}
            competitorPlatform={c.competitorPlatform}
            setCompetitorPlatform={c.setCompetitorPlatform}
            competitorData={c.competitorData}
            setCompetitorData={c.setCompetitorData}
            analyzingCompetitor={c.analyzingCompetitor}
            competitorResult={c.competitorResult}
            benchmarking={c.benchmarking}
            benchmarkResult={c.benchmarkResult}
            identifyingGaps={c.identifyingGaps}
            gapsResult={c.gapsResult}
            onAnalyze={c.handleAnalyzeCompetitor}
            onBenchmark={c.handleBenchmark}
            onGaps={c.handleGaps}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <TrendsTab
            trendNiche={c.trendNiche}
            setTrendNiche={c.setTrendNiche}
            trendPlatform={c.trendPlatform}
            setTrendPlatform={c.setTrendPlatform}
            analyzingTrends={c.analyzingTrends}
            trendsResult={c.trendsResult}
            viralContent={c.viralContent}
            setViralContent={c.setViralContent}
            predictingVirality={c.predictingVirality}
            viralResult={c.viralResult}
            onAnalyzeTrends={c.handleAnalyzeTrends}
            onPredictVirality={c.handlePredictVirality}
          />
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
              <Button className="w-full gradient-primary" onClick={c.handleFindOpportunities} disabled={c.findingOpps}>
                {c.findingOpps && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Encontrar Oportunidades
              </Button>
              {c.oppsResult && (() => {
                const items = c.oppsResult?.opportunities || c.oppsResult?.data || (Array.isArray(c.oppsResult) ? c.oppsResult : []);
                const list = Array.isArray(items) ? items : [];
                return (
                  <div className="space-y-3 mt-4">
                    {list.length > 0 ? list.map((opp: any, i: number) => (
                      <div key={i} className="bg-secondary/30 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">
                            {opp.trend?.topic || opp.topic || opp.title || opp.opportunity || `Oportunidad ${i + 1}`}
                          </p>
                          {opp.urgency && (
                            <span className={`px-2 py-1 rounded text-xs font-bold text-primary-foreground ${
                              opp.urgency === 'act_now' ? 'bg-destructive' :
                              opp.urgency === 'this_week' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {opp.urgency?.replace('_', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                        {(opp.effort_required || opp.potential_impact) && (
                          <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                            <span>⚡ Effort: {opp.effort_required || 'medium'}</span>
                            <span>📈 Impact: {opp.potential_impact || 'high'}</span>
                          </div>
                        )}
                        {opp.description && <p className="text-xs text-muted-foreground mt-1">{opp.description}</p>}
                        {opp.score != null && <p className="text-xs text-primary mt-1">Score: {((opp.score || 0) * 100).toFixed(0)}%</p>}
                        {opp.content_ideas?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-primary mb-1">💡 Ideas:</p>
                            {opp.content_ideas.map((idea: string, j: number) => (
                              <p key={j} className="text-sm">• {idea}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="bg-secondary/30 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">
                          {c.oppsResult?.message || 'No se encontraron oportunidades. Prueba analizar trends primero.'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

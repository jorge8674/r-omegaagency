import { useState } from "react";
import { Loader2, TrendingUp, Heart, Clock, BarChart3, Brain, LineChart } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useDashboardData } from "@/hooks/useDashboardData";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GrowthChart } from "@/components/analytics/GrowthChart";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { ScheduleHeatmap } from "@/components/analytics/ScheduleHeatmap";
import { TopPostsTable } from "@/components/analytics/TopPostsTable";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { loading, growthData, engagementData, heatmapData, topPosts, avgEngagement, totalFollowers } =
    useAnalyticsData();
  const { clients } = useDashboardData();

  // Backend analytics state
  const [metricsInput, setMetricsInput] = useState('{"platform": "instagram", "metrics": {"followers": 5000, "engagement_rate": 0.03}}');
  const [analyzingMetrics, setAnalyzingMetrics] = useState(false);
  const [metricsResult, setMetricsResult] = useState<any>(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [insightsResult, setInsightsResult] = useState<any>(null);
  const [forecasting, setForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);

  const handleAnalyzeMetrics = async () => {
    setAnalyzingMetrics(true);
    try {
      const data = JSON.parse(metricsInput);
      const result = await api.analyzeMetrics(data);
      setMetricsResult(result);
      toast({ title: "✅ Métricas analizadas" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzingMetrics(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGeneratingInsights(true);
    try {
      const data = metricsInput;
      const result = await api.generateInsights(data);
      setInsightsResult(result);
      toast({ title: "✅ Insights generados" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingInsights(false);
    }
  };

  const handleForecast = async () => {
    setForecasting(true);
    try {
      const data = metricsInput;
      const result = await api.forecast(data);
      setForecastResult(result);
      toast({ title: "✅ Forecast generado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setForecasting(false);
    }
  };

  const handleMonthlyReport = async () => {
    setGeneratingReport(true);
    try {
      const result = await api.generateMonthlyReport("default");
      setReportResult(result);
      toast({ title: "✅ Reporte generado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingReport(false);
    }
  };

  const ResultBlock = ({ data }: { data: any }) => (
    <div className="rounded-lg bg-secondary/50 p-3 mt-3">
      <pre className="text-sm whitespace-pre-wrap overflow-x-auto">{typeof data === "string" ? data : JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Métricas y reportes de rendimiento</p>
      </div>

      <Tabs defaultValue="historical">
        <TabsList>
          <TabsTrigger value="historical">Histórico</TabsTrigger>
          <TabsTrigger value="backend">Backend Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="historical" className="space-y-6 mt-4">
          <AnalyticsFilters
            clients={clients.map((c) => ({ id: c.id, name: c.name }))}
            selectedClient={selectedClient}
            onClientChange={setSelectedClient}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard title="Seguidores Totales" value={totalFollowers.toLocaleString()} icon={TrendingUp} subtitle="Todas las plataformas" />
            <StatsCard title="Engagement Promedio" value={`${avgEngagement}%`} icon={Heart} subtitle="Likes + comentarios + shares" />
            <StatsCard title="Mejor Horario" value="19:00 – 21:00" icon={Clock} subtitle="Mayor interacción" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <GrowthChart data={growthData} />
            <EngagementChart data={engagementData} />
          </div>

          <ScheduleHeatmap data={heatmapData} />
          <TopPostsTable posts={topPosts} />
        </TabsContent>

        <TabsContent value="backend" className="space-y-4 mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Datos de Entrada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label className="text-sm">Métricas (JSON)</Label>
              <Textarea value={metricsInput} onChange={(e) => setMetricsInput(e.target.value)} rows={4} className="font-mono text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleAnalyzeMetrics} disabled={analyzingMetrics}>
                  {analyzingMetrics ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><Brain className="mr-2 h-4 w-4" /> Analizar Métricas</>}
                </Button>
                <Button variant="outline" onClick={handleGenerateInsights} disabled={generatingInsights}>
                  {generatingInsights ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><TrendingUp className="mr-2 h-4 w-4" /> Insights</>}
                </Button>
                <Button variant="outline" onClick={handleForecast} disabled={forecasting}>
                  {forecasting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><LineChart className="mr-2 h-4 w-4" /> Forecast</>}
                </Button>
                <Button variant="outline" onClick={handleMonthlyReport} disabled={generatingReport}>
                  {generatingReport ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : '📊 Reporte Mensual'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {metricsResult && (() => {
            const mr = metricsResult?.data || metricsResult;
            return (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Análisis de Métricas</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(mr.metrics || {}).map(([key, val]) => (
                      <div key={key} className="bg-secondary/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-primary">{String(val)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{key.replace(/_/g, ' ')}</p>
                      </div>
                    ))}
                  </div>
                  {mr.ai_insights && (
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2">💡 AI Insights</p>
                      <div className="text-sm leading-relaxed whitespace-pre-line">{mr.ai_insights}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}
          {insightsResult && (() => {
            const ir = insightsResult?.data || insightsResult;
            const insightsText = ir?.insights || ir?.response_text || '';
            return (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Insights</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {insightsText && (
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <div className="text-sm leading-relaxed whitespace-pre-line">{insightsText}</div>
                    </div>
                  )}
                  {ir?.metrics_analyzed?.length > 0 && (
                    <p className="text-xs text-muted-foreground">Métricas analizadas: {ir.metrics_analyzed.join(', ')}</p>
                  )}
                  {ir?.generated_at && (
                    <p className="text-xs text-muted-foreground">Generado: {new Date(ir.generated_at).toLocaleString('es-ES')}</p>
                  )}
                  {!insightsText && <ResultBlock data={insightsResult} />}
                </CardContent>
              </Card>
            );
          })()}

          {forecastResult && (() => {
            const fr = forecastResult?.data || forecastResult;
            const forecastList = fr?.forecast || [];
            return (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /> Forecast</CardTitle></CardHeader>
                <CardContent>
                  {Array.isArray(forecastList) && forecastList.length > 0 ? (
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground border-b border-border pb-2 mb-2">
                        <span>Fecha</span>
                        <span className="text-right">Seguidores</span>
                        <span className="text-right">Engagement</span>
                        <span className="text-right">Alcance</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-1">
                        {forecastList.map((f: any, i: number) => {
                          const date = f.date || f.label || f.metric || `Día ${i + 1}`;
                          const followers = f.followers ?? f.value ?? f.predicted_followers;
                          const engagement = f.engagement_rate ?? f.engagement;
                          const reach = f.reach ?? f.predicted_reach;
                          return (
                            <div key={i} className="grid grid-cols-4 gap-2 bg-secondary/30 rounded-lg px-3 py-2 text-sm">
                              <span className="text-muted-foreground">{date}</span>
                              <span className="text-right font-medium text-primary">
                                {followers != null ? Number(followers).toLocaleString() : '—'}
                              </span>
                              <span className="text-right">
                                {engagement != null ? `${(Number(engagement) < 1 ? (Number(engagement) * 100).toFixed(1) : Number(engagement).toFixed(1))}%` : '—'}
                              </span>
                              <span className="text-right">
                                {reach != null ? Number(reach).toLocaleString() : '—'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">{fr?.message || forecastResult?.message || 'No hay datos suficientes para forecast.'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          {reportResult && (() => {
            const rr = reportResult?.data || reportResult;
            return (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Reporte Mensual — {rr?.client_name || ''}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {rr?.overall_score != null && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 rounded-lg p-3 text-center">
                        <p className="text-3xl font-bold text-primary">{rr.overall_score}/10</p>
                        <p className="text-xs text-muted-foreground">Score General</p>
                      </div>
                    </div>
                  )}
                  {rr?.executive_summary && (
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">Resumen Ejecutivo</p>
                      <div className="text-sm leading-relaxed whitespace-pre-line">{rr.executive_summary}</div>
                    </div>
                  )}
                  {rr?.key_wins?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">🏆 Logros Clave</p>
                      {rr.key_wins.map((w: string, i: number) => (
                        <p key={i} className="text-sm text-muted-foreground">✅ {w}</p>
                      ))}
                    </div>
                  )}
                  {rr?.sections?.map((sec: any, si: number) => (
                    <div key={si} className="bg-secondary/30 rounded-lg p-3 space-y-2">
                      <p className="font-medium text-sm">{sec.title}</p>
                      {sec.metrics?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {sec.metrics.map((m: any, mi: number) => (
                            <div key={mi} className="bg-secondary/50 rounded-lg p-2 text-center">
                              <p className="text-lg font-bold text-primary">{typeof m.current_value === 'number' && m.current_value < 1 ? (m.current_value * 100).toFixed(1) + '%' : m.current_value?.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{m.metric_name?.replace(/_/g, ' ')}</p>
                              {m.change_percentage != null && (
                                <p className={`text-xs font-semibold ${m.is_positive ? 'text-green-500' : 'text-destructive'}`}>
                                  {m.is_positive ? '↑' : '↓'} {m.change_percentage}%
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {sec.recommendations?.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Recomendaciones:</p>
                          {sec.recommendations.map((r: string, ri: number) => (
                            <p key={ri} className="text-sm">💡 {r}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {rr?.next_period_goals?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">🎯 Metas Próximo Período</p>
                      {rr.next_period_goals.map((g: string, i: number) => (
                        <p key={i} className="text-sm text-muted-foreground">• {g}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

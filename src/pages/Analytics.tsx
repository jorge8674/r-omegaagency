import { useState } from "react";
import { Loader2, TrendingUp, Heart, Clock, BarChart3, Brain, LineChart } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useBackendAnalytics } from "@/hooks/useBackendAnalytics";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GrowthChart } from "@/components/analytics/GrowthChart";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { ScheduleHeatmap } from "@/components/analytics/ScheduleHeatmap";
import { TopPostsTable } from "@/components/analytics/TopPostsTable";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import {
  MetricsResultCard, InsightsResultCard, ForecastResultCard, MonthlyReportCard,
} from "@/components/analytics/AnalyticsResultCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const DATE_RANGES = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "90d", label: "90 días" },
] as const;

export default function Analytics() {
  const [selectedClient, setSelectedClient] = useState("all");
  const [dateRangeKey, setDateRangeKey] = useState("30d");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { loading, growthData, engagementData, heatmapData, topPosts, avgEngagement, totalFollowers, bestTime } =
    useAnalyticsData(selectedClient, dateRangeKey);
  const { clients } = useDashboardData();
  const backend = useBackendAnalytics();

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
          <div className="flex flex-wrap items-center gap-3">
            <AnalyticsFilters
              clients={clients.map((c) => ({ id: c.id, name: c.name }))}
              selectedClient={selectedClient}
              onClientChange={setSelectedClient}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <div className="flex gap-1 ml-auto">
              {DATE_RANGES.map((r) => (
                <Button
                  key={r.value}
                  size="sm"
                  variant={dateRangeKey === r.value ? "default" : "outline"}
                  onClick={() => setDateRangeKey(r.value)}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard title="Seguidores Totales" value={totalFollowers ? totalFollowers.toLocaleString() : "—"} icon={TrendingUp} subtitle="Todas las plataformas" />
            <StatsCard title="Engagement Promedio" value={avgEngagement ? `${avgEngagement}%` : "—"} icon={Heart} subtitle="Likes + comentarios + shares" />
            <StatsCard title="Mejor Horario" value={bestTime} icon={Clock} subtitle="Mayor interacción" />
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
              <Textarea value={backend.metricsInput} onChange={(e) => backend.setMetricsInput(e.target.value)} rows={4} className="font-mono text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={backend.handleAnalyzeMetrics} disabled={backend.analyzingMetrics}>
                  {backend.analyzingMetrics ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><Brain className="mr-2 h-4 w-4" /> Analizar Métricas</>}
                </Button>
                <Button variant="outline" onClick={backend.handleGenerateInsights} disabled={backend.generatingInsights}>
                  {backend.generatingInsights ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><TrendingUp className="mr-2 h-4 w-4" /> Insights</>}
                </Button>
                <Button variant="outline" onClick={backend.handleForecast} disabled={backend.forecasting}>
                  {backend.forecasting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><LineChart className="mr-2 h-4 w-4" /> Forecast</>}
                </Button>
                <Button variant="outline" onClick={backend.handleMonthlyReport} disabled={backend.generatingReport}>
                  {backend.generatingReport ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : '📊 Reporte Mensual'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {backend.metricsResult && <MetricsResultCard metricsResult={backend.metricsResult} />}
          {backend.insightsResult && <InsightsResultCard insightsResult={backend.insightsResult} />}
          {backend.forecastResult && <ForecastResultCard forecastResult={backend.forecastResult} />}
          {backend.reportResult && <MonthlyReportCard reportResult={backend.reportResult} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

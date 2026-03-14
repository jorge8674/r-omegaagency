import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useBackendAnalytics() {
  const { toast } = useToast();
  const [metricsInput, setMetricsInput] = useState(
    '{"platform": "instagram", "metrics": {"followers": 5000, "engagement_rate": 0.03}}'
  );
  const [analyzingMetrics, setAnalyzingMetrics] = useState(false);
  const [metricsResult, setMetricsResult] = useState<Record<string, unknown> | null>(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [insightsResult, setInsightsResult] = useState<Record<string, unknown> | null>(null);
  const [forecasting, setForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState<Record<string, unknown> | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<Record<string, unknown> | null>(null);

  const handleAnalyzeMetrics = async () => {
    setAnalyzingMetrics(true);
    try {
      const data = JSON.parse(metricsInput);
      const result = await api.analyzeMetrics(data);
      setMetricsResult(result as Record<string, unknown>);
      toast({ title: "✅ Métricas analizadas" });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    } finally {
      setAnalyzingMetrics(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGeneratingInsights(true);
    try {
      const result = await api.generateInsights(metricsInput);
      setInsightsResult(result as Record<string, unknown>);
      toast({ title: "✅ Insights generados" });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    } finally {
      setGeneratingInsights(false);
    }
  };

  const handleForecast = async () => {
    setForecasting(true);
    try {
      const result = await api.forecast(metricsInput);
      setForecastResult(result as Record<string, unknown>);
      toast({ title: "✅ Forecast generado" });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    } finally {
      setForecasting(false);
    }
  };

  const handleMonthlyReport = async () => {
    setGeneratingReport(true);
    try {
      const result = await api.generateMonthlyReport("default");
      setReportResult(result as Record<string, unknown>);
      toast({ title: "✅ Reporte generado" });
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    } finally {
      setGeneratingReport(false);
    }
  };

  return {
    metricsInput, setMetricsInput,
    analyzingMetrics, metricsResult,
    generatingInsights, insightsResult,
    forecasting, forecastResult,
    generatingReport, reportResult,
    handleAnalyzeMetrics, handleGenerateInsights, handleForecast, handleMonthlyReport,
  };
}

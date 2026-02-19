import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyticsApi } from "@/lib/api/analytics";
import { competitiveApi } from "@/lib/api/competitive";

export type AnalysisType = "insight" | "forecast" | "virality";

interface AnalysisState {
  loading: AnalysisType | null;
  results: Partial<Record<AnalysisType, string>>;
}

export function useResultAnalysis() {
  const { toast } = useToast();
  const [state, setState] = useState<AnalysisState>({
    loading: null,
    results: {},
  });

  const runAnalysis = async (
    type: AnalysisType,
    text: string,
    platform: string,
  ): Promise<void> => {
    setState(prev => ({ ...prev, loading: type }));
    try {
      let response: Record<string, unknown>;

      switch (type) {
        case "insight":
          response = await analyticsApi.generateInsights({
            content: text,
            platform,
          }) as Record<string, unknown>;
          break;
        case "forecast":
          response = await analyticsApi.forecast({
            content: text,
            platform,
            metrics: { followers: 1000, engagement_rate: 0.03 },
          }) as Record<string, unknown>;
          break;
        case "virality":
          response = await competitiveApi.predictVirality(
            text,
            platform || "instagram",
          ) as Record<string, unknown>;
          break;
      }

      const output =
        typeof response === "string"
          ? response
          : JSON.stringify(response, null, 2);

      setState(prev => ({
        loading: null,
        results: { ...prev.results, [type]: output },
      }));

      toast({ title: `Análisis completado: ${type}` });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error en análisis", description: msg, variant: "destructive" });
      setState(prev => ({ ...prev, loading: null }));
    }
  };

  const clearResults = (): void => {
    setState({ loading: null, results: {} });
  };

  return { analysisLoading: state.loading, analysisResults: state.results, runAnalysis, clearResults };
}

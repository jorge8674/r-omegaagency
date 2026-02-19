import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type AnalysisType = "insight" | "forecast" | "virality";

interface AnalysisState {
  loading: AnalysisType | null;
  results: Partial<Record<AnalysisType, string>>;
}

const ENDPOINTS: Record<AnalysisType, string> = {
  insight: "/content-lab/analyze-insight/",
  forecast: "/content-lab/analyze-forecast/",
  virality: "/content-lab/analyze-virality/",
};

const BASE =
  import.meta.env.VITE_API_URL ||
  "https://omegaraisen-production.up.railway.app/api/v1";

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
    contentType?: string,
  ): Promise<void> => {
    setState((prev) => ({ ...prev, loading: type }));
    try {
      const params = new URLSearchParams({
        content: text,
        platform: platform || "instagram",
        content_type: contentType || "post",
      });

      const url = `${BASE}${ENDPOINTS[type]}?${params.toString()}`;

      const res = await fetch(url, { method: "POST" });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(errBody || `HTTP ${res.status}`);
      }

      const data: unknown = await res.json();
      const output =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);

      setState((prev) => ({
        loading: null,
        results: { ...prev.results, [type]: output },
      }));

      toast({ title: `Análisis completado: ${type}` });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast({
        title: "Error en análisis",
        description: msg,
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, loading: null }));
    }
  };

  const clearResults = (): void => {
    setState({ loading: null, results: {} });
  };

  return {
    analysisLoading: state.loading,
    analysisResults: state.results,
    runAnalysis,
    clearResults,
  };
}

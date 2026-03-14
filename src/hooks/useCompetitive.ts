import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useCompetitive() {
  const { toast } = useToast();

  const [competitorName, setCompetitorName] = useState("");
  const [competitorPlatform, setCompetitorPlatform] = useState("instagram");
  const [competitorData, setCompetitorData] = useState("");
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);
  const [competitorResult, setCompetitorResult] = useState<any>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);
  const [identifyingGaps, setIdentifyingGaps] = useState(false);
  const [gapsResult, setGapsResult] = useState<any>(null);

  const [trendNiche, setTrendNiche] = useState("");
  const [trendPlatform, setTrendPlatform] = useState("instagram");
  const [analyzingTrends, setAnalyzingTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<any>(null);
  const [viralContent, setViralContent] = useState("");
  const [predictingVirality, setPredictingVirality] = useState(false);
  const [viralResult, setViralResult] = useState<any>(null);

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
      const cr = competitorResult?.data || competitorResult;
      const result = await api.generateBenchmark(cr);
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
      const cr = competitorResult?.data || competitorResult;
      const result = await api.identifyGaps(cr, trendNiche || undefined);
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
      const result = await api.analyzeTrends(trendNiche, trendPlatform);
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
      const result = await api.findOpportunities(trendsResult, trendNiche || "social media", trendPlatform);
      setOppsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFindingOpps(false);
    }
  };

  return {
    competitorName, setCompetitorName,
    competitorPlatform, setCompetitorPlatform,
    competitorData, setCompetitorData,
    analyzingCompetitor, competitorResult,
    benchmarking, benchmarkResult,
    identifyingGaps, gapsResult,
    trendNiche, setTrendNiche,
    trendPlatform, setTrendPlatform,
    analyzingTrends, trendsResult,
    viralContent, setViralContent,
    predictingVirality, viralResult,
    findingOpps, oppsResult,
    handleAnalyzeCompetitor, handleBenchmark, handleGaps,
    handleAnalyzeTrends, handlePredictVirality, handleFindOpportunities,
  };
}

import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useGrowth() {
  const { toast } = useToast();

  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [findingOpps, setFindingOpps] = useState(false);
  const [oppsResult, setOppsResult] = useState<any>(null);
  const [findingQuickWins, setFindingQuickWins] = useState(false);
  const [quickWinsResult, setQuickWinsResult] = useState<any>(null);

  const [brandName, setBrandName] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [samplePosts, setSamplePosts] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [validateText, setValidateText] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [improveText, setImproveText] = useState("");
  const [improving, setImproving] = useState(false);
  const [improvedResult, setImprovedResult] = useState<any>(null);

  const [hypothesis, setHypothesis] = useState("");
  const [variable, setVariable] = useState("");
  const [designing, setDesigning] = useState(false);
  const [experimentResult, setExperimentResult] = useState<any>(null);

  const handleFindOpps = async () => {
    setFindingOpps(true);
    try {
      const result = await api.identifyOpportunities({ niche, platform, account_data: {} });
      setOppsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFindingOpps(false);
    }
  };

  const handleQuickWins = async () => {
    setFindingQuickWins(true);
    try {
      const result = await api.quickWins(niche, platform);
      setQuickWinsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFindingQuickWins(false);
    }
  };

  const handleCreateProfile = async () => {
    setCreatingProfile(true);
    try {
      const result = await api.createBrandProfile(brandName, brandDesc, samplePosts);
      setBrandProfile(result);
      const clientId = localStorage.getItem("omega_context_client_id");
      if (clientId) {
        try {
          await fetch(
            `https://omegaraisen-production-2031.up.railway.app/api/v1/nova/context/${clientId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ brand_voice: JSON.stringify(result?.data || result) }),
            }
          );
          toast({ title: "Perfil guardado en contexto del cliente" });
        } catch {
          toast({ title: "Perfil creado localmente", description: "No se pudo sincronizar con el contexto" });
        }
      } else {
        toast({ title: "Perfil creado localmente" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const raw = brandProfile?.data || brandProfile;
      const result = await api.validateContent(validateText, raw || {}, brandName);
      setValidationResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setValidating(false);
    }
  };

  const handleImprove = async () => {
    setImproving(true);
    try {
      const raw = brandProfile?.data || brandProfile;
      const result = await api.improveContent(improveText, raw || {}, brandName);
      setImprovedResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setImproving(false);
    }
  };

  const handleDesignExperiment = async () => {
    setDesigning(true);
    try {
      const result = await api.designExperiment(hypothesis, variable, platform);
      setExperimentResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setDesigning(false);
    }
  };

  return {
    niche, setNiche, platform, setPlatform,
    findingOpps, oppsResult, findingQuickWins, quickWinsResult,
    brandName, setBrandName, brandDesc, setBrandDesc, samplePosts, setSamplePosts,
    creatingProfile, brandProfile,
    validateText, setValidateText, validating, validationResult,
    improveText, setImproveText, improving, improvedResult,
    hypothesis, setHypothesis, variable, setVariable, designing, experimentResult,
    handleFindOpps, handleQuickWins, handleCreateProfile,
    handleValidate, handleImprove, handleDesignExperiment,
  };
}

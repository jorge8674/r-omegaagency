import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function levelColor(level: string) {
  switch (level) {
    case "emergency": return { border: "border-destructive/50", bg: "bg-destructive/10", text: "text-destructive" };
    case "crisis": return { border: "border-orange-500/50", bg: "bg-orange-500/10", text: "text-orange-500" };
    case "alert": return { border: "border-yellow-500/50", bg: "bg-yellow-500/10", text: "text-yellow-500" };
    case "monitoring": default: return { border: "border-blue-500/50", bg: "bg-blue-500/10", text: "text-blue-500" };
  }
}

export function useCrisisRoom() {
  const { toast } = useToast();
  const [negativePercent, setNegativePercent] = useState(10);
  const [complaintVelocity, setComplaintVelocity] = useState(5);
  const [sentimentDrop, setSentimentDrop] = useState(15);
  const [reachNegative, setReachNegative] = useState(1000);
  const [mediaInvolved, setMediaInvolved] = useState(false);
  const [influencerInvolved, setInfluencerInvolved] = useState(false);
  const [platform, setPlatform] = useState("instagram");

  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [draftingStatement, setDraftingStatement] = useState(false);
  const [statement, setStatement] = useState("");
  const [planningRecovery, setPlanningRecovery] = useState(false);
  const [recovery, setRecovery] = useState<any>(null);

  const [comment, setComment] = useState("");
  const [responding, setResponding] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [bulkComments, setBulkComments] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentResults, setSentimentResults] = useState<any>(null);

  const handleAssess = async () => {
    setAssessing(true);
    try {
      const signalsPayload = {
        negative_comment_percentage: negativePercent / 100,
        complaint_velocity: complaintVelocity,
        sentiment_drop: sentimentDrop / 100,
        reach_of_negative_content: reachNegative,
        media_involvement: mediaInvolved,
        influencer_involvement: influencerInvolved,
        platform,
      };
      const result = await api.assessCrisis(signalsPayload);
      setAssessment(result?.data || result);
      toast({ title: "✅ Crisis evaluada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAssessing(false);
    }
  };

  const handleDraftStatement = async () => {
    setDraftingStatement(true);
    try {
      const result = await api.draftStatement({ assessment, brand_voice: "professional", brand_name: "Cliente" });
      const stmt = result?.data?.statement || result?.statement || (typeof result === "string" ? result : JSON.stringify(result?.data || result, null, 2));
      setStatement(stmt);
      toast({ title: "✅ Statement generado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setDraftingStatement(false);
    }
  };

  const handleRecovery = async () => {
    setPlanningRecovery(true);
    try {
      const result = await api.recoveryPlan(assessment);
      const steps = result?.data?.recovery_steps || result?.data?.steps || result?.data || result?.recovery_steps || result?.steps;
      setRecovery(steps);
      toast({ title: "✅ Plan de recovery generado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPlanningRecovery(false);
    }
  };

  const handleRespond = async () => {
    setResponding(true);
    try {
      const result = await api.respondComment(comment, platform, "professional");
      setResponse(result?.data || result);
      toast({ title: "✅ Respuesta generada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setResponding(false);
    }
  };

  const handleBulkAnalyze = async () => {
    setAnalyzing(true);
    try {
      const comments = bulkComments.split("\n").filter(Boolean);
      const result = await api.detectCrisis(comments);
      setSentimentResults(result?.data || result);
      toast({ title: "✅ Análisis completado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const assessmentData = assessment;
  const crisisLevelObj = assessmentData?.crisis_level;
  const crisisLevel = crisisLevelObj?.level || assessmentData?.level || assessmentData?.crisis_level;
  const crisisScore = crisisLevelObj?.score ?? assessmentData?.score;
  const triggers = crisisLevelObj?.triggers || assessmentData?.triggers || [];
  const estimatedDamage = assessmentData?.estimated_reputation_damage || assessmentData?.estimated_damage;
  const recoveryTime = assessmentData?.estimated_recovery_time;
  const requiresAction = assessmentData?.requires_immediate_action;
  const colors = crisisLevel ? levelColor(crisisLevel) : null;

  return {
    negativePercent, setNegativePercent,
    complaintVelocity, setComplaintVelocity,
    sentimentDrop, setSentimentDrop,
    reachNegative, setReachNegative,
    mediaInvolved, setMediaInvolved,
    influencerInvolved, setInfluencerInvolved,
    platform, setPlatform,
    assessing, assessment,
    draftingStatement, statement,
    planningRecovery, recovery,
    comment, setComment, responding, response,
    bulkComments, setBulkComments, analyzing, sentimentResults,
    handleAssess, handleDraftStatement, handleRecovery, handleRespond, handleBulkAnalyze,
    crisisLevel, crisisScore, triggers, estimatedDamage, recoveryTime, requiresAction, colors,
  };
}

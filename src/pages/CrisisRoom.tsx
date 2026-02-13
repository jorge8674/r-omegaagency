import { useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Shield, FileText, Heart, Loader2, MessageSquare, Zap } from "lucide-react";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin"];

export default function CrisisRoom() {
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
      console.log('Crisis payload:', JSON.stringify({ signals: signalsPayload }, null, 2));
      console.log('platform value:', signalsPayload.platform);
      const result = await api.assessCrisis(signalsPayload);
      console.log('Crisis assessment result:', JSON.stringify(result, null, 2));
      const data = result?.data || result;
      setAssessment(data);
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
      console.log('respond result:', result);
      console.log('response text:', result?.data?.response);
      const data = result?.data || result;
      setResponse(data);
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
      console.log('bulk result full:', JSON.stringify(result, null, 2));
      const data = result?.data || result;
      setSentimentResults(data);
      toast({ title: "✅ Análisis completado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  // assessment is already result.data (extracted in handleAssess)
  const assessmentData = assessment;
  const crisisLevelObj = assessmentData?.crisis_level;
  const crisisLevel = crisisLevelObj?.level || assessmentData?.level || assessmentData?.crisis_level;
  const crisisScore = crisisLevelObj?.score ?? assessmentData?.score;
  const triggers = crisisLevelObj?.triggers || assessmentData?.triggers || [];
  const estimatedDamage = assessmentData?.estimated_reputation_damage || assessmentData?.estimated_damage;
  const recoveryTime = assessmentData?.estimated_recovery_time;
  const requiresAction = assessmentData?.requires_immediate_action;

  const levelColor = (level: string) => {
    switch (level) {
      case "emergency": return { border: "border-destructive/50", bg: "bg-destructive/10", text: "text-destructive" };
      case "crisis": return { border: "border-orange-500/50", bg: "bg-orange-500/10", text: "text-orange-500" };
      case "alert": return { border: "border-yellow-500/50", bg: "bg-yellow-500/10", text: "text-yellow-500" };
      case "monitoring": default: return { border: "border-blue-500/50", bg: "bg-blue-500/10", text: "text-blue-500" };
    }
  };
  const colors = crisisLevel ? levelColor(crisisLevel) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Crisis Room</h1>
        <p className="text-muted-foreground">Evaluación y respuesta ante crisis de reputación</p>
      </div>

      {assessment && colors && (
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors.border} ${colors.bg}`}>
          <AlertTriangle className={`h-5 w-5 ${colors.text}`} />
          <div>
            <p className="font-medium text-sm">Nivel de crisis: <span className={`uppercase font-bold ${colors.text}`}>{crisisLevel}</span></p>
            {estimatedDamage && <p className="text-xs text-muted-foreground">Daño estimado: {estimatedDamage}</p>}
          </div>
          {requiresAction && (
            <Badge variant="destructive" className="ml-auto flex items-center gap-1">
              <Zap className="h-3 w-3" /> REQUIERE ACCIÓN INMEDIATA
            </Badge>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Evaluación de Crisis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm">Comentarios negativos: {negativePercent}%</Label>
              <Slider value={[negativePercent]} onValueChange={([v]) => setNegativePercent(v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Velocidad de quejas: {complaintVelocity}/hora</Label>
              <Slider value={[complaintVelocity]} onValueChange={([v]) => setComplaintVelocity(v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Caída de sentimiento: {sentimentDrop}%</Label>
              <Slider value={[sentimentDrop]} onValueChange={([v]) => setSentimentDrop(v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Alcance negativo: {reachNegative.toLocaleString()}</Label>
              <Slider value={[reachNegative]} onValueChange={([v]) => setReachNegative(v)} min={100} max={100000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Plataforma</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={mediaInvolved} onCheckedChange={(v) => setMediaInvolved(v === true)} />
                Medios involucrados
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={influencerInvolved} onCheckedChange={(v) => setInfluencerInvolved(v === true)} />
                Influencers involucrados
              </label>
            </div>
            <Button className="w-full gradient-primary" onClick={handleAssess} disabled={assessing}>
              {assessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'EVALUAR CRISIS'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Respuesta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!assessment ? (
              <p className="text-sm text-muted-foreground text-center py-8">Evalúa la crisis primero para generar respuestas</p>
            ) : (
              <>
                {/* Assessment details */}
                {crisisScore != null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Score de crisis</span>
                      <span className="font-medium">{Math.round(crisisScore * 100)}%</span>
                    </div>
                    <Progress value={crisisScore * 100} className="h-2" />
                  </div>
                )}

                {triggers.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Triggers detectados:</p>
                    <div className="flex flex-wrap gap-1">
                      {triggers.map((t: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(estimatedDamage || recoveryTime) && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {estimatedDamage && (
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <p className="text-xs text-muted-foreground">Daño estimado</p>
                        <p className="font-medium capitalize">{estimatedDamage}</p>
                      </div>
                    )}
                    {recoveryTime && (
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <p className="text-xs text-muted-foreground">Tiempo de recovery</p>
                        <p className="font-medium capitalize">{recoveryTime}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t pt-3 space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleDraftStatement} disabled={draftingStatement}>
                    {draftingStatement ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Redactar Statement'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleRecovery} disabled={planningRecovery}>
                    {planningRecovery ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Plan de Recovery'}
                  </Button>
                </div>

                {statement && (
                  <div className="rounded-lg bg-secondary/50 p-3 mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">Statement:</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(statement); toast({ title: "Copiado al portapapeles" }); }}>
                        Copiar
                      </Button>
                    </div>
                    <Textarea value={statement} readOnly rows={6} className="text-sm bg-background/50" />
                  </div>
                )}
                {recovery && (
                  <div className="rounded-lg bg-secondary/50 p-3 mt-2">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Recovery Plan:</p>
                    {Array.isArray(recovery) ? (
                      <div className="space-y-2">
                        {recovery.map((step: any, i: number) => (
                          <div key={step.step_number || i} className="border border-border/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {step.step_number || i + 1}
                              </span>
                              <span className="font-medium text-sm">{step.action || step.step || step.description || step}</span>
                            </div>
                            <div className="text-xs text-muted-foreground flex gap-4 ml-8">
                              {step.responsible && <span>👤 {step.responsible}</span>}
                              {step.deadline && <span>⏱️ {step.deadline}</span>}
                              {step.success_metric && <span>✅ {step.success_metric}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap">{typeof recovery === "string" ? recovery : JSON.stringify(recovery, null, 2)}</pre>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Responder Comentario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Pega un comentario..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
            <Button className="w-full" onClick={handleRespond} disabled={responding || !comment}>
              {responding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Generar Respuesta'}
            </Button>
            {response && (() => {
              const respText = response?.suggested_response || response?.response || (typeof response === "string" ? response : "");
              const sentiment = response?.sentiment;
              const tips = response?.handling_tips || [];
              const alts = response?.suggested_alternatives || [];
              const sentimentColor = (s: string) => s === "negative" ? "destructive" : s === "positive" ? "default" : "secondary";
              const sentimentLabel = (s: string) => s === "negative" ? "NEGATIVO" : s === "positive" ? "POSITIVO" : "NEUTRAL";
              return (
                <div className="mt-2 border-t border-border/30 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    {sentiment && <Badge variant={sentimentColor(sentiment)}>{sentimentLabel(sentiment)}</Badge>}
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(respText); toast({ title: "Copiado" }); }}>Copiar</Button>
                  </div>
                  <Textarea value={respText} readOnly rows={4} className="text-sm bg-secondary/50" />
                  {tips.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Consejos:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">{tips.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                    </div>
                  )}
                  {alts.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Alternativas:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">{alts.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Análisis Masivo de Sentimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Un comentario por línea..." value={bulkComments} onChange={(e) => setBulkComments(e.target.value)} rows={4} />
            <Button className="w-full" onClick={handleBulkAnalyze} disabled={analyzing || !bulkComments}>
              {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Analizar Sentimiento'}
            </Button>
            {sentimentResults && (
              <div className="mt-2 border-t border-border/30 pt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={sentimentResults.is_crisis ? "destructive" : "default"}>
                    {sentimentResults.is_crisis ? '⚠️ CRISIS DETECTADA' : '✅ SIN CRISIS'}
                  </Badge>
                  {sentimentResults.severity && (
                    <span className="text-sm text-muted-foreground">
                      Severidad: <span className="font-medium capitalize">{sentimentResults.severity}</span>
                    </span>
                  )}
                </div>
                {sentimentResults.affected_comments != null && (
                  <p className="text-sm text-muted-foreground">Comentarios afectados: {sentimentResults.affected_comments}</p>
                )}
                {sentimentResults.recommended_action && (
                  <p className="text-sm">
                    <span className="font-medium">Acción recomendada:</span> {sentimentResults.recommended_action}
                  </p>
                )}
                {sentimentResults.suggested_response && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">Respuesta sugerida:</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(sentimentResults.suggested_response); toast({ title: "Copiado" }); }}>Copiar</Button>
                    </div>
                    <Textarea value={sentimentResults.suggested_response} readOnly rows={4} className="text-sm bg-secondary/50" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Shield, FileText, Heart, Loader2, MessageSquare } from "lucide-react";

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
  const [response, setResponse] = useState("");
  const [bulkComments, setBulkComments] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sentimentResults, setSentimentResults] = useState<any>(null);

  const handleAssess = async () => {
    setAssessing(true);
    try {
      const result = await api.assessCrisis({
        negative_comment_percentage: negativePercent / 100,
        complaint_velocity: complaintVelocity,
        sentiment_drop: sentimentDrop / 100,
        reach_of_negative_content: reachNegative,
        media_involvement: mediaInvolved,
        influencer_involvement: influencerInvolved,
        platform,
      });
      setAssessment(result);
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
      const result = await api.draftStatement({ assessment, brand_name: "Cliente" });
      setStatement(typeof result === "string" ? result : result?.statement || JSON.stringify(result, null, 2));
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
      setRecovery(result);
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
      setResponse(typeof result === "string" ? result : result?.response || JSON.stringify(result, null, 2));
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
      setSentimentResults(result);
      toast({ title: "✅ Análisis completado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const crisisLevel = assessment?.level || assessment?.crisis_level;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Crisis Room</h1>
        <p className="text-muted-foreground">Evaluación y respuesta ante crisis de reputación</p>
      </div>

      {assessment && (
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${
          crisisLevel === "critical" || crisisLevel === "high"
            ? "border-destructive/50 bg-destructive/10"
            : crisisLevel === "medium"
            ? "border-warning/50 bg-warning/10"
            : "border-success/50 bg-success/10"
        }`}>
          <AlertTriangle className={`h-5 w-5 ${
            crisisLevel === "critical" || crisisLevel === "high" ? "text-destructive" : crisisLevel === "medium" ? "text-warning" : "text-success"
          }`} />
          <div>
            <p className="font-medium text-sm">Nivel de crisis: <span className="uppercase">{crisisLevel || "evaluado"}</span></p>
            {assessment.estimated_damage && <p className="text-xs text-muted-foreground">Daño estimado: {assessment.estimated_damage}</p>}
          </div>
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
                <Button variant="outline" className="w-full" onClick={handleDraftStatement} disabled={draftingStatement}>
                  {draftingStatement ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Redactar Statement'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRecovery} disabled={planningRecovery}>
                  {planningRecovery ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Plan de Recovery'}
                </Button>
                {statement && (
                  <div className="rounded-lg bg-secondary/50 p-3 mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Statement:</p>
                    <p className="text-sm whitespace-pre-wrap">{statement}</p>
                  </div>
                )}
                {recovery && (
                  <div className="rounded-lg bg-secondary/50 p-3 mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Recovery Plan:</p>
                    <pre className="text-sm whitespace-pre-wrap">{typeof recovery === "string" ? recovery : JSON.stringify(recovery, null, 2)}</pre>
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
            {response && (
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-sm whitespace-pre-wrap">{response}</p>
              </div>
            )}
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
              <div className="rounded-lg bg-secondary/50 p-3">
                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(sentimentResults, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

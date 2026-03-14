import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, Heart, Loader2, MessageSquare, Zap } from "lucide-react";
import { useCrisisRoom } from "@/hooks/useCrisisRoom";
import { CrisisResponsePanel } from "@/components/crisis/CrisisResponsePanel";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin"];

export default function CrisisRoom() {
  const { toast } = useToast();
  const cr = useCrisisRoom();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Crisis Room</h1>
        <p className="text-muted-foreground">Evaluación y respuesta ante crisis de reputación</p>
      </div>

      {cr.assessment && cr.colors && (
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${cr.colors.border} ${cr.colors.bg}`}>
          <AlertTriangle className={`h-5 w-5 ${cr.colors.text}`} />
          <div>
            <p className="font-medium text-sm">Nivel de crisis: <span className={`uppercase font-bold ${cr.colors.text}`}>{cr.crisisLevel}</span></p>
            {cr.estimatedDamage && <p className="text-xs text-muted-foreground">Daño estimado: {cr.estimatedDamage}</p>}
          </div>
          {cr.requiresAction && (
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
              <Label className="text-sm">Comentarios negativos: {cr.negativePercent}%</Label>
              <Slider value={[cr.negativePercent]} onValueChange={([v]) => cr.setNegativePercent(v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Velocidad de quejas: {cr.complaintVelocity}/hora</Label>
              <Slider value={[cr.complaintVelocity]} onValueChange={([v]) => cr.setComplaintVelocity(v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Caída de sentimiento: {cr.sentimentDrop}%</Label>
              <Slider value={[cr.sentimentDrop]} onValueChange={([v]) => cr.setSentimentDrop(v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Alcance negativo: {cr.reachNegative.toLocaleString()}</Label>
              <Slider value={[cr.reachNegative]} onValueChange={([v]) => cr.setReachNegative(v)} min={100} max={100000} step={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Plataforma</Label>
              <Select value={cr.platform} onValueChange={cr.setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={cr.mediaInvolved} onCheckedChange={(v) => cr.setMediaInvolved(v === true)} />
                Medios involucrados
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={cr.influencerInvolved} onCheckedChange={(v) => cr.setInfluencerInvolved(v === true)} />
                Influencers involucrados
              </label>
            </div>
            <Button className="w-full gradient-primary" onClick={cr.handleAssess} disabled={cr.assessing}>
              {cr.assessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'EVALUAR CRISIS'}
            </Button>
          </CardContent>
        </Card>

        <CrisisResponsePanel
          assessment={cr.assessment}
          crisisScore={cr.crisisScore}
          triggers={cr.triggers}
          estimatedDamage={cr.estimatedDamage}
          recoveryTime={cr.recoveryTime}
          draftingStatement={cr.draftingStatement}
          statement={cr.statement}
          planningRecovery={cr.planningRecovery}
          recovery={cr.recovery}
          onDraftStatement={cr.handleDraftStatement}
          onRecovery={cr.handleRecovery}
        />
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
            <Textarea placeholder="Pega un comentario..." value={cr.comment} onChange={(e) => cr.setComment(e.target.value)} rows={3} />
            <Button className="w-full" onClick={cr.handleRespond} disabled={cr.responding || !cr.comment}>
              {cr.responding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Generar Respuesta'}
            </Button>
            {cr.response && (() => {
              const respText = cr.response?.response_text || cr.response?.suggested_response || cr.response?.response || (typeof cr.response === "string" ? cr.response : "");
              const sentiment = cr.response?.sentiment;
              const tips = cr.response?.handling_tips || [];
              const alts = cr.response?.suggested_alternatives || [];
              const sentimentColor = (s: string) => s === "negative" ? "destructive" : s === "positive" ? "default" : "secondary";
              const sentimentLabel = (s: string) => s === "negative" ? "NEGATIVO" : s === "positive" ? "POSITIVO" : "NEUTRAL";
              return (
                <div className="mt-2 border-t border-border/30 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    {sentiment && <Badge variant={sentimentColor(sentiment) as any}>{sentimentLabel(sentiment)}</Badge>}
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
            <Textarea placeholder="Un comentario por línea..." value={cr.bulkComments} onChange={(e) => cr.setBulkComments(e.target.value)} rows={4} />
            <Button className="w-full" onClick={cr.handleBulkAnalyze} disabled={cr.analyzing || !cr.bulkComments}>
              {cr.analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Analizar Sentimiento'}
            </Button>
            {cr.sentimentResults && (
              <div className="mt-2 border-t border-border/30 pt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={cr.sentimentResults.is_crisis ? "destructive" : "default"}>
                    {cr.sentimentResults.is_crisis ? '⚠️ CRISIS DETECTADA' : '✅ SIN CRISIS'}
                  </Badge>
                  {cr.sentimentResults.severity && (
                    <span className="text-sm text-muted-foreground">Severidad: <span className="font-medium capitalize">{cr.sentimentResults.severity}</span></span>
                  )}
                </div>
                {cr.sentimentResults.affected_comments != null && (
                  <p className="text-sm text-muted-foreground">Comentarios afectados: {cr.sentimentResults.affected_comments}</p>
                )}
                {cr.sentimentResults.recommended_action && (
                  <p className="text-sm"><span className="font-medium">Acción recomendada:</span> {cr.sentimentResults.recommended_action}</p>
                )}
                {cr.sentimentResults.suggested_response && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">Respuesta sugerida:</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(cr.sentimentResults.suggested_response); toast({ title: "Copiado" }); }}>Copiar</Button>
                    </div>
                    <Textarea value={cr.sentimentResults.suggested_response} readOnly rows={4} className="text-sm bg-secondary/50" />
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

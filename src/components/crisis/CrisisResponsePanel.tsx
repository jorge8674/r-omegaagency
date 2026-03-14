import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CrisisResponsePanelProps {
  assessment: any;
  crisisScore: number | null | undefined;
  triggers: string[];
  estimatedDamage: string | undefined;
  recoveryTime: string | undefined;
  draftingStatement: boolean;
  statement: string;
  planningRecovery: boolean;
  recovery: any;
  onDraftStatement: () => void;
  onRecovery: () => void;
}

export function CrisisResponsePanel({
  assessment,
  crisisScore,
  triggers,
  estimatedDamage,
  recoveryTime,
  draftingStatement,
  statement,
  planningRecovery,
  recovery,
  onDraftStatement,
  onRecovery,
}: CrisisResponsePanelProps) {
  const { toast } = useToast();

  return (
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
              <Button variant="outline" className="w-full" onClick={onDraftStatement} disabled={draftingStatement}>
                {draftingStatement ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Redactar Statement'}
              </Button>
              <Button variant="outline" className="w-full" onClick={onRecovery} disabled={planningRecovery}>
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
  );
}

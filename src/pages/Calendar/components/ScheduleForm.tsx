import { useState, useEffect } from "react";
import { Send, Loader2, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDailyLimits } from "../hooks/useDailyLimits";
import type { Platform, ScheduleFormValues } from "../types";
import { PLATFORMS } from "../types";

interface ScheduleFormProps {
  scheduling: boolean;
  onSubmit: (values: ScheduleFormValues) => Promise<void>;
  prefilledText?: string | null;
  prefilledContentType?: string | null;
}

export function ScheduleForm({ scheduling, onSubmit, prefilledText, prefilledContentType }: ScheduleFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [scheduledAt, setScheduledAt] = useState("");

  const { used, limit, remaining, canSchedule, isLoading: limitsLoading, planLabel } =
    useDailyLimits(scheduledAt);

  useEffect(() => {
    if (prefilledText) setContent(prefilledText);
    if (prefilledContentType) setTitle(prefilledContentType);
  }, [prefilledText, prefilledContentType]);

  const handleSubmit = async (): Promise<void> => {
    if (!canSchedule) return;
    await onSubmit({ title, content, platform, scheduledAt });
    setTitle("");
    setContent("");
  };

  const isLimited = limit !== Infinity;
  const showLimits = !!scheduledAt && !limitsLoading;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Agendar Post
          </CardTitle>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {planLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm">Titulo</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo del post..." />
        </div>
        <div className="space-y-1">
          <Label className="text-sm">Contenido</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Contenido..." rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-sm">Plataforma</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Fecha y hora</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
        </div>

        {showLimits && isLimited && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Posts agendados: {used}/{limit}
              </span>
              <span className={remaining > 0 ? "text-green-500" : "text-destructive"}>
                {remaining > 0 ? `${remaining} disponible${remaining > 1 ? "s" : ""}` : "Limite alcanzado"}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${remaining > 0 ? "bg-primary" : "bg-destructive"}`}
                style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {showLimits && !canSchedule && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Limite diario alcanzado ({limit} posts). Mejora tu plan para agendar mas contenido.
            </AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full gradient-primary"
          onClick={handleSubmit}
          disabled={scheduling || !title || !canSchedule}
        >
          {scheduling ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
          ) : !canSchedule && showLimits ? (
            <><AlertCircle className="mr-2 h-4 w-4" /> Limite alcanzado</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Agendar Post</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

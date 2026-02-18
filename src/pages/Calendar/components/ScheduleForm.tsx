import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Platform, ScheduleFormValues } from "../types";
import { PLATFORMS } from "../types";

interface ScheduleFormProps {
  scheduling: boolean;
  onSubmit: (values: ScheduleFormValues) => Promise<void>;
}

export function ScheduleForm({ scheduling, onSubmit }: ScheduleFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSubmit = async (): Promise<void> => {
    await onSubmit({ title, content, platform, scheduledAt });
    setTitle("");
    setContent("");
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Agendar Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm">Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del post..." />
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
        <Button className="w-full gradient-primary" onClick={handleSubmit} disabled={scheduling || !title}>
          {scheduling ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Agendar Post</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

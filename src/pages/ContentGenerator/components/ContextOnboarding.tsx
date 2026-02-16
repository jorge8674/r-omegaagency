// src/pages/ContentGenerator/components/ContextOnboarding.tsx
// Responsabilidad única: Formulario de onboarding/edición de contexto

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ChipsInput } from "@/components/ui/ChipsInput";
import { BriefPreview } from "./BriefPreview";
import type { ClientContextData, ClientContextPayload, ToneOption, GoalOption, PlatformOption } from "@/lib/api/context";

const TONES: { value: ToneOption; label: string }[] = [
  { value: "professional", label: "Profesional" },
  { value: "casual", label: "Casual" },
  { value: "inspirational", label: "Inspiracional" },
  { value: "educational", label: "Educativo" },
  { value: "humorous", label: "Humorístico" },
  { value: "energetic", label: "Energético" },
];

const GOALS: { value: GoalOption; label: string }[] = [
  { value: "sales", label: "Ventas" },
  { value: "awareness", label: "Awareness" },
  { value: "community", label: "Comunidad" },
  { value: "leads", label: "Leads" },
  { value: "retention", label: "Retención" },
];

const PLATFORMS: { value: PlatformOption; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X / Twitter" },
];

interface Props {
  clientId: string;
  onSave: (payload: ClientContextPayload) => void;
  isSaving: boolean;
  existingContext?: ClientContextData | null;
  brief?: string | null;
  isGeneratingBrief?: boolean;
  onGenerateBrief?: () => void;
  onSaveBrief?: (brief: string) => void;
}

export function ContextOnboarding({
  clientId, onSave, isSaving, existingContext,
  brief, isGeneratingBrief, onGenerateBrief, onSaveBrief,
}: Props) {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState<ToneOption>("professional");
  const [goal, setGoal] = useState<GoalOption>("awareness");
  const [platforms, setPlatforms] = useState<PlatformOption[]>(["instagram"]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
  const [forbiddenTopics, setForbiddenTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!existingContext) return;
    setBusinessName(existingContext.business_name);
    setIndustry(existingContext.industry);
    setDescription(existingContext.business_description ?? "");
    setTone(existingContext.communication_tone);
    setGoal(existingContext.primary_goal ?? "awareness");
    setPlatforms(existingContext.platforms.length ? existingContext.platforms : ["instagram"]);
    setWebsiteUrl(existingContext.website_url ?? "");
    setKeywords(existingContext.keywords ?? []);
    setForbiddenWords(existingContext.forbidden_words ?? []);
    setForbiddenTopics(existingContext.forbidden_topics ?? []);
  }, [existingContext]);

  const togglePlatform = (p: PlatformOption) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = () => {
    if (!businessName.trim() || !industry.trim()) return;
    onSave({
      client_id: existingContext?.client_id ?? clientId,
      business_name: businessName.trim(),
      industry: industry.trim(),
      business_description: description.trim() || undefined,
      communication_tone: tone,
      primary_goal: goal,
      platforms,
      website_url: websiteUrl.trim() || undefined,
      keywords,
      forbidden_words: forbiddenWords,
      forbidden_topics: forbiddenTopics,
    });
  };

  const isValid = businessName.trim().length > 0 && industry.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ctx-name">Nombre del negocio *</Label>
        <Input id="ctx-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Mi Empresa" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctx-industry">Industria *</Label>
        <Input id="ctx-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Marketing, Fitness, Tech..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctx-desc">Descripción</Label>
        <Textarea id="ctx-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu negocio..." rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tono</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as ToneOption)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Objetivo</Label>
          <Select value={goal} onValueChange={(v) => setGoal(v as GoalOption)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GOALS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Plataformas</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <Button key={p.value} type="button" size="sm"
              variant={platforms.includes(p.value) ? "default" : "outline"}
              onClick={() => togglePlatform(p.value)}>{p.label}</Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctx-web">Website</Label>
        <Input id="ctx-web" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
      </div>

      <ChipsInput label="Keywords" value={keywords} onChange={setKeywords} placeholder="keyword + Enter" />
      <ChipsInput label="Palabras prohibidas" value={forbiddenWords} onChange={setForbiddenWords} placeholder="palabra + Enter" />
      <ChipsInput label="Temas prohibidos" value={forbiddenTopics} onChange={setForbiddenTopics} placeholder="tema + Enter" />

      {onGenerateBrief && (
        <BriefPreview
          brief={brief ?? null}
          isGenerating={isGeneratingBrief ?? false}
          onGenerate={onGenerateBrief}
          onSave={onSaveBrief ?? (() => {})}
        />
      )}

      <Button onClick={handleSubmit} disabled={!isValid || isSaving} className="w-full">
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {existingContext ? "Actualizar Contexto" : "Crear Contexto"}
      </Button>
    </div>
  );
}

// src/components/onboarding/BrandVoiceForm.tsx
// Responsabilidad única: Formulario de voz de marca para onboarding

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateClientContext } from "@/lib/api/context";
import { Loader2, Mic, ShieldCheck, SkipForward, Save } from "lucide-react";

type PrimaryTone = "professional" | "casual" | "aspiracional";
type LanguageStyle = "formal" | "semiformal" | "coloquial";

const TONES: { value: PrimaryTone; label: string }[] = [
  { value: "professional", label: "Profesional" },
  { value: "casual", label: "Casual" },
  { value: "aspiracional", label: "Aspiracional" },
];

const STYLES: { value: LanguageStyle; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "semiformal", label: "Semi-formal" },
  { value: "coloquial", label: "Coloquial" },
];

const PERSONALITY_TRAITS = [
  "Confiable", "Innovador", "Amigable",
  "Audaz", "Elegante", "Juguetón",
];

export interface BrandVoiceData {
  voice: {
    primary_tone: PrimaryTone;
    language_style: LanguageStyle;
    personality_traits: string[];
    emojis_allowed: boolean;
  };
  do: string[];
  dont: string[];
}

interface BrandVoiceFormProps {
  clientId: string;
  onNext: () => void;
  onSkip?: () => void;
}

export function BrandVoiceForm({ clientId, onNext, onSkip }: BrandVoiceFormProps) {
  const { toast } = useToast();
  const [tone, setTone] = useState<PrimaryTone>("professional");
  const [style, setStyle] = useState<LanguageStyle>("formal");
  const [traits, setTraits] = useState<string[]>([]);
  const [emojis, setEmojis] = useState(false);
  const [doRules, setDoRules] = useState("");
  const [dontRules, setDontRules] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleTrait = useCallback((trait: string) => {
    setTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    );
  }, []);

  const parseRules = (text: string): string[] =>
    text.split("\n").map((r) => r.replace(/^[•\-]\s*/, "").trim()).filter(Boolean);

  const isValid =
    parseRules(doRules).length >= 1 && parseRules(dontRules).length >= 1;

  const handleSubmit = useCallback(async () => {
    const data: BrandVoiceData = {
      voice: { primary_tone: tone, language_style: style, personality_traits: traits, emojis_allowed: emojis },
      do: parseRules(doRules),
      dont: parseRules(dontRules),
    };
    setIsSaving(true);
    try {
      await updateClientContext(clientId, {
        custom_instructions: JSON.stringify(data),
      });
      toast({ title: "Voz de marca guardada" });
      onNext();
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [clientId, tone, style, traits, emojis, doRules, dontRules, toast, onNext]);

  const handleSkip = useCallback(async () => {
    setIsSaving(true);
    try {
      const empty: BrandVoiceData = { voice: { primary_tone: "professional", language_style: "formal", personality_traits: [], emojis_allowed: false }, do: [], dont: [] };
      await updateClientContext(clientId, { custom_instructions: JSON.stringify(empty) });
      (onSkip ?? onNext)();
    } catch {
      (onSkip ?? onNext)();
    } finally {
      setIsSaving(false);
    }
  }, [clientId, onSkip, onNext]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mic className="h-5 w-5 text-primary" />
          Paso 3: Define tu Voz de Marca
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Tone */}
        <fieldset className="space-y-2">
          <Label className="font-semibold">Tono Principal *</Label>
          <RadioGroup value={tone} onValueChange={(v) => setTone(v as PrimaryTone)} className="flex flex-wrap gap-4">
            {TONES.map((t) => (
              <div key={t.value} className="flex items-center gap-2">
                <RadioGroupItem value={t.value} id={`tone-${t.value}`} />
                <Label htmlFor={`tone-${t.value}`} className="cursor-pointer">{t.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>

        {/* Style */}
        <fieldset className="space-y-2">
          <Label className="font-semibold">Estilo de Lenguaje *</Label>
          <RadioGroup value={style} onValueChange={(v) => setStyle(v as LanguageStyle)} className="flex flex-wrap gap-4">
            {STYLES.map((s) => (
              <div key={s.value} className="flex items-center gap-2">
                <RadioGroupItem value={s.value} id={`style-${s.value}`} />
                <Label htmlFor={`style-${s.value}`} className="cursor-pointer">{s.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>

        {/* Traits */}
        <fieldset className="space-y-2">
          <Label className="font-semibold">Rasgos de Personalidad</Label>
          <div className="flex flex-wrap gap-3">
            {PERSONALITY_TRAITS.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={traits.includes(t)} onCheckedChange={() => toggleTrait(t)} />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Emojis */}
        <fieldset className="space-y-2">
          <Label className="font-semibold">Permitir emojis en el contenido</Label>
          <RadioGroup value={emojis ? "yes" : "no"} onValueChange={(v) => setEmojis(v === "yes")} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="emoji-yes" /><Label htmlFor="emoji-yes" className="cursor-pointer">Sí</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="emoji-no" /><Label htmlFor="emoji-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </fieldset>

        {/* Do rules */}
        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-success" /> Reglas de Escritura (Do)
          </Label>
          <Textarea value={doRules} onChange={(e) => setDoRules(e.target.value)} placeholder={"Escribe una regla por línea:\n• Usa testimonios de clientes\n• Menciona ubicación\n• Incluye call-to-action"} rows={4} />
        </div>

        {/* Don't rules */}
        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-destructive" /> Reglas de Escritura (Don't)
          </Label>
          <Textarea value={dontRules} onChange={(e) => setDontRules(e.target.value)} placeholder={"Escribe una regla por línea:\n• No mencionar competidores\n• No usar anglicismos\n• No hacer comparaciones de precio"} rows={4} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={handleSkip} disabled={isSaving}>
            <SkipForward className="h-4 w-4 mr-1" /> Saltar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Guardar Voz de Marca
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// src/pages/Clients/components/ClientModal/ContextTab.tsx
// Responsabilidad: Contexto completo de marca del cliente

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChipsInput } from "@/components/ui/ChipsInput";
import { Palette, Upload } from "lucide-react";

const TONE_OPTIONS = [
  { value: "professional", label: "Profesional" },
  { value: "casual", label: "Casual" },
  { value: "inspirational", label: "Inspiracional" },
  { value: "educational", label: "Educativo" },
  { value: "humorous", label: "Humorístico" },
  { value: "energetic", label: "Energético" },
] as const;

const GOAL_OPTIONS = [
  { value: "sales", label: "Ventas" },
  { value: "awareness", label: "Awareness" },
  { value: "community", label: "Comunidad" },
  { value: "leads", label: "Leads" },
  { value: "retention", label: "Retención" },
] as const;

interface ContextTabProps {
  isEdit: boolean;
  clientId: string | null;
  selectedTones: string[];
  onTonesChange: (tones: string[]) => void;
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
}

function toggleItem(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function ContextTab({
  isEdit, clientId, selectedTones, onTonesChange, selectedGoals, onGoalsChange,
}: ContextTabProps) {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
  const [forbiddenTopics, setForbiddenTopics] = useState<string[]>([]);

  if (!isEdit || !clientId) {
    return (
      <Card className="border-dashed mt-4">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Palette className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground text-center">
            Crea el cliente primero para configurar su contexto de marca
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5 mt-4">
      {/* Identidad del negocio */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm">Nombre del negocio *</Label>
          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej: Comida Fit PR" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Industria *</Label>
          <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Ej: Fitness, Restaurante" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Descripción</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción del negocio y su propuesta de valor..." rows={3} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Website URL</Label>
        <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://ejemplo.com" type="url" />
      </div>

      {/* Tags / Chips */}
      <ChipsInput value={keywords} onChange={setKeywords} label="Keywords" placeholder="Escribe y presiona Enter…" maxChips={15} />
      <ChipsInput value={forbiddenWords} onChange={setForbiddenWords} label="Palabras prohibidas" placeholder="Palabras a evitar…" maxChips={15} />
      <ChipsInput value={forbiddenTopics} onChange={setForbiddenTopics} label="Temas prohibidos" placeholder="Temas a evitar…" maxChips={10} />

      {/* Tono — Checkboxes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tono de comunicación</Label>
        <div className="grid grid-cols-2 gap-2">
          {TONE_OPTIONS.map((t) => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedTones.includes(t.value)}
                onCheckedChange={() => onTonesChange(toggleItem(selectedTones, t.value))}
              />
              <span className="text-sm">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Objetivo — Checkboxes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Objetivos</Label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((g) => (
            <label key={g.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedGoals.includes(g.value)}
                onCheckedChange={() => onGoalsChange(toggleItem(selectedGoals, g.value))}
              />
              <span className="text-sm">{g.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* File Upload — UI placeholder */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Adjunta PDFs, guías de marca...</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Disponible en Fase 2</p>
        </CardContent>
      </Card>
    </div>
  );
}

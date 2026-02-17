// src/pages/Clients/components/ClientModal/ContextTab.tsx
// Responsabilidad: Contexto de marca + upload UI placeholder + checkboxes tono/objetivo

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Palette, Upload } from "lucide-react";
import { ContextOnboarding } from "@/pages/ContentGenerator/components/ContextOnboarding";

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
    <div className="space-y-6 mt-4">
      {/* Contexto existente */}
      <ContextOnboarding clientId={clientId} onSave={() => {}} isSaving={false} />

      {/* Tono — Checkboxes */}
      <div className="space-y-3">
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
      <div className="space-y-3">
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

      {/* File Upload — UI placeholder (Fase 2) */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            Adjunta PDFs, guías de marca...
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Disponible en Fase 2
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

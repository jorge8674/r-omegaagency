// src/components/content-lab/VaultPromptBadge.tsx
// Responsabilidad única: Mostrar metadata del prompt vault usado en generación

import { Target, BookOpen, Palette, BarChart3 } from "lucide-react";

export interface VaultPromptMeta {
  id: string;
  name: string;
  technique: string;
  performance_score: number;
}

interface VaultPromptBadgeProps {
  vault: VaultPromptMeta | null | undefined;
  onViewPrompt?: (id: string) => void;
}

function getStars(score: number): string {
  if (score >= 9) return "\u2B50\u2B50\u2B50\u2B50\u2B50";
  if (score >= 7) return "\u2B50\u2B50\u2B50\u2B50";
  if (score >= 4) return "\u2B50\u2B50\u2B50";
  if (score >= 2) return "\u2B50\u2B50";
  return "\u2B50";
}

export function VaultPromptBadge({ vault, onViewPrompt }: VaultPromptBadgeProps) {
  if (!vault) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
        <BookOpen className="h-3 w-3" /> Prompt por Defecto
      </span>
    );
  }

  return (
    <div className="rounded-lg border-l-4 border-primary bg-accent/40 p-3 space-y-1.5 text-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
          <Target className="h-3 w-3" /> Vault Prompt
        </span>
        {onViewPrompt && (
          <button
            onClick={() => onViewPrompt(vault.id)}
            className="text-xs text-primary hover:underline"
          >
            Ver Prompt Completo
          </button>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-foreground">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{vault.name}</span>
      </p>
      <p className="flex items-center gap-1.5 text-muted-foreground">
        <Palette className="h-3.5 w-3.5" /> Técnica: {vault.technique}
      </p>
      <p className="flex items-center gap-1.5 text-muted-foreground">
        <BarChart3 className="h-3.5 w-3.5" /> Performance: {getStars(vault.performance_score)} ({vault.performance_score.toFixed(1)})
      </p>
    </div>
  );
}

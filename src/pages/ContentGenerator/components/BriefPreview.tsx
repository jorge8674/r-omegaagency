// src/pages/ContentGenerator/components/BriefPreview.tsx
// Responsabilidad única: Muestra y permite editar el brief generado

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Sparkles, Save } from "lucide-react";

interface BriefPreviewProps {
  brief: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onSave: (brief: string) => void;
}

export function BriefPreview({ brief, isGenerating, onGenerate, onSave }: BriefPreviewProps) {
  const [editedBrief, setEditedBrief] = useState(brief ?? "");
  const isDirty = editedBrief !== (brief ?? "");

  useEffect(() => {
    setEditedBrief(brief ?? "");
  }, [brief]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Brief de Marca</h3>
        <Button size="sm" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          )}
          Generar Brief con IA
        </Button>
      </div>

      {isGenerating ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : brief ? (
        <div className="space-y-2">
          <Textarea
            value={editedBrief}
            onChange={(e) => setEditedBrief(e.target.value)}
            rows={6}
            className="text-sm"
          />
          {isDirty && (
            <Button size="sm" variant="secondary" onClick={() => onSave(editedBrief)}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Guardar cambios
            </Button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Sin brief generado aún. Pulsa el botón para crear uno con IA.
        </p>
      )}
    </div>
  );
}

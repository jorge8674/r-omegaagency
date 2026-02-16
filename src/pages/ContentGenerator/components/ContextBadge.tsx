// src/pages/ContentGenerator/components/ContextBadge.tsx
// Responsabilidad única: Badge compacto del contexto activo

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, MessageSquare, Globe } from "lucide-react";
import type { ClientContextData } from "@/lib/api/context";

interface Props {
  context: ClientContextData;
  onEdit: () => void;
}

export function ContextBadge({ context, onEdit }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
      <div className="flex flex-1 items-center gap-3 overflow-hidden">
        <span className="truncate font-semibold text-sm">
          {context.business_name}
        </span>

        <Badge variant="secondary" className="gap-1 shrink-0">
          <MessageSquare className="h-3 w-3" />
          {context.communication_tone}
        </Badge>

        {context.platforms.length > 0 && (
          <div className="hidden sm:flex items-center gap-1">
            {context.platforms.map((p) => (
              <Badge key={p} variant="outline" className="text-xs">
                {p}
              </Badge>
            ))}
          </div>
        )}

        {context.primary_goal && (
          <Badge variant="secondary" className="hidden md:flex gap-1 shrink-0">
            <Globe className="h-3 w-3" />
            {context.primary_goal}
          </Badge>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0">
        <Pencil className="h-3.5 w-3.5 mr-1" />
        Editar
      </Button>
    </div>
  );
}

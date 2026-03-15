import { useState } from "react";
import { Bot, ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export function OmegaAgentsSection() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
        <Bot className="h-4 w-4 text-primary" />
        <span className="text-xs">Sistema de agentes en desarrollo</span>
      </div>

      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground rounded-lg border border-border/30 bg-muted/10">
        <Bot className="mb-2 h-8 w-8 opacity-30" />
        <p className="text-sm">Panel de agentes próximamente</p>
      </div>
    </div>
  );
}

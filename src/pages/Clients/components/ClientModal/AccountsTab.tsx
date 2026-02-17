// src/pages/Clients/components/ClientModal/AccountsTab.tsx
// Responsabilidad: Placeholder para cuentas de redes sociales (Fase 2)

import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export function AccountsTab() {
  return (
    <Card className="border-dashed mt-4">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Share2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          Cuentas de redes sociales
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Se configurarán en Fase 2
        </p>
      </CardContent>
    </Card>
  );
}

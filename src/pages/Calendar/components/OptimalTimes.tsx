import { useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Platform, OptimalTimesResult } from "../types";
import { PLATFORMS } from "../types";

interface OptimalTimesProps {
  fetching: boolean;
  result: OptimalTimesResult | string | null;
  onFetch: (platform: string) => Promise<void>;
}

export function OptimalTimes({ fetching, result, onFetch }: OptimalTimesProps) {
  const [platform, setPlatform] = useState<Platform>("instagram");

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Horarios Óptimos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full" variant="outline" onClick={() => onFetch(platform)} disabled={fetching}>
          {fetching ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
          ) : (
            "Calcular Horarios Óptimos"
          )}
        </Button>
        {result && (
          <div className="rounded-lg bg-secondary/50 p-3">
            <pre className="text-sm whitespace-pre-wrap">
              {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

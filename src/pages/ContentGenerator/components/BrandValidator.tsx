import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { BrandValidationResult } from "../types";

interface Props {
  result: BrandValidationResult;
}

export function BrandValidator({ result }: Props) {
  const score = result.compliance_score ?? 0;
  const pct = Math.round(score * 100);
  const color =
    score >= 0.8 ? "text-green-500" :
    score >= 0.5 ? "text-yellow-500" : "text-destructive";
  const barColor =
    score >= 0.8 ? "bg-green-500" :
    score >= 0.5 ? "bg-yellow-500" : "bg-destructive";

  return (
    <div className="rounded-lg bg-secondary/50 p-3 space-y-3">
      {/* Compliance Score */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Compliance Score</span>
            <span className={`text-sm font-bold ${color}`}>{pct}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Badge
          variant={result.is_compliant ? "default" : "destructive"}
          className="shrink-0"
        >
          {result.is_compliant ? "✅ Cumple" : "⚠️ No cumple"}
        </Badge>
      </div>

      {/* Violations */}
      {result.violations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-destructive mb-1">Violaciones:</p>
          {result.violations.map((v, i) => (
            <p key={i} className="text-sm text-muted-foreground">❌ {v}</p>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-primary mb-1">Sugerencias:</p>
          {result.suggestions
            .filter((s) => !s.startsWith("#"))
            .map((s, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                💡 {s.replace(/^##?\s*\d*\.?\s*\*?\*?/g, "").replace(/\*\*/g, "")}
              </p>
            ))}
        </div>
      )}

      {/* Revised content */}
      {result.revised_content && (
        <div>
          <p className="text-xs font-semibold text-primary mb-1">Contenido revisado:</p>
          <Textarea
            value={result.revised_content}
            disabled
            rows={4}
            className="bg-secondary/80 text-sm"
          />
        </div>
      )}
    </div>
  );
}

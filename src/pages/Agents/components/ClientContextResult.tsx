import { Target, Theater, Users, Pin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContextField {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
}

interface ContextData {
  niche?: string;
  tone?: string;
  audience?: string;
  topics?: string[];
  [key: string]: unknown;
}

interface Props {
  data: ContextData;
  isLoading?: boolean;
}

function parseResult(data: ContextData): ContextField[] {
  const fields: ContextField[] = [];
  if (data.niche) fields.push({ icon: <Target className="h-4 w-4 text-amber-500" />, label: "Nicho", value: data.niche });
  if (data.tone) fields.push({ icon: <Theater className="h-4 w-4 text-violet-500" />, label: "Tono", value: data.tone });
  if (data.audience) fields.push({ icon: <Users className="h-4 w-4 text-sky-500" />, label: "Audiencia", value: data.audience });
  if (data.topics?.length) fields.push({ icon: <Pin className="h-4 w-4 text-rose-500" />, label: "Temas que resuenan", value: data.topics });
  return fields;
}

export function ClientContextResult({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Analizando perfil del cliente…</span>
      </div>
    );
  }

  const fields = parseResult(data);

  if (fields.length === 0) {
    return (
      <Card className="border-border bg-muted/30">
        <CardContent className="py-4">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((f) => (
        <Card key={f.label} className="border-border">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              {f.icon} {f.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {Array.isArray(f.value) ? (
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {f.value.map((v) => <li key={v}>• {v}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-foreground">{f.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

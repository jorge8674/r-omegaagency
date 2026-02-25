import { FileText, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { ContextDocument } from "@/lib/api/contextLibrary";

const SCOPE_STYLE: Record<string, string> = {
  global: "bg-primary/15 text-primary border-primary/30",
  client: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  department: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

interface Props {
  doc: ContextDocument;
  onView: (doc: ContextDocument) => void;
  onDelete: (id: string) => void;
}

export function ContextDocCard({ doc, onView, onDelete }: Props) {
  const scopeLabel = doc.scope === "global" ? "Global"
    : doc.scope === "client" ? doc.client_id ?? "Cliente"
    : doc.department ?? "Departamento";

  const ago = formatDistanceToNow(new Date(doc.created_at), { addSuffix: true, locale: es });

  return (
    <Card className="bg-card/80 border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium truncate">{doc.name}</span>
          </div>
          <Badge variant="outline" className={SCOPE_STYLE[doc.scope] ?? ""}>
            {scopeLabel}
          </Badge>
        </div>

        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {doc.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">Subido {ago}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onView(doc)}>
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(doc.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { FileText, Eye, Pencil, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { ContextDocument } from "@/lib/api/contextLibrary";

const SCOPE_STYLE: Record<string, string> = {
  global: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  client: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};
const DEPT_STYLE: Record<string, string> = {
  marketing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  tech: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  operations: "bg-green-500/15 text-green-400 border-green-500/30",
  finance: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  community: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  futures: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  people: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  security: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

interface Props {
  doc: ContextDocument;
  onView: (doc: ContextDocument) => void;
  onEdit: (doc: ContextDocument) => void;
  onDelete: (id: string) => void;
}

function downloadDoc(doc: ContextDocument) {
  const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${doc.name}.txt`; a.click();
  URL.revokeObjectURL(url);
}

export function ContextDocCard({ doc, onView, onEdit, onDelete }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const scopeLabel = doc.scope === "global" ? "Global"
    : doc.scope === "client" ? doc.client_id ?? "Cliente"
    : doc.department ?? "Departamento";
  const badgeStyle = doc.scope === "department"
    ? DEPT_STYLE[doc.department ?? ""] ?? "" : SCOPE_STYLE[doc.scope] ?? "";
  const ago = formatDistanceToNow(new Date(doc.created_at), { addSuffix: true, locale: es });

  return (
    <>
      <Card className="group bg-card/80 border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium truncate">{doc.name}</span>
            </div>
            <Badge variant="outline" className={badgeStyle}>{scopeLabel}</Badge>
          </div>
          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {doc.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">{ago} · {doc.content.length.toLocaleString()} chars</span>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setSheetOpen(true)}><Eye className="h-3.5 w-3.5" /></Button>
              </TooltipTrigger><TooltipContent>Ver</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => onEdit(doc)}><Pencil className="h-3.5 w-3.5" /></Button>
              </TooltipTrigger><TooltipContent>Editar</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => downloadDoc(doc)}><Download className="h-3.5 w-3.5" /></Button>
              </TooltipTrigger><TooltipContent>Descargar</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                  onClick={() => { if (window.confirm(`¿Eliminar "${doc.name}"?`)) onDelete(doc.id); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent>Eliminar</TooltipContent></Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {doc.name}
              <Badge variant="outline" className={badgeStyle}>{scopeLabel}</Badge>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground pr-4">{doc.content}</pre>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

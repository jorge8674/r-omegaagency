import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChipsInput } from "@/components/ui/ChipsInput";
import { Upload, Loader2, PenLine, FileUp, Link2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/lib/api/core";
import type { ContextScope, CreateContextDocPayload } from "@/lib/api/contextLibrary";
import type { ClientProfile } from "@/lib/api/clients";

const OMEGA_DEPARTMENTS = [
  { value: "marketing", label: "Marketing", director: "ATLAS" },
  { value: "tech", label: "Tech", director: "LUNA" },
  { value: "operations", label: "Operations", director: "REX" },
  { value: "finance", label: "Finance", director: "VERA" },
  { value: "community", label: "Community", director: "KIRA" },
  { value: "futures", label: "Futures", director: "ORACLE" },
  { value: "people", label: "People", director: "SOPHIA" },
  { value: "security", label: "Security", director: "SENTINEL" },
];

type SourceTab = "write" | "file" | "url";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (p: CreateContextDocPayload) => Promise<unknown>;
  isCreating: boolean;
  clients: ClientProfile[];
}

export function AddContextModal({ open, onClose, onCreate, isCreating, clients }: Props) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [scope, setScope] = useState<ContextScope>("global");
  const [clientId, setClientId] = useState("");
  const [department, setDepartment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [sourceTab, setSourceTab] = useState<SourceTab>("write");
  const [urlInput, setUrlInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedChars, setExtractedChars] = useState(0);

  const reset = useCallback(() => {
    setName(""); setScope("global"); setClientId("");
    setDepartment(""); setTags([]); setContent("");
    setSourceTab("write"); setUrlInput(""); setExtractedChars(0);
  }, []);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
  }, [name]);

  const handleExtractUrl = async () => {
    if (!urlInput.trim()) return;
    setIsExtracting(true);
    try {
      const res = await apiCall<{ title?: string; content?: string }>(
        "/context/extract-url/", "POST",
        { url: urlInput.trim() } as unknown as Record<string, unknown>
      );
      if (res.content) {
        setContent(res.content);
        setExtractedChars(res.content.length);
        if (res.title && !name) setName(res.title);
        toast({ title: "Contenido extraído ✅" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al extraer";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) return;
    const payload: CreateContextDocPayload = {
      name: name.trim(), scope, content: content.trim(),
      tags: tags.length > 0 ? tags : undefined,
      ...(scope === "client" && clientId ? { client_id: clientId } : {}),
      ...(scope === "department" && department ? { department } : {}),
    };
    await onCreate(payload);
    reset(); onClose();
  };

  const SRC_TABS: { key: SourceTab; label: string; icon: React.ReactNode }[] = [
    { key: "write", label: "Escribir", icon: <PenLine className="h-3.5 w-3.5" /> },
    { key: "file", label: "Archivo", icon: <FileUp className="h-3.5 w-3.5" /> },
    { key: "url", label: "URL", icon: <Link2 className="h-3.5 w-3.5" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Agregar Documento</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre del documento</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guía de marca..." />
          </div>
          <div className="space-y-1.5">
            <Label>Scope</Label>
            <Select value={scope} onValueChange={(v) => setScope(v as ContextScope)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="client">Por Cliente</SelectItem>
                <SelectItem value="department">Por Departamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scope === "client" && (
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {scope === "department" && (
            <div className="space-y-1.5">
              <Label>Departamento</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Seleccionar departamento" /></SelectTrigger>
                <SelectContent>
                  {OMEGA_DEPARTMENTS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label} — {d.director}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <ChipsInput label="Tags" value={tags} onChange={setTags} placeholder="Escribe y presiona Enter" maxChips={10} />

          {/* Source tabs */}
          <div className="space-y-2">
            <Label>Contenido</Label>
            <div className="flex gap-1 rounded-md bg-muted p-1">
              {SRC_TABS.map((t) => (
                <button key={t.key} type="button" onClick={() => setSourceTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${sourceTab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {sourceTab === "write" && (
              <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Pega el contenido aquí..." />
            )}
            {sourceTab === "file" && (
              <label className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/50 p-6 cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Subir archivo (PDF/MD/TXT)</span>
                {content && <span className="text-xs text-primary">{content.length.toLocaleString()} chars cargados</span>}
                <input type="file" accept=".pdf,.md,.txt,.docx" className="sr-only" onChange={handleFile} />
              </label>
            )}
            {sourceTab === "url" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://raisen.agency/blog/..." className="flex-1" />
                  <Button type="button" variant="secondary" size="sm" onClick={handleExtractUrl} disabled={isExtracting || !urlInput.trim()}>
                    {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extraer"}
                  </Button>
                </div>
                {extractedChars > 0 && (
                  <div className="flex items-center gap-2 rounded-md bg-primary/10 border border-primary/20 p-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{extractedChars.toLocaleString()} caracteres extraídos</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isCreating || !name.trim() || !content.trim()}>
            {isCreating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            Guardar Documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

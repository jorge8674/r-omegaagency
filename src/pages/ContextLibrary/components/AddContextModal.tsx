import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChipsInput } from "@/components/ui/ChipsInput";
import { Upload, Loader2 } from "lucide-react";
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

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (p: CreateContextDocPayload) => Promise<unknown>;
  isCreating: boolean;
  clients: ClientProfile[];
}

export function AddContextModal({ open, onClose, onCreate, isCreating, clients }: Props) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState<ContextScope>("global");
  const [clientId, setClientId] = useState("");
  const [department, setDepartment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const reset = useCallback(() => {
    setName(""); setScope("global"); setClientId("");
    setDepartment(""); setTags([]); setContent("");
  }, []);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
  }, [name]);

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) return;
    const payload: CreateContextDocPayload = {
      name: name.trim(),
      scope,
      content: content.trim(),
      tags: tags.length > 0 ? tags : undefined,
      ...(scope === "client" && clientId ? { client_id: clientId } : {}),
      ...(scope === "department" && department ? { department } : {}),
    };
    await onCreate(payload);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Documento</DialogTitle>
        </DialogHeader>

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
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
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
                  {OMEGA_DEPARTMENTS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label} — {d.director}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ChipsInput label="Tags" value={tags} onChange={setTags} placeholder="Escribe y presiona Enter" maxChips={10} />

          <div className="space-y-1.5">
            <Label>Contenido</Label>
            <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Pega el contenido o sube un archivo..." />
            <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>Subir archivo (PDF/MD/TXT)</span>
              <input type="file" accept=".pdf,.md,.txt,.docx" className="sr-only" onChange={handleFile} />
            </label>
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

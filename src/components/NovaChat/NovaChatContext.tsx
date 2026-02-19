import { useRef } from "react";
import { FileText, Trash2, Upload, FileCheck, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { omegaApi } from "@/lib/api/omega";

export interface ContextDoc {
  id: string;
  name: string;
  content: string;
  addedAt: string;
  size: number;
  isImage?: boolean;
  imageDataUrl?: string;
}

const STORAGE_KEY = "nova_context_docs";
const ACCEPTED = ".pdf,.md,.txt,.docx,.png,.jpg,.jpeg,.webp";

export function loadContextDocs(): ContextDoc[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ContextDoc[];
  } catch { return []; }
}

export function saveContextDocs(docs: ContextDoc[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  omegaApi.saveNovaData("context_docs", docs).catch(() => {});
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

async function extractText(file: File): Promise<{ content: string; isImage: boolean; imageDataUrl?: string }> {
  const isImage = file.type.startsWith("image/");
  const isText = file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt");

  if (isImage) {
    const imageDataUrl = await new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    return {
      content: `[Imagen adjunta: ${file.name} — ${formatSize(file.size)}]`,
      isImage: true,
      imageDataUrl,
    };
  }
  if (isText) {
    const text = await new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsText(file);
    });
    return { content: text, isImage: false };
  }
  return { content: `[Documento referenciado: ${file.name} — ${formatSize(file.size)}]`, isImage: false };
}

interface Props {
  docs: ContextDoc[];
  onDocsChange: (docs: ContextDoc[]) => void;
}

export function NovaChatContext({ docs, onDocsChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const newDocs: ContextDoc[] = [...docs];
    for (const file of Array.from(files)) {
      const extracted = await extractText(file);
      newDocs.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        content: extracted.content,
        isImage: extracted.isImage,
        imageDataUrl: extracted.imageDataUrl,
        addedAt: new Date().toISOString(),
        size: file.size,
      });
    }
    onDocsChange(newDocs);
    saveContextDocs(newDocs);
  };

  const removeDoc = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    onDocsChange(updated);
    saveContextDocs(updated);
  };

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      {/* Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileCheck className="h-3.5 w-3.5 text-yellow-400" />
          <span className="text-[10px] font-semibold text-yellow-400">
            Contexto activo: {docs.length} documento{docs.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-[10px] border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-3 w-3 mr-1" />
          Subir
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Drop zone when empty */}
      {docs.length === 0 && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-yellow-500/20 rounded-xl text-muted-foreground hover:border-yellow-500/40 transition-colors cursor-pointer"
        >
          <FileText className="h-8 w-8 mb-2 text-yellow-400/30" />
          <p className="text-xs">Sube PDF, MD, TXT, DOCX</p>
          <p className="text-xs">o imágenes PNG, JPG</p>
          <p className="text-[10px] mt-1 opacity-60">NOVA usará estos archivos como contexto</p>
        </button>
      )}

      {/* Document list */}
      {docs.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2"
            >
              {doc.isImage && doc.imageDataUrl ? (
                <img
                  src={doc.imageDataUrl}
                  alt={doc.name}
                  className="h-8 w-8 rounded object-cover shrink-0 border border-yellow-500/20"
                />
              ) : doc.isImage ? (
                <Image className="h-3.5 w-3.5 text-yellow-400 mt-0.5 shrink-0" />
              ) : (
                <FileText className="h-3.5 w-3.5 text-yellow-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-foreground">{doc.name}</p>
                <p className="text-[9px] text-muted-foreground">
                  {formatDate(doc.addedAt)} · {formatSize(doc.size)}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeDoc(doc.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

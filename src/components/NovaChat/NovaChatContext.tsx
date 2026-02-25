import { useRef } from "react";
import { FileText, Trash2, Upload, Info, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import mammoth from "mammoth";
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

export function loadContextDocsLocal(): ContextDoc[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ContextDoc[];
  } catch { return []; }
}

export async function loadContextDocsAsync(): Promise<ContextDoc[]> {
  try {
    const remote = await omegaApi.loadNovaData("context_docs");
    if (Array.isArray(remote?.content) && remote.content.length > 0) {
      console.log("✅ Context docs cargados desde backend:", remote.content.length);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote.content));
      return remote.content as ContextDoc[];
    }
  } catch {
    console.warn("⚠️ Backend load context_docs failed, usando localStorage");
  }
  const local = loadContextDocsLocal();
  console.log("✅ Context docs cargados desde localStorage:", local.length);
  return local;
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
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

async function extractText(
  file: File
): Promise<{ content: string; isImage: boolean; imageDataUrl?: string }> {
  const isImage = file.type.startsWith("image/");
  const isText =
    file.type === "text/plain" ||
    file.type === "text/markdown" ||
    file.type === "text/x-markdown" ||
    file.name.endsWith(".md") ||
    file.name.endsWith(".markdown") ||
    file.name.endsWith(".txt");
  const isDocx =
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx");

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

  if (isDocx) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      console.log(`✅ DOCX extraído: ${file.name} — ${text.length} caracteres`);
      return { content: text || `[DOCX vacío: ${file.name}]`, isImage: false };
    } catch (err) {
      console.error("Error leyendo DOCX:", err);
      return { content: `[Error leyendo ${file.name}]`, isImage: false };
    }
  }

  if (isText) {
    const text = await file.text();
    return { content: text, isImage: false };
  }

  // PDF and other binaries — reference only
  return {
    content: `[Documento referenciado: ${file.name} — ${formatSize(file.size)}]`,
    isImage: false,
  };
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
      console.log(`📄 Procesando: ${file.name}`);
      const extracted = await extractText(file);
      console.log(`✅ Contenido extraído: ${extracted.content.substring(0, 80)}...`);
      newDocs.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        content: extracted.content,
        isImage: extracted.isImage,
        imageDataUrl: extracted.imageDataUrl,
        addedAt: new Date().toISOString(),
        size: file.size,
      });
      console.log(`✅ Documento agregado al contexto: ${file.name}`);
    }
    onDocsChange(newDocs);
    saveContextDocs(newDocs);
    // reset input so same file can be re-uploaded
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeDoc = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    onDocsChange(updated);
    saveContextDocs(updated);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/20">
        <p className="text-xs font-semibold text-foreground">
          Documentos de Contexto{" "}
          <span className="text-yellow-400">({docs.length})</span>
        </p>
        <p className="text-[9px] text-muted-foreground mt-0.5">
          Se incluyen automáticamente en cada mensaje a NOVA
        </p>
      </div>

      {/* Upload button */}
      <div className="px-4 py-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-yellow-500/30 rounded-xl text-muted-foreground hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-colors cursor-pointer"
        >
          <Upload className="h-4 w-4 text-yellow-400/70" />
          <span className="text-xs">Subir PDF, DOCX, MD, TXT, PNG, JPG</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2 scrollbar-thin">
        {docs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
            <FileText className="h-7 w-7 mb-1.5 text-yellow-400/20" />
            <p className="text-[10px]">No hay documentos en el contexto</p>
          </div>
        )}

        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-start gap-2.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2.5"
          >
            {/* Thumbnail or icon */}
            {doc.isImage && doc.imageDataUrl ? (
              <img
                src={doc.imageDataUrl}
                alt={doc.name}
                className="h-9 w-9 rounded object-cover shrink-0 border border-yellow-500/20"
              />
            ) : doc.isImage ? (
              <Image className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-foreground">{doc.name}</p>
              <p className="text-[9px] text-muted-foreground">
                {formatDate(doc.addedAt)} · {formatSize(doc.size)}
              </p>
              {/* Content preview */}
              {!doc.isImage && doc.content && !doc.content.startsWith("[") && (
                <p className="text-[9px] text-muted-foreground/70 mt-1 line-clamp-2 leading-relaxed">
                  {doc.content.substring(0, 160)}
                </p>
              )}
              {/* If doc was referenced only */}
              {!doc.isImage && doc.content.startsWith("[") && (
                <p className="text-[9px] text-yellow-400/50 mt-1 italic">
                  {doc.content}
                </p>
              )}
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

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/20 bg-muted/20">
        <div className="flex items-start gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground leading-relaxed">
            Los documentos se inyectan en el system prompt de NOVA automáticamente.
            No necesitas presionar ningún botón.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState, useCallback } from "react";
import { Paperclip, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/lib/api/core";

export interface Attachment {
  id: string;
  file: File;
  type: "image" | "document";
  preview?: string;       // base64 for images
  extractedText?: string; // extracted text for docs
  charCount?: number;
}

interface AttachmentInputProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  onTextExtracted: (text: string, filename: string) => void;
}

const MAX_IMAGES = 1;
const MAX_DOCS = 3;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOC_EXTENSIONS = [".pdf", ".txt", ".md"];

export function AttachmentInput({ attachments, onChange, onTextExtracted }: AttachmentInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);
  const { toast } = useToast();

  const images = attachments.filter((a) => a.type === "image");
  const docs = attachments.filter((a) => a.type === "document");

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const isImage = IMAGE_TYPES.includes(file.type);
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const isDoc = DOC_EXTENSIONS.includes(ext);

    if (!isImage && !isDoc) {
      toast({ title: "Formato no soportado", description: "Usa JPG, PNG, WEBP, PDF, TXT o MD", variant: "destructive" });
      return;
    }

    if (isImage && images.length >= MAX_IMAGES) {
      toast({ title: `Máximo ${MAX_IMAGES} imagen`, variant: "destructive" });
      return;
    }
    if (isDoc && docs.length >= MAX_DOCS) {
      toast({ title: `Máximo ${MAX_DOCS} documentos`, variant: "destructive" });
      return;
    }

    const id = crypto.randomUUID();

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onChange([...attachments, { id, file, type: "image", preview }]);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Document — extract text
    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("omega_token");
      const res = await fetch(`${API_BASE}/context/extract-file/`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Error" }));
        throw new Error(err.detail || "Error extrayendo archivo");
      }
      const data = await res.json() as { content: string; title: string; char_count: number };
      const att: Attachment = { id, file, type: "document", extractedText: data.content, charCount: data.char_count };
      onChange([...attachments, att]);
      onTextExtracted(data.content, file.name);
      toast({ title: `✅ ${data.char_count.toLocaleString()} caracteres extraídos` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error al procesar archivo", description: msg, variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  }, [attachments, images.length, docs.length, onChange, onTextExtracted, toast]);

  const remove = (id: string) => onChange(attachments.filter((a) => a.id !== id));

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" className="hidden" accept="image/*,.pdf,.txt,.md" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      <Button type="button" variant="ghost" size="sm" className="text-xs gap-1.5" onClick={() => inputRef.current?.click()} disabled={extracting}>
        {extracting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
        {extracting ? "Extrayendo..." : "Adjuntar imagen o documento"}
      </Button>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((a) => (
            <div key={a.id} className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-xs">
              {a.type === "image" ? (
                <>
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  {a.preview && <img src={a.preview} alt="" className="h-8 w-8 rounded object-cover" />}
                  <span className="truncate max-w-[120px]">{a.file.name}</span>
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[120px]">{a.file.name}</span>
                  {a.charCount && <span className="text-muted-foreground">— {a.charCount.toLocaleString()} chars</span>}
                </>
              )}
              <button type="button" onClick={() => remove(a.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

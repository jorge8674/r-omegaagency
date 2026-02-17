import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  listBrandFiles,
  uploadBrandFile,
  deleteBrandFile,
  formatFileSize,
  getFileEmoji,
  PLAN_LIMITS,
} from "@/lib/api/brandFiles";

interface BrandFilesUploadProps {
  client: { id: string; plan: string } | null;
}

export function BrandFilesUpload({ client }: BrandFilesUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteFileName, setDeleteFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const plan = client?.plan || "basic";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.basic;

  const { data: filesData, isLoading } = useQuery({
    queryKey: ["brand-files", client?.id],
    queryFn: () => listBrandFiles(client!.id),
    enabled: !!client?.id,
  });

  const files = filesData?.data || [];
  const totalSize = filesData?.total_size || 0;
  const totalSizeMb = totalSize / (1024 * 1024);
  const atLimit = files.length >= limits.maxFiles;

  const deleteMutation = useMutation({
    mutationFn: deleteBrandFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-files", client?.id] });
      toast({ title: "Archivo eliminado" });
      setDeleteId(null);
    },
    onError: (e: Error) => {
      toast({ title: "Error al eliminar", description: e.message, variant: "destructive" });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !client) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: "Archivo muy grande", description: "Máximo 25MB por archivo", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      await uploadBrandFile(client.id, file);
      queryClient.invalidateQueries({ queryKey: ["brand-files", client.id] });
      toast({ title: `✅ ${file.name} subido exitosamente` });
    } catch (error: unknown) {
      let msg = error instanceof Error ? error.message : "Error al subir archivo";
      try {
        const jsonStart = msg.indexOf("{");
        if (jsonStart !== -1) {
          const parsed = JSON.parse(msg.slice(jsonStart));
          if (typeof parsed?.detail === "string") msg = parsed.detail;
        }
      } catch { /* ignore parse error */ }
      toast({ title: "Error al subir", description: msg, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteFileName(name);
  };

  if (!client) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        💡 Guarda el cliente primero para adjuntar archivos.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.svg,.gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header + usage */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Guías de marca</h4>
          <p className="text-xs text-muted-foreground">
            {files.length}/{limits.maxFiles} archivos · {totalSizeMb.toFixed(1)}MB / {limits.totalMb}MB
            {" "}· Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={atLimit || isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Upload className="mr-1 h-3 w-3" />}
          {isUploading ? "Subiendo..." : "Adjuntar"}
        </Button>
      </div>

      {/* Usage bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${totalSizeMb / limits.totalMb > 0.8 ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${Math.min((totalSizeMb / limits.totalMb) * 100, 100)}%` }}
        />
      </div>

      {/* Limit message */}
      {atLimit && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>
            Límite alcanzado ({limits.maxFiles} archivos en plan {plan}).
            {" "}Actualiza a {plan === "basic" ? "Pro" : "Enterprise"} para más espacio.
          </span>
        </div>
      )}

      {/* File list */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 ? (
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => !atLimit && fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">PDF, Word, PPT, imágenes · 25MB por archivo</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-2 rounded border border-border/30 bg-muted/20 px-3 py-2">
              <span className="text-base">{getFileEmoji(file.mime_type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
              </div>
              {file.storage_url && (
                <a
                  href={file.storage_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline shrink-0"
                >
                  Ver
                </a>
              )}
              <button
                type="button"
                onClick={() => confirmDelete(file.id, file.file_name)}
                className="p-1 rounded hover:bg-destructive/10 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar archivo?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteFileName} se eliminará permanentemente y el espacio se liberará.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

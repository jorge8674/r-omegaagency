import { X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { UploadProgress } from "../hooks/useBulkUpload";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  files: File[];
  onRemove: (index: number) => void;
  progress: UploadProgress | null;
  summary: { success: number; failed: number } | null;
  disabled?: boolean;
}

export function BulkFileList({ files, onRemove, progress, summary, disabled }: Props) {
  if (!files.length && !summary) return null;

  const statusIcon = (status: string) => {
    switch (status) {
      case "uploading": return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
      case "success": return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
      case "error": return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      default: return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const isUploading = progress !== null && !summary;

  return (
    <div className="space-y-2">
      {/* Counter */}
      {files.length > 0 && !summary && (
        <p className="text-xs text-muted-foreground font-medium">
          {files.length} archivo{files.length !== 1 ? "s" : ""} seleccionado{files.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Progress bar */}
      {isUploading && progress && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-primary">
            Subiendo {progress.current + 1 > progress.total ? progress.total : progress.current + 1} de {progress.total}...
          </p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 p-2.5 text-sm">
          {summary.success > 0 && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" /> {summary.success} subido{summary.success !== 1 ? "s" : ""}
            </span>
          )}
          {summary.failed > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertCircle className="h-4 w-4" /> {summary.failed} fallido{summary.failed !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border border-border/30 p-1.5">
          {files.map((file, i) => {
            const result = progress?.results[i];
            return (
              <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted/40">
                {result ? statusIcon(result.status) : <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-muted-foreground shrink-0">{formatSize(file.size)}</span>
                {result?.status === "error" && (
                  <span className="text-destructive truncate max-w-[100px]" title={result.error}>{result.error}</span>
                )}
                {!isUploading && !summary && (
                  <button type="button" onClick={() => onRemove(i)} disabled={disabled}
                    className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useCallback } from "react";
import { API_BASE } from "@/lib/api/core";
import type { CreateContextDocPayload } from "@/lib/api/contextLibrary";

export interface FileResult {
  name: string;
  size: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export interface UploadProgress {
  current: number;
  total: number;
  results: FileResult[];
}

interface UseBulkUploadOptions {
  buildPayload: (content: string, fileName: string) => CreateContextDocPayload;
  onCreate: (p: CreateContextDocPayload) => Promise<unknown>;
}

export function useBulkUpload({ buildPayload, onCreate }: UseBulkUploadOptions) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [summary, setSummary] = useState<{ success: number; failed: number } | null>(null);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    setSelectedFiles((prev) => {
      const combined = [...prev];
      for (let i = 0; i < files.length; i++) {
        if (combined.length >= 100) break;
        const f = files[i];
        if (!combined.some((e) => e.name === f.name && e.size === f.size)) {
          combined.push(f);
        }
      }
      return combined;
    });
    setSummary(null);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setProgress(null);
    setSummary(null);
  }, []);

  const extractFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("omega_token");
    const res = await fetch(`${API_BASE}/context/extract-file/`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error((err as { detail?: string }).detail || "Error extrayendo");
    }
    const data = (await res.json()) as { content?: string };
    if (!data.content) throw new Error("Sin contenido extraído");
    return data.content;
  };

  const uploadAll = useCallback(async () => {
    if (!selectedFiles.length) return;

    const results: FileResult[] = selectedFiles.map((f) => ({
      name: f.name,
      size: f.size,
      status: "pending" as const,
    }));

    setProgress({ current: 0, total: selectedFiles.length, results: [...results] });
    setSummary(null);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      results[i].status = "uploading";
      setProgress({ current: i, total: selectedFiles.length, results: [...results] });

      try {
        const content = await extractFile(selectedFiles[i]);
        const payload = buildPayload(content, selectedFiles[i].name);
        await onCreate(payload);
        results[i].status = "success";
        successCount++;
      } catch (err: unknown) {
        results[i].status = "error";
        results[i].error = err instanceof Error ? err.message : "Error";
        failedCount++;
      }

      setProgress({ current: i + 1, total: selectedFiles.length, results: [...results] });
    }

    setSummary({ success: successCount, failed: failedCount });
    if (successCount === selectedFiles.length) {
      setSelectedFiles([]);
    }
  }, [selectedFiles, buildPayload, onCreate]);

  const isUploading = progress !== null && summary === null;

  return {
    selectedFiles,
    addFiles,
    removeFile,
    clearFiles,
    progress,
    summary,
    isUploading,
    uploadAll,
    setSummary,
  };
}

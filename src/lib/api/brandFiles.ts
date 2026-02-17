import { API_BASE } from "./core";

export interface BrandFile {
  id: string;
  client_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  storage_url: string | null;
  created_at: string;
}

interface ListResponse {
  success: boolean;
  data: BrandFile[];
  total: number;
  total_size: number;
}

interface FileResponse {
  success: boolean;
  data?: BrandFile;
  message?: string;
}

export async function listBrandFiles(clientId: string): Promise<ListResponse> {
  const token = localStorage.getItem("omega_token");
  const res = await fetch(`${API_BASE}/brand-files/?client_id=${clientId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json();
}

export async function uploadBrandFile(clientId: string, file: File): Promise<FileResponse> {
  const token = localStorage.getItem("omega_token");
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/brand-files/upload/?client_id=${clientId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json();
}

export async function deleteBrandFile(fileId: string): Promise<FileResponse> {
  const token = localStorage.getItem("omega_token");
  const res = await fetch(`${API_BASE}/brand-files/${fileId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const PLAN_LIMITS: Record<string, { maxFiles: number; totalMb: number }> = {
  basic: { maxFiles: 3, totalMb: 25 },
  pro: { maxFiles: 10, totalMb: 100 },
  enterprise: { maxFiles: 30, totalMb: 500 },
};

export function getFileEmoji(mimeType: string): string {
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word")) return "📝";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📊";
  if (mimeType.startsWith("image/")) return "🖼️";
  return "📎";
}

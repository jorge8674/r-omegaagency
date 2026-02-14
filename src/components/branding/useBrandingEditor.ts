import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";

function hslStringToHex(hsl: string): string {
  const match = hsl.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!match) return hsl;
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export interface BrandingData {
  agency_name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  hero_type: "image" | "video";
  hero_media_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  pain_section: { active: boolean; title: string; description: string; items: { text: string; emoji: string }[] };
  solutions_section: { active: boolean; title: string; items: { title: string; description: string }[] };
  services_section: { active: boolean; title: string; items: { name: string; description: string; price: string }[] };
  metrics_section: { active: boolean; items: { number: string; label: string }[] };
  process_section: { active: boolean; title: string; items: { step: number; title: string; description: string }[] };
  testimonials: { active: boolean; items: { name: string; company: string; text: string; rating: number }[] };
  client_logos: { active: boolean; items: { url: string; name: string }[] };
  contact_email: string;
  contact_phone: string;
  social_links: { instagram: string; facebook: string; linkedin: string; tiktok: string; twitter: string; whatsapp: string };
  footer_text: string;
}

const defaultBranding: BrandingData = {
  agency_name: "", logo_url: "", primary_color: "#D4A017", secondary_color: "#1a1a2e",
  hero_type: "image", hero_media_url: "", hero_title: "", hero_subtitle: "", hero_cta_text: "Empezar Ahora", hero_cta_url: "",
  pain_section: { active: true, title: "¿Te identificas?", description: "", items: [{ text: "", emoji: "😓" }] },
  solutions_section: { active: true, title: "Nuestras Soluciones", items: [{ title: "", description: "" }] },
  services_section: { active: true, title: "Servicios", items: [{ name: "", description: "", price: "" }] },
  metrics_section: { active: true, items: [{ number: "", label: "" }] },
  process_section: { active: true, title: "Nuestro Proceso", items: [{ step: 1, title: "", description: "" }] },
  testimonials: { active: true, items: [{ name: "", company: "", text: "", rating: 5 }] },
  client_logos: { active: false, items: [] },
  contact_email: "", contact_phone: "",
  social_links: { instagram: "", facebook: "", linkedin: "", tiktok: "", twitter: "", whatsapp: "" },
  footer_text: "",
};

export function useBrandingEditor() {
  const [searchParams] = useSearchParams();
  const resellerId = searchParams.get("reseller_id") || "";
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!resellerId) return;
    setLoading(true);
    api.getResellerBranding(resellerId)
      .then((r: any) => {
        const d = r?.data || r || {};
        // Convert HSL strings from API to hex for color picker compatibility
        if (d.primary_color && !d.primary_color.startsWith("#")) {
          d.primary_color = hslStringToHex(d.primary_color);
        }
        if (d.secondary_color && !d.secondary_color.startsWith("#")) {
          d.secondary_color = hslStringToHex(d.secondary_color);
        }
        setBranding({ ...defaultBranding, ...d });
        setSlug(d.slug || r?.slug || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resellerId]);

  const update = <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => {
    setBranding((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const base = (import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1");
      const url = `${base}/resellers/${resellerId}/branding`;
      const payload = branding as any;
      console.log("BRANDING SAVE PAYLOAD:", JSON.stringify(payload, null, 2));
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("BRANDING ERROR DETAIL:", JSON.stringify(data, null, 2));
        toast({ title: "Error al guardar", description: data?.detail || "Intenta de nuevo.", variant: "destructive" });
      } else {
        toast({ title: "Cambios guardados", description: "El branding se actualizó correctamente." });
      }
    } catch (err) {
      console.error("BRANDING SAVE EXCEPTION:", err);
      toast({ title: "Error al guardar", description: "Intenta de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file: File, field: "logo_url" | "hero_media_url") => {
    if (file.size > 15 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "Máximo 15MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const base = (import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1").replace("/api/v1", "");
      const res = await fetch(`${base}/api/v1/resellers/${resellerId}/upload-hero-media`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const url = data?.url || data?.data?.url || data?.hero_media_url || "";
      if (url) update(field, url);
      toast({ title: "Archivo subido" });
    } catch {
      toast({ title: "Error al subir", description: "Intenta de nuevo.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return { resellerId, slug, branding, loading, saving, uploading, update, save, uploadFile, setBranding };
}

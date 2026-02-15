import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOmegaAuth } from "@/contexts/AuthContext";
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
  agency_tagline: string;
  badge_text: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  hero_type: "image" | "video" | "none";
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
  social_links: { instagram: string; facebook: string; linkedin: string; tiktok: string; twitter: string; whatsapp: string; youtube: string };
  footer_text: string;
  legal_pages: { title: string; content: string }[];
  pricing_plans: { name: string; price: number; period: "mes" | "año"; description: string; features: string[]; is_popular: boolean }[];
}

const defaultBranding: BrandingData = {
  agency_name: "", agency_tagline: "", badge_text: "", logo_url: "", primary_color: "#D4A017", secondary_color: "#1a1a2e",
  hero_type: "image", hero_media_url: "", hero_title: "", hero_subtitle: "", hero_cta_text: "Empezar Ahora", hero_cta_url: "",
  pain_section: { active: true, title: "¿Te identificas?", description: "", items: [{ text: "", emoji: "😓" }] },
  solutions_section: { active: true, title: "Nuestras Soluciones", items: [{ title: "", description: "" }] },
  services_section: { active: true, title: "Servicios", items: [{ name: "", description: "", price: "" }] },
  metrics_section: { active: true, items: [{ number: "", label: "" }] },
  process_section: { active: true, title: "Nuestro Proceso", items: [{ step: 1, title: "", description: "" }] },
  testimonials: { active: true, items: [{ name: "", company: "", text: "", rating: 5 }] },
  client_logos: { active: false, items: [] },
  contact_email: "", contact_phone: "",
  social_links: { instagram: "", facebook: "", linkedin: "", tiktok: "", twitter: "", whatsapp: "", youtube: "" },
  footer_text: "",
  legal_pages: [],
  pricing_plans: [],
};

export function useBrandingEditor() {
  const { user } = useOmegaAuth();
  const [searchParams] = useSearchParams();
  const resellerId = searchParams.get("reseller_id") || user?.reseller_id || "";
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sanitizeObj = (val: unknown) => {
    if (Array.isArray(val) || val === null || val === undefined) return {};
    return val;
  };

  useEffect(() => {
    if (!resellerId) return;
    setLoading(true);
    api.getResellerBranding(resellerId)
      .then((r: any) => {
        const d = r?.data || r || {};
        if (d.primary_color && !d.primary_color.startsWith("#")) {
          d.primary_color = hslStringToHex(d.primary_color);
        }
        if (d.secondary_color && !d.secondary_color.startsWith("#")) {
          d.secondary_color = hslStringToHex(d.secondary_color);
        }
        setBranding({
          ...defaultBranding,
          agency_name: d.agency_name || "",
          agency_tagline: d.agency_tagline || "",
          badge_text: d.badge_text || "",
          logo_url: d.logo_url || "",
          primary_color: d.primary_color || defaultBranding.primary_color,
          secondary_color: d.secondary_color || defaultBranding.secondary_color,
          hero_type: d.hero_media_type || "image",
          hero_media_url: d.hero_media_url || "",
          hero_title: d.hero_title || "",
          hero_subtitle: d.hero_subtitle || "",
          hero_cta_text: d.hero_cta_text || "Empezar Ahora",
          hero_cta_url: d.hero_cta_url || "",
          pain_section: { active: true, title: defaultBranding.pain_section.title, description: "", items: Array.isArray(d.pain_items) ? d.pain_items : defaultBranding.pain_section.items },
          solutions_section: { active: true, title: defaultBranding.solutions_section.title, items: Array.isArray(d.solution_items) ? d.solution_items : defaultBranding.solutions_section.items },
          services_section: { active: true, title: defaultBranding.services_section.title, items: Array.isArray(d.services) ? d.services : defaultBranding.services_section.items },
          metrics_section: { active: true, items: Array.isArray(d.metrics) ? d.metrics : defaultBranding.metrics_section.items },
          process_section: { active: true, title: defaultBranding.process_section.title, items: Array.isArray(d.process_steps) ? d.process_steps : defaultBranding.process_section.items },
          testimonials: { active: true, items: Array.isArray(d.testimonials) ? d.testimonials : defaultBranding.testimonials.items },
          client_logos: defaultBranding.client_logos,
          contact_email: d.footer_email || "",
          contact_phone: d.footer_phone || "",
          social_links: (d.social_links && typeof d.social_links === 'object' && !Array.isArray(d.social_links)) ? d.social_links : defaultBranding.social_links,
          footer_text: d.footer_text || "",
          legal_pages: Array.isArray(d.legal_pages) ? d.legal_pages : [],
          pricing_plans: Array.isArray(d.pricing_plans) ? d.pricing_plans : [],
        });
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
      const sanitizeDict = (val: unknown) => {
        if (!val || Array.isArray(val)) return {};
        return val;
      };
      const payload: Record<string, unknown> = {
        agency_name: branding.agency_name || null,
        agency_tagline: branding.agency_tagline || null,
        badge_text: branding.badge_text || null,
        logo_url: branding.logo_url || null,
        primary_color: branding.primary_color || "#d4891a",
        secondary_color: branding.secondary_color || "#1e2030",
        hero_media_type: branding.hero_type === "none" ? null : branding.hero_type || "image",
        hero_media_url: branding.hero_media_url || null,
        hero_cta_text: branding.hero_cta_text || "Comenzar",
        pain_items: branding.pain_section?.items?.length ? branding.pain_section.items : null,
        solution_items: branding.solutions_section?.items?.length ? branding.solutions_section.items : null,
        services: branding.services_section?.items?.length ? branding.services_section.items : null,
        metrics: branding.metrics_section?.items?.length ? branding.metrics_section.items : null,
        process_steps: branding.process_section?.items?.length ? branding.process_section.items : null,
        testimonials: branding.testimonials?.items?.length ? branding.testimonials.items : null,
        footer_email: branding.contact_email || null,
        footer_phone: branding.contact_phone || null,
        social_links: (() => {
          const sl = branding.social_links || {};
          const filtered = Object.fromEntries(Object.entries(sl).filter(([, v]) => v));
          return Object.keys(filtered).length ? filtered : null;
        })(),
        legal_pages: branding.legal_pages?.length ? branding.legal_pages : null,
        pricing_plans: branding.pricing_plans?.length ? branding.pricing_plans : null,
      };
      console.log("BRANDING SAVE PAYLOAD:", JSON.stringify(payload, null, 2));
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("BRANDING ERROR DETAIL:", JSON.stringify(data, null, 2));
        const msg = Array.isArray(data?.detail)
          ? data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
          : (typeof data?.detail === 'string' ? data.detail : "Intenta de nuevo.");
        toast({ title: "Error al guardar", description: msg, variant: "destructive" });
      } else {
        console.log("BRANDING SAVE OK:", data);
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

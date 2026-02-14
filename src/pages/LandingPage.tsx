import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingSections from "@/components/landing/LandingSections";
import LandingContact from "@/components/landing/LandingContact";
import LandingFooter from "@/components/landing/LandingFooter";

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

type Status = "loading" | "ok" | "suspended" | "not_found" | "error";

const safeObj = (v: unknown) => (!v || Array.isArray(v) ? {} : (v as Record<string, any>));

const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [reseller, setReseller] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    if (!slug) { setStatus("not_found"); return; }
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/resellers/slug/${slug}`);
        if (res.status === 404) { setStatus("not_found"); return; }
        if (!res.ok) { setStatus("error"); return; }
        const json = await res.json();
        const wrapper = json.data || json;
        // API may nest: { data: { reseller: {...}, branding: {...} } }
        const resellerData = wrapper.reseller || wrapper;
        const brandingData = wrapper.branding || null;
        if (resellerData.status === "suspended" || resellerData.suspend_switch) { setStatus("suspended"); return; }
        setReseller(resellerData);

        if (brandingData) {
          setBranding(brandingData);
        } else {
          // Fallback: fetch branding separately
          const bRes = await fetch(`${API_BASE}/resellers/${resellerData.id}/branding`);
          if (bRes.ok) {
            const bJson = await bRes.json();
            setBranding(bJson.data || bJson);
          } else {
            setBranding({});
          }
        }
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    })();
  }, [slug]);

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", background: "#0D0E12", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,.1)", borderTopColor: "var(--brand-primary, #d4891a)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (status === "suspended") return (
    <div style={{ minHeight: "100vh", background: "#0D0E12", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif" }}>
      <p style={{ fontSize: 20, opacity: 0.5 }}>Esta agencia no está disponible</p>
    </div>
  );

  if (status === "not_found" || status === "error") return (
    <div style={{ minHeight: "100vh", background: "#0D0E12", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif" }}>
      <p style={{ fontSize: 20, opacity: 0.5 }}>Agencia no encontrada</p>
    </div>
  );

  const b = branding || {};
  const agencyName = reseller?.agency_name || "";
  const ctaText = b.hero_cta_text || "Comenzar";
  const ctaUrl = b.hero_cta_url || "#contacto";

  return (
    <div id="landing-root" style={{
      ["--brand-primary" as any]: b.primary_color || "#d4891a",
      ["--brand-secondary" as any]: b.secondary_color || "#1e2030",
      fontFamily: "DM Sans, sans-serif",
      background: "#0D0E12",
      color: "white",
      minHeight: "100vh",
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
      `}</style>
      <LandingNavbar agencyName={agencyName} logoUrl={b.logo_url} ctaText={ctaText} ctaUrl={ctaUrl} />
      <LandingHero
        heroType={b.hero_type || b.hero_media_type}
        heroMediaUrl={b.hero_media_url}
        heroTitle={b.hero_title}
        heroSubtitle={b.hero_subtitle}
        ctaText={ctaText}
        ctaUrl={ctaUrl}
        agencyName={agencyName}
      />
      <LandingSections
        metrics={safeObj(b.metrics_section)}
        pain={safeObj(b.pain_section)}
        solutions={safeObj(b.solutions_section)}
        services={safeObj(b.services_section)}
        process={safeObj(b.process_section)}
        testimonials={safeObj(b.testimonials_section)}
        clientLogos={safeObj(b.client_logos_section)}
      />
      <LandingContact resellerId={reseller.id} contactEmail={b.contact_email} />
      <LandingFooter agencyName={agencyName} footerText={b.footer_text} socialLinks={safeObj(b.social_links) as Record<string, string>} />
    </div>
  );
};

export default LandingPage;

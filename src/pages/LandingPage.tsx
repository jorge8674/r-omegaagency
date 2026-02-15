import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingSections from "@/components/landing/LandingSections";
import LandingContact from "@/components/landing/LandingContact";
import LandingFooter from "@/components/landing/LandingFooter";

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

type Status = "loading" | "ok" | "suspended" | "not_found" | "error";

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
        const resellerData = wrapper.reseller || wrapper;
        const brandingData = wrapper.branding || {};
        if (resellerData.status === "suspended" || resellerData.suspend_switch) { setStatus("suspended"); return; }
        setReseller(resellerData);
        setBranding(brandingData);
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
    <div style={{ minHeight: "100vh", background: "#0D0E12", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⚠️</div>
      <p style={{ fontSize: 20, opacity: 0.5 }}>Esta agencia no está disponible</p>
    </div>
  );

  if (status === "not_found" || status === "error") return (
    <div style={{ minHeight: "100vh", background: "#0D0E12", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", gap: 16 }}>
      <div style={{ fontSize: 56, opacity: 0.2 }}>404</div>
      <p style={{ fontSize: 20, opacity: 0.5 }}>Agencia no encontrada</p>
    </div>
  );

  const b = branding || {};
  console.log('branding completo:', b);
  console.log('pricing_plans:', b?.pricing_plans);
  const agencyName = reseller?.agency_name || "";
  const ctaText = b.hero_cta_text || "Comenzar";
  const ctaUrl = b.hero_cta_url || "#contacto";

  // Map flat backend fields to section objects for LandingSections
  const painItems = Array.isArray(b.pain_items) ? b.pain_items : [];
  const solutionItems = Array.isArray(b.solution_items) ? b.solution_items : [];
  const services = Array.isArray(b.services) ? b.services : [];
  const metrics = Array.isArray(b.metrics) ? b.metrics : [];
  const processSteps = Array.isArray(b.process_steps) ? b.process_steps : [];
  const testimonials = Array.isArray(b.testimonials) ? b.testimonials : [];
  const pricingPlans = Array.isArray(b.pricing_plans) ? b.pricing_plans : [];
  const legalPages = Array.isArray(b.legal_pages) ? b.legal_pages : [];

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
        heroTitle={b.hero_title || b.agency_tagline || agencyName}
        heroSubtitle={b.hero_subtitle}
        ctaText={ctaText}
        ctaUrl={ctaUrl}
        agencyName={agencyName}
        badgeText={b.badge_text}
      />
      <LandingSections
        metrics={{ active: metrics.length > 0, items: metrics }}
        pain={{ active: painItems.length > 0, title: "¿Te suena familiar?", points: painItems.map((p: any) => typeof p === 'string' ? p : p.text || '') }}
        solutions={{ active: solutionItems.length > 0, items: solutionItems }}
        services={{ active: services.length > 0, title: "Servicios", items: services }}
        process={{ active: processSteps.length > 0, title: "Nuestro Proceso", steps: processSteps }}
        testimonials={{ active: testimonials.length > 0, items: testimonials }}
        clientLogos={{ active: false, items: [] }}
        pricingPlans={pricingPlans}
        ctaText={ctaText}
      />
      <LandingContact resellerId={reseller.id} slug={slug} contactEmail={b.footer_email} ctaText={ctaText} />
      <LandingFooter
        agencyName={agencyName}
        footerText={b.footer_text}
        socialLinks={b.social_links && typeof b.social_links === 'object' && !Array.isArray(b.social_links) ? b.social_links : {}}
        footerEmail={b.footer_email}
        footerPhone={b.footer_phone}
        legalPages={legalPages}
      />
    </div>
  );
};

export default LandingPage;
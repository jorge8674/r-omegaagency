import React from "react";
import { ArrowDown } from "lucide-react";

interface Props {
  heroType: string | null;
  heroMediaUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  ctaText: string;
  ctaUrl: string;
  agencyName?: string;
  badgeText?: string | null;
}

const LandingHero: React.FC<Props> = ({
  heroType, heroMediaUrl, heroTitle, heroSubtitle, ctaText, ctaUrl, agencyName, badgeText,
}) => {
  const hasMedia = heroMediaUrl && heroType && heroType !== "none";

  return (
    <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {hasMedia && heroType === "video" ? (
        <video autoPlay loop muted playsInline src={heroMediaUrl!} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : hasMedia && heroType === "image" ? (
        <img src={heroMediaUrl!} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : null}

      <div style={{
        position: "absolute", inset: 0,
        background: hasMedia
          ? "linear-gradient(to bottom, rgba(13,14,18,0.3), rgba(13,14,18,0.5) 50%, #0D0E12)"
          : "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #d4891a) 15%, transparent), #0D0E12 40%)",
      }} />

      {!hasMedia && (
        <>
          <div style={{ position: "absolute", top: "30%", left: "25%", width: 384, height: 384, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)", filter: "blur(100px)", animation: "float 6s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 300, height: 300, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 6%, transparent)", filter: "blur(80px)", animation: "float 6s ease-in-out infinite 1s" }} />
        </>
      )}

      <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "200px 200px" }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "120px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        {(badgeText || agencyName) && (
          <span style={{
            display: "inline-block", marginBottom: 32,
            borderRadius: 9999, border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)",
            background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)",
            padding: "6px 16px",
            fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.3em",
            color: "var(--brand-primary, #d4891a)",
          }}>
            {badgeText || agencyName}
          </span>
        )}

        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(42px, 6vw, 72px)",
          fontWeight: 700, lineHeight: 0.95,
          letterSpacing: "-0.02em",
          color: "white", margin: "0 0 24px",
        }}>
          {heroTitle || agencyName || ""}
        </h1>

        {heroSubtitle && (
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.6 }}>
            {heroSubtitle}
          </p>
        )}

        <a href={ctaUrl} style={{
          display: "inline-block", position: "relative", overflow: "hidden",
          background: "var(--brand-primary, #d4891a)", color: "#0D0E12",
          padding: "14px 32px", borderRadius: 9999,
          fontWeight: 600, fontSize: 14, textDecoration: "none",
          fontFamily: "Syne, sans-serif", transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 40px -5px var(--brand-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {ctaText}
        </a>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "bounce 2s infinite", zIndex: 10 }}>
        <ArrowDown size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
        <span style={{ fontFamily: "Syne, sans-serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Scroll</span>
      </div>
    </section>
  );
};

export default LandingHero;
import React from "react";

interface Props {
  agencyName: string;
  logoUrl: string | null;
  ctaText: string;
  ctaUrl: string;
}

const LandingNavbar: React.FC<Props> = ({ agencyName, logoUrl, ctaText, ctaUrl }) => (
  <nav
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
    style={{
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      background: "rgba(13,14,18,0.6)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    {logoUrl ? (
      <img src={logoUrl} alt={agencyName} style={{ height: 36 }} />
    ) : (
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-0.02em",
          color: "white",
        }}
      >
        {agencyName}
      </span>
    )}
    <a
      href={ctaUrl}
      style={{
        background: "var(--brand-primary, #d4891a)",
        color: "#0D0E12",
        padding: "10px 24px",
        borderRadius: 9999,
        fontWeight: 600,
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "Syne, sans-serif",
        transition: "all 0.3s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 0 30px -5px var(--brand-primary, #d4891a)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {ctaText}
    </a>
  </nav>
);

export default LandingNavbar;

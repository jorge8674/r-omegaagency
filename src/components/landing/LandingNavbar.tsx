import React from "react";

interface Props {
  agencyName: string;
  logoUrl: string | null;
  ctaText: string;
  ctaUrl: string;
}

const LandingNavbar: React.FC<Props> = ({ agencyName, logoUrl, ctaText, ctaUrl }) => (
  <nav
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "#0D0E12",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {logoUrl ? (
      <img src={logoUrl} alt={agencyName} style={{ height: 40 }} />
    ) : (
      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 24, color: "white" }}>
        {agencyName}
      </span>
    )}
    <a
      href={ctaUrl}
      style={{
        background: "var(--brand-primary, #d4891a)",
        color: "#000",
        padding: "10px 24px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        textDecoration: "none",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {ctaText}
    </a>
  </nav>
);

export default LandingNavbar;

import React from "react";

interface Props {
  heroType: string | null;
  heroMediaUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  ctaText: string;
  ctaUrl: string;
}

const LandingHero: React.FC<Props> = ({ heroType, heroMediaUrl, heroTitle, heroSubtitle, ctaText, ctaUrl }) => {
  const hasMedia = heroMediaUrl && heroType;

  return (
    <section
      style={{
        minHeight: "90vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      {hasMedia && heroType === "video" ? (
        <video
          autoPlay loop muted playsInline
          src={heroMediaUrl}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : hasMedia && heroType === "image" ? (
        <img
          src={heroMediaUrl}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hasMedia
            ? "rgba(0,0,0,0.6)"
            : "linear-gradient(135deg, var(--brand-primary, #d4891a)22, #0D0E12)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
        {heroTitle && (
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.1 }}>
            {heroTitle}
          </h1>
        )}
        {heroSubtitle && (
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 20, opacity: 0.8, margin: "0 0 32px" }}>
            {heroSubtitle}
          </p>
        )}
        <a
          href={ctaUrl}
          style={{
            display: "inline-block",
            background: "var(--brand-primary, #d4891a)",
            color: "#000",
            padding: "14px 36px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};

export default LandingHero;

import React from "react";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

interface Props {
  agencyName: string;
  footerText: string | null;
  socialLinks: Record<string, string>;
}

const iconMap: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
};

const LandingFooter: React.FC<Props> = ({ agencyName, footerText, socialLinks }) => {
  const links = Object.entries(socialLinks || {}).filter(([, v]) => v);

  return (
    <footer style={{ background: "#080910", padding: "40px 24px", textAlign: "center" }}>
      {links.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
          {links.map(([platform, url]) => {
            const Icon = iconMap[platform];
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255,255,255,0.6)", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-primary, #d4891a)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {Icon ? <Icon size={24} /> : <span style={{ fontSize: 14 }}>{platform}</span>}
              </a>
            );
          })}
        </div>
      )}
      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, opacity: 0.5, margin: 0 }}>
        {footerText || `© 2026 ${agencyName}`}
      </p>
    </footer>
  );
};

export default LandingFooter;

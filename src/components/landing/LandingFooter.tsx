import React from "react";
import { Instagram, Facebook, Linkedin, Twitter, Youtube, Phone, Mail } from "lucide-react";

interface Props {
  agencyName: string;
  footerText: string | null;
  socialLinks: Record<string, string>;
  footerEmail?: string | null;
  footerPhone?: string | null;
  legalPages?: { title: string; content: string }[];
}

const iconMap: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: () => <span style={{ fontSize: 16, fontWeight: 700 }}>♪</span>,
};

const LandingFooter: React.FC<Props> = ({ agencyName, footerText, socialLinks, footerEmail, footerPhone, legalPages = [] }) => {
  const links = Object.entries(socialLinks || {}).filter(([, v]) => v);

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#080910", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Agency name */}
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "white", textAlign: "center", marginBottom: 24 }}>
          {agencyName}
        </div>

        {/* Contact info */}
        {(footerEmail || footerPhone) && (
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
            {footerEmail && (
              <a href={`mailto:${footerEmail}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14, transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                <Mail size={14} /> {footerEmail}
              </a>
            )}
            {footerPhone && (
              <a href={`tel:${footerPhone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14, transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                <Phone size={14} /> {footerPhone}
              </a>
            )}
          </div>
        )}

        {/* Social links */}
        {links.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
            {links.map(([platform, url]) => {
              const Icon = iconMap[platform];
              return (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-primary, #d4891a)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >
                  {Icon ? <Icon size={20} /> : <span style={{ fontSize: 14, textTransform: "capitalize" }}>{platform}</span>}
                </a>
              );
            })}
          </div>
        )}

        {/* Legal pages links */}
        {legalPages.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            {legalPages.map((page, i) => (
              <button key={i}
                onClick={() => {
                  // Open in a simple modal/new tab
                  const w = window.open("", "_blank", "width=600,height=500");
                  if (w) {
                    w.document.write(`<html><head><title>${page.title}</title><style>body{font-family:'DM Sans',sans-serif;background:#0D0E12;color:#fff;padding:40px;max-width:600px;margin:0 auto;line-height:1.7;font-size:14px}h1{font-family:Syne,sans-serif;font-size:24px;margin-bottom:24px}</style></head><body><h1>${page.title}</h1><div>${page.content.replace(/\n/g, '<br/>')}</div></body></html>`);
                    w.document.close();
                  }
                }}
                style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {page.title}
              </button>
            ))}
          </div>
        )}

        {/* Copyright */}
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0, textAlign: "center" }}>
          {footerText || `© ${new Date().getFullYear()} ${agencyName}. Todos los derechos reservados.`}
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
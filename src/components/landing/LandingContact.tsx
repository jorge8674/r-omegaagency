import React, { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Send, CheckCircle, Mail } from "lucide-react";

interface Props {
  resellerId: string;
  slug?: string;
  contactEmail: string | null;
  ctaText?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: 14,
  fontFamily: "DM Sans, sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.3s",
};

const LandingContact: React.FC<Props> = ({ resellerId, slug, contactEmail, ctaText = "Enviar" }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { ref, isVisible } = useScrollAnimation(0.15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus("loading");
    try {
      // Try slug-based endpoint first, fallback to reseller_id
      const endpoint = slug
        ? `${API_BASE}/resellers/slug/${slug}/lead`
        : `${API_BASE}/resellers/${resellerId}/leads`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          message: form.message.trim() || null,
          source: "landing_page",
          reseller_id: resellerId,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--brand-primary)";
    e.currentTarget.style.boxShadow = "0 0 0 1px var(--brand-primary)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <section id="contacto" style={{ padding: "96px 24px" }}>
      <div style={{ height: 1, width: "66%", margin: "0 auto 64px", background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--brand-primary) 20%, transparent), transparent)" }} />
      <div ref={ref} style={{ maxWidth: 600, margin: "0 auto", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease-out" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,3vw,36px)", fontWeight: 700, textAlign: "center", color: "white", marginBottom: 16 }}>
          Hablemos
        </h2>
        {contactEmail && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)", background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", padding: "6px 16px", fontSize: 13, color: "var(--brand-primary)" }}>
              <Mail size={14} /> {contactEmail}
            </span>
          </div>
        )}

        {status === "success" ? (
          <div style={{ borderRadius: 12, border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)", background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", padding: 48, textAlign: "center" }}>
            <CheckCircle size={48} style={{ color: "var(--brand-primary)", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 600, color: "white" }}>¡Gracias!</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Te contactaremos pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input style={inputStyle} placeholder="Nombre *" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} />
            <input style={inputStyle} placeholder="Email *" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} />
            <input style={inputStyle} placeholder="Teléfono" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} />
            <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Mensaje" rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={focusStyle as any} onBlur={blurStyle as any} />
            {status === "error" && <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>Hubo un error. Intenta de nuevo.</p>}
            <button type="submit" disabled={status === "loading"} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "var(--brand-primary, #d4891a)", color: "#0D0E12",
              padding: "14px 32px", borderRadius: 9999, border: "none",
              fontWeight: 600, fontSize: 14, fontFamily: "Syne, sans-serif",
              cursor: status === "loading" ? "wait" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { if (status !== "loading") { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 30px -5px var(--brand-primary)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <Send size={16} />
              {status === "loading" ? "Enviando..." : ctaText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default LandingContact;
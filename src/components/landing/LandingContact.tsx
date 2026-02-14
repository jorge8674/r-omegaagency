import React, { useState } from "react";

interface Props {
  resellerId: string;
  contactEmail: string | null;
}

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "#13141a",
  color: "white",
  fontSize: 15,
  fontFamily: "DM Sans, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const LandingContact: React.FC<Props> = ({ resellerId, contactEmail }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/resellers/${resellerId}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          message: form.message.trim() || null,
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

  return (
    <section id="contacto" style={{ padding: "80px 24px", background: "#0f1018" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
          Contáctanos
        </h2>
        {contactEmail && (
          <p style={{ textAlign: "center", opacity: 0.6, marginBottom: 40, fontSize: 14 }}>{contactEmail}</p>
        )}

        {status === "success" ? (
          <p style={{ textAlign: "center", color: "#4ade80", fontSize: 16 }}>
            ¡Mensaje enviado! Nos contactaremos pronto.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input style={inputStyle} placeholder="Nombre *" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input style={inputStyle} placeholder="Email *" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input style={inputStyle} placeholder="Teléfono" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Mensaje" rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            {status === "error" && <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>Error al enviar. Intenta nuevamente.</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "var(--brand-primary, #d4891a)",
                color: "#000",
                padding: "14px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: status === "loading" ? "wait" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {status === "loading" ? "Enviando..." : "Enviar"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default LandingContact;

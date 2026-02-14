import React from "react";

interface SectionData {
  active?: boolean;
  title?: string;
  description?: string;
  points?: string[];
  items?: any[];
  steps?: any[];
}

interface Props {
  metrics: SectionData;
  pain: SectionData;
  solutions: SectionData;
  services: SectionData;
  process: SectionData;
  testimonials: SectionData;
  clientLogos: SectionData;
}

const sectionStyle: React.CSSProperties = { padding: "80px 24px", maxWidth: 1100, margin: "0 auto" };
const titleStyle: React.CSSProperties = { fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 48 };
const cardStyle: React.CSSProperties = { background: "#151722", borderRadius: 12, padding: 28 };

const LandingSections: React.FC<Props> = ({ metrics, pain, solutions, services, process, testimonials, clientLogos }) => (
  <>
    {/* Metrics */}
    {metrics.active && metrics.items && metrics.items.length > 0 && (
      <section style={{ background: "#13141a", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, textAlign: "center" }}>
          {metrics.items.map((m: any, i: number) => (
            <div key={i}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 48, fontWeight: 700, color: "var(--brand-primary)" }}>{m.number}</span>
              <br />
              <span style={{ fontSize: 14, opacity: 0.7 }}>{m.label}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Pain */}
    {pain.active && (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>{pain.title}</h2>
        {pain.description && <p style={{ textAlign: "center", opacity: 0.7, marginBottom: 40 }}>{pain.description}</p>}
        {pain.points && pain.points.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {pain.points.map((p: string, i: number) => (
              <div key={i} style={{ ...cardStyle, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    )}

    {/* Solutions */}
    {solutions.active && solutions.items && solutions.items.length > 0 && (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>{solutions.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {solutions.items.map((s: any, i: number) => (
            <div key={i} style={{ ...cardStyle, borderTop: "3px solid var(--brand-primary)" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.7 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Services */}
    {services.active && services.items && services.items.length > 0 && (
      <section style={{ ...sectionStyle, background: "#13141a", borderRadius: 0, maxWidth: "100%", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={titleStyle}>{services.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {services.items.map((s: any, i: number) => (
              <div key={i} style={{ ...cardStyle, border: "1px solid transparent", transition: "border-color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
              >
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{s.name}</h3>
                <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>{s.description}</p>
                {s.price && <span style={{ background: "var(--brand-primary)", color: "#000", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{s.price}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Process */}
    {process.active && process.steps && process.steps.length > 0 && (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>{process.title}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          {process.steps.map((s: any, i: number) => (
            <div key={i} style={{ textAlign: "center", flex: "1 1 200px", maxWidth: 240 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, margin: "0 auto 16px", fontFamily: "Syne" }}>{i + 1}</div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: 14, opacity: 0.7 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Testimonials */}
    {testimonials.active && testimonials.items && testimonials.items.length > 0 && (
      <section style={{ ...sectionStyle, background: "#13141a", borderRadius: 0, maxWidth: "100%", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={titleStyle}>Testimonios</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.items.map((t: any, i: number) => (
              <div key={i} style={cardStyle}>
                <span style={{ fontFamily: "Syne", fontSize: 40, color: "var(--brand-primary)", lineHeight: 1 }}>"</span>
                <p style={{ fontSize: 15, marginBottom: 16 }}>{t.text}</p>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{t.name}{t.company ? ` — ${t.company}` : ""}</div>
                {t.rating && <div style={{ marginTop: 8 }}>{"★".repeat(Math.min(t.rating, 5))}<span style={{ opacity: 0.3 }}>{"★".repeat(5 - Math.min(t.rating, 5))}</span></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Client Logos */}
    {clientLogos.active && clientLogos.items && clientLogos.items.length > 0 && (
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, alignItems: "center" }}>
          {clientLogos.items.map((l: any, i: number) => (
            <img key={i} src={l.url} alt={l.alt || ""} style={{ height: 40, filter: "grayscale(100%)", transition: "filter .2s" }}
              onMouseEnter={e => (e.currentTarget.style.filter = "grayscale(0%)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "grayscale(100%)")}
            />
          ))}
        </div>
      </section>
    )}
  </>
);

export default LandingSections;

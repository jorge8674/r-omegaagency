import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldAlert, Sparkles, Check, X } from "lucide-react";

interface SectionData {
  active?: boolean;
  title?: string;
  subtitle?: string;
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

/* ─── Animated wrapper ─── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, isVisible } = useScrollAnimation(0.15);
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms` }}>
      {children}
    </div>
  );
};

const sep = <div style={{ height: 1, width: "66%", margin: "0 auto 64px", background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--brand-primary) 20%, transparent), transparent)" }} />;

const LandingSections: React.FC<Props> = ({ metrics, pain, solutions, services, process, testimonials, clientLogos }) => (
  <>
    {/* ── Metrics ── */}
    {metrics.active && metrics.items && metrics.items.length > 0 && (
      <section style={{ padding: "64px 24px" }}>
        {sep}
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, textAlign: "center" }}>
          {metrics.items.map((m: any, i: number) => (
            <Reveal key={i} delay={i * 120}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(36px,4vw,48px)", fontWeight: 800, backgroundImage: "linear-gradient(90deg, var(--brand-primary), #f5c542)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.number}</span>
              <br />
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans" }}>{m.label}</span>
            </Reveal>
          ))}
        </div>
      </section>
    )}

    {/* ── Pain + Solutions ── */}
    {pain.active && (
      <section style={{ padding: "96px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(239,68,68,0.03)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", filter: "blur(120px)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <h2 style={{ fontFamily: "Syne", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", textAlign: "center", marginBottom: 64 }}>{pain.title}</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {/* Pain card */}
            <Reveal delay={150}>
              <div style={{ borderRadius: 12, border: "1px solid rgba(239,68,68,0.1)", background: "rgba(239,68,68,0.02)", padding: 32, backdropFilter: "blur(4px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <ShieldAlert size={20} style={{ color: "rgba(239,68,68,0.7)" }} />
                  <span style={{ fontFamily: "Syne", fontWeight: 600, color: "white" }}>Problemas</span>
                </div>
                {pain.points?.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <X size={16} style={{ color: "rgba(239,68,68,0.6)", marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{p}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            {/* Solutions card */}
            {solutions.active && solutions.items && solutions.items.length > 0 && (
              <Reveal delay={300}>
                <div style={{ borderRadius: 12, border: "1px solid color-mix(in srgb, var(--brand-primary) 15%, transparent)", background: "color-mix(in srgb, var(--brand-primary) 2%, transparent)", padding: 32, backdropFilter: "blur(4px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                    <Sparkles size={20} style={{ color: "var(--brand-primary)" }} />
                    <span style={{ fontFamily: "Syne", fontWeight: 600, color: "white" }}>Soluciones</span>
                  </div>
                  {solutions.items.map((s: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                      <Check size={16} style={{ color: "var(--brand-primary)", marginTop: 3, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{s.title}</span>
                        {s.description && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>{s.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    )}

    {/* ── Services ── */}
    {services.active && services.items && services.items.length > 0 && (
      <section style={{ padding: "96px 24px" }}>
        {sep}
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "Syne", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, color: "white", textAlign: "center", marginBottom: 16 }}>{services.title}</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 48 }}>
            {services.items.map((s: any, i: number) => (
              <Reveal key={i} delay={i * 150}>
                <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "hsl(225 15% 8%)", padding: 32, transition: "all 0.3s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--brand-primary) 40%, transparent)"; e.currentTarget.style.boxShadow = "0 0 40px -10px color-mix(in srgb, var(--brand-primary) 25%, transparent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 0 0 1px color-mix(in srgb, var(--brand-primary) 20%, transparent)" }}>
                    <Sparkles size={22} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <h3 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "white", marginBottom: 8 }}>{s.name}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>{s.description}</p>
                  {s.price && <span style={{ display: "inline-block", marginTop: 16, borderRadius: 9999, border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)", color: "var(--brand-primary)", fontSize: 12, padding: "4px 12px" }}>{s.price}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* ── Process ── */}
    {process.active && process.steps && process.steps.length > 0 && (
      <section style={{ padding: "96px 24px" }}>
        {sep}
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "Syne", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, color: "white", textAlign: "center", marginBottom: 64 }}>{process.title}</h2></Reveal>
          {process.steps.map((s: any, i: number) => (
            <Reveal key={i} delay={i * 180}>
              <div style={{ display: "flex", gap: 24, position: "relative", paddingBottom: i < process.steps!.length - 1 ? 40 : 0 }}>
                {i < process.steps!.length - 1 && <div style={{ position: "absolute", left: 19, top: 48, bottom: 0, width: 1, background: "rgba(255,255,255,0.1)" }} />}
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)", background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "var(--brand-primary)", flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <h4 style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>{s.title}</h4>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{s.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    )}

    {/* ── Testimonials ── */}
    {testimonials.active && testimonials.items && testimonials.items.length > 0 && (
      <section style={{ padding: "96px 24px" }}>
        {sep}
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "Syne", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, color: "white", textAlign: "center", marginBottom: 48 }}>Testimonios</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.items.map((t: any, i: number) => (
              <Reveal key={i} delay={i * 150}>
                <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "hsl(225 15% 8%)", padding: 32, transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--brand-primary) 30%, transparent)"; e.currentTarget.style.boxShadow = "0 0 30px -10px color-mix(in srgb, var(--brand-primary) 20%, transparent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ fontFamily: "Syne", fontSize: 56, lineHeight: 1, color: "color-mix(in srgb, var(--brand-primary) 20%, transparent)" }}>"</span>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 24 }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontSize: 14, fontWeight: 600, color: "var(--brand-primary)" }}>{t.name?.[0] || "?"}</div>
                    <div>
                      <div style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "white" }}>{t.name}</div>
                      {t.company && <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--brand-primary) 70%, transparent)" }}>{t.company}</div>}
                    </div>
                  </div>
                  {t.rating && <div style={{ marginTop: 12, color: "var(--brand-primary)" }}>{"★".repeat(Math.min(t.rating, 5))}<span style={{ opacity: 0.2 }}>{"★".repeat(5 - Math.min(t.rating, 5))}</span></div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* ── Client Logos ── */}
    {clientLogos.active && clientLogos.items && clientLogos.items.length > 0 && (
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, alignItems: "center" }}>
          {clientLogos.items.map((l: any, i: number) => (
            <img key={i} src={l.url} alt={l.alt || ""} style={{ height: 40, filter: "grayscale(100%) opacity(0.4)", transition: "all 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.filter = "grayscale(0%) opacity(1)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "grayscale(100%) opacity(0.4)")}
            />
          ))}
        </div>
      </section>
    )}
  </>
);

export default LandingSections;

import React from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Básico",
    price: 97,
    popular: false,
    cta: "Empezar gratis 7 días",
    href: "/login",
    features: [
      "1 cuenta social",
      "2 bloques de contenido/día",
      "Generador AI de imágenes y copy",
      "Hashtags optimizados",
      "Soporte por email",
    ],
  },
  {
    name: "Pro",
    price: 197,
    popular: true,
    cta: "Empezar gratis 7 días",
    href: "/login",
    features: [
      "5 cuentas sociales",
      "6 bloques de contenido/día",
      "Todo lo de Básico",
      "Prompt optimizer",
      "Carruseles inteligentes",
      "Smart scheduling",
      "3 redes sociales",
      "Soporte prioritario",
    ],
  },
  {
    name: "Enterprise",
    price: 497,
    popular: false,
    cta: "Contactar ventas",
    href: "/login",
    features: [
      "Cuentas ilimitadas",
      "Bloques ilimitados",
      "Publicación automática 100%",
      "Multi-cuenta simultáneo",
      "AI Analytics avanzado",
      "Hasta 3 agentes humanos",
      "White-label disponible",
      "API access",
    ],
  },
];

const faqs = [
  { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, puedes cancelar tu suscripción en cualquier momento sin penalización. Tu acceso continuará hasta el final del periodo de facturación." },
  { q: "¿Qué pasa al terminar el trial?", a: "Se cobra automáticamente el plan que elegiste. Recibirás un aviso 2 días antes del cobro." },
  { q: "¿Hay contratos?", a: "No, todos nuestros planes son mes a mes. Sin compromisos a largo plazo." },
  { q: "¿Soporte en español?", a: "Sí, 100% de nuestro soporte es en español. Atención humana cuando la necesitas." },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="pt-20 pb-4 text-center px-6">
        <h1 className="font-[Syne] text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Elige tu plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Empieza gratis por 7 días. Sin compromisos.
        </p>
      </header>

      {/* Plans grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
              plan.popular
                ? "border-primary/50 bg-card shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)] scale-[1.02]"
                : "border-border bg-card/60 hover:border-border/80"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground font-[Syne]">
                  <Star className="h-3 w-3" /> Más Popular
                </span>
              </div>
            )}

            <h3 className="font-[Syne] text-xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold font-[Syne]">${plan.price}</span>
              <span className="text-muted-foreground text-sm">/mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate(plan.href)}
              className={`w-full rounded-full py-3 px-6 text-sm font-semibold font-[Syne] transition-all ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]"
                  : "border border-border bg-secondary/40 text-foreground hover:bg-secondary/70"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </section>

      {/* Reseller CTA */}
      <div className="text-center pb-16 px-6">
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 text-primary hover:underline font-[Syne] font-semibold text-sm transition-colors"
        >
          ¿Eres una agencia? Conviértete en Reseller
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="font-[Syne] text-2xl font-bold text-center mb-8">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-xl px-5 bg-card/40"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default Pricing;

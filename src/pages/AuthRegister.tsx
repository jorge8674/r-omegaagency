import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

const plans = [
  { id: "basic", name: "Básico", price: 97 },
  { id: "pro", name: "Pro", price: 197, popular: true },
  { id: "enterprise", name: "Enterprise", price: 497 },
];

export default function AuthRegister() {
  const { isAuthenticated, user } = useOmegaAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get("plan") || "pro");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.redirect_to, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, plan: selectedPlan }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = (data.detail || data.message || "").toLowerCase();
        if (msg.includes("exist") || msg.includes("already")) {
          setError("Ya existe una cuenta con ese email");
        } else if (res.status >= 500) {
          setError("Error del servidor. Intenta más tarde");
        } else {
          setError(data.detail || data.message || "Error al crear la cuenta");
        }
        return;
      }

      // If backend returns checkout URL, redirect there
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      toast({ title: "¡Cuenta creada!", description: "Redirigiendo..." });
      navigate("/auth/login", { replace: true });
    } catch {
      setError("Sin conexión. Verifica tu internet");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[hsl(38,85%,55%)] focus:ring-1 focus:ring-[hsl(38,85%,55%)]";

  const labelClass =
    "block font-[Syne] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: "#0D0E12", fontFamily: "DM Sans, sans-serif" }}>
      <div className="w-full max-w-lg rounded-xl border border-white/10 p-8 sm:p-10" style={{ background: "hsl(225 15% 8%)" }}>
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="font-[Syne] text-2xl font-bold tracking-tight text-white">
            RAISEN<span style={{ color: "hsl(38, 85%, 55%)" }}>.</span>
          </span>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">OMEGA</div>
        </div>

        <h1 className="font-[Syne] text-xl font-bold text-white text-center mb-1">Crear Cuenta</h1>
        <p className="text-sm text-white/50 text-center mb-6">Empieza tu prueba gratuita de 7 días</p>

        {/* Plan selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-lg border p-3 text-center transition-all ${
                selectedPlan === plan.id
                  ? "border-[hsl(38,85%,55%)] bg-[hsl(38,85%,55%)]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "hsl(38, 85%, 55%)", color: "#0D0E12" }}>
                  Popular
                </span>
              )}
              <div className="font-[Syne] text-xs font-semibold text-white mt-1">{plan.name}</div>
              <div className="text-white/60 text-xs">${plan.price}<span className="text-white/30">/mes</span></div>
              {selectedPlan === plan.id && (
                <Check size={14} className="absolute top-1.5 right-1.5" style={{ color: "hsl(38, 85%, 55%)" }} />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input className={inputClass} placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className={labelClass}>Contraseña</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className={inputClass} style={{ paddingRight: 44 }} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} className={inputClass} style={{ paddingRight: 44 }} placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Trial badge */}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-[hsl(38,85%,55%)]/20 bg-[hsl(38,85%,55%)]/5 px-4 py-2.5 text-sm">
            <Sparkles size={14} style={{ color: "hsl(38, 85%, 55%)" }} />
            <span className="text-white/70">7 días gratis — cancela cuando quieras</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3.5 font-[Syne] text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            style={{
              background: "hsl(38, 85%, 55%)",
              color: "#0D0E12",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 0 20px -5px hsl(38 85% 55% / 0.3)",
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creando cuenta..." : "Crear cuenta y continuar al pago →"}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" className="text-[hsl(38,85%,55%)] hover:underline">
            Inicia sesión →
          </Link>
        </p>
      </div>
    </div>
  );
}

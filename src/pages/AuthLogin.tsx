import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AuthLogin() {
  const { login, isAuthenticated, user } = useOmegaAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.redirect_to, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    setLoading(true);
    try {
      const authUser = await login(email.trim(), password);
      navigate(authUser.redirect_to, { replace: true });
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("invalid_credentials")) setError("Email o contraseña incorrectos");
      else if (msg.includes("no_access")) setError("Tu cuenta no tiene acceso al sistema");
      else if (msg.includes("server_error")) setError("Error del servidor. Intenta más tarde");
      else if (msg.includes("network_error")) setError("Sin conexión. Verifica tu internet");
      else setError("Error al iniciar sesión");
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
      <div className="w-full max-w-md rounded-xl border border-white/10 p-8 sm:p-10" style={{ background: "hsl(225 15% 8%)" }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-[Syne] text-2xl font-bold tracking-tight text-white">
            RAISEN<span style={{ color: "hsl(38, 85%, 55%)" }}>.</span>
          </span>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">OMEGA</div>
        </div>

        <h1 className="font-[Syne] text-xl font-bold text-white text-center mb-1">Iniciar Sesión</h1>
        <p className="text-sm text-white/50 text-center mb-8">Accede a tu panel OMEGA</p>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>

          <div>
            <label className={labelClass}>Contraseña</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className={inputClass} style={{ paddingRight: 44 }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-5">
          <Link to="/auth/reset" className="text-xs text-white/30 hover:text-white/50 transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-xs text-white/30">
            ¿No tienes cuenta?{" "}
            <Link to="/auth/register" className="text-[hsl(38,85%,55%)] hover:underline">
              Empieza gratis →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

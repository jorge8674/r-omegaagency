import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const processRecovery = async () => {
      const hash = window.location.hash;

      // Parse tokens from hash fragment: #access_token=XXX&type=recovery&refresh_token=YYY
      if (hash.includes("type=recovery") && hash.includes("access_token=")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error("Recovery session error:", sessionError);
            setError("No se pudo verificar el enlace. Solicita uno nuevo.");
          } else {
            setSessionReady(true);
          }
          return;
        }
      }

      // Fallback: listen for PASSWORD_RECOVERY event (in case Supabase handles it)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setSessionReady(true);
          subscription.unsubscribe();
        }
      });

      // Timeout: if nothing happens after 3s, show error
      setTimeout(() => {
        setSessionReady((ready) => {
          if (!ready) setError("Enlace de recuperación inválido o expirado.");
          return ready;
        });
        subscription.unsubscribe();
      }, 3000);
    };

    processRecovery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    toast({ title: "Contraseña actualizada", description: "Ya puedes iniciar sesión con tu nueva contraseña." });
    setTimeout(() => navigate("/auth/login", { replace: true }), 2500);
  };

  const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[hsl(38,85%,55%)] focus:ring-1 focus:ring-[hsl(38,85%,55%)]";
  const labelClass =
    "block font-[Syne] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: "#0D0E12", fontFamily: "DM Sans, sans-serif" }}>
      <div className="w-full max-w-md rounded-xl border border-white/10 p-8 sm:p-10" style={{ background: "hsl(225 15% 8%)" }}>
        <div className="text-center mb-8">
          <span className="font-[Syne] text-2xl font-bold tracking-tight text-white">
            RAISEN<span style={{ color: "hsl(38, 85%, 55%)" }}>.</span>
          </span>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">OMEGA</div>
        </div>

        <h1 className="font-[Syne] text-xl font-bold text-white text-center mb-1">Nueva Contraseña</h1>
        <p className="text-sm text-white/50 text-center mb-8">
          {success ? "¡Listo! Redirigiendo al login..." : "Ingresa tu nueva contraseña"}
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(38, 85%, 55%)" }}>
              <Check size={24} color="#0D0E12" />
            </div>
            <p className="text-sm text-white/50">Contraseña actualizada correctamente</p>
          </div>
        ) : !sessionReady ? (
          <div className="text-center text-sm text-white/50">
            <Loader2 size={20} className="animate-spin mx-auto mb-3 text-white/30" />
            Verificando enlace de recuperación...
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelClass}>Nueva contraseña</label>
                <input type="password" className={inputClass} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
              </div>
              <div>
                <label className={labelClass}>Confirmar contraseña</label>
                <input type="password" className={inputClass} placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
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
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6">
          <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors">
            <ArrowLeft size={12} /> Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

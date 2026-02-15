import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthReset() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[hsl(38,85%,55%)] focus:ring-1 focus:ring-[hsl(38,85%,55%)]";

  const labelClass =
    "block font-[Syne] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-2";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate delay — real logic later
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast({ title: "Correo enviado", description: "Si ese email existe, recibirás instrucciones para restablecer tu contraseña." });
  };

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

        <h1 className="font-[Syne] text-xl font-bold text-white text-center mb-1">Restablecer Contraseña</h1>
        <p className="text-sm text-white/50 text-center mb-8">
          {sent ? "Revisa tu bandeja de entrada" : "Te enviaremos instrucciones por email"}
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
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
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        ) : (
          <div className="text-center text-sm text-white/50">
            Si <strong className="text-white">{email}</strong> tiene una cuenta, recibirás un correo con los pasos para restablecer tu contraseña.
          </div>
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

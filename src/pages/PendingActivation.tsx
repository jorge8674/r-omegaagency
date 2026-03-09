import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useOmegaAuth } from "@/contexts/AuthContext";

export default function PendingActivation() {
  const { logout } = useOmegaAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: "#0D0E12", fontFamily: "DM Sans, sans-serif" }}>
      <div className="w-full max-w-md rounded-xl border border-white/10 p-8 sm:p-10 text-center" style={{ background: "hsl(225 15% 8%)" }}>
        <div className="text-center mb-8">
          <span className="font-[Syne] text-2xl font-bold tracking-tight text-white">
            RAISEN<span style={{ color: "hsl(38, 85%, 55%)" }}>.</span>
          </span>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">OMEGA</div>
        </div>

        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "hsl(38, 85%, 55%, 0.15)" }}>
          <Clock size={28} style={{ color: "hsl(38, 85%, 55%)" }} />
        </div>

        <h1 className="font-[Syne] text-xl font-bold text-white mb-2">Cuenta pendiente de activación</h1>
        <p className="text-sm text-white/50 mb-6 leading-relaxed">
          Tu cuenta ha sido creada correctamente, pero aún no tiene un rol asignado.
          Contacta a tu agencia para que te activen el acceso.
        </p>

        <button
          onClick={logout}
          className="w-full rounded-full py-3 font-[Syne] text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: "hsl(38, 85%, 55%)",
            color: "#0D0E12",
            boxShadow: "0 0 20px -5px hsl(38 85% 55% / 0.3)",
          }}
        >
          Cerrar sesión
        </button>

        <p className="text-xs text-white/30 mt-4">
          ¿Necesitas ayuda?{" "}
          <a href="mailto:soporte@r-omega.agency" className="text-[hsl(38,85%,55%)] hover:underline">
            soporte@r-omega.agency
          </a>
        </p>
      </div>
    </div>
  );
}

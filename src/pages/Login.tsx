import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated, user } = useOmegaAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated, redirect
  if (isAuthenticated && user) {
    navigate(user.redirect_to, { replace: true });
    return null;
  }

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
      if (msg.includes("invalid_credentials") || msg.includes("inválidas") || msg.includes("401")) {
        setError("Email o contraseña incorrectos");
      } else if (msg.includes("no_access") || msg.includes("403")) {
        setError("Tu cuenta no tiene acceso al sistema");
      } else if (msg.includes("server_error") || msg.includes("500")) {
        setError("Error del servidor. Intenta más tarde");
      } else if (msg.includes("network_error")) {
        setError("Sin conexión. Verifica tu internet");
      } else {
        setError(msg || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[hsl(38,85%,55%)] focus:ring-1 focus:ring-[hsl(38,85%,55%)]";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0E12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "hsl(225 15% 8%)",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "white",
            }}
          >
            RAISEN
            <span style={{ color: "hsl(38, 85%, 55%)" }}>.</span>
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "white",
            margin: "0 0 4px",
            textAlign: "center",
          }}
        >
          Iniciar Sesión
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            margin: "0 0 32px",
          }}
        >
          Accede a tu panel OMEGA
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.1)",
              padding: "12px 16px",
              fontSize: 14,
              color: "#f87171",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "Syne, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "Syne, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass}
                placeholder="••••••••"
                style={{ paddingRight: 44 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  padding: 4,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              borderRadius: 9999,
              background: "hsl(38, 85%, 55%)",
              padding: "14px",
              border: "none",
              fontFamily: "Syne, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#0D0E12",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = "0 0 30px -5px hsl(38 85% 55% / 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            type="button"
            onClick={() => alert("Contacta a OMEGA para restablecer tu acceso")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
}

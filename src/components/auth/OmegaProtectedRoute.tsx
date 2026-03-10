import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RaisenLogo } from "@/components/brand/RaisenLogo";
import PendingActivation from "@/pages/PendingActivation";

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

export function OmegaProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading, isAuthenticated } = useOmegaAuth();
  const [supabaseRoleCheck, setSupabaseRoleCheck] = useState<"loading" | "has_role" | "no_role" | "no_session">("loading");

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        // No Supabase session — rely on Railway auth only
        setSupabaseRoleCheck("no_session");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data?.role) {
        setSupabaseRoleCheck("has_role");
      } else {
        setSupabaseRoleCheck("no_role");
      }
    };

    if (isAuthenticated) {
      checkRole();
    }
  }, [isAuthenticated]);

  if (isLoading || (isAuthenticated && supabaseRoleCheck === "loading")) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <RaisenLogo size="xl" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If Supabase session exists but user has no role → pending activation
  if (supabaseRoleCheck === "no_role") {
    return <PendingActivation />;
  }

  // Client with no client_id → account being configured
  if (user.role === "client" && !user.client_id) {
    return <ClientPendingSetup logout={logout} />;
  }

  // Role check: if allowedRoles specified and user role not in list, redirect to their default
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.redirect_to} replace />;
  }

  return <>{children}</>;
}

function ClientPendingSetup({ logout }: { logout: () => void }) {
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
          <RaisenLogo size="md" />
        </div>

        <h1 className="font-[Syne] text-xl font-bold text-white mb-2">Bienvenido a OMEGA</h1>
        <p className="text-sm text-white/50 mb-6 leading-relaxed">
          Tu cuenta está siendo configurada. En breve un agente de Raisen la activará completamente.
          Si tienes preguntas escribe a{" "}
          <a href="mailto:info@r-omega.agency" className="text-[hsl(38,85%,55%)] hover:underline">
            info@r-omega.agency
          </a>
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
      </div>
    </div>
  );
}

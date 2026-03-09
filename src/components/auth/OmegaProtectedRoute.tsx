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

  // Role check: if allowedRoles specified and user role not in list, redirect to their default
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.redirect_to} replace />;
  }

  return <>{children}</>;
}

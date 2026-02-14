import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { RaisenLogo } from "@/components/brand/RaisenLogo";

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

export function OmegaProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading, isAuthenticated } = useOmegaAuth();

  if (isLoading) {
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

  // Role check: if allowedRoles specified and user role not in list, redirect to their default
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.redirect_to} replace />;
  }

  return <>{children}</>;
}

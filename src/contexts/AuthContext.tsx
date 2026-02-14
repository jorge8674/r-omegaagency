import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface AuthUser {
  email: string;
  role: "owner" | "reseller" | "agent" | "client";
  reseller_id: string | null;
  client_id: string | null;
  redirect_to: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { throw new Error("Not initialized"); },
  logout: () => {},
});

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

// Mock login until backend endpoint is confirmed
const mockLogin = async (email: string, _password: string): Promise<{ token: string; user: AuthUser }> => {
  await new Promise((r) => setTimeout(r, 800));
  if (email === "test@agenciatest.com") {
    return {
      token: "mock-token-reseller",
      user: {
        email,
        role: "reseller",
        reseller_id: "8ebe5f95-c470-4eff-bd06-5aa8446e7a51",
        client_id: null,
        redirect_to: "/reseller/dashboard",
      },
    };
  }
  if (email === "ibrain@r-omega.agency") {
    return {
      token: "mock-token-owner",
      user: {
        email,
        role: "owner",
        reseller_id: null,
        client_id: null,
        redirect_to: "/admin/resellers",
      },
    };
  }
  if (email === "agent@test.com") {
    return {
      token: "mock-token-agent",
      user: {
        email,
        role: "agent",
        reseller_id: null,
        client_id: null,
        redirect_to: "/dashboard",
      },
    };
  }
  throw new Error("Credenciales inválidas");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("omega_token");
      const savedUser = localStorage.getItem("omega_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("omega_token");
      localStorage.removeItem("omega_user");
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    // TODO: Replace mock with real API call when backend confirms
    // const res = await fetch(`${API_BASE}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.detail || "Credenciales inválidas"); }
    // const data = await res.json();
    // const authUser = data.user; const authToken = data.token;

    const { token: authToken, user: authUser } = await mockLogin(email, password);

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("omega_token", authToken);
    localStorage.setItem("omega_user", JSON.stringify(authUser));
    return authUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("omega_token");
    localStorage.removeItem("omega_user");
    sessionStorage.removeItem("omega_reseller_id");
    // Fire-and-forget logout to backend
    // fetch(`${API_BASE}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useOmegaAuth = () => useContext(AuthContext);

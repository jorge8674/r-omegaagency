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


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore and verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("omega_token");
      const savedUser = localStorage.getItem("omega_user");

      if (!savedToken || !savedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
          setToken(savedToken);
        } else {
          localStorage.removeItem("omega_token");
          localStorage.removeItem("omega_user");
        }
      } catch {
        // Offline fallback — use cached user
        const user = JSON.parse(savedUser);
        setUser(user);
        setToken(savedToken);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    let response: Response;
    let data: any;

    try {
      response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      data = await response.json();
    } catch {
      throw new Error("network_error");
    }

    if (!response.ok || !data.success) {
      const status = response.status;
      const msg = (data.detail || data.message || "").toLowerCase();
      const backendMsg = data.detail || data.message || "";
      if (status === 401 || msg.includes("invalid") || msg.includes("credentials") || msg.includes("incorrect")) {
        throw new Error(backendMsg || "invalid_credentials");
      }
      if (status === 403 || msg.includes("no access") || msg.includes("unauthorized")) {
        throw new Error(backendMsg || "no_access");
      }
      if (status >= 500) throw new Error(backendMsg || "server_error");
      throw new Error(backendMsg || "invalid_credentials");
    }

    const authUser: AuthUser = data.data;
    const authToken: string = data.token;

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

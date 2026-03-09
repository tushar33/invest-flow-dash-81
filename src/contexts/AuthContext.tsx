import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth as authApi, AuthUser, setToken, clearToken } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithPhone: (phone: string, password: string) => Promise<AuthUser>;
  register: (data: { fullName: string; email?: string; phone?: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      authApi.me()
        .then(setUser)
        .catch(() => { clearToken(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await authApi.login({ email, password });
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const loginWithPhone = async (phone: string, password: string): Promise<AuthUser> => {
    const res = await authApi.login({ phone, password });
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: { fullName: string; email?: string; phone?: string; password: string }): Promise<AuthUser> => {
    const res = await authApi.register(data);
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const refreshUser = async () => {
    const u = await authApi.me();
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithPhone, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

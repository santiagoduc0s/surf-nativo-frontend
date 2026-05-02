"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  authLogin as apiLogin,
  authLogout as apiLogout,
  authMe,
  authRegister as apiRegister,
  type ApiCustomer,
} from "./api";

type AuthCtx = {
  user: ApiCustomer | null;
  token: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const Auth = createContext<AuthCtx | null>(null);

const TOKEN_KEY = "sn-auth-token-v1";
const USER_KEY = "sn-auth-user-v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiCustomer | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u) as ApiCustomer);
    } catch {}
    setHydrated(true);
  }, []);

  // Refresh user from /auth/me whenever a token is present
  useEffect(() => {
    if (!hydrated || !token) return;
    let cancelled = false;
    authMe(token)
      .then((u) => {
        if (cancelled) return;
        if (!u) {
          setToken(null);
          setUser(null);
          try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          } catch {}
        } else {
          setUser(u);
          try {
            localStorage.setItem(USER_KEY, JSON.stringify(u));
          } catch {}
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token, hydrated]);

  const persist = (t: string, u: ApiCustomer) => {
    setToken(t);
    setUser(u);
    try {
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {}
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    persist(res.token, res.customer);
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; phone?: string; password: string }) => {
      const res = await apiRegister(payload);
      persist(res.token, res.customer);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiLogout(token);
      } catch {}
    }
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  }, [token]);

  return (
    <Auth.Provider value={{ user, token, hydrated, login, register, logout }}>
      {children}
    </Auth.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Auth);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

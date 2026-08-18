"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  persistSession,
} from "@/lib/auth-storage";
import { fetchMe, login as loginRequest, logout as logoutRequest } from "@/lib/endpoints";
import { ApiError, type User } from "@/lib/types";

type AuthState = {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      clearSession();
      return;
    }

    try {
      const me = await fetchMe(storedToken);
      setToken(storedToken);
      setUser(me.user);
      persistSession(storedToken, me.user);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 0)) {
        clearSession();
        setUser(null);
        setToken(null);
      }
      throw err;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (!storedToken) {
        return;
      }

      setToken(storedToken);
      setUser(storedUser);

      try {
        const me = await fetchMe(storedToken);
        setUser(me.user);
        persistSession(storedToken, me.user);
      } catch {
        clearSession();
        setUser(null);
        setToken(null);
      }
    };

    initializeAuth().finally(() => {
      setReady(true);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    persistSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    const current = getStoredToken();
    if (current) {
      try {
        await logoutRequest(current);
      } catch {
        // Client still drops the session even if the API call fails.
      }
    }
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, ready, login, logout, refresh }),
    [user, token, ready, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

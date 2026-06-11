"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "../lib/api";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    preferredCities: string[];
    interests: string[];
  };
};

type SessionState = {
  status: "loading" | "authenticated" | "anonymous";
  user: SessionUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthResponse = {
  authenticated: boolean;
  user: SessionUser | null;
  token?: string;
};

const STORAGE_KEY = "afrika_admin_session_token";

const SessionContext = createContext<SessionState>({
  status: "loading",
  user: null,
  signIn: async () => {},
  signOut: async () => {}
});

function persistToken(token?: string) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(STORAGE_KEY, token);
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

export function readAdminToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionState["status"]>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;
    const tokenAtRequestStart = readAdminToken();

    apiFetch<AuthResponse>("/auth/session", { method: "GET" })
      .then((response) => {
        if (!active) return;
        if (readAdminToken() !== tokenAtRequestStart) return;
        if (response.authenticated && response.user?.role === "admin") {
          setUser(response.user);
          setStatus("authenticated");
          if (response.token) persistToken(response.token);
          return;
        }

        setUser(null);
        setStatus("anonymous");
        persistToken(undefined);
      })
      .catch(() => {
        if (!active) return;
        if (readAdminToken() !== tokenAtRequestStart) return;
        setUser(null);
        setStatus("anonymous");
        persistToken(undefined);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      status,
      user,
      signIn: async (email, password) => {
        const response = await apiFetch<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        if (!response.authenticated || response.user?.role !== "admin") {
          persistToken(undefined);
          setUser(null);
          setStatus("anonymous");
          throw new Error("Admin access only.");
        }

        setUser(response.user);
        setStatus("authenticated");
        persistToken(response.token);
      },
      signOut: async () => {
        await apiFetch("/auth/logout", { method: "POST" });
        setUser(null);
        setStatus("anonymous");
        persistToken(undefined);
      }
    }),
    [status, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAdminSession() {
  return useContext(SessionContext);
}

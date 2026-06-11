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
  signUp: (payload: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthResponse = {
  authenticated: boolean;
  user: SessionUser | null;
  token?: string;
};

const SessionContext = createContext<SessionState>({
  status: "loading",
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionState["status"]>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);

  function readToken() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("afrika_session_token");
  }

  function persistToken(token?: string) {
    if (typeof window === "undefined") return;
    if (token) {
      window.localStorage.setItem("afrika_session_token", token);
      return;
    }
    window.localStorage.removeItem("afrika_session_token");
  }

  useEffect(() => {
    let active = true;
    const tokenAtRequestStart = readToken();

    apiFetch<AuthResponse>("/auth/session", { method: "GET" })
      .then((response) => {
        if (!active) return;
        if (readToken() !== tokenAtRequestStart) return;
        setUser(response.user);
        setStatus(response.authenticated ? "authenticated" : "anonymous");
        if (response.authenticated) {
          if (response.token) persistToken(response.token);
        } else {
          persistToken(undefined);
        }
      })
      .catch(() => {
        if (!active) return;
        if (readToken() !== tokenAtRequestStart) return;
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
        setUser(response.user);
        setStatus("authenticated");
        persistToken(response.token);
      },
      signUp: async (payload) => {
        const response = await apiFetch<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
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

export function useSession() {
  return useContext(SessionContext);
}

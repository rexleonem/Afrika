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

  useEffect(() => {
    let active = true;
    apiFetch<{ authenticated: boolean; user: SessionUser | null }>("/auth/session", { method: "GET" })
      .then((response) => {
        if (!active) return;
        setUser(response.user);
        setStatus(response.authenticated ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus("anonymous");
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
        const response = await apiFetch<{ authenticated: boolean; user: SessionUser }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        setUser(response.user);
        setStatus("authenticated");
      },
      signUp: async (payload) => {
        const response = await apiFetch<{ user: SessionUser }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setUser(response.user);
        setStatus("authenticated");
      },
      signOut: async () => {
        await apiFetch("/auth/logout", { method: "POST" });
        setUser(null);
        setStatus("anonymous");
      }
    }),
    [status, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}

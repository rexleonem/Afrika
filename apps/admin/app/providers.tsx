"use client";

import type { ReactNode } from "react";
import { AdminDataProvider } from "../components/admin-data-provider";
import { AdminSessionProvider } from "../components/session-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminDataProvider>{children}</AdminDataProvider>
    </AdminSessionProvider>
  );
}

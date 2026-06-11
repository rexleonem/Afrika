"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AmbientGlow } from "./motion/ambient-glow";
import { useAdminSession } from "./session-provider";
import { useAdminData } from "./admin-data-provider";

const navItems = [
  { href: "/overview", label: "Overview" },
  { href: "/operations", label: "Operations" },
  { href: "/ingestion", label: "Ingestion" },
  { href: "/ai", label: "Nommo Pipeline" },
  { href: "/analytics", label: "Analytics" },
  { href: "/trust", label: "Trust" }
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user, signOut } = useAdminSession();
  const { status: dataStatus, error, reload } = useAdminData();

  useEffect(() => {
    if (status === "anonymous" || (status === "authenticated" && user?.role !== "admin")) {
      router.replace(`/login?next=${encodeURIComponent(pathname ?? "/overview")}`);
    }
  }, [pathname, router, status, user?.role]);

  if (status === "loading" || dataStatus === "loading") {
    return (
      <main className="afrika-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="afrika-panel relative overflow-hidden p-8">
          <AmbientGlow variant="gold" size="lg" className="right-0 top-0" opacity={0.16} />
          <div className="space-y-3">
            <div className="afrika-label">Admin control room</div>
            <div className="text-2xl font-semibold text-white">Loading protected dashboard...</div>
            <p className="max-w-2xl text-sm leading-6 text-white/60">
              Verifying the admin session and hydrating live intelligence panels.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <main className="afrika-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="afrika-panel p-8 text-sm text-white/70">Redirecting to admin sign-in...</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0">
        <AmbientGlow variant="gold" size="xl" className="left-[8%] top-[16%]" opacity={0.12} />
        <AmbientGlow variant="forest" size="lg" className="right-[10%] top-[10%]" opacity={0.1} animationDelay="-4s" />
        <AmbientGlow variant="clay" size="xl" className="bottom-[-6%] left-[42%]" opacity={0.08} animationDelay="-8s" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1920px] gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="afrika-panel sticky top-4 h-[calc(100vh-2rem)] overflow-hidden p-5">
          <div className="flex h-full flex-col">
            <div className="space-y-2">
              <div className="afrika-label">AFRIKA admin</div>
              <div className="text-xl font-semibold text-white">Control room</div>
              <p className="text-sm leading-6 text-white/55">Live operations, ingestion, model pipeline, trust, and analytics.</p>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-[20px] border px-4 py-3 text-sm transition ${
                      active
                        ? "nav-active border-white/10 text-white"
                        : "border-transparent text-white/60 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs uppercase tracking-[0.28em] text-white/35">0{navItems.findIndex((nav) => nav.href === item.href) + 1}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="afrika-label">Signed in</div>
              <div className="text-base font-medium text-white">{user.name}</div>
              <div className="text-sm text-white/55">{user.email}</div>
              <button
                type="button"
                className="btn-secondary mt-2 w-full justify-center"
                onClick={async () => {
                  await signOut();
                  router.replace("/login");
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="space-y-6 pb-8">
          <section className="afrika-panel flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="afrika-label">Live admin session</div>
              <div className="mt-2 text-lg font-semibold text-white">{pathname === "/overview" ? "Overview" : pathname?.split("/").filter(Boolean).slice(-1)[0]?.replace("-", " ") ?? "Dashboard"}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">Role: {user.role}</span>
              <span className="afrika-chip">Status: {dataStatus}</span>
              <span className="afrika-chip">Mode: dark control room</span>
            </div>
          </section>

          {error ? (
            <section className="afrika-panel border-red-500/20 bg-red-500/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="afrika-label text-red-200/70">Data sync issue</div>
                  <div className="mt-2 text-base font-medium text-white">{error}</div>
                </div>
                <button type="button" className="btn-secondary" onClick={() => reload()}>
                  Retry sync
                </button>
              </div>
            </section>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  );
}

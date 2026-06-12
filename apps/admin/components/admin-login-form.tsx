"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AmbientGlow } from "./motion/ambient-glow";
import { useAdminSession } from "./session-provider";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, user, signIn } = useAdminSession();
  const [email, setEmail] = useState("admin@afrika.local");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "afrika-demo-password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nextPath = searchParams.get("next") ?? "/overview";

  useEffect(() => {
    if (status === "authenticated" && user?.role === "admin") {
      router.replace(nextPath);
    }
  }, [nextPath, router, status, user?.role]);

  return (
    <main className="afrika-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="afrika-panel relative w-full max-w-lg overflow-hidden p-8">
        <AmbientGlow variant="gold" size="xl" className="-right-10 -top-12" opacity={0.22} />
        <AmbientGlow variant="forest" size="lg" className="-left-16 bottom-[-4rem]" opacity={0.12} animationDelay="-5s" />

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="afrika-chip">Admin access</span>
            <span className="afrika-chip">Protected control room</span>
          </div>
          <h1 className="afrika-hero-title text-4xl">Sign in to the AFRIKA admin center.</h1>
          <p className="max-w-xl text-sm leading-7 text-white/65">
            This dashboard is restricted to admin sessions and live operational data.
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setLoading(true);
            try {
              await signIn(email, password);
              router.replace(nextPath);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Unable to sign in.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="block space-y-2">
            <span className="afrika-label">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
              type="email"
              placeholder="admin@afrika.local"
            />
          </label>

          <label className="block space-y-2">
            <span className="afrika-label">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
              type="password"
              placeholder="Password"
            />
          </label>

          {error ? <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Signing in..." : "Enter control room"}
          </button>
        </form>

        <div className="mt-6 text-sm text-white/55">Use an approved admin account to enter the control room.</div>
      </div>
    </main>
  );
}

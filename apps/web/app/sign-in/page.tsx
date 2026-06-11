"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "../../components/session-provider";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState("admin@afrika.local");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "afrika-demo-password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen px-4 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-xl">
        <div className="afrika-panel p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="afrika-chip">Sign in</span>
            <span className="afrika-chip">AFRIKA account</span>
          </div>
          <h1 className="afrika-hero-title text-3xl">Enter your AFRIKA account</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Sign in to sync your profile, saved places, and plans with the live API.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setLoading(true);
              try {
                await signIn(email, password);
                router.push("/profile" as const);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Sign in failed.");
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
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
                type="email"
                placeholder="you@afrika.ng"
              />
            </label>
            <label className="block space-y-2">
              <span className="afrika-label">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
                type="password"
                placeholder="Password"
              />
            </label>

            {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

            <button className="btn-primary w-full justify-center" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-white/55">
            <span>Need an account?</span>
            <Link href={"/sign-up" as const} className="text-white/80 underline decoration-white/30 underline-offset-4">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

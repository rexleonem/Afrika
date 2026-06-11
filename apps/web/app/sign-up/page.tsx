"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "../../components/session-provider";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useSession();
  const [name, setName] = useState("AFRIKA Member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen px-4 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-xl">
        <div className="afrika-panel p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="afrika-chip">Sign up</span>
            <span className="afrika-chip">AFRIKA account</span>
          </div>
          <h1 className="afrika-hero-title text-3xl">Create your AFRIKA account</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Create a real session so your profile, plans, and saved discoveries can persist.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setLoading(true);
              try {
                await signUp({ name, email, password });
                router.push("/profile" as const);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Sign up failed.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <label className="block space-y-2">
              <span className="afrika-label">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
                type="text"
                placeholder="Your name"
              />
            </label>
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
                placeholder="Create a password"
              />
            </label>

            {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

            <button className="btn-primary w-full justify-center" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-white/55">
            <span>Already have an account?</span>
            <Link href={"/sign-in" as const} className="text-white/80 underline decoration-white/30 underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

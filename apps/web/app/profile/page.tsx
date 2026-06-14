"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { MetricTile, SectionHeader } from "../../components/primitives";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

type Plan = {
  id: string;
  title: string;
  type: string;
  items: Array<{ id: string; title: string; note?: string; cardId?: string }>;
};

type SearchHistory = {
  id: string;
  query: string;
  intent: string;
  resultCount: number;
  createdAt: string;
};

type SavedItem = {
  id: string;
  card: {
    id: string;
    title: string;
    location: string;
    category: string;
    media: { imageUrl: string };
    intelligence: { summary: string };
  };
};

type HistoryItem = {
  id: string;
  createdAt: string;
  card: {
    id: string;
    title: string;
    location: string;
    category: string;
    media: { imageUrl: string };
  };
};

export default function ProfilePage() {
  const { status, user, signOut } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [searches, setSearches] = useState<SearchHistory[]>([]);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    let active = true;
    void Promise.all([
      apiFetch<{ items: Plan[] }>("/plans"),
      apiFetch<{ items: SearchHistory[] }>("/search/history"),
      apiFetch<{ items: SavedItem[] }>("/saves"),
      apiFetch<{ items: HistoryItem[] }>("/history/views?limit=6")
    ])
      .then(([plansResponse, searchesResponse, savesResponse, historyResponse]) => {
        if (!active) return;
        setPlans(plansResponse.items);
        setSearches(searchesResponse.items);
        setSaved(savesResponse.items);
        setHistory(historyResponse.items);
      })
      .catch(() => {
        if (!active) return;
        setPlans([]);
        setSearches([]);
        setSaved([]);
        setHistory([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

  if (loading) {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-6 text-sm text-white/65">Loading profile...</div>
      </main>
    );
  }

  if (status !== "authenticated" || !user) {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-8">
          <AmbientGlow variant="gold" size="lg" className="right-0 top-0" opacity={0.16} />
          <SectionHeader
            eyebrow="Profile"
            title="Sign in to see your saved work."
            description="Your plans, saved discoveries, recent searches, and viewed places only make sense once they belong to you."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-in" className="btn-primary">
              Sign in
            </Link>
            <Link href="/sign-up" className="btn-secondary">
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-24 lg:pb-12">
      <section className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="clay" size="lg" className="right-[5%] top-[10%]" opacity={0.2} />
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-3xl font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="afrika-label">Signed in</div>
                <div className="mt-1 text-2xl font-semibold text-white">{user.name}</div>
                <div className="text-sm text-white/55">{user.email}</div>
              </div>
            </div>
            <h1 className="afrika-hero-title max-w-3xl text-3xl sm:text-4xl">
              Your profile is now tied to real places, real plans, and the questions you keep returning to.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/65">
              AFRIKA keeps track of what you saved, what you asked Nommo, and the places you opened long enough to care about.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary">
                Keep exploring
              </Link>
              <button className="btn-secondary" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Saved" value={`${saved.length}`} detail="Places you held onto." />
            <MetricTile label="Plans" value={`${plans.length}`} detail="Routes and ideas in progress." />
            <MetricTile label="Searches" value={`${searches.length}`} detail="Questions you've asked." />
            <MetricTile label="Viewed" value={`${history.length}`} detail="Cards you've opened recently." />
          </div>
        </div>
      </section>

      <section className="mt-10 px-4 sm:px-8 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Saved plans"
                title="What you're actively putting together."
                description="Keep the places, plans, and patterns that are starting to feel like yours."
              />
            </ScrollReveal>

            <div className="grid gap-4">
              {plans.length === 0 ? (
                <div className="afrika-panel p-5 text-sm text-white/60">You have not created a plan yet.</div>
              ) : (
                plans.map((plan) => (
                  <div key={plan.id} className="afrika-panel p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="afrika-label">{plan.type}</div>
                        <div className="mt-2 text-lg font-semibold text-white">{plan.title}</div>
                      </div>
                      <span className="afrika-chip">{plan.items.length} items</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {plan.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <ScrollReveal>
              <SectionHeader
                eyebrow="Saved discoveries"
                title="Places worth reopening."
                description="These are the cards you explicitly saved, not just the latest cards in the feed."
              />
            </ScrollReveal>

            <div className="grid gap-4 md:grid-cols-2">
              {saved.length === 0 ? (
                <div className="afrika-panel p-5 text-sm text-white/60">Nothing saved yet. Save a discovery from any detail page.</div>
              ) : (
                saved.map((item) => (
                  <Link key={item.id} href={`/discover/${item.card.id}`} className="afrika-panel block overflow-hidden p-0">
                    <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${item.card.media.imageUrl})` }} />
                    <div className="p-5">
                      <div className="afrika-label">{item.card.category}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{item.card.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{item.card.location}</div>
                      <p className="mt-3 text-sm leading-6 text-white/65">{item.card.intelligence.summary}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <ScrollReveal>
              <SectionHeader
                eyebrow="Recent searches"
                title="What you've been asking Nommo."
                description="Queries are only stored when the live search endpoint resolves them."
              />
            </ScrollReveal>

            <div className="space-y-3">
              {searches.length === 0 ? (
                <div className="afrika-panel p-5 text-sm text-white/60">No recorded searches yet.</div>
              ) : (
                searches.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="afrika-panel p-5">
                    <div className="text-sm font-medium text-white">{entry.query}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{entry.intent}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="afrika-panel p-5">
              <div className="afrika-label">Recent views</div>
              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <p className="text-sm leading-6 text-white/60">Your recent card views will appear here once you open a few discoveries.</p>
                ) : (
                  history.map((item) => (
                    <Link key={item.id} href={`/discover/${item.card.id}`} className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${item.card.media.imageUrl})` }} />
                      <div className="px-4 py-3">
                        <div className="text-sm font-medium text-white">{item.card.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{item.card.location}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

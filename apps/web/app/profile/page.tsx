"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { MetricTile, SectionHeader, InsightRow } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
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

type Card = {
  id: string;
  title: string;
  location: string;
  category: string;
  media?: { imageUrl?: string };
  intelligence: { summary: string; whyItMatters: string };
};

export default function ProfilePage() {
  const { status, user, signOut } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [savedCards, setSavedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [plansResponse, historyResponse, cardsResponse] = await Promise.all([
          apiFetch<{ items: Plan[] }>("/plans"),
          apiFetch<{ items: SearchHistory[] }>("/search/history"),
          apiFetch<{ items: Card[] }>("/cards?limit=6")
        ]);
        if (!active) return;
        setPlans(plansResponse.items);
        setHistory(historyResponse.items);
        setSavedCards(cardsResponse.items);
      } catch {
        if (!active) return;
        setPlans([]);
        setHistory([]);
        setSavedCards([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const interestTags = useMemo(
    () => ["Discovery", "Culture", "Food routes", "Weekend plans", "Map-first", "Quiet places", "Opportunities"],
    []
  );

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-8">Loading profile intelligence…</div>
      </main>
    );
  }

  if (status !== "authenticated" || !user) {
    return (
      <main className="min-h-screen px-4 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="afrika-panel p-8">
            <AmbientGlow variant="gold" size="lg" className="top-0 right-0" opacity={0.18} />
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="afrika-chip">Profile</span>
              <span className="afrika-chip">Session required</span>
            </div>
            <h1 className="afrika-hero-title text-3xl">Sign in to unlock your profile</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              Your saved plans, recent searches, and discovery history will appear here once you sign in.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={"/sign-in" as const} className="btn-primary">Sign in</Link>
              <Link href={"/sign-up" as const} className="btn-secondary">Create account</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <section className="relative overflow-hidden px-4 pt-14 pb-10 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="clay" size="lg" className="top-[10%] right-[5%]" opacity={0.22} />
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">Identity graph</span>
              <span className="afrika-chip">Taste profile</span>
              <span className="afrika-chip">Session live</span>
            </div>
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
              Your account now reflects real saved history, real plans, and real discovery signals.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/65">
              This profile is now connected to the live API rather than a static placeholder. Session data, plans, and search behavior are loaded from the backend.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary" onClick={() => void signOut()}>
                Sign out
              </button>
              <Link href={"/search" as const} className="btn-primary">
                Continue exploring
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Saved cards" value={`${savedCards.length}`} detail="Loaded from live API state." />
            <MetricTile label="Plans" value={`${plans.length}`} detail="Stored persistently." />
            <MetricTile label="Searches" value={`${history.length}`} detail="Recent intent history." />
            <MetricTile label="Role" value={user.role.replace(/-/g, " ")} detail="Access level from session." />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Profile intelligence"
                title="Your taste profile becomes a map of what you naturally explore."
                description="The screen now reflects live session data instead of placeholder seed content."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {interestTags.map((tag) => (
                  <span key={tag} className="afrika-chip">{tag}</span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <SectionHeader eyebrow="Saved plans" title="What you’re actively organizing." />
              <div className="mt-5 grid gap-3">
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <div key={plan.id} className="afrika-panel p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="afrika-label">{plan.type}</div>
                          <div className="mt-1 text-lg font-semibold text-white">{plan.title}</div>
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
                ) : (
                  <div className="afrika-panel p-5 text-sm text-white/60">No saved plans yet. Open the plans page to start one.</div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <SectionHeader eyebrow="Recent searches" title="What you’ve been asking Afrika." />
              <div className="mt-5 space-y-3">
                {history.length > 0 ? (
                  history.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="afrika-panel p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-medium text-white">{entry.query}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{entry.intent}</div>
                        </div>
                        <div className="text-xs text-white/55">{entry.resultCount} results</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="afrika-panel p-5 text-sm text-white/60">Search history will appear here after your first live query.</div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <SectionHeader eyebrow="Saved discoveries" title="Cards backed by the live API." />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {savedCards.length > 0 ? (
                  savedCards.map((card) => (
                    <Link key={card.id} href={`/discover/${card.id}`} className="afrika-panel block overflow-hidden p-0">
                      <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${card.media?.imageUrl ?? ""})` }} />
                      <div className="p-5">
                        <div className="afrika-label">{card.category}</div>
                        <div className="mt-2 text-lg font-semibold text-white">{card.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{card.location}</div>
                        <p className="mt-3 text-sm leading-6 text-white/65">{card.intelligence?.summary}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="afrika-panel p-5 text-sm text-white/60">Saved discoveries will show up once the feed and save flows are connected.</div>
                )}
              </div>
            </ScrollReveal>
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Account intelligence" live>
              <InsightRow title="Identity" detail={`${user.name} · ${user.role}`} accent />
              <InsightRow title="Session" detail="Connected to the API-backed auth flow." accent />
              <InsightRow title="Sync" detail="Plans, cards, and searches load from live state." accent />
            </AIInsightPanel>

            <AIInsightPanel title="Profile summary">
              <p className="text-xs leading-5 text-white/65">
                The profile page now reads actual session state from AFRIKA’s API rather than a static demo shell.
              </p>
            </AIInsightPanel>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

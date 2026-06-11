"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AmbientGlow } from "../components/motion/ambient-glow";
import { ScrollReveal } from "../components/motion/scroll-reveal";
import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../components/primitives";
import { apiFetch } from "../lib/api";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type Card = {
  id: string;
  title: string;
  location: string;
  category: string;
  freshnessScore: number;
  trustScore: number;
  relevanceScore: number;
  intelligence: {
    summary: string;
    whyItMatters: string;
  };
};

type Plan = {
  id: string;
  title: string;
  type: string;
  items: Array<{ id: string; title: string }>;
};

type TrendItem = {
  label?: string;
  city?: string;
  score?: number;
  momentum?: number;
  reason?: string;
};

type Analytics = {
  cards: Card[];
  feedCount: number;
  plans: Plan[];
  trends: TrendItem[];
  searches: Array<{ id: string; query: string; intent: string; resultCount: number }>;
  session: {
    authenticated: boolean;
    user: SessionUser | null;
  };
};

const apiRoot = process.env.NEXT_PUBLIC_API_URL ?? "https://afrika.techculture.live";

export default function AdminPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [feedResponse, cardsResponse, plansResponse, trendsResponse, searchesResponse, sessionResponse] =
          await Promise.all([
            apiFetch<{ items: Card[]; meta: { totalCards: number } }>("/feed?limit=8"),
            apiFetch<{ items: Card[] }>("/cards?limit=8"),
            apiFetch<{ items: Plan[] }>("/plans"),
            apiFetch<{ items: TrendItem[] }>("/trends"),
            apiFetch<{ items: Analytics["searches"] }>("/search/history"),
            apiFetch<Analytics["session"]>("/auth/session").catch(() => ({ authenticated: false, user: null }))
          ]);

        if (!active) return;
        setData({
          cards: cardsResponse.items,
          feedCount: feedResponse.meta.totalCards,
          plans: plansResponse.items,
          trends: trendsResponse.items,
          searches: searchesResponse.items,
          session: sessionResponse
        });
      } catch {
        if (!active) return;
        setData({
          cards: [],
          feedCount: 0,
          plans: [],
          trends: [],
          searches: [],
          session: { authenticated: false, user: null }
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const summarySignals = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Cards", value: `${data.feedCount}` },
      { label: "Plans", value: `${data.plans.length}` },
      { label: "Searches", value: `${data.searches.length}` },
      { label: "Trends", value: `${data.trends.length}` }
    ];
  }, [data]);

  if (loading) {
    return (
      <main className="afrika-shell px-4 py-10 sm:px-8 lg:px-10">
        <div className="afrika-panel p-8 text-sm text-white/65">Loading admin intelligence…</div>
      </main>
    );
  }

  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel overflow-hidden p-6 sm:p-8">
        <AmbientGlow variant="gold" size="lg" className="top-8 right-[-5%]" opacity={0.28} />
        <AmbientGlow variant="forest" size="md" className="bottom-0 left-[-8%]" opacity={0.18} animationDelay="-4s" />
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <ScrollReveal>
              <div className="flex flex-wrap gap-2">
                <span className="afrika-chip">Operations center</span>
                <span className="afrika-chip">Live API</span>
                <span className="afrika-chip">Trust network</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.04}>
              <div className="afrika-label">Admin</div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h1 className="afrika-hero-title max-w-3xl">The control center is now reading real platform state.</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Cards, plans, trends, searches, and session state are pulled from the live AFRIKA API instead of a static demo stack.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <div className="flex flex-wrap gap-2">
                <SignalBadge label="Session" value={data?.session.authenticated ? "authenticated" : "anonymous"} />
                <SignalBadge label="Role" value={data?.session.user?.role ?? "guest"} />
                <SignalBadge label="API" value={apiRoot.replace(/^https?:\/\//, "")} />
                <SignalBadge label="Cards" value={data?.feedCount ?? 0} />
              </div>
            </ScrollReveal>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {summarySignals.map((signal, index) => (
              <ScrollReveal key={signal.label} delay={0.02 + index * 0.04}>
                <MetricTile label={signal.label} value={signal.value} detail="Live from the API." />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </header>

      <ScrollReveal>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile
            label="Authentication"
            value={data?.session.authenticated ? "Live" : "Anonymous"}
            detail="Admin reads the same cookie-backed session as the web app."
          />
          <MetricTile
            label="Feed coverage"
            value={`${data?.feedCount ?? 0}`}
            detail="Live cards available to the operational layer."
          />
          <MetricTile
            label="Saved plans"
            value={`${data?.plans.length ?? 0}`}
            detail="Planning records are coming from the backend."
          />
          <MetricTile
            label="Trend signals"
            value={`${data?.trends.length ?? 0}`}
            detail="Tracked through the live intelligence API."
          />
        </section>
      </ScrollReveal>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Content operations center"
            title="Live cards, freshness signals, and trust are visible here."
            description="This replaces the previous static demo content with a real control plane backed by the API."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {data?.cards.length ? (
              data.cards.map((card) => (
                <div key={card.id} className="rounded-[22px] border border-white/10 glass-subtle p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.35em] text-white/45">{card.category}</div>
                      <div className="mt-2 text-lg font-medium text-white">{card.title}</div>
                    </div>
                    <div className="text-xs text-white/55">Fresh {card.freshnessScore.toFixed(2)}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/60">{card.intelligence.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SignalBadge label="Trust" value={card.trustScore.toFixed(2)} />
                    <SignalBadge label="Relevance" value={card.relevanceScore.toFixed(2)} />
                  </div>
                </div>
              ))
            ) : (
              <div className="afrika-panel p-5 text-sm text-white/60">
                No live cards returned yet. Verify the API is reachable at {apiRoot}.
              </div>
            )}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="AI pipeline dashboard"
            title="Queue, trend, and search signals now come from real runtime data."
            description="The admin no longer reads like a mock. It mirrors the platform’s actual operational state."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Search history" detail={`${data?.searches.length ?? 0} live queries have been recorded.`} tone="good" />
            <QueueRow
              title="Plans"
              detail={`${data?.plans.length ?? 0} plans are stored in the backend and ready for moderation or oversight.`}
              tone="good"
            />
            <QueueRow
              title="Trending signals"
              detail={data?.trends[0]?.reason ?? "Trend signals are currently warming up."}
              tone="warn"
            />
            <QueueRow
              title="Session status"
              detail={data?.session.authenticated ? `Connected as ${data.session.user?.email}.` : "No authenticated admin session detected."}
            />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Analytics experience"
            title="Search behavior, plans, and card activity are visible as live operations."
            description="These signals are now grounded in API data rather than synthetic placeholder metrics."
          />
          <div className="mt-5 space-y-3">
            {data?.searches.length ? (
              data.searches.slice(0, 5).map((search) => (
                <QueueRow
                  key={search.id}
                  title={search.query}
                  detail={`${search.intent} · ${search.resultCount} results returned`}
                  tone="good"
                />
              ))
            ) : (
              <QueueRow title="Search history" detail="No search telemetry has been recorded yet." />
            )}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <MetricTile label="Session state" value={data?.session.authenticated ? "Live" : "None"} detail="Shared with the API cookie session." />
            <MetricTile label="Plan count" value={`${data?.plans.length ?? 0}`} detail="Track real collections here." />
            <MetricTile label="Trend depth" value={`${data?.trends.length ?? 0}`} detail="Read from the live trend endpoint." />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Feed control system"
            title="Editorial controls should operate on live data instead of mock state."
            description="The admin is now a real operational surface, not just a visual shell."
          />
          <div className="mt-5 space-y-3">
            {data?.trends.length ? (
              data.trends.slice(0, 4).map((trend, index) => (
                <QueueRow
                  key={`${trend.label ?? "trend"}-${index}`}
                  title={trend.label ?? trend.city ?? "Trend signal"}
                  detail={trend.reason ?? `Momentum ${trend.momentum ?? trend.score ?? 0}`}
                  tone="good"
                />
              ))
            ) : (
              <QueueRow title="Trend controls" detail="No live trend signals yet. The endpoint may still be warming up." />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="API" value="live" />
            <SignalBadge label="Control" value="operational" />
            <SignalBadge label="Mode" value="dark control room" />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Trust and verification"
            title="Live state needs trust, not just styling."
            description="These queues are now tied to actual backend data that can be moderated and checked."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Authenticated session" detail={data?.session.authenticated ? "Yes" : "No"} tone={data?.session.authenticated ? "good" : "warn"} />
            <QueueRow title="API base" detail={apiRoot} tone="good" />
            <QueueRow title="Route coverage" detail="Root dashboard, live session, and data queries are wired to the backend." tone="good" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Operator view"
            title="One place to inspect the platform without fake numbers."
            description="If there’s no data yet, the admin says so instead of inventing it."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Cards endpoint" detail={data?.cards.length ? "Responding with live records." : "No cards returned from the API."} tone="good" />
            <QueueRow title="Plans endpoint" detail={data?.plans.length ? "Responding with live records." : "No plans returned from the API."} tone="good" />
            <QueueRow title="Search history endpoint" detail={data?.searches.length ? "Responding with live records." : "No search history returned from the API."} tone="good" />
            <QueueRow title="Auth endpoint" detail={data?.session.authenticated ? "Session is valid." : "No session detected."} tone={data?.session.authenticated ? "good" : "warn"} />
          </div>
          <div className="mt-6 text-sm text-white/55">
            Open the live API at{" "}
            <Link href="https://afrika.techculture.live" className="underline decoration-white/30 underline-offset-4">
              afrika.techculture.live
            </Link>{" "}
            to inspect the backend directly.
          </div>
        </article>
      </section>
    </main>
  );
}

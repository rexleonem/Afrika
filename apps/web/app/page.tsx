"use client";

import { featuredCards } from "@afrika/shared/content";
import { freshnessStatus, interpretSearch, scoreCardTotal } from "@afrika/shared/stage2";
import { motion } from "framer-motion";

export default function HomePage() {
  const feedHighlights = featuredCards.map((card) => ({
    ...card,
    quality: scoreCardTotal({
      usefulness: 0.86,
      uniqueness: 0.72,
      freshness: card.freshnessScore,
      visualQuality: 0.91,
      sourceTrust: card.trustScore,
      engagementProbability: 0.66,
      localRelevance: card.relevanceScore
    })
  }));

  const trendQuery = interpretSearch("trending places in Lagos this week");

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <aside className="hidden rounded-[28px] border border-white/10 bg-white/5 p-5 lg:block">
          <div className="text-xs uppercase tracking-[0.4em] text-white/50">AFRIKA</div>
          <nav className="mt-8 space-y-4 text-sm text-white/70">
            <div className="text-white">Discover</div>
            <div>Search</div>
            <div>Map</div>
            <div>Plans</div>
            <div>Profile</div>
          </nav>
        </aside>

        <section className="space-y-6">
          <header className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.4em] text-white/50">Visual intelligence layer</div>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
              Africa, rendered as a living stream of places, signals, and action.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
              Discover what matters, understand it instantly, and move with clarity.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Trend signal</div>
              <div className="mt-3 text-2xl font-semibold">Trending in Lagos</div>
              <p className="mt-2 text-sm text-white/60">{trendQuery.rankingHint}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Freshness</div>
              <div className="mt-3 text-2xl font-semibold">{freshnessStatus(feedHighlights[0]?.quality.freshness ?? 0.8)}</div>
              <p className="mt-2 text-sm text-white/60">Cards decay automatically when they lose confidence.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Reasoning</div>
              <div className="mt-3 text-2xl font-semibold">Context-aware</div>
              <p className="mt-2 text-sm text-white/60">AI adds why-it-matters, comparisons, and nearby discovery.</p>
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {feedHighlights.map((card, index) => (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-glow"
              >
                <div className="aspect-[4/5] bg-cover bg-center" style={{ backgroundImage: `url(${card.media.imageUrl})` }} />
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-white/45">
                    <span>{card.category}</span>
                    <span>{card.location}</span>
                  </div>
                  <h2 className="text-2xl font-medium tracking-tight">{card.title}</h2>
                  <p className="text-sm leading-6 text-white/70">{card.intelligence.summary}</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                    quality {card.quality.total} · freshness {card.freshnessScore}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Intelligence</div>
            <p className="mt-3 text-lg leading-7 text-white/85">Discover → Understand → Act</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Useful, calm, and spatially aware discovery for African life.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Freshness</div>
            <div className="mt-3 text-3xl font-semibold">0.91</div>
            <p className="mt-2 text-sm text-white/60">Recent, trusted, and locally relevant.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

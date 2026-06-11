"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { featuredCards } from "@afrika/shared/content";
import { interpretSearch } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";
import { generateCulturalStories } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { apiFetch } from "../../lib/api";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { SearchBar } from "../../components/ui/search-bar";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { AmbientGlow } from "../../components/motion/ambient-glow";

type LiveCard = (typeof featuredCards)[number];

const SUGGESTIONS = [
  "Quiet places to work in Lagos",
  "Weekend escapes under 2 hours",
  "Where the work crowd actually goes in Nairobi",
  "Best calm places right now",
  "Emerging neighborhoods in Accra"
];

const cityIntelligence = buildCityIntelligence(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" }
]);
const predictiveResults = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
const culturalStories = generateCulturalStories(featuredCards, []);
const actionLayer = buildActionLayer(featuredCards);
const ambientIntelligence = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const leadingCity = cityIntelligence.find((city) => city.city === "Lagos");

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LiveCard[]>(featuredCards);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timeout = window.setTimeout(async () => {
      try {
        const response = await apiFetch<{ items: LiveCard[] }>(`/search?q=${encodeURIComponent(query || "quiet places to work in Lagos")}`);
        if (!active) return;
        setResults(response.items.length > 0 ? response.items : featuredCards);
      } catch {
        if (!active) return;
        const q = query.trim().toLowerCase();
        setResults(
          !q
            ? featuredCards
            : featuredCards.filter((card) =>
                [card.title, card.location, card.category, card.intelligence.summary, ...card.tags].join(" ").toLowerCase().includes(q)
              )
        );
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  const parsed = useMemo(() => interpretSearch(query || "quiet places to work in Lagos"), [query]);

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="gold" size="lg" className="top-0 right-[20%]" opacity={0.35} />
        <AmbientGlow variant="forest" size="md" className="bottom-0 left-[5%]" opacity={0.25} animationDelay="-3s" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap gap-2">
            {["Ask Nommo", "Semantic search", "Map-aware results"].map((chip) => (
              <span key={chip} className="afrika-chip">
                {chip}
              </span>
            ))}
          </div>
          <h1 className="afrika-hero-title text-4xl sm:text-5xl">
            Search like a question.{" "}
            <span style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--accent-warm))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Receive a spatial decision.
            </span>
          </h1>
          <p className="text-base leading-7 text-white/65">
            AFRIKA understands intent, geography, timing, and context, then surfaces immersive results with useful comparisons and soft next steps.
          </p>
          <SearchBar value={query} onChange={setQuery} suggestions={SUGGESTIONS} onSuggestion={setQuery} />
          <AnimatePresence mode="wait">
            {(query || loading) && (
              <motion.div
                key={query}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                  Intent: {parsed.intent}
                </div>
                {parsed.locationHint ? <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">📍 {parsed.locationHint}</div> : null}
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <SectionHeader
              eyebrow={query ? `Results for "${query}"` : "Discover"}
              title={query ? "Grouped intelligence, not a flat list." : "All discoveries, curated by intelligence."}
              description="Each result blends visual context, why-it-matters reasoning, and action paths."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {results.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DiscoveryCard
                    card={card}
                    score={`Match ${card.relevanceScore.toFixed(2)}`}
                    highlight={card.intelligence.comparison ?? card.intelligence.whyItMatters}
                    cta="View result"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Nommo reading">
              <p className="text-xs leading-5 text-white/65">
                {parsed.rankingHint} The system combines semantic intent, geo relevance, freshness, and the ambient city pulse.
              </p>
            </AIInsightPanel>

            <AIInsightPanel title="City pulse" live>
              <div className="space-y-2">
                <InsightRow title="Temporal cue" detail={ambientIntelligence.temporalSignals[0]?.recommendation ?? "Timing-aware results."} accent />
                <InsightRow title={leadingCity?.city ?? "Lagos"} detail={`Momentum ${leadingCity?.trendMomentum ?? 0} · Density ${leadingCity?.discoveryDensity ?? 0}`} accent />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Likely next steps">
              <div className="space-y-2">
                {predictiveResults.slice(0, 3).map((item) => (
                  <InsightRow key={item.card.id} title={item.card.title} detail={item.reason} />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Cultural context">
              <p className="mb-3 text-xs leading-5 text-white/65">{culturalStories[0]?.summary ?? "Local context appears here once the results settle."}</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/map" className="afrika-chip text-xs">
                  Open map
                </Link>
                <Link href="/plans" className="afrika-chip text-xs">
                  Add to plan
                </Link>
              </div>
            </AIInsightPanel>

            <div className="grid grid-cols-2 gap-3">
              <MetricTile label="Intent" value={parsed.intent} />
              <MetricTile label="Mode" value={ambientIntelligence.adaptiveInterface.mode.split("-")[0]} />
            </div>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

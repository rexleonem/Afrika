"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { featuredCards } from "@afrika/shared/content";
import { interpretSearch } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";
import { generateCulturalStories } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { SearchBar } from "../../components/ui/search-bar";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

const SUGGESTIONS = [
  "Quiet places to work in Lagos",
  "Weekend escapes under 2 hours",
  "Creative hubs in Nairobi",
  "Best calm places right now",
  "Emerging neighborhoods in Accra",
];

const cityIntelligence = buildCityIntelligence(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" },
]);
const predictiveResults = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
const culturalStories = generateCulturalStories(featuredCards, []);
const actionLayer = buildActionLayer(featuredCards);
const ambientIntelligence = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const leadingCity = cityIntelligence.find((city) => city.city === "Lagos");

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // Live client-side filtering
  const filtered = useMemo(() => {
    if (!query.trim()) return featuredCards;
    const q = query.toLowerCase();
    return featuredCards.filter(
      (card) =>
        card.title.toLowerCase().includes(q) ||
        card.location.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q) ||
        card.tags.some((t) => t.toLowerCase().includes(q)) ||
        card.intelligence.summary.toLowerCase().includes(q)
    );
  }, [query]);

  const parsed = interpretSearch(query || "quiet places to work in Lagos");

  return (
    <main className="min-h-screen pb-24 lg:pb-12">

      {/* ── Search hero ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 pt-16 pb-12 sm:px-8 lg:px-12"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <AmbientGlow variant="gold" size="lg" className="top-0 right-[20%]" opacity={0.35} />
        <AmbientGlow variant="forest" size="md" className="bottom-0 left-[5%]" opacity={0.25} animationDelay="-3s" />

        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              {["AI-powered exploration", "Semantic search", "Map-aware results"].map((chip) => (
                <span key={chip} className="afrika-chip">{chip}</span>
              ))}
            </div>

            <h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display), serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              Search like a question.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-gold), var(--accent-warm))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Receive a spatial decision.
              </span>
            </h1>

            <p className="text-base leading-7" style={{ color: "var(--text-secondary)" }}>
              AFRIKA understands intent, geography, timing, and context — then surfaces immersive results with useful comparisons and soft next steps.
            </p>

            {/* Big search bar */}
            <SearchBar
              value={query}
              onChange={setQuery}
              suggestions={SUGGESTIONS}
              onSuggestion={setQuery}
            />

            {/* Query interpretation */}
            <AnimatePresence mode="wait">
              {query && (
                <motion.div
                  key={query}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap gap-3"
                >
                  <div
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-full"
                    style={{
                      background: "rgba(210,166,109,0.08)",
                      border: "1px solid rgba(210,166,109,0.18)",
                      color: "var(--accent-gold)",
                    }}
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Intent: {parsed.intent}
                  </div>
                  {parsed.locationHint && (
                    <span
                      className="text-xs px-3 py-2 rounded-full"
                      style={{
                        background: "var(--bg-glass-light)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      📍 {parsed.locationHint}
                    </span>
                  )}
                  <span
                    className="text-xs px-3 py-2 rounded-full"
                    style={{
                      background: "var(--bg-glass-light)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">

          {/* Results grid */}
          <div className="space-y-8">
            <SectionHeader
              eyebrow={query ? `Results for "${query}"` : "Discover"}
              title={query ? "Grouped intelligence, not a flat list." : "All discoveries, curated by intelligence."}
              description="Each result blends visual context, why-it-matters reasoning, and action paths."
            />

            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key={query}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  {filtered.map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <DiscoveryCard
                        card={card}
                        score={`Match ${card.relevanceScore.toFixed(2)}`}
                        highlight={card.intelligence.comparison ?? card.intelligence.whyItMatters}
                        cta="View result"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div
                    className="text-5xl mb-4"
                    style={{ filter: "grayscale(1)", opacity: 0.4 }}
                  >🌍</div>
                  <div
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    No discoveries found
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Try a different query or{" "}
                    <button
                      onClick={() => setQuery("")}
                      style={{ color: "var(--accent-gold)", textDecoration: "underline" }}
                    >
                      clear the search
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel */}
          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="AI explanation">
              <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>
                {parsed.rankingHint} The system combines semantic intent, geo relevance, freshness, and the ambient city pulse.
              </p>
            </AIInsightPanel>

            <AIInsightPanel title="Intelligence" live>
              <div className="space-y-2">
                <InsightRow title="Temporal cue" detail={ambientIntelligence.temporalSignals[0]?.recommendation ?? "Timing-aware results."} accent />
                <InsightRow title={leadingCity?.city ?? "Lagos"} detail={`Momentum ${leadingCity?.trendMomentum ?? 0} · Density ${leadingCity?.discoveryDensity ?? 0}`} accent />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Predictive matches">
              <div className="space-y-2">
                {predictiveResults.slice(0, 3).map((item) => (
                  <InsightRow key={item.card.id} title={item.card.title} detail={item.reason} />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Cultural context">
              <p className="text-xs leading-5 mb-3" style={{ color: "var(--text-secondary)" }}>
                {culturalStories[0]?.summary ?? "Cultural intelligence appears here."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/map" className="afrika-chip text-xs">Open map</Link>
                <Link href="/plans" className="afrika-chip text-xs">Add to plan</Link>
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

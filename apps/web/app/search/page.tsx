"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { AFRIKACard } from "@afrika/shared/types";
import { interpretSearch } from "@afrika/shared/stage2";
import { apiFetch } from "../../lib/api";
import { buildLocationQuery, useLocationContext } from "../../lib/location-context";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { SearchBar } from "../../components/ui/search-bar";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { AmbientGlow } from "../../components/motion/ambient-glow";

type LiveCard = AFRIKACard;

type SearchResponse = {
  items: LiveCard[];
  summary?: string;
};

const suggestions = [
  "Quiet places to work in Lagos",
  "Weekend escapes under 2 hours",
  "Where the work crowd actually goes in Nairobi",
  "Best calm places right now",
  "Emerging neighborhoods in Accra"
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LiveCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { effectiveLocation, geolocationStatus, requestPreciseLocation, isLocating } = useLocationContext();

  const locationQuery = useMemo(() => buildLocationQuery(effectiveLocation), [effectiveLocation]);
  const locationLabel = useMemo(() => {
    if (!effectiveLocation) return null;
    if (effectiveLocation.label?.trim()) return effectiveLocation.label;
    return [effectiveLocation.city, effectiveLocation.country].filter(Boolean).join(", ") || null;
  }, [effectiveLocation]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const timeout = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("q", query);
        if (query.trim().length > 0) params.set("record", "true");
        if (locationQuery) {
          const locationParams = new URLSearchParams(locationQuery);
          locationParams.forEach((value, key) => params.set(key, value));
        }

        const response = await apiFetch<SearchResponse>(`/search?${params.toString()}`);
        if (!active) return;
        setResults(response.items);
      } catch (requestError) {
        if (!active) return;
        setResults([]);
        setError(requestError instanceof Error ? requestError.message : "Search is unavailable right now.");
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query, locationQuery]);

  const parsed = useMemo(() => interpretSearch(query || "quiet places to work in Lagos"), [query]);

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="gold" size="lg" className="right-[20%] top-0" opacity={0.35} />
        <AmbientGlow variant="forest" size="md" className="bottom-0 left-[5%]" opacity={0.25} animationDelay="-3s" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap gap-2">
            {["Ask Nommo", "Semantic search", "Map-aware results"].map((chip) => (
              <span key={chip} className="afrika-chip">
                {chip}
              </span>
            ))}
            {locationLabel ? <span className="afrika-chip">{effectiveLocation?.source === "gps" ? `Near ${locationLabel}` : `Around ${locationLabel}`}</span> : null}
          </div>
          <h1 className="afrika-hero-title text-4xl sm:text-5xl">
            Search like a question.{" "}
            <span style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--accent-warm))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Receive a spatial decision.
            </span>
          </h1>
          <p className="text-base leading-7 text-white/65">
            Nommo reads intent, geography, timing, and context before it ranks what deserves your attention.
          </p>
          <SearchBar value={query} onChange={setQuery} suggestions={suggestions} onSuggestion={setQuery} />
          <AnimatePresence mode="wait">
            {(query || loading || error || locationLabel) && (
              <motion.div
                key={`${query}-${loading}-${error}-${locationLabel}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">Intent: {parsed.intent}</div>
                {parsed.locationHint ? <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">{parsed.locationHint}</div> : null}
                {locationLabel ? (
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
                    {effectiveLocation?.source === "gps" ? `Using exact location near ${locationLabel}` : `Ranking with ${locationLabel}`}
                  </div>
                ) : null}
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
                  {loading ? "Searching..." : `${results.length} result${results.length === 1 ? "" : "s"}`}
                </div>
                {geolocationStatus === "prompt" && effectiveLocation?.source !== "gps" ? (
                  <button
                    type="button"
                    onClick={() => void requestPreciseLocation()}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white transition hover:border-white/20 hover:bg-white/15"
                  >
                    {isLocating ? "Finding your exact spot..." : "Use exact location"}
                  </button>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="mt-10 px-4 sm:px-8 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <SectionHeader
              eyebrow={query ? `Results for "${query}"` : "Discover"}
              title={query ? "Grouped intelligence, not a flat list." : "All discoveries, curated by intelligence."}
              description={
                locationLabel
                  ? `Each result blends visual context, local relevance, and why-it-matters reasoning around ${locationLabel}.`
                  : "Each result blends visual context, why-it-matters reasoning, and action paths."
              }
            />

            {error ? (
              <div className="afrika-panel p-5 text-sm text-red-100">{error}</div>
            ) : null}

            {!loading && results.length === 0 ? (
              <div className="afrika-panel p-6 text-sm leading-6 text-white/60">
                No strong matches yet. Try naming a city, a mood, or the kind of place you want.
              </div>
            ) : (
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
            )}
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Nommo reading">
              <p className="text-xs leading-5 text-white/65">
                {parsed.rankingHint}{" "}
                {locationLabel
                  ? `Results are leaning toward ${locationLabel} before widening out.`
                  : "Results are coming from the live backend rather than a local fallback array."}
              </p>
            </AIInsightPanel>

            <AIInsightPanel title="Likely next steps">
              <div className="space-y-2">
                {results.slice(0, 3).map((item) => (
                  <InsightRow key={item.id} title={item.title} detail={item.intelligence.whyItMatters} />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Move with it">
              <div className="flex flex-wrap gap-2">
                <Link href="/map" className="afrika-chip text-xs">
                  Open map
                </Link>
                <Link href="/plans" className="afrika-chip text-xs">
                  Open plans
                </Link>
                <Link href="/nommo" className="afrika-chip text-xs">
                  Ask Nommo
                </Link>
              </div>
            </AIInsightPanel>

            <div className="grid grid-cols-2 gap-3">
              <MetricTile label="Intent" value={parsed.intent} />
              <MetricTile label="Results" value={`${results.length}`} />
            </div>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

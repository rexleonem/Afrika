"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { AFRIKACard } from "@afrika/shared/types";
import { buildAmbientIntelligence, buildTemporalIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { AmbientGlow } from "../../components/motion/ambient-glow";
import { apiFetch } from "../../lib/api";

type FeedResponse = {
  items: AFRIKACard[];
};

type MapPin = {
  id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  tone: "gold" | "forest" | "clay";
  kind: string;
  summary: string;
  category: string;
};

const FILTERS = ["All", "Neighborhoods", "Culture", "Work", "Dining", "Weekend"] as const;

const OSMMap = dynamic(() => import("../../components/maps/osm-map").then((mod) => mod.OSMMap), {
  ssr: false,
  loading: () => (
    <div className="afrika-map-surface flex min-h-[680px] items-center justify-center rounded-[28px] border border-white/10">
      <div className="text-sm text-white/60">Loading the live map...</div>
    </div>
  )
});

export default function MapPage() {
  const [cards, setCards] = useState<AFRIKACard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  useEffect(() => {
    let active = true;

    const loadMapCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch<FeedResponse>("/cards?limit=60");
        if (!active) return;
        setCards(response.items);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "We couldn't load the map right now.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadMapCards();

    return () => {
      active = false;
    };
  }, []);

  const ambient = useMemo(() => (cards.length ? buildAmbientIntelligence(cards, new Date().toISOString()) : null), [cards]);
  const temporal = useMemo(() => (cards.length ? buildTemporalIntelligence(cards, new Date().toISOString()) : []), [cards]);

  const pins = useMemo<MapPin[]>(
    () =>
      cards.map((card, index) => ({
        id: card.id,
        title: card.title,
        location: card.location,
        latitude: card.coordinates.lat,
        longitude: card.coordinates.lng,
        tone: (["gold", "forest", "clay"] as const)[index % 3],
        kind: card.kind,
        summary: card.intelligence.summary,
        category: card.category
      })),
    [cards]
  );

  const visiblePins = useMemo(() => {
    if (activeFilter === "All") return pins;
    const query = activeFilter.toLowerCase();
    return pins.filter((pin) => [pin.title, pin.location, pin.kind, pin.category].join(" ").toLowerCase().includes(query));
  }, [activeFilter, pins]);

  const activePinCard = visiblePins.find((pin) => pin.id === activePin) ?? null;
  const activeToneColor =
    activePinCard?.tone === "forest"
      ? "var(--accent-forest)"
      : activePinCard?.tone === "clay"
        ? "var(--accent-clay)"
        : "var(--accent-gold)";

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <section className="relative border-b px-4 pb-8 pt-14 sm:px-8 lg:px-12" style={{ borderColor: "var(--border-subtle)" }}>
        <AmbientGlow variant="forest" size="md" className="right-[30%] top-0" opacity={0.3} />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              {["Live city map", "OpenStreetMap", "Discovery overlays"].map((chip) => (
                <span key={chip} className="afrika-chip">
                  {chip}
                </span>
              ))}
            </div>

            <h1
              className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display), serif", letterSpacing: "-0.02em", lineHeight: 1.08 }}
            >
              Read the city through the places people keep moving toward.
            </h1>

            <p className="max-w-2xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              The map now runs on OpenStreetMap and the live AFRIKA card graph, so the spatial layer is reading the same places, timing, and context as the rest of the product.
            </p>

            <div className="mt-6 grid max-w-lg grid-cols-3 gap-3">
              <MetricTile label="Visible pins" value={`${visiblePins.length}`} detail="Live discovery points." />
              <MetricTile label="Cities in pulse" value={`${ambient?.cityPulse.length ?? 0}`} detail="Tracked by timing and movement." />
              <MetricTile
                label="Environment"
                value={ambient?.environmentalSignals[0]?.weather ?? "Loading"}
                detail={`${ambient?.environmentalSignals[0]?.traffic ?? "..." } traffic`}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-8 px-4 sm:px-8 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className="flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200"
                  style={{
                    background: activeFilter === filter ? "rgba(210,166,109,0.15)" : "var(--bg-glass-light)",
                    border: activeFilter === filter ? "1px solid rgba(210,166,109,0.30)" : "1px solid var(--border-subtle)",
                    color: activeFilter === filter ? "var(--accent-gold)" : "var(--text-muted)"
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {error ? <div className="afrika-panel mb-4 border-red-500/20 bg-red-500/5 p-6 text-sm text-red-100">{error}</div> : null}

            <div className="relative overflow-hidden rounded-[28px]" style={{ minHeight: 680, border: "1px solid var(--border-default)", boxShadow: "var(--shadow-card)" }}>
              <OSMMap pins={visiblePins} activePin={activePin} onPinSelect={setActivePin} />

              <div
                className="absolute left-5 top-5 z-[500] rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.38em]"
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" }}
              >
                OpenStreetMap
              </div>

              <div
                className="absolute right-5 top-5 z-[500] rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{ background: "rgba(210,166,109,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(210,166,109,0.28)", color: "var(--accent-gold)" }}
              >
                {loading ? "Loading" : activeFilter}
              </div>

              {activePinCard ? (
                <div
                  className="absolute bottom-5 left-5 z-[500] max-w-sm rounded-[20px] p-4"
                  style={{ background: "rgba(10,10,12,0.82)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 60px rgba(0,0,0,0.60)" }}
                >
                  <div className="mb-1.5 text-[0.60rem] uppercase tracking-[0.32em]" style={{ color: activeToneColor }}>
                    {activePinCard.kind}
                  </div>
                  <div className="mb-1 text-sm font-semibold text-white">{activePinCard.title}</div>
                  <div className="mb-2 text-[10px] text-white/50">{activePinCard.location}</div>
                  <p className="text-[10px] leading-4 text-white/60">{activePinCard.summary}</p>
                </div>
              ) : null}
            </div>
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Best windows">
              <div className="space-y-2">
                {temporal.slice(0, 6).map((slot) => (
                  <InsightRow key={slot.label} title={slot.label} detail={slot.recommendation} accent />
                ))}
              </div>
            </AIInsightPanel>

            {ambient ? (
              <AIInsightPanel title="Conditions on the ground" live>
                <div className="space-y-2">
                  <InsightRow title="Weather" detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} — good for low-friction exploring.`} />
                  <InsightRow title="Traffic" detail={`${ambient.environmentalSignals[0]?.traffic ?? "Low"} — route timing stays manageable.`} />
                  <InsightRow title="Crowd feel" detail={`${ambient.environmentalSignals[0]?.crowdDensity ?? "Moderate"} — intensity updates through the day.`} />
                </div>
              </AIInsightPanel>
            ) : null}

            <AIInsightPanel title="Map highlights">
              <div className="space-y-2">
                {visiblePins.slice(0, 3).map((pin) => (
                  <InsightRow key={pin.id} title={pin.title} detail={`${pin.location} · ${pin.summary}`} />
                ))}
              </div>
            </AIInsightPanel>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

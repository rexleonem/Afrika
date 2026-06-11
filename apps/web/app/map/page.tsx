"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { featuredCards } from "@afrika/shared/content";
import { buildAmbientIntelligence, buildTemporalIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { AmbientGlow } from "../../components/motion/ambient-glow";

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

const OSMMap = dynamic(() => import("../../components/maps/osm-map").then((mod) => mod.OSMMap), {
  ssr: false,
  loading: () => (
    <div className="afrika-map-surface flex min-h-[680px] items-center justify-center rounded-[28px] border border-white/10">
      <div className="text-sm text-white/60">Loading OpenStreetMap...</div>
    </div>
  )
});

const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const temporal = buildTemporalIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

const FILTERS = ["All", "Neighborhoods", "Culture", "Work", "Dining", "Weekend"];

export default function MapPage() {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const pins = useMemo<MapPin[]>(
    () =>
      featuredCards.map((card, index) => ({
        id: card.id,
        title: card.title,
        location: card.location,
        latitude: card.coordinates?.lat ?? 0,
        longitude: card.coordinates?.lng ?? 0,
        tone: (["gold", "forest", "clay"] as const)[index % 3],
        kind: card.kind,
        summary: card.intelligence.summary,
        category: card.category
      })),
    []
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
      <section className="relative px-4 pt-14 pb-8 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="forest" size="md" className="top-0 right-[30%]" opacity={0.3} />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              {["Spatial discovery layer", "Heat regions", "Live city pulse"].map((chip) => (
                <span key={chip} className="afrika-chip">
                  {chip}
                </span>
              ))}
            </div>
            <h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display), serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.08
              }}
            >
              Discovery intelligence,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-forest), var(--accent-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                rendered spatially.
              </span>
            </h1>
            <p className="text-sm leading-7 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              OpenStreetMap now carries the live map. Region focus, floating previews, category overlays, and temporal heat still frame the experience around it.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-lg mt-6">
              <MetricTile label="Active cities" value={`${ambient.cityPulse.length}`} detail="Tracked with timing." />
              <MetricTile label="Temporal layers" value={`${temporal.length}`} detail="Best windows." />
              <MetricTile label="Signal" value="Live" detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} / ${ambient.environmentalSignals[0]?.traffic ?? "low"} traffic`} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
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

            <div className="relative overflow-hidden rounded-[28px]" style={{ minHeight: 680, border: "1px solid var(--border-default)", boxShadow: "var(--shadow-card)" }}>
              <OSMMap pins={visiblePins} activePin={activePin} onPinSelect={setActivePin} />

              <div
                className="absolute top-5 left-5 z-[500] text-[10px] uppercase tracking-[0.38em] px-3 py-2 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)"
                }}
              >
                OpenStreetMap
              </div>

              <div
                className="absolute top-5 right-5 z-[500] text-[10px] font-semibold uppercase tracking-[0.28em] px-3 py-2 rounded-full"
                style={{
                  background: "rgba(210,166,109,0.18)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(210,166,109,0.28)",
                  color: "var(--accent-gold)"
                }}
              >
                {activeFilter}
              </div>

              {activePinCard ? (
                <div
                  className="absolute bottom-5 left-5 z-[500] max-w-sm rounded-[20px] p-4"
                  style={{
                    background: "rgba(10,10,12,0.82)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 16px 60px rgba(0,0,0,0.60)"
                  }}
                >
                  <div className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5" style={{ color: activeToneColor }}>
                    {activePinCard.kind}
                  </div>
                  <div className="text-sm font-semibold text-white leading-snug mb-1">{activePinCard.title}</div>
                  <div className="text-[10px] text-white/50 mb-2">{activePinCard.location}</div>
                  <p className="text-[10px] leading-4 text-white/60">{activePinCard.summary}</p>
                </div>
              ) : null}

              <div className="absolute bottom-5 right-5 z-[500] w-[min(100%,420px)]">
                <div className="grid gap-3 sm:grid-cols-3">
                  {ambient.cityPulse.map((pulse) => (
                    <div
                      key={`${pulse.city}-${pulse.hour}`}
                      className="rounded-[20px] p-4"
                      style={{
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.10)"
                      }}
                    >
                      <div className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {pulse.city}
                      </div>
                      <div className="text-base font-semibold text-white">{pulse.bestWindow}</div>
                      <p className="text-[10px] mt-1 text-white/50">
                        Pulse {pulse.pulse} / accel {pulse.acceleration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Temporal rhythm">
              <div className="space-y-2">
                {temporal.map((slot) => (
                  <InsightRow key={slot.label} title={slot.label} detail={slot.recommendation} accent />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Environmental rhythm" live>
              <div className="space-y-2">
                <InsightRow
                  title="Weather"
                  detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} — ideal for low-friction exploration.`}
                />
                <InsightRow
                  title="Traffic"
                  detail={`${ambient.environmentalSignals[0]?.traffic ?? "Low"} — route planning stays calm.`}
                />
                <InsightRow
                  title="Crowd density"
                  detail={`${ambient.environmentalSignals[0]?.crowdDensity ?? "Moderate"} — live intensity updates.`}
                />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Featured on map">
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

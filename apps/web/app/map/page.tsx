"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { featuredCards } from "@afrika/shared/content";
import { buildAmbientIntelligence, buildTemporalIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const temporal = buildTemporalIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

const pins = featuredCards.map((card, i) => ({
  id: card.id,
  title: card.title,
  location: card.location,
  top: ["22%", "45%", "62%"][i] ?? "40%",
  left: ["28%", "65%", "42%"][i] ?? "50%",
  tone: (["gold", "forest", "clay"] as const)[i] ?? "gold",
  card,
}));

const toneColors: Record<string, string> = {
  gold: "var(--accent-gold)",
  forest: "var(--accent-forest)",
  clay: "var(--accent-clay)",
};

const FILTERS = ["All", "Neighborhoods", "Culture", "Work", "Dining", "Weekend"];

export default function MapPage() {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <main className="min-h-screen pb-24 lg:pb-12">

      {/* ── Map header ──────────────────────────────────────────── */}
      <section
        className="relative px-4 pt-14 pb-8 sm:px-8 lg:px-12"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
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
                <span key={chip} className="afrika-chip">{chip}</span>
              ))}
            </div>
            <h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display), serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              Discovery intelligence,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-forest), var(--accent-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                rendered spatially.
              </span>
            </h1>
            <p className="text-sm leading-7 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Region focus, floating previews, category overlays, and temporal heat all work together to make the map feel alive.
            </p>

            {/* Metric strip */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mt-6">
              <MetricTile label="Active cities" value={`${ambient.cityPulse.length}`} detail="Tracked with timing." />
              <MetricTile label="Temporal layers" value={`${temporal.length}`} detail="Best windows." />
              <MetricTile label="Signal" value="Live" detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} · ${ambient.environmentalSignals[0]?.traffic ?? "low"} traffic`} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main map area ───────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">

          {/* Map canvas */}
          <div>
            {/* Filter bar */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
                  style={{
                    background:
                      activeFilter === f
                        ? "rgba(210,166,109,0.15)"
                        : "var(--bg-glass-light)",
                    border:
                      activeFilter === f
                        ? "1px solid rgba(210,166,109,0.30)"
                        : "1px solid var(--border-subtle)",
                    color: activeFilter === f ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* The map canvas */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 28,
                minHeight: 680,
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Map background */}
              <div
                className="absolute inset-0 afrika-map-surface"
              />

              {/* Grid lines */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />

              {/* Center glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 65%)",
                }}
              />

              {/* Map label */}
              <div
                className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.38em] px-3 py-2 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Live discovery map
              </div>

              {/* Filter badge */}
              <div
                className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-[0.28em] px-3 py-2 rounded-full"
                style={{
                  background: "rgba(210,166,109,0.18)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(210,166,109,0.28)",
                  color: "var(--accent-gold)",
                }}
              >
                {activeFilter}
              </div>

              {/* Discovery pins */}
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  className="absolute cursor-pointer"
                  style={{
                    top: pin.top,
                    left: pin.left,
                    transform: "translate(-50%, -50%)",
                    zIndex: activePin === pin.id ? 20 : 10,
                  }}
                  onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                >
                  {/* Pulse ring */}
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: toneColors[pin.tone],
                        transform: "scale(1)",
                        opacity: 0.3,
                        animation: "pulse-ring 2.5s ease infinite",
                        width: 40,
                        height: 40,
                        left: -10,
                        top: -10,
                      }}
                    />
                    <motion.div
                      className="w-5 h-5 rounded-full border-2"
                      style={{
                        background: toneColors[pin.tone],
                        borderColor: "rgba(255,255,255,0.85)",
                        boxShadow: `0 0 24px ${toneColors[pin.tone]}80`,
                      }}
                      whileHover={{ scale: 1.3 }}
                      animate={activePin === pin.id ? { scale: 1.4 } : { scale: 1 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                  </div>

                  {/* Floating card on click */}
                  {activePin === pin.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ type: "spring", damping: 22, stiffness: 280 }}
                      className="absolute left-6 top-0 w-56 rounded-[20px] p-4"
                      style={{
                        background: "rgba(10,10,12,0.85)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 16px 60px rgba(0,0,0,0.60)",
                        zIndex: 30,
                      }}
                    >
                      <div
                        className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5"
                        style={{ color: toneColors[pin.tone] }}
                      >
                        {pin.card.kind}
                      </div>
                      <div className="text-sm font-semibold text-white leading-snug mb-1">
                        {pin.title}
                      </div>
                      <div className="text-[10px] text-white/50 mb-2">{pin.location}</div>
                      <p className="text-[10px] leading-4 text-white/60">
                        {pin.card.intelligence.summary}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}

              {/* City pulse cards at bottom */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  {ambient.cityPulse.map((pulse) => (
                    <div
                      key={`${pulse.city}-${pulse.hour}`}
                      className="rounded-[20px] p-4"
                      style={{
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <div
                        className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {pulse.city}
                      </div>
                      <div className="text-base font-semibold text-white">{pulse.bestWindow}</div>
                      <p className="text-[10px] mt-1 text-white/50">
                        Pulse {pulse.pulse} · accel {pulse.acceleration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right intelligence panel */}
          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Temporal intelligence">
              <div className="space-y-2">
                {temporal.map((slot) => (
                  <InsightRow key={slot.label} title={slot.label} detail={slot.recommendation} accent />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Environmental signals" live>
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
                {featuredCards.slice(0, 3).map((card) => (
                  <InsightRow
                    key={card.id}
                    title={card.title}
                    detail={`${card.location} · ${card.intelligence.summary}`}
                  />
                ))}
              </div>
            </AIInsightPanel>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

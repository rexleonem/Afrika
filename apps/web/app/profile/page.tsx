"use client";

import { motion } from "framer-motion";
import { featuredCards } from "@afrika/shared/content";
import { buildActionLayer } from "@afrika/shared/stage5";
import { inferBehavioralProfile } from "@afrika/shared/stage3";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { ScrollReveal, StaggerContainer, staggerItem } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

const actionLayer = buildActionLayer(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "save", cardId: featuredCards[0]?.id, timestamp: "2026-06-09T05:31:00.000Z" },
  { type: "search", query: "weekend plan under budget", timestamp: "2026-06-09T05:32:00.000Z" },
]);
const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

const INTEREST_TAGS = [
  "Calm exploration", "Food routes", "Creative neighborhoods",
  "Weekend planning", "Trustworthy places", "Work-friendly cafes",
  "Hidden beaches", "Cultural movements",
];

const HEATMAP_CELLS = Array.from({ length: 56 }, (_, i) => ({
  id: i,
  intensity: Math.random(),
}));

function intensityColor(v: number) {
  if (v > 0.8) return "rgba(210,166,109,0.90)";
  if (v > 0.6) return "rgba(210,166,109,0.55)";
  if (v > 0.4) return "rgba(210,166,109,0.28)";
  if (v > 0.2) return "rgba(210,166,109,0.12)";
  return "var(--border-subtle)";
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen pb-24 lg:pb-12">

      {/* ── Profile hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 pt-14 pb-10 sm:px-8 lg:px-12"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <AmbientGlow variant="clay" size="lg" className="top-[10%] right-[5%]" opacity={0.28} />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left: identity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              {["Identity graph", "Taste profile", "Exploration memory"].map((c) => (
                <span key={c} className="afrika-chip">{c}</span>
              ))}
            </div>

            {/* Avatar + name */}
            <div className="flex items-center gap-5">
              <div
                className="relative flex-shrink-0 w-20 h-20 rounded-[22px] flex items-center justify-center text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, rgba(210,166,109,0.25) 0%, rgba(193,123,88,0.20) 100%)",
                  border: "1px solid rgba(210,166,109,0.25)",
                  color: "var(--accent-gold)",
                  fontFamily: "var(--font-display), serif",
                }}
              >
                A
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--accent-forest)",
                    border: "2px solid var(--bg-primary)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <div
                  className="text-xs uppercase tracking-[0.38em] mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Explorer mode
                </div>
                <div
                  className="text-2xl font-semibold capitalize"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-display), serif",
                  }}
                >
                  {behavioralProfile.archetype.replace(/-/g, " ")}
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {behavioralProfile.discoveryStyle}
                </p>
              </div>
            </div>

            <h1
              className="text-3xl font-semibold tracking-tight max-w-2xl sm:text-4xl"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display), serif",
                letterSpacing: "-0.018em",
                lineHeight: 1.12,
              }}
            >
              A personal exploration identity,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-clay), var(--accent-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                not a plain account.
              </span>
            </h1>
            <p className="text-base leading-7 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Taste clusters, saved regions, and AI-inferred behavior create a profile that feels like a living decision layer.
            </p>
          </motion.div>

          {/* Right: quick metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3 h-fit"
          >
            <MetricTile label="Action intent" value={actionLayer.intent.primaryIntent.replace(/-/g, " ")} detail={actionLayer.intent.nextStepPrompt} />
            <MetricTile label="Timing bias" value={actionLayer.intent.timingHint} detail="Planning sophistication tracked quietly." />
            <MetricTile label="Adaptive mode" value={ambient.adaptiveInterface.mode.replace(/-/g, " ")} detail={ambient.adaptiveInterface.tone} />
            <MetricTile label="Saved places" value={`${featuredCards.length}`} detail="Across Lagos, Nairobi, Accra." />
          </motion.div>
        </div>
      </section>

      {/* ── Main profile content ─────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">

          {/* Left column */}
          <div className="space-y-10">

            {/* Interest clusters */}
            <ScrollReveal>
              <SectionHeader eyebrow="Profile intelligence" title="Your taste profile becomes a map of what you naturally explore." />
              <div className="mt-5 flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="text-xs font-medium px-4 py-2 rounded-full cursor-pointer"
                    style={{
                      background: i < 3 ? "rgba(210,166,109,0.12)" : "var(--bg-glass-light)",
                      border: i < 3 ? "1px solid rgba(210,166,109,0.25)" : "1px solid var(--border-subtle)",
                      color: i < 3 ? "var(--accent-gold)" : "var(--text-secondary)",
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </ScrollReveal>

            {/* Exploration heatmap */}
            <ScrollReveal>
              <SectionHeader eyebrow="Activity heatmap" title="A visual rhythm of your exploration over time." />
              <div
                className="mt-5 rounded-[24px] p-5"
                style={{
                  background: "var(--bg-glass-light)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
                  }}
                >
                  {HEATMAP_CELLS.map((cell) => (
                    <motion.div
                      key={cell.id}
                      className="aspect-square rounded-[4px]"
                      style={{ background: intensityColor(cell.intensity) }}
                      whileHover={{ scale: 1.3 }}
                      title={`Activity: ${Math.round(cell.intensity * 100)}%`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Less activity
                  </span>
                  <div className="flex items-center gap-1">
                    {[0.12, 0.28, 0.55, 0.90].map((v) => (
                      <div
                        key={v}
                        className="w-3 h-3 rounded-[3px]"
                        style={{ background: intensityColor(v) }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    More activity
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Saved discoveries */}
            <ScrollReveal>
              <SectionHeader
                eyebrow="Saved discoveries"
                title="Places you've bookmarked for later."
              />
              <StaggerContainer className="mt-5 grid gap-4 sm:grid-cols-2">
                {featuredCards.map((card) => (
                  <motion.div
                    key={card.id}
                    variants={staggerItem}
                    className="flex gap-3 rounded-[20px] p-4 cursor-pointer"
                    style={{
                      background: "var(--bg-glass-light)",
                      border: "1px solid var(--border-subtle)",
                    }}
                    whileHover={{ borderColor: "var(--border-default)" }}
                  >
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-[14px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${card.media.imageUrl})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {card.title}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {card.location}
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {card.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] px-2 py-0.5 rounded-full"
                            style={{
                              background: "var(--border-subtle)",
                              color: "var(--text-muted)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </StaggerContainer>
            </ScrollReveal>
          </div>

          {/* Right: activity + memory */}
          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Activity history">
              <div className="space-y-2">
                <InsightRow title="Recent searches" detail="Quiet work spaces, weekend plans, and budget-aware discovery." accent />
                <InsightRow
                  title="Saved cards"
                  detail={featuredCards.map((c) => c.title).join(" · ")}
                />
                <InsightRow
                  title="Planning style"
                  detail="Structured but calm — routes and outcomes over endless browsing."
                />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Profile intelligence">
              <div className="grid grid-cols-2 gap-2">
                <MetricTile label="Cities" value={`${ambient.cityPulse.length}`} detail="Tracked spatial behavior." />
                <MetricTile label="Saved" value="5" detail="Clusters by habit." />
                <MetricTile label="Route style" value="Curated" detail="Plans become more spatial." />
                <MetricTile label="Memory" value="Adaptive" detail="Timing, frequency, intent." />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Memory layer">
              <div className="space-y-2">
                {ambient.memory.map((item) => (
                  <InsightRow
                    key={`${item.neighborhood}-${item.city}`}
                    title={item.neighborhood}
                    detail={`${item.city} · timing ${item.preferredTiming}`}
                    accent
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

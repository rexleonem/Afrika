"use client";

import { motion } from "framer-motion";
import { featuredCards } from "@afrika/shared/content";
import { buildActionAnalytics, buildActionLayer, buildMovementPlan } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { ScrollReveal, StaggerContainer, staggerItem } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";
import Link from "next/link";

const actionLayer = buildActionLayer(featuredCards);
const movementPlans = [
  buildMovementPlan(featuredCards.slice(0, 3), "Calm Lagos weekend"),
  buildMovementPlan(featuredCards.slice(1, 3), "Food and culture loop"),
];
const fulfillment = buildActionAnalytics([
  { type: "reservation", completed: true },
  { type: "visit", completed: true },
  { type: "plan", completed: true },
  { type: "application", completed: false },
]);
const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

const STOP_COLORS = ["var(--accent-gold)", "var(--accent-forest)", "var(--accent-clay)"];

export default function PlansPage() {
  return (
    <main className="min-h-screen pb-24 lg:pb-12">

      {/* ── Header ──────────────────────────────────────────────── */}
      <section
        className="relative px-4 pt-14 pb-12 sm:px-8 lg:px-12 overflow-hidden"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <AmbientGlow variant="warm" size="lg" className="top-0 left-[20%]" opacity={0.30} />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex flex-wrap gap-2">
              {["Visual planning workspace", "Routes", "Reservations"].map((chip) => (
                <span key={chip} className="afrika-chip">{chip}</span>
              ))}
            </div>
            <h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl max-w-2xl"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display), serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              Plans that feel like{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-warm), var(--accent-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                elegant boards,
              </span>{" "}
              not forms.
            </h1>
            <p className="text-base leading-7 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Build weekend routes, cultural loops, or practical visit plans with intelligence that adapts to timing and environment.
            </p>
          </motion.div>

          {/* Fulfillment stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <AIInsightPanel title="Fulfillment signal" live>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <MetricTile
                  label="Success rate"
                  value={fulfillment.reservationSuccessRate}
                  detail="Calm, invisible transactions."
                />
                <MetricTile
                  label="Next action"
                  value={actionLayer.actions[0]?.label ?? "Plan visit"}
                  detail={actionLayer.intent.nextStepPrompt}
                />
              </div>
            </AIInsightPanel>
          </motion.div>
        </div>
      </section>

      {/* ── Metric strip ────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Intent" value={actionLayer.intent.primaryIntent.replace(/-/g, " ")} detail={actionLayer.intent.nextStepPrompt} />
          <MetricTile label="Timing" value={actionLayer.intent.timingHint} detail={`Window: ${actionLayer.plan.timing}`} />
          <MetricTile label="Environment" value={ambient.adaptiveInterface.mode.replace(/-/g, " ")} detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} · ${ambient.environmentalSignals[0]?.traffic ?? "low"} traffic`} />
        </div>
      </section>

      {/* ── Plan boards ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">

          {/* Plans */}
          <div className="space-y-8">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Plan boards"
                title="Spatial boards for weekends, food routes, and discovery loops."
                description="Plans are laid out like visual workspaces so you can move from inspiration to action naturally."
                action={
                  <button className="btn-primary text-sm">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New plan
                  </button>
                }
              />
            </ScrollReveal>

            <StaggerContainer className="space-y-5">
              {movementPlans.map((plan, planIdx) => (
                <motion.article
                  key={plan.title}
                  variants={staggerItem}
                  className="rounded-[28px] overflow-hidden"
                  style={{
                    background: "var(--bg-glass-light)",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-panel)",
                  }}
                >
                  {/* Plan header */}
                  <div
                    className="relative p-6 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${STOP_COLORS[planIdx] ?? "var(--accent-gold)"}18 0%, transparent 60%)`,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="afrika-label mb-2">{plan.city}</div>
                        <h2
                          className="text-xl font-semibold"
                          style={{
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-display), serif",
                          }}
                        >
                          {plan.title}
                        </h2>
                        <p className="mt-1.5 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                          {plan.actionPrompt}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <span className="afrika-chip">{plan.route.length} stops</span>
                        <span
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{
                            background: `${STOP_COLORS[planIdx] ?? "var(--accent-gold)"}18`,
                            border: `1px solid ${STOP_COLORS[planIdx] ?? "var(--accent-gold)"}30`,
                            color: STOP_COLORS[planIdx] ?? "var(--accent-gold)",
                          }}
                        >
                          {plan.timing}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route stops */}
                  <div className="p-5">
                    <div className="relative">
                      {/* Vertical route line */}
                      <div
                        className="absolute left-5 top-5 bottom-5 w-px"
                        style={{ background: "var(--border-subtle)" }}
                      />
                      <div className="space-y-3 pl-12 relative">
                        {plan.route.map((stop, index) => (
                          <div key={stop} className="relative">
                            {/* Stop dot */}
                            <div
                              className="absolute -left-7 w-3 h-3 rounded-full border-2 top-3.5"
                              style={{
                                borderColor: "var(--border-default)",
                                background: index === 0
                                  ? STOP_COLORS[planIdx] ?? "var(--accent-gold)"
                                  : "var(--bg-surface)",
                              }}
                            />
                            <div
                              className="rounded-[18px] p-4"
                              style={{
                                background: "var(--bg-glass-light)",
                                border: "1px solid var(--border-subtle)",
                              }}
                            >
                              <div
                                className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5"
                                style={{ color: "var(--text-muted)" }}
                              >
                                Stop {index + 1}
                              </div>
                              <p className="text-sm leading-5" style={{ color: "var(--text-primary)" }}>
                                {stop}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plan actions */}
                    <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      <button className="btn-primary text-xs">
                        Open plan
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button className="btn-secondary text-xs">Share</button>
                      <button className="btn-ghost text-xs">Edit</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </StaggerContainer>
          </div>

          {/* Right context */}
          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Best window" live>
              <div className="space-y-2 mt-1">
                <MetricTile
                  label="City pulse"
                  value={ambient.cityPulse[0]?.bestWindow ?? "Evening"}
                  detail={ambient.temporalSignals[0]?.recommendation ?? "Timing-aware suggestions."}
                />
                <MetricTile
                  label="Location fit"
                  value={ambient.adaptiveInterface.mode.replace(/-/g, " ")}
                  detail="Interface adapts to mode and city rhythm."
                />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Fulfillment">
              <div className="space-y-2">
                <InsightRow title="Reservations" detail="Lightweight and stable with low-friction entry points." accent />
                <InsightRow title="Applications" detail="Opportunity flows remain external but organized." />
                <InsightRow
                  title="Completed"
                  detail={`Visits ${fulfillment.completedVisits} · Plans ${fulfillment.completedPlans}`}
                />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Quick add">
              <div className="space-y-2">
                {featuredCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between gap-3 rounded-[16px] px-3 py-2.5"
                    style={{
                      background: "var(--bg-glass-light)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {card.title}
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {card.location}
                      </div>
                    </div>
                    <button
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(210,166,109,0.12)",
                        border: "1px solid rgba(210,166,109,0.22)",
                        color: "var(--accent-gold)",
                      }}
                    >
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </AIInsightPanel>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

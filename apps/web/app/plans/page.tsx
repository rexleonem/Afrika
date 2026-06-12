"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { featuredCards } from "@afrika/shared/content";
import { buildActionAnalytics, buildActionLayer, buildMovementPlan } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { apiFetch } from "../../lib/api";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { ScrollReveal, StaggerContainer, staggerItem } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

type Plan = {
  id: string;
  title: string;
  type: string;
  items: Array<{ id: string; title: string; note?: string; cardId?: string }>;
};

const fallbackPlans = [
  buildMovementPlan(featuredCards.slice(0, 3), "Calm Lagos weekend"),
  buildMovementPlan(featuredCards.slice(1, 3), "Food and culture loop")
];
const fallbackActionLayer = buildActionLayer(featuredCards);
const fallbackFulfillment = buildActionAnalytics([
  { type: "reservation", completed: true },
  { type: "visit", completed: true },
  { type: "plan", completed: true },
  { type: "application", completed: false }
]);
const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

const STOP_COLORS = ["var(--accent-gold)", "var(--accent-forest)", "var(--accent-clay)"];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(fallbackPlans.map((plan) => ({
    id: plan.title,
    title: plan.title,
    type: plan.city,
    items: plan.route.map((stop, index) => ({ id: `${plan.title}-${index}`, title: stop }))
  })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await apiFetch<{ items: Plan[] }>("/plans");
        if (!active) return;
        setPlans(response.items.length > 0 ? response.items : plans);
      } catch {
        if (!active) return;
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <section className="relative overflow-hidden px-4 pt-14 pb-12 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="warm" size="lg" className="top-0 left-[20%]" opacity={0.3} />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {["Visual planning workspace", "Routes", "Reservations"].map((chip) => (
                <span key={chip} className="afrika-chip">
                  {chip}
                </span>
              ))}
            </div>
            <h1 className="afrika-hero-title max-w-2xl text-4xl sm:text-5xl">
              Plans that feel like{" "}
              <span style={{ background: "linear-gradient(135deg, var(--accent-warm), var(--accent-gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                elegant boards,
              </span>{" "}
              not forms.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/65">
              Build weekend routes, cultural loops, or practical visit plans with timing and environment that make sense.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            <AIInsightPanel title="Fulfillment signal" live>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <MetricTile label="Success rate" value={fallbackFulfillment.reservationSuccessRate.toFixed(2)} detail="Calm, low-friction actions." />
                <MetricTile label="Next action" value={fallbackActionLayer.actions[0]?.label ?? "Plan visit"} detail={fallbackActionLayer.intent.nextStepPrompt} />
              </div>
            </AIInsightPanel>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Intent" value={fallbackActionLayer.intent.primaryIntent.replace(/-/g, " ")} detail={fallbackActionLayer.intent.nextStepPrompt} />
          <MetricTile label="Timing" value={fallbackActionLayer.intent.timingHint} detail={`Window: ${fallbackPlans[0].timing}`} />
          <MetricTile label="Environment" value={ambient.adaptiveInterface.mode.replace(/-/g, " ")} detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} · ${ambient.environmentalSignals[0]?.traffic ?? "low"} traffic`} />
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
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

            {loading ? (
              <div className="afrika-panel p-5 text-sm text-white/60">Loading your plans...</div>
            ) : (
              <StaggerContainer className="space-y-5">
                {plans.map((plan, planIdx) => (
                  <motion.article
                    key={plan.id}
                    variants={staggerItem}
                    className="overflow-hidden rounded-[28px]"
                    style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-panel)" }}
                  >
                    <div
                      className="relative overflow-hidden border-b p-6"
                      style={{
                        background: `linear-gradient(135deg, ${STOP_COLORS[planIdx] ?? "var(--accent-gold)"}18 0%, transparent 60%)`,
                        borderBottomColor: "var(--border-subtle)"
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="afrika-label mb-2">{plan.type}</div>
                          <h2 className="text-xl font-semibold text-white">{plan.title}</h2>
                          <p className="mt-1.5 text-sm leading-6 text-white/65">{plan.items.length} items in this live plan.</p>
                        </div>
                        <span className="afrika-chip">{plan.items.length} stops</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="space-y-3">
                        {plan.items.slice(0, 4).map((item, index) => (
                          <div key={item.id} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                            <div className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5 text-white/45">Stop {index + 1}</div>
                            <p className="text-sm leading-5 text-white/80">{item.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </StaggerContainer>
            )}
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Planning intelligence">
              <div className="space-y-2">
                <InsightRow title="Timing" detail="Plans prefer calmer windows and lower friction." accent />
                <InsightRow title="Movement" detail="Routes should sequence near clusters naturally." accent />
                <InsightRow title="Fulfillment" detail="Actions remain subtle and trust-aware." accent />
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Routing hints">
              <div className="space-y-2">
                {fallbackPlans.map((plan) => (
                  <InsightRow key={plan.title} title={plan.title} detail={plan.actionPrompt} />
                ))}
              </div>
            </AIInsightPanel>

            <div className="flex flex-col gap-2">
              <Link href="/search" className="btn-primary text-sm justify-center">
                Build from search
              </Link>
              <Link href="/map" className="btn-secondary text-sm justify-center">
                View map flow
              </Link>
            </div>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

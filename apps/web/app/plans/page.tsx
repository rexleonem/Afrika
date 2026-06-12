"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../components/panels/ai-insight-panel";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

type Plan = {
  id: string;
  title: string;
  type: string;
  items: Array<{ id: string; title: string; note?: string; cardId?: string }>;
};

type IntentResponse = {
  intent: {
    primaryIntent: string;
    timingHint: string;
    nextStepPrompt: string;
  };
};

type AmbientResponse = {
  ambient: {
    adaptiveInterface: {
      mode: string;
    };
    environmentalSignals: Array<{
      weather: string;
      traffic: string;
    }>;
  };
};

type FulfillmentResponse = {
  analytics: {
    reservationSuccessRate: number;
    completedActions: number;
  };
};

export default function PlansPage() {
  const router = useRouter();
  const { status } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [intent, setIntent] = useState<IntentResponse["intent"] | null>(null);
  const [ambient, setAmbient] = useState<AmbientResponse["ambient"] | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentResponse["analytics"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;

    void Promise.all([
      apiFetch<{ items: Plan[] }>("/plans"),
      apiFetch<IntentResponse>("/intent"),
      apiFetch<AmbientResponse>("/ambient"),
      apiFetch<FulfillmentResponse>("/fulfillment")
    ])
      .then(([plansResponse, intentResponse, ambientResponse, fulfillmentResponse]) => {
        if (!active) return;
        setPlans(plansResponse.items);
        setIntent(intentResponse.intent);
        setAmbient(ambientResponse.ambient);
        setFulfillment(fulfillmentResponse.analytics);
      })
      .catch(() => {
        if (!active) return;
        setPlans([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-8 lg:px-12" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <AmbientGlow variant="warm" size="lg" className="left-[20%] top-0" opacity={0.25} />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {["Visual planning workspace", "Routes", "Reservations"].map((chip) => (
                <span key={chip} className="afrika-chip">
                  {chip}
                </span>
              ))}
            </div>
            <h1 className="afrika-hero-title max-w-2xl text-4xl sm:text-5xl">
              Plans that feel like elegant boards, not forms.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/65">
              The plan layer now reads and writes against the live API instead of showing sample routes in a vacuum.
            </p>
          </div>
          <AIInsightPanel title="Fulfillment signal" live>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <MetricTile label="Success rate" value={fulfillment ? fulfillment.reservationSuccessRate.toFixed(2) : "—"} detail="Actions completed successfully." />
              <MetricTile label="Completed" value={fulfillment ? `${fulfillment.completedActions}` : "—"} detail={intent?.nextStepPrompt ?? "Build a plan from a discovery you want to act on."} />
            </div>
          </AIInsightPanel>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Intent" value={intent?.primaryIntent?.replace(/-/g, " ") ?? "—"} detail={intent?.nextStepPrompt} />
          <MetricTile label="Timing" value={intent?.timingHint ?? "—"} detail="Time hints come from the live intent engine." />
          <MetricTile
            label="Environment"
            value={ambient?.adaptiveInterface.mode.replace(/-/g, " ") ?? "—"}
            detail={ambient?.environmentalSignals[0] ? `${ambient.environmentalSignals[0].weather} · ${ambient.environmentalSignals[0].traffic} traffic` : "—"}
          />
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Plan boards"
                title="Real plans tied to your session."
                description="Create routes, save stops, and keep them attached to your account."
                action={
                  <button
                    className="btn-primary text-sm"
                    disabled={creating}
                    onClick={async () => {
                      if (status !== "authenticated") {
                        router.push("/sign-in");
                        return;
                      }

                      setCreating(true);
                      try {
                        const response = await apiFetch<{ plan: Plan }>("/plans", {
                          method: "POST",
                          body: JSON.stringify({ title: "New discovery plan", type: "weekend plan" })
                        });
                        setPlans((current) => [response.plan, ...current]);
                      } finally {
                        setCreating(false);
                      }
                    }}
                  >
                    {creating ? "Creating..." : "New plan"}
                  </button>
                }
              />
            </ScrollReveal>

            {loading ? (
              <div className="afrika-panel p-5 text-sm text-white/60">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="afrika-panel p-8 text-center">
                <h2 className="text-xl font-semibold text-white">No plans yet.</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Create a live plan after you sign in, or head back into search and save a place you want to return to.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/search" className="btn-secondary">
                    Search places
                  </Link>
                  <Link href="/sign-in" className="btn-primary">
                    Sign in
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {plans.map((plan) => (
                  <article key={plan.id} className="afrika-panel overflow-hidden p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="afrika-label">{plan.type}</div>
                        <h2 className="mt-2 text-xl font-semibold text-white">{plan.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-white/65">{plan.items.length} saved stop(s) in this plan.</p>
                      </div>
                      <span className="afrika-chip">{plan.items.length} items</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {plan.items.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                          This plan is empty for now. Add a place from a discovery detail page next.
                        </div>
                      ) : (
                        plan.items.map((item, index) => (
                          <div key={item.id} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                            <div className="text-[0.60rem] uppercase tracking-[0.32em] mb-1.5 text-white/45">Stop {index + 1}</div>
                            <p className="text-sm leading-5 text-white/80">{item.title}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Planning intelligence">
              <div className="space-y-2">
                <InsightRow title="Timing" detail={intent?.timingHint ?? "The timing engine is still loading."} accent />
                <InsightRow title="Movement" detail="Plans stay linked to nearby cards so routes can grow naturally." accent />
                <InsightRow title="Fulfillment" detail="Actions stay subtle, but now persist through the live API." accent />
              </div>
            </AIInsightPanel>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

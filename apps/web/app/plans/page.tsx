import { featuredCards } from "@afrika/shared/content";
import { buildActionAnalytics, buildActionLayer, buildMovementPlan } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";

const actionLayer = buildActionLayer(featuredCards);
const movementPlans = [
  buildMovementPlan(featuredCards.slice(0, 3), "Calm Lagos weekend"),
  buildMovementPlan(featuredCards.slice(1, 3), "Food and culture loop")
];
const fulfillment = buildActionAnalytics([
  { type: "reservation", completed: true },
  { type: "visit", completed: true },
  { type: "plan", completed: true },
  { type: "application", completed: false }
]);
const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

export default function PlansPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Plans</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Intelligent plans for visits, routes, reservations, and opportunities.</h1>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Intent</div>
            <p className="mt-3 text-xl font-medium capitalize">{actionLayer.intent.primaryIntent.replace("-", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{actionLayer.intent.nextStepPrompt}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Fulfillment</div>
            <p className="mt-3 text-xl font-medium">{fulfillment.reservationSuccessRate}</p>
            <p className="mt-2 text-sm text-white/60">Calm actions, invisible transactions, trustworthy outcomes.</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Recommended action</div>
            <p className="mt-3 text-xl font-medium">{actionLayer.actions[0]?.label}</p>
            <p className="mt-2 text-sm text-white/60">{actionLayer.actions[0]?.description}</p>
          </article>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Best window</div>
            <p className="mt-3 text-xl font-medium">{ambient.cityPulse[0]?.bestWindow}</p>
            <p className="mt-2 text-sm text-white/60">{ambient.temporalSignals[0]?.recommendation}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Environment fit</div>
            <p className="mt-3 text-xl font-medium capitalize">{ambient.adaptiveInterface.mode.replace("-", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{ambient.environmentalSignals[0]?.weather} weather and {ambient.environmentalSignals[0]?.traffic} traffic.</p>
          </article>
        </section>

        <div className="mt-6 grid gap-4">
          {movementPlans.map((plan) => (
            <article key={plan.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">{plan.city}</div>
              <h2 className="mt-3 text-2xl font-medium">{plan.title}</h2>
              <p className="mt-2 text-sm text-white/60">{plan.actionPrompt}</p>
              <div className="mt-4 space-y-2 text-white/70">
                {plan.route.map((stop) => (
                  <div key={stop}>- {stop}</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

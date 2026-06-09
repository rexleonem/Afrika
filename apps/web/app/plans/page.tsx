import { featuredCards } from "@afrika/shared/content";
import { buildActionAnalytics, buildActionLayer, buildMovementPlan } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";

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

export default function PlansPage() {
  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel-strong overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">Visual planning workspace</span>
              <span className="afrika-chip">Routes</span>
              <span className="afrika-chip">Reservations</span>
            </div>
            <div className="afrika-label">Plans</div>
            <h1 className="afrika-title max-w-3xl">Plans that feel like elegant boards, not forms.</h1>
            <p className="afrika-copy max-w-2xl">
              Build weekend routes, cultural loops, or practical visit plans with intelligence that adapts to timing and environment.
            </p>
          </div>
          <aside className="afrika-panel p-5">
            <div className="afrika-label">Fulfillment signal</div>
            <div className="mt-4 grid gap-3">
              <MetricTile label="Success rate" value={fulfillment.reservationSuccessRate} detail="Calm actions, invisible transactions." />
              <MetricTile label="Recommended action" value={actionLayer.actions[0]?.label ?? "Plan visit"} detail={actionLayer.intent.nextStepPrompt} />
            </div>
          </aside>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricTile label="Intent" value={actionLayer.intent.primaryIntent.replace("-", " ")} detail={actionLayer.intent.nextStepPrompt} />
        <MetricTile label="Timing" value={actionLayer.intent.timingHint} detail={`Recommended window: ${actionLayer.plan.timing}`} />
        <MetricTile label="Environment fit" value={ambient.adaptiveInterface.mode.replace("-", " ")} detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} weather and ${ambient.environmentalSignals[0]?.traffic ?? "low"} traffic.`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Plan boards"
            title="Spatial boards for weekends, food routes, and discovery loops."
            description="Plans are laid out like visual workspaces so the user can move from inspiration to action naturally."
          />
          <div className="grid gap-5">
            {movementPlans.map((plan) => (
              <article key={plan.title} className="afrika-panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="afrika-label">{plan.city}</div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{plan.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/60">{plan.actionPrompt}</p>
                  </div>
                  <div className="afrika-chip">{plan.route.length} stops</div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {plan.route.map((stop, index) => (
                    <div key={stop} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.35em] text-white/45">Stop {index + 1}</div>
                      <p className="mt-2 text-sm leading-6 text-white/75">{stop}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Best window" title="The platform understands when the plan should happen." />
            <div className="mt-4 space-y-3">
              <MetricTile label="City pulse" value={ambient.cityPulse[0]?.bestWindow ?? "Evening"} detail={ambient.temporalSignals[0]?.recommendation ?? "Timing-aware suggestions."} />
              <MetricTile label="Location fit" value={ambient.adaptiveInterface.mode.replace("-", " ")} detail="The interface adapts to the user mode and city rhythm." />
            </div>
          </div>
          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Fulfillment" title="Reservations and applications stay discreet." />
            <div className="mt-4 space-y-3">
              <InsightRow title="Reservations" detail="Lightweight and stable with low friction entry points." />
              <InsightRow title="Applications" detail="Opportunity flows remain external but organized." />
              <InsightRow title="Completed actions" detail={`Visits ${fulfillment.completedVisits}, plans ${fulfillment.completedPlans}, applications ${fulfillment.applicationsSubmitted}.`} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

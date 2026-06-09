import { featuredCards } from "@afrika/shared/content";
import { interpretSearch } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";
import { buildHumanIntelligenceLayer, generateCulturalStories } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";

export default function SearchPage() {
  const query = interpretSearch("quiet places to work in Lagos");
  const cityIntelligence = buildCityIntelligence(featuredCards);
  const humanLayer = buildHumanIntelligenceLayer(featuredCards);
  const behavioralProfile = inferBehavioralProfile(featuredCards, [
    { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" }
  ]);
  const predictiveResults = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
  const leadingCity = cityIntelligence.find((city) => city.city === "Lagos");
  const culturalStories = generateCulturalStories(featuredCards, []);
  const actionLayer = buildActionLayer(featuredCards);
  const ambientIntelligence = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Search</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Semantic search for places, trends, and context.</h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Intent parse</div>
            <p className="mt-3 text-xl font-medium">{query.intent}</p>
            <p className="mt-2 text-sm text-white/60">Location: {query.locationHint ?? "anywhere"} - Budget: {query.budgetHint ?? "open"}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Ranking hint</div>
            <p className="mt-3 text-xl font-medium">{query.rankingHint}</p>
            <p className="mt-2 text-sm text-white/60">Hybrid search combines semantics, geo relevance, and keywords.</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Ambient cue</div>
            <p className="mt-3 text-xl font-medium">{ambientIntelligence.suggestions[0]?.title}</p>
            <p className="mt-2 text-sm text-white/60">{ambientIntelligence.suggestions[0]?.reason}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Temporal layer</div>
            <p className="mt-3 text-xl font-medium">{ambientIntelligence.temporalSignals[0]?.label}</p>
            <p className="mt-2 text-sm text-white/60">{ambientIntelligence.temporalSignals[0]?.recommendation}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Adaptive mode</div>
            <p className="mt-3 text-xl font-medium capitalize">{ambientIntelligence.adaptiveInterface.mode.replace("-", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{ambientIntelligence.adaptiveInterface.tone}</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Intent</div>
            <p className="mt-3 text-xl font-medium capitalize">{actionLayer.intent.primaryIntent.replace("-", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{actionLayer.intent.nextStepPrompt}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Timing</div>
            <p className="mt-3 text-xl font-medium">{actionLayer.intent.timingHint}</p>
            <p className="mt-2 text-sm text-white/60">Recommended window: {actionLayer.plan.timing}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Suggested action</div>
            <p className="mt-3 text-xl font-medium">{actionLayer.actions[0]?.label}</p>
            <p className="mt-2 text-sm text-white/60">{actionLayer.actions[0]?.description}</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Search archetype</div>
            <p className="mt-3 text-xl font-medium capitalize">{behavioralProfile.archetype.replace("-", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{behavioralProfile.discoveryStyle} discovery behavior</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">City overlay</div>
            <p className="mt-3 text-xl font-medium">{leadingCity?.city ?? "Lagos"}</p>
            <p className="mt-2 text-sm text-white/60">
              Trend momentum {leadingCity?.trendMomentum ?? 0} - density {leadingCity?.discoveryDensity ?? 0}
            </p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Predictive layer</div>
            <p className="mt-3 text-xl font-medium">{predictiveResults.length} next-best matches</p>
            <p className="mt-2 text-sm text-white/60">The graph surfaces likely follow-up discoveries before the search expands.</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Human layer</div>
            <p className="mt-3 text-xl font-medium">{humanLayer.behavioralProfile.archetype.replace("-", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{humanLayer.graph.nodes.length} connected intelligence nodes</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Cultural stories</div>
            <p className="mt-3 text-xl font-medium">{culturalStories[0]?.title ?? "Local cultural movement"}</p>
            <p className="mt-2 text-sm text-white/60">{culturalStories[0]?.summary ?? "Editorial cultural context appears here."}</p>
          </article>
        </section>

        <section className="grid gap-4">
          {[
            "quiet places to work in Lagos",
            "weekend escapes under 2 hours",
            "areas in Lagos growing fast"
          ].map((item) => (
            <article key={item} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-lg">{item}</p>
              <p className="mt-2 text-sm text-white/60">
                AI-ranked results, nearby intelligence, comparisons, and trend panels appear here.
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

import { featuredCards } from "@afrika/shared/content";
import { interpretSearch } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";

export default function SearchPage() {
  const query = interpretSearch("quiet places to work in Lagos");
  const cityIntelligence = buildCityIntelligence(featuredCards);
  const behavioralProfile = inferBehavioralProfile(featuredCards, [
    { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" }
  ]);
  const predictiveResults = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
  const leadingCity = cityIntelligence.find((city) => city.city === "Lagos");

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

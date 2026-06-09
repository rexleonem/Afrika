import Link from "next/link";
import { featuredCards } from "@afrika/shared/content";
import { interpretSearch } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";
import { buildHumanIntelligenceLayer, generateCulturalStories } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../../components/primitives";

const suggestions = [
  "quiet places to work in Lagos",
  "weekend escapes under 2 hours",
  "areas in Lagos growing fast",
  "best calm places right now",
];

export default function SearchPage() {
  const query = interpretSearch("quiet places to work in Lagos");
  const cityIntelligence = buildCityIntelligence(featuredCards);
  const humanLayer = buildHumanIntelligenceLayer(featuredCards);
  const behavioralProfile = inferBehavioralProfile(featuredCards, [
    { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" },
  ]);
  const predictiveResults = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
  const leadingCity = cityIntelligence.find((city) => city.city === "Lagos");
  const culturalStories = generateCulturalStories(featuredCards, []);
  const actionLayer = buildActionLayer(featuredCards);
  const ambientIntelligence = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel-strong overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">AI-powered exploration console</span>
              <span className="afrika-chip">Semantic search</span>
              <span className="afrika-chip">Map-aware results</span>
            </div>
            <div className="space-y-4">
              <div className="afrika-label">Search</div>
              <h1 className="afrika-title max-w-3xl">Search like a question. Receive a spatial decision surface.</h1>
              <p className="afrika-copy max-w-2xl">
                AFRIKA understands intent, geography, timing, and context, then surfaces immersive results with useful comparisons and soft next steps.
              </p>
            </div>
            <div className="afrika-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-[22px] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/45">
                Ask AFRIKA about places, vibes, timing, budgets, or movement...
              </div>
              <div className="flex flex-wrap gap-2">
                {["Lagos", "Quiet", "Budget", "Weekend"].map((item) => (
                  <span key={item} className="afrika-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <MetricTile label="Intent parse" value={query.intent} detail={`Location: ${query.locationHint ?? "anywhere"} - Budget: ${query.budgetHint ?? "open"}`} />
              <MetricTile label="Ranking hint" value="Semantic first" detail={query.rankingHint} />
              <MetricTile label="Adaptive mode" value={ambientIntelligence.adaptiveInterface.mode.replace("-", " ")} detail={ambientIntelligence.adaptiveInterface.tone} />
            </div>
          </div>
          <aside className="afrika-panel p-5">
            <div className="afrika-label">Search intelligence</div>
            <div className="mt-4 space-y-3">
              <InsightRow title="Temporal cue" detail={ambientIntelligence.temporalSignals[0]?.recommendation ?? "Timing-aware results appear here."} />
              <InsightRow title="City overlay" detail={`${leadingCity?.city ?? "Lagos"} trend momentum ${leadingCity?.trendMomentum ?? 0}, density ${leadingCity?.discoveryDensity ?? 0}.`} />
              <InsightRow title="Human layer" detail={`${humanLayer.graph.nodes.length} connected intelligence nodes now help interpret search results.`} />
            </div>
          </aside>
        </div>
      </header>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Search suggestions"
          title="Conversational query chips that feel like a prompt board."
          description="Queries adapt to city, budget, timing, and the kind of calm or energetic exploration the user wants."
        />
        <div className="flex flex-wrap gap-3">
          {suggestions.map((item) => (
            <span key={item} className="afrika-chip border-white/[0.12] bg-white/5 px-4 py-2 text-sm">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Results"
            title="Grouped intelligence, not a flat list."
            description="Each result blends visual context, why-it-matters reasoning, and action paths."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredCards.map((card) => (
              <DiscoveryCard
                key={card.id}
                card={card}
                score={`Match ${card.relevanceScore.toFixed(2)}`}
                highlight={card.intelligence.comparison ?? card.intelligence.whyItMatters}
                cta="View result"
              />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="afrika-panel p-5">
            <div className="afrika-label">AI explanation</div>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {query.rankingHint} The system combines semantic intent, geo relevance, freshness, and the ambient city pulse.
            </p>
          </div>
          <div className="afrika-panel p-5">
            <div className="afrika-label">Map-aware context</div>
            <div className="mt-4 space-y-3">
              <InsightRow title="Nearby intelligence" detail="Search results can be expanded into route and spatial views." />
              <InsightRow title="Best fit" detail="Cards are grouped by mood, utility, and local relevance." />
              <InsightRow title="Temporal layer" detail={ambientIntelligence.temporalSignals[0]?.label ?? "Best times and windows appear here."} />
            </div>
          </div>
          <div className="afrika-panel p-5">
            <div className="afrika-label">Predictive matches</div>
            <div className="mt-4 space-y-3">
              {predictiveResults.slice(0, 3).map((item) => (
                <InsightRow key={item.card.id} title={item.card.title} detail={item.reason} />
              ))}
            </div>
          </div>
          <div className="afrika-panel p-5">
            <div className="afrika-label">Cultural context</div>
            <p className="mt-3 text-sm leading-6 text-white/65">{culturalStories[0]?.summary ?? "Cultural intelligence appears here."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/map" className="afrika-chip">
                Open map
              </Link>
              <Link href="/plans" className="afrika-chip">
                Add to plan
              </Link>
            </div>
          </div>
          <div className="afrika-panel p-5">
            <div className="afrika-label">Action layer</div>
            <div className="mt-4 space-y-3">
              <MetricTile label="Primary intent" value={actionLayer.intent.primaryIntent.replace("-", " ")} detail={actionLayer.intent.nextStepPrompt} />
              <MetricTile label="Timing" value={actionLayer.intent.timingHint} detail={actionLayer.plan.timing} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

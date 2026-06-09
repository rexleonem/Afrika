import { featuredCards } from "@afrika/shared/content";
import { buildCityIntelligence, buildContentGraph, inferBehavioralProfile, optimizeQuality, selfHealGraph } from "@afrika/shared/stage3";

const ingestionHealth = [
  { label: "Active crawlers", value: "12" },
  { label: "Failed extractions", value: "3" },
  { label: "Queued sources", value: "8" },
  { label: "Source reliability", value: "0.82" }
];

const cityIntelligence = buildCityIntelligence(featuredCards);
const contentGraph = buildContentGraph(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "save", cardId: featuredCards[0]?.id, timestamp: "2026-06-09T05:31:00.000Z" },
  { type: "search", query: "weekend spots in Lagos", timestamp: "2026-06-09T05:32:00.000Z" }
]);
const qualitySignals = optimizeQuality(featuredCards);
const healingSignals = selfHealGraph(featuredCards);

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-[#F5F1EA]">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Operations center</div>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Ingestion, AI, graph intelligence, and freshness.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
            AFRIKA&apos;s admin layer now monitors the autonomous intelligence network, the content graph, and self-healing data quality in one place.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ingestionHealth.map((item) => (
            <article key={item.label} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/55">{item.label}</div>
              <div className="mt-3 text-4xl font-semibold">{item.value}</div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">City intelligence</div>
            <div className="mt-4 space-y-3">
              {cityIntelligence.map((city) => (
                <div key={city.cityKey} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-sm text-white/55">{city.city}</div>
                  <div className="mt-1 text-lg font-medium">
                    momentum {city.trendMomentum} - density {city.discoveryDensity}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Behavioral AI</div>
            <div className="mt-4 rounded-[18px] border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/55">Inferred archetype</div>
              <div className="mt-2 text-2xl font-semibold capitalize">{behavioralProfile.archetype.replace("-", " ")}</div>
              <p className="mt-2 text-sm text-white/60">{behavioralProfile.discoveryStyle} discovery layer</p>
            </div>
            <div className="mt-3 text-sm text-white/60">
              Preferred cities: {behavioralProfile.preferredCities.join(", ") || "none yet"}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Graph scale</div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                Nodes: {contentGraph.nodes.length}
              </div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                Edges: {contentGraph.edges.length}
              </div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                Quality-surfaced cards: {qualitySignals.filter((item) => item.shouldSurface).length}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Ingestion monitoring</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["Crawler queue", "Healthy"],
                ["Extraction errors", "Low"],
                ["Deduplication backlog", "Moderate"],
                ["Source reliability drift", "Stable"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{label}</div>
                  <div className="mt-2 text-lg font-medium">{value}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">AI monitoring</div>
            <div className="mt-4 space-y-3">
              {[
                ["Generated summaries", "128 pending review"],
                ["Flagged outputs", "7 need correction"],
                ["Confidence floor", "0.78"],
                ["Comparisons generated", "54"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{label}</div>
                  <div className="mt-2 text-lg font-medium">{value}</div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Source management</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Prioritize tourism and local blog sources</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Throttle social-signal crawls when duplicate noise rises</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Block low-reliability feeds</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Re-run active sources on freshness decay</div>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">AI generation queue</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Pending enrichments: 42</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Flagged summaries: 7</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Comparison jobs: 16</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Trend recompute due now</div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Quality optimization</div>
            <div className="mt-4 space-y-3">
              {qualitySignals.map((item) => (
                <div key={item.cardId} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  {item.cardId} - {item.freshnessState} - {item.total}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Self-healing</div>
            <div className="mt-4 space-y-3">
              {healingSignals.map((item) => (
                <div key={item.cardId} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  {item.action} - {item.cardId}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Trend monitoring</div>
            <div className="mt-4 space-y-3">
              {[
                "Trending in Lagos",
                "Fast-rising neighborhoods",
                "Weekend hotspots",
                "Growing opportunity zones"
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Freshness monitoring</div>
            <div className="mt-4 space-y-3">
              {healingSignals.map((item) => (
                <div key={`${item.cardId}-${item.action}`} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  {item.action} - {item.reason}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Manual overrides</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Pin a card to the feed</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Block a noisy source</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Override quality score</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Moderate a trend cluster</div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

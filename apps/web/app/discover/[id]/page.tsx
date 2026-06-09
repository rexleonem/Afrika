import { featuredCards } from "@afrika/shared/content";
import { enrichCard, recommendNearby, scoreCardTotal } from "@afrika/shared/stage2";
import { buildCityIntelligence, buildContentGraph, predictDiscovery } from "@afrika/shared/stage3";
import { buildContributorNetwork, generateCulturalStories, structureHumanContribution } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { notFound } from "next/navigation";
import { InsightRow, MetricTile, SectionHeader } from "../../../components/primitives";

type DiscoverDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DiscoverDetailPage({ params }: DiscoverDetailPageProps) {
  const { id } = await params;
  const card = featuredCards.find((item) => item.id === id);

  if (!card) {
    notFound();
  }

  const cityIntelligence = buildCityIntelligence(featuredCards);
  const contentGraph = buildContentGraph(featuredCards);
  const cityContext = cityIntelligence.find((city) => city.city === card.location.split(",")[1]?.trim());
  const contributorNetwork = buildContributorNetwork([
    {
      id: `explorer-${card.id}`,
      name: "Local Explorer",
      role: "explorer",
      city: cityContext?.city ?? "Africa",
      expertiseAreas: ["neighborhood rhythm", "hidden places", "cultural nuance"],
      verificationHistory: 0.84,
      contributionQuality: 0.88,
      consistency: 0.82,
      localExpertise: 0.9,
    },
  ]);
  const humanContribution = structureHumanContribution({
    card,
    contributor: {
      id: `explorer-${card.id}`,
      name: "Local Explorer",
      role: "explorer",
      city: cityContext?.city ?? "Africa",
      expertiseAreas: ["neighborhood rhythm", "hidden places", "cultural nuance"],
      verificationHistory: 0.84,
      contributionQuality: 0.88,
      consistency: 0.82,
      localExpertise: 0.9,
    },
    note: "Locals treat this as a high-signal area for calm, useful discovery.",
    emotionalContext: "calm, attentive, and grounded",
    culturalContext: "locally trusted neighborhood rhythm",
    localTiming: "weekday evenings",
    mediaUrl: card.media.imageUrl,
  });
  const culturalStories = generateCulturalStories(featuredCards, [humanContribution.insight]);
  const actionLayer = buildActionLayer(featuredCards);
  const predictiveMatches = predictDiscovery(
    featuredCards,
    {
      archetype: "explorer",
      confidence: 0.74,
      preferredKinds: [card.kind],
      preferredCities: [card.location.split(",")[1]?.trim() ?? card.location],
      discoveryStyle: "curiosity-led",
      socialEnergy: "exploratory",
      travelRadiusKm: 35,
      signals: ["detail-view"],
    },
    cityIntelligence,
  );

  const score = scoreCardTotal({
    usefulness: 0.86,
    uniqueness: 0.72,
    freshness: card.freshnessScore,
    visualQuality: 0.91,
    sourceTrust: card.trustScore,
    engagementProbability: 0.66,
    localRelevance: card.relevanceScore,
  });

  return (
    <main className="afrika-shell space-y-8 pb-12">
      <section className="afrika-panel-strong overflow-hidden">
        <div className="afrika-media min-h-[320px] rounded-none border-0 bg-center" style={{ backgroundImage: `url(${card.media.imageUrl})` }}>
          <div className="afrika-overlay" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip border-white/15 bg-black/30">Detail intelligence</span>
              <span className="afrika-chip border-white/15 bg-black/30">{card.category}</span>
              <span className="afrika-chip border-white/15 bg-black/30">{card.location}</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">{card.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">{card.intelligence.summary}</p>
          </div>
        </div>
        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <section className="space-y-6">
            <SectionHeader
              eyebrow="Cinematic intelligence"
              title="A visual storytelling page that explains the place instantly."
              description="The place, its context, its timing, and its usefulness appear together so the user can decide with clarity."
            />

            <div className="grid gap-3 md:grid-cols-3">
              <MetricTile label="Quality score" value={`Q ${score.total}`} detail={`Freshness ${card.freshnessScore.toFixed(2)} - trust ${card.trustScore.toFixed(2)}`} />
              <MetricTile label="Verification" value={humanContribution.verification.verificationState} detail={`Confidence ${humanContribution.verification.confidenceScore} with human validation signals.`} />
              <MetricTile label="Graph links" value={`${contentGraph.edges.filter((edge) => edge.from === card.id || edge.to === card.id).length}`} detail="Related discovery pathways already exist." />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="afrika-panel p-5">
                <div className="afrika-label">Why it matters</div>
                <p className="mt-3 text-sm leading-7 text-white/65">{card.intelligence.whyItMatters}</p>
              </article>
              <article className="afrika-panel p-5">
                <div className="afrika-label">Comparison</div>
                <p className="mt-3 text-sm leading-7 text-white/65">{card.intelligence.comparison ?? "Comparison intelligence appears here."}</p>
              </article>
            </div>

            <div className="afrika-panel p-5">
              <div className="afrika-label">Contextual sections</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InsightRow title="Nearby intelligence" detail={card.intelligence.nearbyInsights.join(". ")} />
                <InsightRow title="Action layer" detail={actionLayer.intent.nextStepPrompt} />
                <InsightRow title="City context" detail={`${cityContext?.city ?? "Lagos"} momentum ${cityContext?.trendMomentum ?? 0}, density ${cityContext?.discoveryDensity ?? 0}.`} />
                <InsightRow title="Contributor trust" detail={`Average network trust ${contributorNetwork.averageTrust}.`} />
              </div>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
            <div className="afrika-panel p-5">
              <div className="afrika-label">Action module</div>
              <div className="mt-4 grid gap-2">
                {actionLayer.actions.slice(0, 4).map((action) => (
                  <div key={action.type} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-sm font-medium text-white">{action.label}</div>
                    <p className="mt-1 text-sm leading-6 text-white/60">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="afrika-panel p-5">
              <div className="afrika-label">Map embedding</div>
              <div className="mt-4 aspect-[4/3] rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_20%_25%,rgba(200,155,92,0.2),transparent_20%),radial-gradient(circle_at_70%_40%,rgba(60,141,115,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.35))] p-4">
                <div className="flex h-full items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/45">{card.location}</div>
                    <div className="mt-2 text-lg font-semibold text-white">Spatial preview</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs text-white/70">
                    {card.coordinates.lat.toFixed(2)}, {card.coordinates.lng.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="afrika-panel p-5">
              <div className="afrika-label">Predictive matches</div>
              <div className="mt-4 space-y-3">
                {predictiveMatches.slice(0, 3).map((item) => (
                  <InsightRow key={item.card.id} title={item.card.title} detail={item.reason} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="afrika-panel p-5">
          <SectionHeader eyebrow="Nearby recommendations" title="Related discoveries and useful next steps." />
          <div className="mt-5 space-y-3">
            {recommendNearby(card.title, card.location).map((item) => (
              <InsightRow key={item} title={item} detail="Contextual comparison and discovery layer." />
            ))}
          </div>
        </div>
        <div className="afrika-panel p-5">
          <SectionHeader eyebrow="Cultural story" title="Editorial movement with local context." />
          <div className="mt-5 space-y-3">
            {culturalStories.map((story) => (
              <InsightRow key={story.id} title={story.title} detail={story.summary} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

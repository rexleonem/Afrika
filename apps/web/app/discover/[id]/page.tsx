import { featuredCards } from "@afrika/shared/content";
import { enrichCard, recommendNearby, scoreCardTotal } from "@afrika/shared/stage2";
import { buildCityIntelligence, buildContentGraph, predictDiscovery } from "@afrika/shared/stage3";
import { buildContributorNetwork, generateCulturalStories, structureHumanContribution } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { notFound } from "next/navigation";

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
      localExpertise: 0.9
    }
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
      localExpertise: 0.9
    },
    note: "Locals treat this as a high-signal area for calm, useful discovery.",
    emotionalContext: "calm, attentive, and grounded",
    culturalContext: "locally trusted neighborhood rhythm",
    localTiming: "weekday evenings",
    mediaUrl: card.media.imageUrl
  });
  const culturalStories = generateCulturalStories(featuredCards, [humanContribution.insight]);
  const actionLayer = buildActionLayer(featuredCards);
  const predictiveMatches = predictDiscovery(featuredCards, {
    archetype: "explorer",
    confidence: 0.74,
    preferredKinds: [card.kind],
    preferredCities: [card.location.split(",")[1]?.trim() ?? card.location],
    discoveryStyle: "curiosity-led",
    socialEnergy: "exploratory",
    travelRadiusKm: 35,
    signals: ["detail-view"]
  }, cityIntelligence);

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5">
        <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${card.media.imageUrl})` }} />
        <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="text-xs uppercase tracking-[0.4em] text-white/45">{card.location}</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">{card.title}</h1>
            <p className="mt-4 text-base leading-7 text-white/70">{card.intelligence.summary}</p>
            <p className="mt-4 text-base leading-7 text-white/70">{card.intelligence.whyItMatters}</p>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/45">
              score {scoreCardTotal({
                usefulness: 0.86,
                uniqueness: 0.72,
                freshness: card.freshnessScore,
                visualQuality: 0.91,
                sourceTrust: card.trustScore,
                engagementProbability: 0.66,
                localRelevance: card.relevanceScore
              }).total}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">Human validation</div>
                <p className="mt-3 text-lg font-medium">{humanContribution.verification.verificationState}</p>
                <p className="mt-2 text-sm text-white/65">
                  Confidence {humanContribution.verification.confidenceScore} - local trust {humanContribution.contributor.status}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">Contributor network</div>
                <p className="mt-3 text-lg font-medium">Average trust {contributorNetwork.averageTrust}</p>
                <p className="mt-2 text-sm text-white/65">
                  {contributorNetwork.trustedContributors} trusted contributors in the network.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">City intelligence</div>
                <p className="mt-3 text-lg font-medium">{cityContext?.city ?? card.location}</p>
                <p className="mt-2 text-sm text-white/65">
                  Momentum {cityContext?.trendMomentum ?? 0} - density {cityContext?.discoveryDensity ?? 0}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">Graph signal</div>
                <p className="mt-3 text-lg font-medium">{contentGraph.edges.filter((edge) => edge.from === card.id || edge.to === card.id).length} links</p>
                <p className="mt-2 text-sm text-white/65">Related discovery pathways already exist in the living graph.</p>
              </div>
            </div>
          </section>
          <aside className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Nearby intelligence</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                {card.intelligence.nearbyInsights.map((item) => (
                  <div key={item}>- {item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">AI context</div>
              <p className="mt-3 text-sm text-white/70">
                {enrichCard({
                  title: card.title,
                  location: card.location,
                  category: card.category,
                  rawText: card.intelligence.summary,
                  sourceReliability: card.trustScore
                }).whyItMatters}
              </p>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                {recommendNearby(card.title, card.location).map((item) => (
                  <div key={item}>- {item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Predictive matches</div>
              <div className="mt-3 space-y-3 text-sm text-white/70">
                {predictiveMatches.slice(0, 3).map((item) => (
                  <div key={item.card.id}>
                    <div className="font-medium text-white">{item.card.title}</div>
                    <div className="text-white/55">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Cultural story</div>
              <p className="mt-3 text-sm text-white/70">{culturalStories[0]?.summary}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Next action</div>
              <p className="mt-3 text-sm text-white/70">{actionLayer.intent.nextStepPrompt}</p>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                {actionLayer.actions.slice(0, 3).map((action) => (
                  <div key={action.type}>- {action.label}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

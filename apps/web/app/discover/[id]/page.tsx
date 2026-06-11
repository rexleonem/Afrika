import { featuredCards } from "@afrika/shared/content";
import { enrichCard, recommendNearby, scoreCardTotal } from "@afrika/shared/stage2";
import { buildCityIntelligence, buildContentGraph, predictDiscovery } from "@afrika/shared/stage3";
import { buildContributorNetwork, generateCulturalStories, structureHumanContribution } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { notFound } from "next/navigation";
import Link from "next/link";
import { InsightRow, MetricTile, SectionHeader } from "../../../components/primitives";
import { AIInsightPanel, ContextPanel } from "../../../components/panels/ai-insight-panel";

type DiscoverDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiscoverDetailPage({ params }: DiscoverDetailPageProps) {
  const { id } = await params;
  const card = featuredCards.find((item) => item.id === id);

  if (!card) notFound();

  const cardImage =
    card.media?.imageUrl ??
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80";
  const cardCoordinates = card.coordinates ?? { lat: 0, lng: 0 };

  let cityIntelligence: ReturnType<typeof buildCityIntelligence> = [];
  let contentGraph: ReturnType<typeof buildContentGraph> = { nodes: [], edges: [] };
  let cityContext: ReturnType<typeof buildCityIntelligence>[number] | undefined;
  let contributorNetwork = { averageTrust: 0.84 };
  let humanContribution = {
    verification: {
      verificationState: "review" as const,
      confidenceScore: 0.72
    },
    insight: {
      id: `insight_${card.id}`,
      cardId: card.id,
      contributorId: "local-explorer",
      note: "Locals treat this as a high-signal area for calm, useful discovery.",
      emotionalContext: "calm, attentive, and grounded",
      culturalContext: "locally trusted neighborhood rhythm",
      localTiming: "weekday evenings",
      trustScore: 0.84
    }
  } as ReturnType<typeof structureHumanContribution>;
  let culturalStories: Array<{ id: string; title: string; summary: string }> = [];
  let actionLayer = buildActionLayer([card]);
  let predictiveMatches: Array<{ card: typeof card; reason: string }> = [];
  let score = { total: 0.0 };
  let nearby: string[] = [];
  let graphLinks = 0;

  try {
    cityIntelligence = buildCityIntelligence(featuredCards);
    contentGraph = buildContentGraph(featuredCards);
    cityContext = cityIntelligence.find((city) => city.city === card.location.split(",")[1]?.trim());

    contributorNetwork = buildContributorNetwork([
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

    humanContribution = structureHumanContribution({
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
      mediaUrl: cardImage
    });

    culturalStories = generateCulturalStories(featuredCards, [humanContribution.insight]);
    actionLayer = buildActionLayer(featuredCards);
    predictiveMatches = predictDiscovery(
      featuredCards,
      {
        archetype: "explorer",
        confidence: 0.74,
        preferredKinds: [card.kind],
        preferredCities: [card.location.split(",")[1]?.trim() ?? card.location],
        discoveryStyle: "curiosity-led",
        socialEnergy: "exploratory",
        travelRadiusKm: 35,
        signals: ["detail-view"]
      },
      cityIntelligence
    );
    score = scoreCardTotal({
      usefulness: 0.86,
      uniqueness: 0.72,
      freshness: card.freshnessScore,
      visualQuality: 0.91,
      sourceTrust: card.trustScore,
      engagementProbability: 0.66,
      localRelevance: card.relevanceScore
    });
    nearby = recommendNearby(card.title, card.location);
    graphLinks = contentGraph.edges.filter((edge) => edge.from === card.id || edge.to === card.id).length;
  } catch {
    // If any enrichment layer fails, keep the page functional with the base card data.
  }

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <div className="relative overflow-hidden" style={{ minHeight: "72vh" }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cardImage})` }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, transparent 40%, rgba(0,0,0,0.82) 100%), linear-gradient(90deg, rgba(0,0,0,0.28) 0%, transparent 50%)"
          }}
        />

        <div className="absolute top-6 left-6 z-20">
          <Link
            href={"/" as const}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.80)"
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-10 sm:pb-12">
          <div className="mb-5 flex flex-wrap gap-2">
            {[card.category, card.location, card.kind].map((chip) => (
              <span
                key={chip}
                className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.85)"
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          <h1
            className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: "var(--font-display), serif",
              letterSpacing: "-0.02em"
            }}
          >
            {card.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">{card.intelligence.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1.5 text-xs"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-10 px-4 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Quality score"
                value={`Q ${score.total}`}
                detail={`Fresh ${card.freshnessScore.toFixed(2)} · Trust ${card.trustScore.toFixed(2)}`}
              />
              <MetricTile
                label="Verification"
                value={humanContribution.verification.verificationState}
                detail={`Confidence ${humanContribution.verification.confidenceScore}`}
              />
              <MetricTile label="Graph links" value={`${graphLinks}`} detail="Related discovery pathways." />
            </div>

            <div className="rounded-[28px] p-6" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-default)" }}>
              <SectionHeader eyebrow="Cinematic intelligence" title="Why this place matters right now." />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="afrika-label mb-3">Why it matters</div>
                  <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                    {card.intelligence.whyItMatters}
                  </p>
                </div>
                {card.intelligence.comparison ? (
                  <div>
                    <div className="afrika-label mb-3">Comparison</div>
                    <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                      {card.intelligence.comparison}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Nearby intelligence" title="What locals know about this area." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {card.intelligence.nearbyInsights.map((insight) => (
                  <InsightRow key={insight} title={insight} detail="Local intelligence signal." accent />
                ))}
                <InsightRow title="Action layer" detail={actionLayer.intent.nextStepPrompt} />
                <InsightRow
                  title={`${cityContext?.city ?? "City"} context`}
                  detail={`Momentum ${cityContext?.trendMomentum ?? 0} · Density ${cityContext?.discoveryDensity ?? 0}`}
                />
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Cultural story" title="Editorial movement with local context." />
              <div className="mt-5 grid gap-3">
                {culturalStories.map((story) => (
                  <InsightRow key={story.id} title={story.title} detail={story.summary} accent />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Nearby discoveries" title="Related places and useful next steps." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {nearby.map((item) => (
                  <InsightRow key={item} title={item} detail="Contextual comparison and discovery layer." />
                ))}
              </div>
            </div>
          </div>

          <ContextPanel className="lg:sticky lg:top-6 lg:h-fit">
            <div className="overflow-hidden rounded-[24px]" style={{ border: "1px solid var(--border-default)", boxShadow: "var(--shadow-panel)" }}>
              <div className="relative aspect-[4/3] afrika-map-surface">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 60%)"
                  }}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white/80"
                    style={{
                      background: "var(--accent-gold)",
                      boxShadow: "0 0 20px rgba(210,166,109,0.60)"
                    }}
                  />
                  <div
                    className="absolute left-[-8px] top-[-8px] h-8 w-8 rounded-full"
                    style={{
                      background: "rgba(210,166,109,0.25)",
                      animation: "pulse-ring 2.5s ease infinite"
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <div className="mb-1 text-[0.60rem] uppercase tracking-[0.32em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {card.location}
                    </div>
                    <div className="text-sm font-semibold text-white">Spatial preview</div>
                  </div>
                  <div
                    className="rounded-full px-2.5 py-1.5 text-[10px]"
                    style={{
                      background: "rgba(0,0,0,0.50)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.65)"
                    }}
                  >
                    {cardCoordinates.lat.toFixed(2)}, {cardCoordinates.lng.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <AIInsightPanel title="Actions">
              <div className="space-y-2">
                {actionLayer.actions.slice(0, 4).map((action) => (
                  <div
                    key={action.type}
                    className="cursor-pointer rounded-[18px] px-4 py-3 transition-all"
                    style={{
                      background: "var(--bg-glass-light)",
                      border: "1px solid var(--border-subtle)"
                    }}
                  >
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {action.label}
                    </div>
                    <p className="mt-0.5 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Predictive matches">
              <div className="space-y-2">
                {predictiveMatches.slice(0, 3).map((item) => (
                  <InsightRow key={item.card.id} title={item.card.title} detail={item.reason} accent />
                ))}
              </div>
            </AIInsightPanel>

            <div className="flex flex-col gap-2">
              <Link href={"/plans" as const} className="btn-primary justify-center text-sm">
                Add to a plan
              </Link>
              <Link href={"/map" as const} className="btn-secondary justify-center text-sm">
                View on map
              </Link>
            </div>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

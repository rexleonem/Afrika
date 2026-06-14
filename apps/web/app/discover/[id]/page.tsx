import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { buildCityIntelligence, buildContentGraph, predictDiscovery } from "@afrika/shared/stage3";
import { buildContributorNetwork, generateCulturalStories, structureHumanContribution } from "@afrika/shared/stage4";
import type { ContributorProfile } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { recommendNearby, scoreCardTotal } from "@afrika/shared/stage2";
import type { AFRIKACard } from "@afrika/shared/types";
import { AIInsightPanel, ContextPanel } from "../../../components/panels/ai-insight-panel";
import { InsightRow, MetricTile, SectionHeader } from "../../../components/primitives";
import { HistoryTracker } from "../../../components/user/history-tracker";
import { SaveButton } from "../../../components/user/save-button";
import { serverApiFetch } from "../../../lib/server-api";

type DiscoverDetailPageProps = {
  params: Promise<{ id: string }>;
};

type FeedResponse = {
  items: AFRIKACard[];
};

const legacyCardAliases: Record<string, string> = {
  "lagos-lekki-art-district": "nike-art-gallery-lagos"
};

function dedupeCards(cards: AFRIKACard[]) {
  return [...new Map(cards.map((card) => [card.id, card])).values()];
}

export default async function DiscoverDetailPage({ params }: DiscoverDetailPageProps) {
  const { id } = await params;
  const resolvedId = legacyCardAliases[id] ?? id;

  if (resolvedId !== id) {
    redirect(`/discover/${resolvedId}` as `/discover/${string}`);
  }

  let card: AFRIKACard | null = null;
  let contextCards: AFRIKACard[] = [];

  try {
    const [cardResponse, feedResponse] = await Promise.all([
      serverApiFetch<AFRIKACard>(`/cards/${resolvedId}`),
      serverApiFetch<FeedResponse>("/feed", { query: { limit: 40 } })
    ]);

    card = cardResponse;
    contextCards = dedupeCards([cardResponse, ...feedResponse.items]);
  } catch {
    notFound();
  }

  if (!card) notFound();

  const cardImage = card.media?.imageUrl;
  const cardCoordinates = card.coordinates;
  const cityIntelligence = buildCityIntelligence(contextCards);
  const contentGraph = buildContentGraph(contextCards);
  const cityContext = cityIntelligence.find((city) => city.city === card.location.split(",")[1]?.trim());

  const contributor: Omit<ContributorProfile, "trustScore" | "status"> = {
    id: `explorer-${card.id}`,
    name: "Local Explorer",
    role: "explorer",
    city: cityContext?.city ?? "Africa",
    expertiseAreas: ["neighborhood rhythm", "hidden places", "cultural nuance"],
    verificationHistory: 0.84,
    contributionQuality: 0.88,
    consistency: 0.82,
    localExpertise: 0.9
  };

  const contributorNetwork = buildContributorNetwork([contributor]);
  const humanContribution = structureHumanContribution({
    card,
    contributor,
    note: `People use ${card.title} when they want something that still feels grounded in the city around it.`,
    emotionalContext: "calm, attentive, and locally informed",
    culturalContext: "trusted by people who know the area well",
    localTiming: "weekday afternoons and slower weekend mornings",
    mediaUrl: cardImage
  });
  const culturalStories = generateCulturalStories(contextCards, [humanContribution.insight]);
  const actionLayer = buildActionLayer(contextCards);
  const predictiveMatches = predictDiscovery(
    contextCards,
    {
      archetype: "explorer",
      confidence: 0.76,
      preferredKinds: [card.kind],
      preferredCities: [card.location.split(",")[1]?.trim() ?? card.location],
      discoveryStyle: "curiosity-led",
      socialEnergy: "intentional",
      travelRadiusKm: 35,
      signals: ["detail-view"]
    },
    cityIntelligence
  );
  const score = scoreCardTotal({
    usefulness: 0.86,
    uniqueness: 0.72,
    freshness: card.freshnessScore,
    visualQuality: 0.91,
    sourceTrust: card.trustScore,
    engagementProbability: 0.66,
    localRelevance: card.relevanceScore
  });
  const nearby = recommendNearby(card.title, card.location);
  const graphLinks = contentGraph.edges.filter((edge) => edge.from === card.id || edge.to === card.id).length;

  return (
    <main className="min-h-screen pb-24 lg:pb-12">
      <HistoryTracker cardId={card.id} />

      <div className="relative overflow-hidden" style={{ minHeight: "72vh" }}>
        {card.media.videoUrl ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={card.media.videoUrl} poster={cardImage} muted loop playsInline autoPlay />
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cardImage})` }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, transparent 40%, rgba(0,0,0,0.82) 100%), linear-gradient(90deg, rgba(0,0,0,0.28) 0%, transparent 50%)"
          }}
        />

        <div className="absolute left-6 top-6 z-20">
          <Link
            href={"/" as const}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.80)" }}
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
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)" }}
              >
                {chip}
              </span>
            ))}
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display), serif", letterSpacing: "-0.02em" }}>
            {card.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">{card.intelligence.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1.5 text-xs"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" }}
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
              <MetricTile label="Quality score" value={`Q ${score.total}`} detail={`Fresh ${card.freshnessScore.toFixed(2)} · trust ${card.trustScore.toFixed(2)}`} />
              <MetricTile
                label="Verification"
                value={humanContribution.verification.verificationState}
                detail={`Confidence ${humanContribution.verification.confidenceScore.toFixed(2)}`}
              />
              <MetricTile label="Graph links" value={`${graphLinks}`} detail="Related paths around this place." />
            </div>

            <div className="rounded-[28px] p-6" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-default)" }}>
              <SectionHeader eyebrow="Why it matters" title="What makes this place worth your time." />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="afrika-label mb-3">Context</div>
                  <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                    {card.intelligence.whyItMatters}
                  </p>
                </div>
                {card.intelligence.comparison ? (
                  <div>
                    <div className="afrika-label mb-3">Compared with nearby options</div>
                    <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                      {card.intelligence.comparison}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Local read" title="The small details that change the experience." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {card.intelligence.nearbyInsights.map((insight) => (
                  <InsightRow key={insight} title={insight} detail="Pulled from the surrounding discovery graph." accent />
                ))}
                <InsightRow title="Suggested next step" detail={actionLayer.intent.nextStepPrompt} />
                <InsightRow
                  title={`${cityContext?.city ?? "City"} signal`}
                  detail={`Momentum ${cityContext?.trendMomentum.toFixed(2) ?? "0.00"} · density ${cityContext?.discoveryDensity.toFixed(2) ?? "0.00"}`}
                />
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Story around it" title="How this place fits into the wider movement nearby." />
              <div className="mt-5 grid gap-3">
                {culturalStories.slice(0, 3).map((story) => (
                  <InsightRow key={story.id} title={story.title} detail={story.summary} accent />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Useful next comparisons" title="Nearby discoveries worth holding next to this one." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {nearby.map((item) => (
                  <InsightRow key={item} title={item} detail="A related option in the same orbit." />
                ))}
              </div>
            </div>
          </div>

          <ContextPanel className="lg:sticky lg:top-6 lg:h-fit">
            <div className="overflow-hidden rounded-[24px]" style={{ border: "1px solid var(--border-default)", boxShadow: "var(--shadow-panel)" }}>
              <div className="afrika-map-surface relative aspect-[4/3]">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/80" style={{ background: "var(--accent-gold)", boxShadow: "0 0 20px rgba(210,166,109,0.60)" }} />
                  <div className="absolute left-[-8px] top-[-8px] h-8 w-8 rounded-full" style={{ background: "rgba(210,166,109,0.25)", animation: "pulse-ring 2.5s ease infinite" }} />
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
                    style={{ background: "rgba(0,0,0,0.50)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" }}
                  >
                    {cardCoordinates.lat.toFixed(2)}, {cardCoordinates.lng.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <AIInsightPanel title="Actions">
              <div className="space-y-2">
                <SaveButton
                  cardId={card.id}
                  label="Save this discovery"
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                />
                {actionLayer.actions.slice(0, 4).map((action) => (
                  <div
                    key={action.type}
                    className="rounded-[18px] px-4 py-3"
                    style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)" }}
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

            <AIInsightPanel title="You may want next">
              <div className="space-y-2">
                {predictiveMatches
                  .filter((item) => item.card.id !== card.id)
                  .slice(0, 3)
                  .map((item) => (
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

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
  const nearby = recommendNearby(card.title, card.location);
  const graphLinks = contentGraph.edges.filter((e) => e.from === card.id || e.to === card.id).length;

  return (
    <main className="min-h-screen pb-24 lg:pb-12">

      {/* ── Cinematic hero ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: "72vh" }}
      >
        {/* Full-bleed image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${card.media.imageUrl})` }}
        />
        {/* Cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(0,0,0,0.38) 0%, transparent 40%, rgba(0,0,0,0.82) 100%),
              linear-gradient(90deg, rgba(0,0,0,0.28) 0%, transparent 50%)
            `,
          }}
        />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-full"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.80)",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 sm:pb-12 z-10">
          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[card.category, card.location, card.kind].map((chip) => (
              <span
                key={chip}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            className="text-4xl font-semibold text-white max-w-3xl sm:text-5xl lg:text-6xl leading-tight"
            style={{
              fontFamily: "var(--font-display), serif",
              letterSpacing: "-0.02em",
            }}
          >
            {card.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            {card.intelligence.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main detail content ─────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

          {/* Left: intelligence content */}
          <div className="space-y-8">

            {/* Score tiles */}
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
              <MetricTile
                label="Graph links"
                value={`${graphLinks}`}
                detail="Related discovery pathways."
              />
            </div>

            {/* Why it matters */}
            <div
              className="rounded-[28px] p-6"
              style={{
                background: "var(--bg-glass-light)",
                border: "1px solid var(--border-default)",
              }}
            >
              <SectionHeader
                eyebrow="Cinematic intelligence"
                title="Why this place matters right now."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="afrika-label mb-3">Why it matters</div>
                  <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                    {card.intelligence.whyItMatters}
                  </p>
                </div>
                {card.intelligence.comparison && (
                  <div>
                    <div className="afrika-label mb-3">Comparison</div>
                    <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                      {card.intelligence.comparison}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby insights */}
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

            {/* Cultural stories */}
            <div>
              <SectionHeader eyebrow="Cultural story" title="Editorial movement with local context." />
              <div className="mt-5 grid gap-3">
                {culturalStories.map((story) => (
                  <InsightRow key={story.id} title={story.title} detail={story.summary} accent />
                ))}
              </div>
            </div>

            {/* Related discoveries */}
            <div>
              <SectionHeader eyebrow="Nearby discoveries" title="Related places and useful next steps." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {nearby.map((item) => (
                  <InsightRow key={item} title={item} detail="Contextual comparison and discovery layer." />
                ))}
              </div>
            </div>
          </div>

          {/* Right: action + map panel */}
          <ContextPanel className="lg:sticky lg:top-6 lg:h-fit">
            {/* Map preview */}
            <div
              className="rounded-[24px] overflow-hidden"
              style={{
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-panel)",
              }}
            >
              <div
                className="relative aspect-[4/3] afrika-map-surface"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 60%)",
                  }}
                />
                {/* Center pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white/80"
                    style={{
                      background: "var(--accent-gold)",
                      boxShadow: "0 0 20px rgba(210,166,109,0.60)",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(210,166,109,0.25)",
                      animation: "pulse-ring 2.5s ease infinite",
                      width: 32,
                      height: 32,
                      left: -8,
                      top: -8,
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <div
                      className="text-[0.60rem] uppercase tracking-[0.32em] mb-1"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {card.location}
                    </div>
                    <div className="text-sm font-semibold text-white">Spatial preview</div>
                  </div>
                  <div
                    className="text-[10px] px-2.5 py-1.5 rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.50)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {card.coordinates.lat.toFixed(2)}, {card.coordinates.lng.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action module */}
            <AIInsightPanel title="Actions">
              <div className="space-y-2">
                {actionLayer.actions.slice(0, 4).map((action) => (
                  <div
                    key={action.type}
                    className="rounded-[18px] px-4 py-3 cursor-pointer transition-all"
                    style={{
                      background: "var(--bg-glass-light)",
                      border: "1px solid var(--border-subtle)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(210,166,109,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                    }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {action.label}
                    </div>
                    <p className="mt-0.5 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </AIInsightPanel>

            {/* Predictive matches */}
            <AIInsightPanel title="Predictive matches">
              <div className="space-y-2">
                {predictiveMatches.slice(0, 3).map((item) => (
                  <InsightRow key={item.card.id} title={item.card.title} detail={item.reason} accent />
                ))}
              </div>
            </AIInsightPanel>

            {/* Add to plan */}
            <div className="flex flex-col gap-2">
              <Link href="/plans" className="btn-primary text-sm justify-center">
                Add to a plan
              </Link>
              <Link href="/map" className="btn-secondary text-sm justify-center">
                View on map
              </Link>
            </div>
          </ContextPanel>
        </div>
      </section>
    </main>
  );
}

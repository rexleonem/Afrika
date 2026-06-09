"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { featuredCards } from "@afrika/shared/content";
import { freshnessStatus, interpretSearch, scoreCardTotal } from "@afrika/shared/stage2";
import {
  buildCityIntelligence,
  buildContentGraph,
  inferBehavioralProfile,
  predictDiscovery,
} from "@afrika/shared/stage3";
import {
  buildContributorNetwork,
  buildHumanIntelligenceLayer,
  generateCulturalStories,
} from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence, buildPersonalOperatingSystem } from "@afrika/shared/stage6";
import { buildStage7IntelligenceSystem } from "@afrika/shared/stage7";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../components/primitives";

const navItems = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/map", label: "Map" },
  { href: "/plans", label: "Plans" },
  { href: "/profile", label: "Profile" },
] as const;

export default function HomePage() {
  const cityIntelligence = buildCityIntelligence(featuredCards);
  const contentGraph = buildContentGraph(featuredCards);
  const humanLayer = buildHumanIntelligenceLayer(featuredCards);
  const contributorNetwork = buildContributorNetwork([
    {
      id: "contributor-lagos-explorer",
      name: "Lagos Explorer",
      role: "explorer",
      city: "Lagos",
      expertiseAreas: ["hidden places", "neighborhood context", "calm discovery"],
      verificationHistory: 0.88,
      contributionQuality: 0.86,
      consistency: 0.81,
      localExpertise: 0.89,
    },
    {
      id: "contributor-food-scout",
      name: "Food Scout",
      role: "food-scout",
      city: "Accra",
      expertiseAreas: ["food culture", "affordability", "local dining"],
      verificationHistory: 0.84,
      contributionQuality: 0.9,
      consistency: 0.77,
      localExpertise: 0.86,
    },
  ]);
  const behavioralProfile = inferBehavioralProfile(featuredCards, [
    { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" },
    { type: "save", cardId: featuredCards[0]?.id, timestamp: "2026-06-09T05:31:00.000Z" },
  ]);
  const culturalStories = generateCulturalStories(featuredCards, []);
  const actionLayer = buildActionLayer(featuredCards);
  const ambientIntelligence = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
  const personalOS = buildPersonalOperatingSystem(featuredCards, "2026-06-09T19:00:00.000Z");
  const stage7 = buildStage7IntelligenceSystem(featuredCards);
  const predictiveHighlights = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
  const trendQuery = interpretSearch("trending places in Lagos this week");
  const feedHighlights = featuredCards.map((card) => ({
    ...card,
    quality: scoreCardTotal({
      usefulness: 0.86,
      uniqueness: 0.72,
      freshness: card.freshnessScore,
      visualQuality: 0.91,
      sourceTrust: card.trustScore,
      engagementProbability: 0.66,
      localRelevance: card.relevanceScore,
    }),
  }));

  return (
    <main className="afrika-shell space-y-8 pb-12">
      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        <aside className="afrika-panel sticky top-6 hidden h-fit p-5 xl:block">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.45em] text-white/45">AFRIKA</div>
            <div className="text-lg font-semibold text-white">Living intelligence</div>
            <p className="text-sm leading-6 text-white/55">Discover &rarr; Understand &rarr; Act</p>
          </div>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-[20px] border border-transparent px-4 py-3 text-sm text-white/65 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                <span>{item.label}</span>
                <span aria-hidden="true">/</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="afrika-label">System status</div>
            <p className="mt-3 text-sm leading-6 text-white/65">Ambient intelligence, human context, and action planning are synced across the network.</p>
          </div>
        </aside>

        <section className="space-y-8">
          <header className="afrika-panel-strong overflow-hidden p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="afrika-chip">Visual intelligence layer</span>
                  <span className="afrika-chip">African reality OS</span>
                  <span className="afrika-chip">Ambient discovery</span>
                </div>
                <div className="space-y-4">
                  <div className="afrika-label">Home feed</div>
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
                    Africa, rendered as a cinematic stream of places, signals, and actions.
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                    Premium discovery for African life, with AI insights, spatial context, and action paths that feel natural rather than transactional.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricTile label="Trend signal" value="Lagos rising" detail={trendQuery.rankingHint} />
                  <MetricTile label="Freshness" value={freshnessStatus(feedHighlights[0]?.quality.freshness ?? 0.8)} detail="Cards decay when signal quality fades." />
                  <MetricTile label="Reasoning" value="Context aware" detail="Why it matters, comparisons, and nearby intelligence." />
                </div>
              </div>

              <div className="afrika-panel relative overflow-hidden p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,155,92,0.22),transparent_55%)]" />
                <div className="relative space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="afrika-label">Ambient briefing</div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">Live</div>
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-white/45">Current mode</div>
                    <div className="mt-3 text-3xl font-semibold text-white capitalize">
                      {ambientIntelligence.adaptiveInterface.mode.replace("-", " ")}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/60">{ambientIntelligence.adaptiveInterface.tone}</p>
                  </div>
                  <div className="grid gap-3">
                    {ambientIntelligence.suggestions.slice(0, 3).map((item) => (
                      <InsightRow key={`${item.city}-${item.title}`} title={item.title} detail={`${item.city} - ${item.reason}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-3">
            <MetricTile label="Behavioral archetype" value={behavioralProfile.archetype.replace("-", " ")} detail={`Discovery style: ${behavioralProfile.discoveryStyle}`} />
            <MetricTile
              label="City intelligence"
              value={cityIntelligence[0]?.city ?? "Lagos"}
              detail={`Density ${cityIntelligence[0]?.discoveryDensity ?? 0} and momentum ${cityIntelligence[0]?.trendMomentum ?? 0}`}
            />
            <MetricTile label="Graph layers" value={`${contentGraph.nodes.length} nodes`} detail="Linked city, culture, and discovery pathways." />
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Editorial feed"
              title="Immersive cards that feel collectible, spatial, and useful."
              description="A richer rhythm of large visual cards, AI overlays, and localized discovery sections."
            />
            <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="grid gap-5 lg:grid-cols-2">
                {feedHighlights.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                  >
                    <DiscoveryCard
                      card={card}
                      score={`Q ${card.quality.total}`}
                      highlight={card.intelligence.whyItMatters}
                      cta="Open intelligence"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="afrika-panel p-5">
                  <div className="afrika-label">Context layers</div>
                  <div className="mt-4 grid gap-3">
                    <InsightRow title="City intelligence" detail={`${cityIntelligence[0]?.city ?? "Lagos"} is showing ${cityIntelligence[0]?.trendMomentum ?? 0} trend momentum.`} />
                    <InsightRow title="Human layer" detail={`${humanLayer.cityIntelligence.length} cities now have human context alongside AI structure.`} />
                    <InsightRow title="Contributor trust" detail={`${contributorNetwork.averageTrust} average trust, with ${contributorNetwork.trustedContributors} trusted contributors.`} />
                    <InsightRow title="Cultural stories" detail={`${culturalStories.length} editorial movement stories generated from the graph.`} />
                  </div>
                </div>

                <div className="afrika-panel p-5">
                  <div className="afrika-label">Action layer</div>
                  <div className="mt-4 space-y-3">
                    <InsightRow title={actionLayer.intent.primaryIntent.replace("-", " ")} detail={actionLayer.intent.nextStepPrompt} />
                    <InsightRow title="Fulfillment trust" detail={`${actionLayer.analytics.reservationSuccessRate} reservation success, with calm invisible actions.`} />
                    <InsightRow title="Personal OS" detail={`${personalOS.routines.length} ambient routines are adapting to timing and movement.`} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Predictive discovery"
              title="What AFRIKA expects you may want next."
              description="The system predicts follow-up discoveries based on behavior, geography, and ambient signals."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {predictiveHighlights.map((item) => (
                <article key={item.card.id} className="afrika-panel p-5">
                  <div className="afrika-label">{item.horizon}</div>
                  <div className="mt-3 text-xl font-semibold text-white">{item.card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.reason}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className="afrika-panel p-5">
              <SectionHeader eyebrow="Ambient discovery" title="Suggestions that surface before the user asks." />
              <div className="mt-5 grid gap-3">
                {ambientIntelligence.cityPulse.map((pulse) => (
                  <InsightRow
                    key={`${pulse.city}-${pulse.hour}`}
                    title={`${pulse.city} - ${pulse.bestWindow}`}
                    detail={`Pulse ${pulse.pulse}, acceleration ${pulse.acceleration}, aligned to ${ambientIntelligence.adaptiveInterface.mode.replace("-", " ")}.`}
                  />
                ))}
              </div>
            </div>
            <div className="afrika-panel p-5">
              <SectionHeader eyebrow="Intelligence graph" title="Connected discovery layers." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MetricTile label="Nodes" value={`${contentGraph.nodes.length}`} detail="Places, neighborhoods, and culture clusters." />
                <MetricTile label="Edges" value={`${contentGraph.edges.length}`} detail="Relationships powering recommendations." />
                <MetricTile label="City profiles" value={`${cityIntelligence.length}`} detail="Spatial intelligence across locations." />
                <MetricTile label="Personal routines" value={`${personalOS.routines.length}`} detail="Adaptive timing and context loops." />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Stage 7"
              title="The system learns, self-heals, and scales by itself."
              description="Feedback signals, duplicate resolution, city bootstraps, and AI consistency checks now sit in the core intelligence layer."
            />
            <div className="grid gap-4 xl:grid-cols-4">
              <MetricTile label="Feedback clusters" value={`${stage7.feedbackLoop.signals.length}`} detail={stage7.feedbackLoop.learningSummary} />
              <MetricTile label="Self-healing actions" value={`${stage7.selfHealing.staleness.length}`} detail={`${stage7.selfHealing.duplicates.length} duplicate groups were normalized.`} />
              <MetricTile label="City bootstraps" value={`${stage7.cityScaling.profiles.length}`} detail="Each city has baseline demand, trend, and engagement maps." />
              <MetricTile label="AI validation" value={stage7.aiControl.checks.every((check) => check.passed) ? "Aligned" : "Review"} detail={stage7.aiControl.validatorSummary} />
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Live layers"
              title="Editorial sections, not a noisy feed."
              description="Trending areas, nearby intelligence, and useful discoveries remain organized by context."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Trending now", detail: "Areas accelerating in local saves and search signals." },
                { label: "Nearby discoveries", detail: "Places closest to the user's current city pulse." },
                { label: "Editor picks", detail: "High-trust discoveries selected for utility and clarity." },
                { label: "AI curated", detail: "Cards scored for freshness, relevance, and visual quality." },
              ].map((item) => (
                <InsightRow key={item.label} title={item.label} detail={item.detail} />
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <div className="afrika-panel sticky top-6 p-5">
            <div className="afrika-label">Operational pulse</div>
            <div className="mt-4 text-2xl font-semibold text-white">Living intelligence</div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Discovery, context, and action are coordinated so the interface feels calm even when the system is active.
            </p>
          </div>

          <div className="afrika-panel p-5">
            <div className="afrika-label">Freshness</div>
            <div className="mt-3 text-4xl font-semibold text-white">0.91</div>
            <p className="mt-2 text-sm leading-6 text-white/60">Recent, trusted, and locally relevant signal across the feed.</p>
          </div>

          <div className="afrika-panel p-5">
            <div className="afrika-label">Intent engine</div>
            <div className="mt-4 space-y-3">
              <InsightRow title={actionLayer.intent.primaryIntent.replace("-", " ")} detail={actionLayer.intent.nextStepPrompt} />
              <InsightRow title="Timing" detail={actionLayer.intent.timingHint} />
              <InsightRow title="Recommendation" detail={actionLayer.actions[0]?.description ?? "A next action appears here."} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

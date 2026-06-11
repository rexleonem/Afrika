import { featuredCards } from "@afrika/shared/content";
import {
  buildContributorNetwork,
  buildHumanIntelligenceLayer,
  generateCulturalStories,
  moderateContribution,
  structureHumanContribution,
} from "@afrika/shared/stage4";
import { buildActionAnalytics, buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence, buildContinentalIntelligence, buildPersonalOperatingSystem } from "@afrika/shared/stage6";
import { buildStage7IntelligenceSystem } from "@afrika/shared/stage7";
import { buildStage8WorldModel } from "@afrika/shared/stage8";
import { buildStage9CivilizationalIntelligenceSystem } from "@afrika/shared/stage9";
import { buildStage10ConsciousnessSystem } from "@afrika/shared/stage10";
import { buildStage11OrchestrationSystem } from "@afrika/shared/stage11";
import { AmbientGlow } from "../components/motion/ambient-glow";
import { ScrollReveal } from "../components/motion/scroll-reveal";
import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../components/primitives";

const contributorSeed = [
  {
    id: "contributor-lagos-explorer",
    name: "Lagos Explorer",
    role: "explorer" as const,
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
    role: "food-scout" as const,
    city: "Accra",
    expertiseAreas: ["food culture", "affordability", "local dining"],
    verificationHistory: 0.84,
    contributionQuality: 0.9,
    consistency: 0.77,
    localExpertise: 0.86,
  },
];

const contributorNetwork = buildContributorNetwork(contributorSeed);
const humanLayer = buildHumanIntelligenceLayer(featuredCards);
const actionLayer = buildActionLayer(featuredCards);
const humanContributions = [
  structureHumanContribution({
    card: featuredCards[0]!,
    contributor: contributorSeed[0]!,
    note: "Creative corridors feel calmer and more useful on weekday afternoons.",
    emotionalContext: "calm, focused, and curious",
    culturalContext: "design and studio culture",
    localTiming: "weekday afternoons",
    mediaUrl: featuredCards[0]?.media.imageUrl,
  }),
  structureHumanContribution({
    card: featuredCards[1]!,
    contributor: contributorSeed[1]!,
    note: "This coast spot is a reset point for locals after work.",
    emotionalContext: "restful and open",
    culturalContext: "coastal rhythm and weekend movement",
    localTiming: "after work",
    mediaUrl: featuredCards[1]?.media.imageUrl,
  }),
];
const culturalStories = generateCulturalStories(featuredCards, humanContributions.map((item) => item.insight));
const moderationQueue = humanContributions.map((item) =>
  moderateContribution({
    contributorId: item.contributor.id,
    note: item.insight.note,
    trustScore: item.contributor.trustScore,
    hasMedia: true,
    duplicatesDetected: false,
    misleadingSignals: item.verification.verificationState === "flagged",
  }),
);
const actionAnalytics = buildActionAnalytics([
  { type: "reservation", completed: true },
  { type: "visit", completed: true },
  { type: "plan", completed: true },
  { type: "application", completed: false },
  { type: "recommendation", completed: true },
]);
const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const personalOS = buildPersonalOperatingSystem(featuredCards, "2026-06-09T19:00:00.000Z");
const continental = buildContinentalIntelligence();
const stage7 = buildStage7IntelligenceSystem(featuredCards);
const stage8 = buildStage8WorldModel(featuredCards);
const stage9 = buildStage9CivilizationalIntelligenceSystem(featuredCards);
const stage10 = buildStage10ConsciousnessSystem(featuredCards);
const stage11 = buildStage11OrchestrationSystem(featuredCards);

export default function AdminPage() {
  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel overflow-hidden p-6 sm:p-8">
        <AmbientGlow variant="gold" size="lg" className="top-8 right-[-5%]" opacity={0.28} />
        <AmbientGlow variant="forest" size="md" className="bottom-0 left-[-8%]" opacity={0.18} animationDelay="-4s" />
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <ScrollReveal>
              <div className="flex flex-wrap gap-2">
                <span className="afrika-chip">Operations center</span>
                <span className="afrika-chip">AI pipeline</span>
                <span className="afrika-chip">Trust network</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.04}>
              <div className="afrika-label">Admin</div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h1 className="afrika-hero-title max-w-3xl">The control center for a living intelligence network.</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Content operations, AI enrichment, moderation, trend controls, and trust signals now sit inside a cohesive operational workspace.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <div className="flex flex-wrap gap-2">
                <SignalBadge label="Mode" value={ambient.adaptiveInterface.mode.replace("-", " ")} />
                <SignalBadge label="Pulse" value={`${ambient.cityPulse.length} cities`} />
                <SignalBadge label="Trust" value={contributorNetwork.averageTrust.toFixed(2)} />
                <SignalBadge label="Stage 7" value={stage7.aiControl.checks.every((check) => check.passed) ? "validated" : "review"} />
                <SignalBadge label="Stage 8" value={stage8.worldModel.length > 0 ? "model active" : "review"} />
                <SignalBadge label="Stage 9" value={stage9.civilizationalMemory.length > 0 ? "memory alive" : "review"} />
              </div>
            </ScrollReveal>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ScrollReveal delay={0.02}>
              <MetricTile label="Contributor trust" value={contributorNetwork.averageTrust.toFixed(2)} detail="Built from accuracy, consistency, and verification history." />
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <MetricTile label="Action signals" value={`${actionAnalytics.completedPlans}`} detail="Plan completions and real-world actions stay visible." />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <MetricTile label="Fulfillment rate" value={actionAnalytics.reservationSuccessRate} detail="Invisible actions remain reliable." />
            </ScrollReveal>
            <ScrollReveal delay={0.14}>
              <MetricTile
                label="Human stories"
                value={`${culturalStories.length}`}
                detail={`${humanLayer.graph.nodes.length} graph nodes now blend human context with AI structure.`}
              />
            </ScrollReveal>
          </div>
        </div>
      </header>

      <ScrollReveal>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Ingestion health" value="Stable" detail="Distributed workers, freshness checks, and source scoring remain healthy." />
          <MetricTile label="AI confidence" value="High" detail="Summaries, rankings, and moderation outputs are within expected bounds." />
          <MetricTile label="Trend momentum" value="Rising" detail="Emerging neighborhoods and movement signals are being boosted." />
          <MetricTile label="Verification" value="Active" detail="Human and AI validation continue to support authenticity." />
        </section>
      </ScrollReveal>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Stage 7 feedback loop"
            title="User behavior now tunes relevance, freshness, and ranking weights automatically."
            description="The system is no longer static. It is learning from clicks, saves, dwell time, and map interactions."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricTile label="Signals" value={`${stage7.feedbackLoop.signals.length}`} detail="Clicks, saves, dwell, map-open, and search-refine signals." />
            <MetricTile label="Ranking weights" value="Adaptive" detail="Weights shift by engagement, city context, and category performance." />
            <MetricTile label="Card memory" value={`${stage7.feedbackLoop.cardMemory.length}`} detail="Each card retains performance history and relevance trend." />
            <MetricTile label="Learning summary" value="Active" detail={stage7.feedbackLoop.learningSummary} />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Stage 7 hardening"
            title="Self-healing, city bootstrapping, and load-aware AI routing are now visible."
            description="This is the control surface for the operational foundation that keeps the platform stable at scale."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Self-healing" detail={`${stage7.selfHealing.duplicates.length} duplicate groups, ${stage7.selfHealing.staleness.filter((item) => item.action !== "refresh").length} corrective actions.`} tone="good" />
            <QueueRow title="City scaling" detail={`${stage7.cityScaling.profiles.length} cities are bootstrapped with demand and trend maps.`} tone="good" />
            <QueueRow title="AI control" detail={stage7.aiControl.validatorSummary} tone={stage7.aiControl.checks.every((check) => check.passed) ? "good" : "warn"} />
            <QueueRow title="Performance routing" detail={stage7.performance.gracefulDegradation[0]} tone="good" />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Content operations center"
            title="Visual moderation queues with freshness and AI enrichment context."
            description="The admin surface now reads like an operational intelligence desk instead of a generic CRUD table."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {featuredCards.map((card) => (
              <div key={card.id} className="rounded-[22px] border border-white/10 glass-subtle p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/45">{card.category}</div>
                    <div className="mt-2 text-lg font-medium text-white">{card.title}</div>
                  </div>
                  <div className="text-xs text-white/55">Fresh {card.freshnessScore.toFixed(2)}</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">{card.intelligence.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SignalBadge label="Trust" value={card.trustScore.toFixed(2)} />
                  <SignalBadge label="Relevance" value={card.relevanceScore.toFixed(2)} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="AI pipeline dashboard"
            title="Track generation queues, moderation confidence, and failed jobs."
            description="The interface emphasizes state, trust, and freshness over raw noise."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Generation queue" detail="Summaries and contextual layers are flowing through the enrichment pipeline." tone="good" />
            <QueueRow title="Moderation queue" detail="Low-confidence contributions stay visible for human review." tone="warn" />
            <QueueRow title="Ranking outputs" detail="Deep reasoning and freshness weighting are feeding the live feeds." tone="good" />
            <QueueRow title="Failed jobs" detail="Retry policy and health checks remain within acceptable thresholds." />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Analytics experience"
            title="Geographic activity, save behavior, and category momentum become visible."
            description="The analytics layer now mirrors the spatial intelligence story of the platform."
          />
          <div className="mt-5 space-y-3">
            {[
              "Lagos creative corridors are showing the strongest save velocity.",
              "Coastal discovery themes are outperforming generic city listings.",
              "Opportunity content is converting into plan saves more often than expected.",
            ].map((item) => (
              <QueueRow key={item} title="Signal" detail={item} tone="good" />
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <MetricTile label="Discovery flow" value="Healthy" detail="Users move from feed to map to plan with continuity." />
            <MetricTile label="Category momentum" value="Mixed" detail="Places and culture remain strongest." />
            <MetricTile label="Save velocity" value="Rising" detail="Cards with utility continue to outperform." />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Feed control system"
            title="Editorial controls for trend boosting and regional prioritization."
            description="The goal is calibrated intelligence, not vanity metrics or noisy management."
          />
          <div className="mt-5 grid gap-3">
            <QueueRow title="Region prioritization" detail="Lagos and Accra remain high-signal regions for curated boosting." tone="good" />
            <QueueRow title="Seasonal pinning" detail="Weekend and evening content can be weighted more aggressively." />
            <QueueRow title="AI override tools" detail="Editors can quietly adjust low-confidence outputs." tone="warn" />
            <QueueRow title="Content weighting" detail="Use usefulness, freshness, and trust over reach alone." tone="good" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Verification and trust"
            title="Human validation keeps the ecosystem authentic."
            description="Contributor quality, moderation confidence, and source reliability remain traceable."
          />
          <div className="mt-5 space-y-3">
            {humanContributions.map((item) => (
              <QueueRow
                key={item.insight.id}
                title={item.contributor.status}
                detail={`${item.insight.note} Confidence ${item.verification.confidenceScore}.`}
                tone={item.verification.verificationState === "verified" ? "good" : "warn"}
              />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Human intelligence"
            title="Editorial context and contributor quality sit beside the autonomous graph."
            description="The platform treats human knowledge as a trust layer rather than a social feed."
          />
          <div className="mt-5 space-y-3">
            {culturalStories.map((story) => (
              <QueueRow key={story.id} title={story.title} detail={story.summary} tone="good" />
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Operational intelligence"
            title="Ambient, temporal, and continental views stay visible in one place."
            description="Admin should understand city pulse and orchestration without becoming noisy."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Ambient mode" detail={`${ambient.adaptiveInterface.mode.replace("-", " ")} - ${ambient.adaptiveInterface.tone}`} tone="good" />
            <QueueRow title="City pulse" detail={`${ambient.cityPulse[0]?.city} - ${ambient.cityPulse[0]?.bestWindow}`} tone="good" />
            <QueueRow title="Personal OS" detail={`${personalOS.routines.length} adaptive routines are active.`} tone="good" />
            <QueueRow title="Continental view" detail={`${continental.length} regions tracked with localized personality layers.`} tone="good" />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Stage 8 world model"
            title="Cities, behavior, and environment are now tracked as a living simulation layer."
            description="This is the operational view of the autonomous world model that feeds predictive reality and digital twins."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricTile label="World model signals" value={`${stage8.worldModel.length}`} detail="Neighborhood, culture, behavior, and environment." />
            <MetricTile label="Digital twins" value={`${stage8.digitalTwins.length}`} detail="City pulse and future state layers." />
            <MetricTile label="Simulation nodes" value={`${stage8.orchestration.coordinationGraph.nodes}`} detail="Cross-graph reasoning and memory layers." />
            <MetricTile label="Predictive reality" value={`${stage8.predictiveReality.length}`} detail="Forecasts for urban, cultural, and tourism shifts." />
          </div>
          <div className="mt-5 space-y-3">
            <QueueRow title="Agent coordination" detail={stage8.orchestration.coordinationGraph.summary} tone="good" />
            <QueueRow title="Learning loops" detail={stage8.selfEvolving.summary} tone="good" />
            <QueueRow title="Simulation layer" detail={stage8.simulations[0]?.outcome ?? "Simulation outputs are warming up."} tone="good" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="AI agent oversight"
            title="Discovery agents explore culture, food, opportunities, and tourism continuously."
            description="Autonomous agents now coordinate through the shared world model rather than operating in isolation."
          />
          <div className="mt-5 space-y-3">
            {stage8.orchestration.agents.map((agent) => (
              <QueueRow
                key={agent.id}
                title={agent.type.toUpperCase()}
                detail={`${agent.focus} - ${agent.status} - autonomy ${agent.autonomyLevel.toFixed(2)}`}
                tone="good"
              />
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricTile label="Multimodal cards" value={`${stage8.multimodal.length}`} detail="Visual, spatial, behavioral, and linguistic reads." />
            <MetricTile label="Collective behavior" value={`${stage8.collectiveBehavior.length}`} detail="Regional movement and trend spread layers." />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Stage 9 civilizational intelligence"
            title="Historical memory, future forecasts, and continuity systems now work as one living layer."
            description="The observatory keeps African life legible across time without exposing raw complexity."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricTile label="Memory entries" value={`${stage9.civilizationalMemory.length}`} detail="Neighborhoods, stories, traditions, and change." />
            <MetricTile label="Forecasts" value={`${stage9.futureForecasts.length}`} detail="Future cultural and urban trajectories." />
            <MetricTile label="Generational layers" value={`${stage9.generationalIntelligence.length}`} detail="How behavior shifts across age groups." />
            <MetricTile label="Global network" value={`${stage9.globalAfricanNetwork.length}`} detail="Diaspora influence and cultural diffusion." />
          </div>
          <div className="mt-5 space-y-3">
            <QueueRow title="Historical graph" detail={stage9.historicalGraph.summary} tone="good" />
            <QueueRow title="Continuity" detail={stage9.continuity.summary} tone="good" />
            <QueueRow title="Knowledge evolution" detail={stage9.knowledgeEvolution[0]?.update ?? "Learning loops are active."} tone="good" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Cultural preservation AI"
            title="Living memory keeps language, rituals, architecture, and evolving identity in view."
            description="Preservation is treated as continuity, not an archive."
          />
          <div className="mt-5 space-y-3">
            {stage9.preservationAI.map((item) => (
              <QueueRow
                key={item.id}
                title={item.preserveAs}
                detail={`${item.summary} Urgency ${item.urgency}.`}
                tone={item.urgency === "high" ? "warn" : "good"}
              />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Stage 10 consciousness layer"
            title="Emotional movement, cultural synchronization, and self-reflective AI now read as one planetary organism."
            description="The observatory now tracks the atmosphere of African reality with emotional, cultural, and continuity-aware synthesis."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricTile label="Consciousness pulses" value={`${stage10.consciousnessEngine.length}`} detail="City-level emotional and cultural rhythm layers." />
            <MetricTile label="Emotional civilization" value={`${stage10.emotionalCivilization.length}`} detail="Calmness, intensity, warmth, and reflection across regions." />
            <MetricTile label="Cultural sync" value={`${stage10.culturalSynchronization.length}`} detail="Diaspora and global movement alignment." />
            <MetricTile label="Knowledge mesh" value={`${stage10.planetaryKnowledgeMesh.length}`} detail="Cities and diaspora bridges in one living mesh." />
          </div>
          <div className="mt-5 space-y-3">
            <QueueRow title="Organism vitality" detail={stage10.livingOrganism.summary} tone="good" />
            <QueueRow title="Memory grid" detail={stage10.intergenerationalContinuity.summary} tone="good" />
            <QueueRow title="Self reflection" detail={stage10.selfReflectiveAI.summary} tone="good" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Planetary intelligence"
            title="A calmer, more emotional intelligence layer for African civilization is now visible."
            description="Consciousness monitoring should stay elegant, human, and useful rather than turning into a noisy dashboard."
          />
          <div className="mt-5 space-y-3">
            {stage10.consciousnessEngine.slice(0, 3).map((pulse) => (
              <QueueRow key={pulse.city} title={pulse.city} detail={pulse.resonance} tone="good" />
            ))}
            <QueueRow title="Reality harmonization" detail={stage10.realityHarmonization[0]?.synthesis ?? "Harmonization layers are active."} tone="good" />
            <QueueRow title="Societal simulation" detail={stage10.societalSimulations[0]?.outcome ?? "Simulation systems are warming up."} tone="good" />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Stage 11 orchestration"
            title="Discovery, movement, opportunity, and environmental balance now flow through one calm coordination layer."
            description="The platform now harmonizes real-world pressure without revealing the machinery behind it."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MetricTile label="Reality orchestration" value={`${stage11.realityOrchestration.length}`} detail="City-level flow coordination nodes." />
            <MetricTile label="Urban harmony" value={`${stage11.urbanHarmonization.length}`} detail="Congestion, quiet zones, and nightlife balance." />
            <MetricTile label="Environmental sync" value={`${stage11.environmentalSynchronization.length}`} detail="Weather, heat, noise, and comfort alignment." />
            <MetricTile label="Stability signals" value={`${stage11.civilizationStability.length}`} detail="Long-term balance and cultural diversity." />
          </div>
          <div className="mt-5 space-y-3">
            <QueueRow title="Invisible coordination" detail={stage11.invisibleAmbient.summary} tone="good" />
            <QueueRow title="Flow optimization" detail={stage11.collectiveFlow[0]?.summary ?? "Flow systems are active."} tone="good" />
            <QueueRow title="Friction reduction" detail={stage11.frictionReduction[0]?.outcome ?? "Friction reduction systems are active."} tone="good" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Coordination agents"
            title="Autonomous agents now cooperate across flow, culture, environment, and opportunity routing."
            description="This is the calm orchestration view, not a noisy operations dashboard."
          />
          <div className="mt-5 space-y-3">
            {stage11.coordinationAgents.slice(0, 3).map((agent) => (
              <QueueRow key={agent.id} title={agent.type.toUpperCase()} detail={`${agent.focus} · ${agent.status}`} tone="good" />
            ))}
            <QueueRow title="Opportunity routing" detail={stage11.opportunityRouting[0]?.reason ?? "Routing is adaptive and contextual."} tone="good" />
            <QueueRow title="Continental awareness" detail={stage11.continentalAwareness[0]?.summary ?? "Continental awareness is active."} tone="good" />
          </div>
        </article>
      </section>
    </main>
  );
}

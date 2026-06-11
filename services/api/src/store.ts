import { featuredCards } from "@afrika/shared/content";
import { freshnessStatus, scoreCardTotal, type RecommendationEdge, type TrendSignal } from "@afrika/shared/stage2";
import {
  buildCityIntelligence,
  buildContentGraph,
  inferBehavioralProfile,
  optimizeQuality,
  predictDiscovery,
  selfHealGraph
} from "@afrika/shared/stage3";
import {
  buildContributorNetwork,
  buildHumanIntelligenceLayer,
  generateCulturalStories,
  moderateContribution,
  type ContributorModeration,
  type HumanAIContribution,
  type VerificationResult,
  structureHumanContribution
} from "@afrika/shared/stage4";
import {
  buildActionAnalytics,
  buildActionLayer,
  buildInquiryWorkflow,
  buildMovementPlan,
  buildOpportunityApplications,
  buildReservationRequest,
  buildSmartActions,
  detectIntent
} from "@afrika/shared/stage5";
import {
  buildAmbientIntelligence,
  buildContinentalIntelligence,
  buildCrossDomainIntelligenceGraph,
  buildPersonalOperatingSystem,
  buildTemporalIntelligence
} from "@afrika/shared/stage6";
import { buildStage7IntelligenceSystem } from "@afrika/shared/stage7";
import { buildStage8WorldModel } from "@afrika/shared/stage8";
import { buildStage9CivilizationalIntelligenceSystem } from "@afrika/shared/stage9";
import { buildStage10ConsciousnessSystem } from "@afrika/shared/stage10";
import { buildStage11OrchestrationSystem } from "@afrika/shared/stage11";
import type { StoredCard } from "./types.js";

export type RuntimeCard = StoredCard & {
  freshnessStatus: "fresh" | "warming" | "stale" | "expired";
  qualityScore: number;
};

export type RuntimeStore = {
  cards: RuntimeCard[];
  trendSignals: TrendSignal[];
  recommendationEdges: RecommendationEdge[];
  contentGraph: ReturnType<typeof buildContentGraph>;
  cityIntelligence: ReturnType<typeof buildCityIntelligence>;
  behavioralProfile: ReturnType<typeof inferBehavioralProfile>;
  predictiveRecommendations: ReturnType<typeof predictDiscovery>;
  qualityOptimization: ReturnType<typeof optimizeQuality>;
  selfHealingActions: ReturnType<typeof selfHealGraph>;
  humanLayer: ReturnType<typeof buildHumanIntelligenceLayer>;
  contributorNetwork: ReturnType<typeof buildContributorNetwork>;
  humanContributions: HumanAIContribution[];
  verificationQueue: VerificationResult[];
  culturalStories: ReturnType<typeof generateCulturalStories>;
  moderationQueue: ContributorModeration[];
  actionLayer: ReturnType<typeof buildActionLayer>;
  intentSignals: ReturnType<typeof detectIntent>[];
  smartActions: ReturnType<typeof buildSmartActions>[number][];
  reservationRequests: ReturnType<typeof buildReservationRequest>[];
  inquiries: ReturnType<typeof buildInquiryWorkflow>[];
  movementPlans: ReturnType<typeof buildMovementPlan>[];
  opportunityApplications: ReturnType<typeof buildOpportunityApplications>;
  actionAnalytics: ReturnType<typeof buildActionAnalytics>;
  ambientIntelligence: ReturnType<typeof buildAmbientIntelligence>;
  temporalIntelligence: ReturnType<typeof buildTemporalIntelligence>;
  crossDomainGraph: ReturnType<typeof buildCrossDomainIntelligenceGraph>;
  personalOperatingSystem: ReturnType<typeof buildPersonalOperatingSystem>;
  continentalIntelligence: ReturnType<typeof buildContinentalIntelligence>;
  stage7Interactions: Array<{
    cardId?: string;
    city: string;
    category?: string;
    type: "click" | "save" | "dwell" | "map-open" | "search-refine";
    weight: number;
    timestamp: string;
  }>;
  stage7System: ReturnType<typeof buildStage7IntelligenceSystem>;
  stage8System: ReturnType<typeof buildStage8WorldModel>;
  stage9System: ReturnType<typeof buildStage9CivilizationalIntelligenceSystem>;
  stage10System: ReturnType<typeof buildStage10ConsciousnessSystem>;
  stage11System: ReturnType<typeof buildStage11OrchestrationSystem>;
};

function createRuntimeCards(cards: StoredCard[]): RuntimeCard[] {
  return cards
    .filter((card) => card.status !== "archived")
    .map((card, index) => {
      const quality = scoreCardTotal({
        usefulness: 0.86,
        uniqueness: 0.72,
        freshness: card.freshnessScore,
        visualQuality: 0.91,
        sourceTrust: card.trustScore,
        engagementProbability: 0.66,
        localRelevance: card.relevanceScore
      });

      return {
        ...card,
        freshnessStatus: freshnessStatus(quality.freshness),
        qualityScore: quality.total,
        confidenceScore: card.confidenceScore ?? Number((0.78 + index * 0.02).toFixed(2)),
        trendScore: card.trendScore ?? Number((0.7 + index * 0.03).toFixed(2)),
        status: card.status ?? "active"
      };
    });
}

export function buildStore(cards: StoredCard[] = featuredCards as StoredCard[]): RuntimeStore {
  const runtimeCards = createRuntimeCards(cards);
  const sourceCards = runtimeCards.length > 0 ? runtimeCards : createRuntimeCards(featuredCards as StoredCard[]);

  const contentGraph = buildContentGraph(sourceCards);
  const cityIntelligence = buildCityIntelligence(sourceCards);
  const behavioralProfile = inferBehavioralProfile(sourceCards, [
    { type: "search", query: "quiet places to work in Lagos", timestamp: new Date().toISOString() },
    { type: "save", cardId: sourceCards[0]?.id, timestamp: new Date().toISOString() },
    { type: "map-open", cardId: sourceCards[1]?.id, timestamp: new Date().toISOString() }
  ]);
  const predictiveRecommendations = predictDiscovery(sourceCards, behavioralProfile, cityIntelligence);
  const qualityOptimization = optimizeQuality(sourceCards);
  const selfHealingActions = selfHealGraph(sourceCards);
  const humanLayer = buildHumanIntelligenceLayer(sourceCards);

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
      localExpertise: 0.89
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
      localExpertise: 0.86
    }
  ];

  const contributorNetwork = buildContributorNetwork(contributorSeed);

  const humanContributions = [
    structureHumanContribution({
      card: sourceCards[0]!,
      contributor: contributorSeed[0]!,
      note: "Creative corridor feels safer and more active on weekday afternoons.",
      emotionalContext: "calm but energetic",
      culturalContext: "design and studio culture",
      localTiming: "weekday afternoons",
      mediaUrl: sourceCards[0]?.media.imageUrl
    }),
    structureHumanContribution({
      card: sourceCards[1]!,
      contributor: contributorSeed[1]!,
      note: "Locals visit this coast spot after work for a quiet reset.",
      emotionalContext: "restful and open",
      culturalContext: "coastal weekend rhythm",
      localTiming: "after work",
      mediaUrl: sourceCards[1]?.media.imageUrl
    })
  ];

  const verificationQueue = humanContributions.map((item) => item.verification);
  const culturalStories = generateCulturalStories(sourceCards, humanContributions.map((item) => item.insight));
  const moderationQueue = humanContributions.map((item) =>
    moderateContribution({
      contributorId: item.contributor.id,
      note: item.insight.note,
      trustScore: item.contributor.trustScore,
      hasMedia: Boolean(item.insight.cardId),
      duplicatesDetected: false,
      misleadingSignals: item.verification.verificationState === "flagged"
    })
  );

  const actionLayer = buildActionLayer(sourceCards);
  const intentSignals = [
    detectIntent("quiet places for a date in Lagos", [
      { type: "save", weight: 2 },
      { type: "search", weight: 3 },
      { type: "map-open", weight: 1 }
    ]),
    detectIntent("creative neighborhoods for remote work", [
      { type: "search", weight: 3 },
      { type: "save", weight: 2 }
    ])
  ];

  const smartActions = sourceCards.flatMap((card) => buildSmartActions(card, actionLayer.intent));
  const reservationRequests = sourceCards
    .filter((card) => card.kind === "place" || card.kind === "event" || card.kind === "discovery")
    .slice(0, 2)
    .map((card) => buildReservationRequest(card, card.kind === "event" ? "event" : "experience"));
  const inquiries = sourceCards.slice(0, 2).map((card) => buildInquiryWorkflow(card));
  const movementPlans = [buildMovementPlan(sourceCards, "Calm Lagos weekend"), buildMovementPlan(sourceCards.slice(1), "Food route through Accra")];
  const opportunityApplications = buildOpportunityApplications(sourceCards);
  const actionAnalytics = buildActionAnalytics([
    { type: "reservation", completed: true },
    { type: "visit", completed: true },
    { type: "plan", completed: true },
    { type: "application", completed: true },
    { type: "recommendation", completed: true }
  ]);

  const stage6Timestamp = "2026-06-09T19:00:00.000Z";
  const ambientIntelligence = buildAmbientIntelligence(sourceCards, stage6Timestamp);
  const temporalIntelligence = buildTemporalIntelligence(sourceCards, stage6Timestamp);
  const crossDomainGraph = buildCrossDomainIntelligenceGraph(sourceCards, stage6Timestamp);
  const personalOperatingSystem = buildPersonalOperatingSystem(sourceCards, stage6Timestamp);
  const continentalIntelligence = buildContinentalIntelligence();
  const stage7Interactions = [
    { cardId: sourceCards[0]?.id, city: "Lagos", category: sourceCards[0]?.category, type: "click" as const, weight: 1.2, timestamp: "2026-06-09T19:05:00.000Z" },
    { cardId: sourceCards[0]?.id, city: "Lagos", category: sourceCards[0]?.category, type: "save" as const, weight: 1.4, timestamp: "2026-06-09T19:06:00.000Z" },
    { cardId: sourceCards[1]?.id, city: "Accra", category: sourceCards[1]?.category, type: "dwell" as const, weight: 1.1, timestamp: "2026-06-09T19:07:00.000Z" },
    { cardId: sourceCards[2]?.id, city: "Nairobi", category: sourceCards[2]?.category, type: "map-open" as const, weight: 1.0, timestamp: "2026-06-09T19:08:00.000Z" },
    { cardId: sourceCards[2]?.id, city: "Nairobi", category: sourceCards[2]?.category, type: "search-refine" as const, weight: 0.9, timestamp: "2026-06-09T19:09:00.000Z" }
  ];
  const stage7System = buildStage7IntelligenceSystem(sourceCards, stage7Interactions);
  const stage8System = buildStage8WorldModel(sourceCards);
  const stage9System = buildStage9CivilizationalIntelligenceSystem(sourceCards);
  const stage10System = buildStage10ConsciousnessSystem(sourceCards);
  const stage11System = buildStage11OrchestrationSystem(sourceCards);

  const trendSignals: TrendSignal[] = [
    { locationKey: "lagos-lekki", metric: "search_frequency", score: 0.88, label: "Fast-rising in Lagos" },
    { locationKey: "nairobi-kilimani", metric: "save_velocity", score: 0.81, label: "High save velocity" }
  ];

  const recommendationEdges: RecommendationEdge[] = [
    {
      fromCardId: sourceCards[0]?.id ?? "lagos-lekki-art-district",
      toCardId: sourceCards[1]?.id ?? "accra-coastal-escape",
      score: 0.84,
      reason: "Similar discovery style with a different city context"
    }
  ];

  return {
    cards: runtimeCards,
    trendSignals,
    recommendationEdges,
    contentGraph,
    cityIntelligence,
    behavioralProfile,
    predictiveRecommendations,
    qualityOptimization,
    selfHealingActions,
    humanLayer,
    contributorNetwork,
    humanContributions,
    verificationQueue,
    culturalStories,
    moderationQueue,
    actionLayer,
    intentSignals,
    smartActions,
    reservationRequests,
    inquiries,
    movementPlans,
    opportunityApplications,
    actionAnalytics,
    ambientIntelligence,
    temporalIntelligence,
    crossDomainGraph,
    personalOperatingSystem,
    continentalIntelligence,
    stage7Interactions,
    stage7System,
    stage8System,
    stage9System,
    stage10System,
    stage11System
  };
}

export const seedStore = buildStore();

import { featuredCards } from "@afrika/shared/content";
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
  structureHumanContribution
} from "@afrika/shared/stage4";
import { freshnessStatus, scoreCardTotal, type RecommendationEdge, type TrendSignal } from "@afrika/shared/stage2";

const cards = featuredCards.map((card) => {
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
    qualityScore: quality.total
  };
});

const contentGraph = buildContentGraph(cards);
const cityIntelligence = buildCityIntelligence(cards);
const behavioralProfile = inferBehavioralProfile(cards, [
  { type: "search", query: "quiet places to work in Lagos", timestamp: new Date().toISOString() },
  { type: "save", cardId: cards[0]?.id, timestamp: new Date().toISOString() },
  { type: "map-open", cardId: cards[1]?.id, timestamp: new Date().toISOString() }
]);
const predictiveRecommendations = predictDiscovery(cards, behavioralProfile, cityIntelligence);
const qualityOptimization = optimizeQuality(cards);
const selfHealingActions = selfHealGraph(cards);
const humanLayer = buildHumanIntelligenceLayer(cards);

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
    card: cards[0]!,
    contributor: contributorSeed[0]!,
    note: "Creative corridor feels safer and more active on weekday afternoons.",
    emotionalContext: "calm but energetic",
    culturalContext: "design and studio culture",
    localTiming: "weekday afternoons",
    mediaUrl: cards[0]?.media.imageUrl
  }),
  structureHumanContribution({
    card: cards[1]!,
    contributor: contributorSeed[1]!,
    note: "Locals visit this coast spot after work for a quiet reset.",
    emotionalContext: "restful and open",
    culturalContext: "coastal weekend rhythm",
    localTiming: "after work",
    mediaUrl: cards[1]?.media.imageUrl
  })
];

const verificationQueue = humanContributions.map((item) => item.verification);
const culturalStories = generateCulturalStories(cards, humanContributions.map((item) => item.insight));
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

const trendSignals: TrendSignal[] = [
  { locationKey: "lagos-lekki", metric: "search_frequency", score: 0.88, label: "Fast-rising in Lagos" },
  { locationKey: "nairobi-kilimani", metric: "save_velocity", score: 0.81, label: "High save velocity" }
];

const recommendationEdges: RecommendationEdge[] = [
  {
    fromCardId: cards[0]?.id ?? "lagos-lekki-art-district",
    toCardId: cards[1]?.id ?? "accra-coastal-escape",
    score: 0.84,
    reason: "Similar discovery style with a different city context"
  }
];

export const store = {
  cards,
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
  moderationQueue
};

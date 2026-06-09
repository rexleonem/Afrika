import { featuredCards } from "@afrika/shared/content";
import {
  buildCityIntelligence,
  buildContentGraph,
  inferBehavioralProfile,
  optimizeQuality,
  predictDiscovery,
  selfHealGraph
} from "@afrika/shared/stage3";
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
  selfHealingActions
};

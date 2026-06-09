import type { AFRIKACard } from "./types";

export type IngestionSourceKind =
  | "google-maps"
  | "openstreetmap"
  | "tripadvisor"
  | "tourism"
  | "blog"
  | "food"
  | "real-estate"
  | "job-board"
  | "startup"
  | "event"
  | "social-signal"
  | "youtube";

export type IngestionSource = {
  id: string;
  name: string;
  kind: IngestionSourceKind;
  url: string;
  reliabilityScore: number;
  active: boolean;
  lastCrawledAt?: string;
  crawlIntervalMinutes: number;
};

export type CrawlRun = {
  id: string;
  sourceId: string;
  startedAt: string;
  finishedAt?: string;
  status: "queued" | "running" | "success" | "failed";
  fetchedCount: number;
  dedupedCount: number;
  errorCount: number;
};

export type RawDiscovery = {
  sourceId: string;
  url: string;
  title: string;
  description?: string;
  images?: string[];
  videos?: string[];
  coordinates?: { lat: number; lng: number };
  publishedAt?: string;
  categoryHint?: string;
  metadata?: Record<string, unknown>;
};

export type NormalizedCardDraft = Pick<
  AFRIKACard,
  "id" | "title" | "location" | "category" | "kind" | "tags" | "coordinates" | "timestamp" | "media"
> & {
  sourceId: string;
  sourceUrl: string;
  sourceReliability: number;
  rawFingerprint: string;
  discoveryType: "place" | "opportunity" | "event" | "culture" | "trend" | "neighborhood";
};

export type AIEnrichment = {
  summary: string;
  whyItMatters: string;
  recommendations: string[];
  comparisons: string[];
  trendRelevance: number;
  categoryConfidence: number;
  contextualSignals: string[];
};

export type QualityScore = {
  usefulness: number;
  uniqueness: number;
  freshness: number;
  visualQuality: number;
  sourceTrust: number;
  engagementProbability: number;
  localRelevance: number;
  total: number;
};

export type FreshnessState = {
  freshnessScore: number;
  confidenceScore: number;
  decayRate: number;
  verificationTimestamp: string;
  sourceReliability: number;
  status: "fresh" | "warming" | "stale" | "expired";
};

export type TrendSignal = {
  locationKey: string;
  metric: "save_velocity" | "search_frequency" | "engagement_spike" | "external_mentions" | "geo_activity";
  score: number;
  label: string;
};

export type RecommendationEdge = {
  fromCardId: string;
  toCardId: string;
  score: number;
  reason: string;
};

export type SearchInterpretation = {
  query: string;
  intent: "discover" | "compare" | "plan" | "locate";
  categoryHints: string[];
  locationHint?: string;
  budgetHint?: string;
  geoRadiusKm?: number;
  rankingHint: string;
};

export function scoreCardTotal(score: Omit<QualityScore, "total">): QualityScore {
  const total =
    score.usefulness * 0.22 +
    score.uniqueness * 0.12 +
    score.freshness * 0.18 +
    score.visualQuality * 0.12 +
    score.sourceTrust * 0.16 +
    score.engagementProbability * 0.08 +
    score.localRelevance * 0.12;

  return { ...score, total: Number(total.toFixed(3)) };
}

export function freshnessStatus(freshnessScore: number): FreshnessState["status"] {
  if (freshnessScore >= 0.8) return "fresh";
  if (freshnessScore >= 0.6) return "warming";
  if (freshnessScore >= 0.35) return "stale";
  return "expired";
}

export function interpretSearch(query: string): SearchInterpretation {
  const normalized = query.toLowerCase();
  const categoryHints = ["places", "insights"];

  if (/(cafe|coffee|eat|restaurant|food|brunch)/.test(normalized)) categoryHints.unshift("food");
  if (/(apartment|rent|house|property|real estate)/.test(normalized)) categoryHints.unshift("real-estate");
  if (/(job|grant|startup|accelerator|opportunity)/.test(normalized)) categoryHints.unshift("opportunities");
  if (/(event|concert|show|nightlife|party)/.test(normalized)) categoryHints.unshift("events");

  const locationMatch = normalized.match(/\b(lagos|yaba|lekki|nairobi|accra|abuja|port harcourt|cape town)\b/);
  const budgetMatch = normalized.match(/(cheap|budget|under\s*₦?\d+|under\s*\$?\d+)/);
  const planMatch = /(plan|weekend|itinerary|trip)/.test(normalized);
  const compareMatch = /(vs|compare|versus)/.test(normalized);

  return {
    query,
    intent: compareMatch ? "compare" : planMatch ? "plan" : "discover",
    categoryHints: [...new Set(categoryHints)],
    locationHint: locationMatch?.[0],
    budgetHint: budgetMatch?.[0],
    geoRadiusKm: /(near|around|close)/.test(normalized) ? 5 : 20,
    rankingHint: compareMatch
      ? "compare by usefulness, freshness, and affordability"
      : "rank by usefulness, freshness, local relevance, and trust"
  };
}

export function enrichCard(payload: {
  title: string;
  location: string;
  category: string;
  sourceReliability?: number;
  rawText?: string;
}): AIEnrichment {
  const text = (payload.rawText ?? "").toLowerCase();
  const isBusinessDistrict = /(work|office|startup|remote|cowork)/.test(text);
  const isQuiet = /(quiet|calm|peaceful|low-key)/.test(text);
  const isAffordable = /(cheap|budget|affordable|low cost)/.test(text);

  const recommendations = [
    `Explore nearby options around ${payload.location}`,
    `Compare ${payload.title} with similar places in the area`,
    `Save this for later planning`
  ];

  const comparisons = [
    isAffordable ? "Stronger budget value than nearby alternatives." : "Comparable to nearby options, but with stronger positioning.",
    isBusinessDistrict ? "Better suited for productive daytime use." : "More oriented toward leisure and discovery."
  ];

  const contextualSignals = [
    isQuiet ? "quiet" : "active",
    isAffordable ? "budget-friendly" : "premium-leaning",
    isBusinessDistrict ? "work-friendly" : "discovery-friendly"
  ];

  return {
    summary: `A concise intelligence layer for ${payload.title} in ${payload.location}.`,
    whyItMatters: isBusinessDistrict
      ? "Useful for people looking for work-friendly and connected urban context."
      : "Useful for people making a local decision with confidence.",
    recommendations,
    comparisons,
    trendRelevance: payload.sourceReliability ?? 0.75,
    categoryConfidence: 0.84,
    contextualSignals
  };
}

export function recommendNearby(cardTitle: string, location: string) {
  return [
    `${cardTitle} nearby alternatives`,
    `Similar vibe in ${location}`,
    `Area intelligence around ${location}`
  ];
}

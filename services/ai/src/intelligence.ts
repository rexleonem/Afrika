type SearchInterpretation = {
  query: string;
  intent: "discover" | "compare" | "plan" | "locate";
  categoryHints: string[];
  locationHint?: string;
  budgetHint?: string;
  geoRadiusKm?: number;
  rankingHint: string;
};

type AIEnrichment = {
  summary: string;
  whyItMatters: string;
  recommendations: string[];
  comparisons: string[];
  trendRelevance: number;
  categoryConfidence: number;
  contextualSignals: string[];
};

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

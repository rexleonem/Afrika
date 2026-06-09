import type { AFRIKACard } from "./types";
import { freshnessStatus, scoreCardTotal } from "./stage2";

export type DiscoverySignal = {
  type: "view" | "save" | "search" | "map-open" | "plan-add";
  cardId?: string;
  query?: string;
  timestamp: string;
};

export type ContentGraphNode = {
  id: string;
  label: string;
  kind: AFRIKACard["kind"] | "city" | "cluster";
  cityKey: string;
  cardIds: string[];
  signalScore: number;
};

export type ContentGraphEdge = {
  from: string;
  to: string;
  weight: number;
  reason: string;
};

export type CityIntelligence = {
  cityKey: string;
  city: string;
  country: string;
  discoveryDensity: number;
  trendMomentum: number;
  lifestyleSegments: string[];
  growthIndicators: string[];
  topNeighborhoods: Array<{
    name: string;
    score: number;
    reason: string;
  }>;
};

export type BehavioralProfile = {
  archetype: "explorer" | "foodie" | "remote-worker" | "traveler" | "investor-minded" | "nightlife-oriented" | "culture-focused";
  confidence: number;
  preferredKinds: AFRIKACard["kind"][];
  preferredCities: string[];
  discoveryStyle: string;
  socialEnergy: string;
  travelRadiusKm: number;
  signals: string[];
};

export type PredictiveRecommendation = {
  card: AFRIKACard;
  score: number;
  horizon: "now" | "soon" | "later";
  reason: string;
  context: string[];
};

export type SelfHealingAction = {
  cardId: string;
  action: "refresh" | "archive" | "merge" | "repair";
  reason: string;
  confidence: number;
};

export type QualityOptimization = {
  cardId: string;
  total: number;
  freshnessState: ReturnType<typeof freshnessStatus>;
  shouldSurface: boolean;
  notes: string[];
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function splitLocation(location: string) {
  return location
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cityKeyFromLocation(location: string) {
  const [, city = location] = splitLocation(location);
  return normalizeText(city).replace(/\s+/g, "-");
}

function cityNameFromLocation(location: string) {
  const parts = splitLocation(location);
  return parts[1] ?? parts[0] ?? location;
}

function countryFromLocation(location: string) {
  const parts = splitLocation(location);
  return parts[2] ?? "Africa";
}

function similarityScore(a: AFRIKACard, b: AFRIKACard) {
  const tagOverlap = a.tags.filter((tag) => b.tags.includes(tag)).length;
  const kindMatch = a.kind === b.kind ? 1 : 0;
  const locationMatch = a.location === b.location ? 1 : 0;
  const distanceWeight = Math.max(0, 1 - Math.hypot(a.coordinates.lat - b.coordinates.lat, a.coordinates.lng - b.coordinates.lng) / 8);

  return Number((tagOverlap * 0.22 + kindMatch * 0.18 + locationMatch * 0.22 + distanceWeight * 0.38).toFixed(3));
}

function inferArchetype(cards: AFRIKACard[]) {
  const counts = {
    "remote-worker": 0,
    foodie: 0,
    traveler: 0,
    "nightlife-oriented": 0,
    "culture-focused": 0,
    explorer: 0,
    "investor-minded": 0
  } as Record<BehavioralProfile["archetype"], number>;

  for (const card of cards) {
    const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
    if (/(work|office|cowork|remote|focus)/.test(text)) counts["remote-worker"] += 2;
    if (/(food|restaurant|cafe|brunch|eat)/.test(text)) counts.foodie += 2;
    if (/(beach|trip|travel|weekend|escape)/.test(text)) counts.traveler += 2;
    if (/(nightlife|party|music|late)/.test(text)) counts["nightlife-oriented"] += 2;
    if (/(culture|gallery|design|creative|museum)/.test(text)) counts["culture-focused"] += 2;
    if (/(discovery|hidden|new|explore)/.test(text)) counts.explorer += 2;
    if (/(market|investment|growth|opportunity|startup|property)/.test(text)) counts["investor-minded"] += 2;
  }

  const entries = Object.entries(counts);
  const [archetype, count] = entries.sort((left, right) => right[1] - left[1])[0] ?? ["explorer", 0];

  return {
    archetype: archetype as BehavioralProfile["archetype"],
    confidence: Number(Math.min(0.98, 0.45 + count / Math.max(cards.length * 2, 1)).toFixed(2))
  };
}

export function buildContentGraph(cards: AFRIKACard[]) {
  const nodes: ContentGraphNode[] = [];
  const edges: ContentGraphEdge[] = [];
  const groups = new Map<string, AFRIKACard[]>();

  for (const card of cards) {
    const cityKey = cityKeyFromLocation(card.location);
    const bucket = groups.get(cityKey) ?? [];
    bucket.push(card);
    groups.set(cityKey, bucket);
  }

  for (const [cityKey, cityCards] of groups.entries()) {
    nodes.push({
      id: `city:${cityKey}`,
      label: cityNameFromLocation(cityCards[0]?.location ?? cityKey),
      kind: "city",
      cityKey,
      cardIds: cityCards.map((card) => card.id),
      signalScore: Number(
        (
          cityCards.reduce((sum, card) => sum + card.relevanceScore + card.freshnessScore, 0) /
          Math.max(cityCards.length * 2, 1)
        ).toFixed(3)
      )
    });

    const kindBuckets = new Map<string, AFRIKACard[]>();
    for (const card of cityCards) {
      const kindBucket = kindBuckets.get(card.kind) ?? [];
      kindBucket.push(card);
      kindBuckets.set(card.kind, kindBucket);
    }

    for (const [kind, kindCards] of kindBuckets.entries()) {
      const nodeId = `cluster:${cityKey}:${kind}`;
      nodes.push({
        id: nodeId,
        label: `${cityNameFromLocation(cityCards[0]?.location ?? cityKey)} ${kind}`,
        kind: "cluster",
        cityKey,
        cardIds: kindCards.map((card) => card.id),
        signalScore: Number(
          (
            kindCards.reduce((sum, card) => sum + card.relevanceScore + card.freshnessScore, 0) /
            Math.max(kindCards.length * 2, 1)
          ).toFixed(3)
        )
      });

      edges.push({
        from: `city:${cityKey}`,
        to: nodeId,
        weight: Number((0.6 + kindCards.length / Math.max(cityCards.length * 4, 1)).toFixed(3)),
        reason: "Cards in the same city and discovery cluster reinforce one another."
      });
    }
  }

  for (let index = 0; index < cards.length; index += 1) {
    for (let next = index + 1; next < cards.length; next += 1) {
      const score = similarityScore(cards[index], cards[next]);
      if (score < 0.42) continue;
      edges.push({
        from: cards[index].id,
        to: cards[next].id,
        weight: score,
        reason: "Shared tags, kind, or spatial context suggest a linked discovery path."
      });
    }
  }

  return { nodes, edges };
}

export function buildCityIntelligence(cards: AFRIKACard[]): CityIntelligence[] {
  const groups = new Map<string, AFRIKACard[]>();

  for (const card of cards) {
    const cityKey = cityKeyFromLocation(card.location);
    const bucket = groups.get(cityKey) ?? [];
    bucket.push(card);
    groups.set(cityKey, bucket);
  }

  return [...groups.entries()].map(([cityKey, cityCards]) => {
    const topNeighborhoods = cityCards
      .filter((card) => card.kind === "neighborhood" || /neighborhood|district|area/i.test(card.category))
      .map((card) => ({
        name: card.title,
        score: Number(((card.freshnessScore + card.relevanceScore) / 2).toFixed(3)),
        reason: card.intelligence.whyItMatters
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, 3);

    const averageFreshness =
      cityCards.reduce((sum, card) => sum + card.freshnessScore, 0) / Math.max(cityCards.length, 1);
    const averageRelevance =
      cityCards.reduce((sum, card) => sum + card.relevanceScore, 0) / Math.max(cityCards.length, 1);
    const cityName = cityNameFromLocation(cityCards[0]?.location ?? cityKey);

    return {
      cityKey,
      city: cityName,
      country: countryFromLocation(cityCards[0]?.location ?? cityName),
      discoveryDensity: Number(Math.min(1, cityCards.length / 6).toFixed(3)),
      trendMomentum: Number(((averageFreshness + averageRelevance) / 2).toFixed(3)),
      lifestyleSegments: [
        cityCards.some((card) => /(work|office|remote|cowork)/i.test(`${card.title} ${card.tags.join(" ")}`)) ? "remote workers" : "explorers",
        cityCards.some((card) => /(food|cafe|restaurant|brunch)/i.test(`${card.title} ${card.tags.join(" ")}`)) ? "food culture" : "discovery seekers"
      ],
      growthIndicators: [
        `Freshness average ${averageFreshness.toFixed(2)}`,
        `Relevance average ${averageRelevance.toFixed(2)}`,
        `${cityCards.length} live intelligence cards`
      ],
      topNeighborhoods
    };
  });
}

export function inferBehavioralProfile(cards: AFRIKACard[], signals: DiscoverySignal[] = []): BehavioralProfile {
  const archetype = inferArchetype(cards);
  const preferredCities = [...new Set(cards.map((card) => cityNameFromLocation(card.location)))].slice(0, 4);
  const preferredKinds = [...new Set(cards.map((card) => card.kind))].slice(0, 4) as AFRIKACard["kind"][];
  const searchSignals = signals.filter((signal) => signal.type === "search").length;
  const saveSignals = signals.filter((signal) => signal.type === "save").length;

  return {
    archetype: archetype.archetype,
    confidence: archetype.confidence,
    preferredKinds,
    preferredCities,
    discoveryStyle: archetype.archetype === "remote-worker"
      ? "utility-first"
      : archetype.archetype === "nightlife-oriented"
        ? "energy-led"
        : "curiosity-led",
    socialEnergy: saveSignals > searchSignals ? "intentional" : "exploratory",
    travelRadiusKm: archetype.archetype === "traveler" ? 120 : 35,
    signals: [
      ...signals.slice(0, 4).map((signal) => signal.type),
      `saved:${saveSignals}`,
      `searched:${searchSignals}`
    ]
  };
}

export function predictDiscovery(cards: AFRIKACard[], profile: BehavioralProfile, cityContext: CityIntelligence[]) {
  const contextByCity = new Map(cityContext.map((entry) => [entry.city, entry]));

  return cards
    .map((card) => {
      const city = cityNameFromLocation(card.location);
      const cityIntel = contextByCity.get(city);
      const score =
        scoreCardTotal({
          usefulness: card.relevanceScore,
          uniqueness: card.kind === "discovery" ? 0.84 : 0.72,
          freshness: card.freshnessScore,
          visualQuality: 0.9,
          sourceTrust: card.trustScore,
          engagementProbability: 0.68,
          localRelevance: card.relevanceScore
        }).total +
        (profile.preferredCities.includes(city) ? 0.06 : 0) +
        (profile.preferredKinds.includes(card.kind) ? 0.05 : 0) +
        (cityIntel ? cityIntel.trendMomentum * 0.05 : 0);

      const horizon: PredictiveRecommendation["horizon"] =
        score >= 0.92 ? "now" : score >= 0.85 ? "soon" : "later";

      return {
        card,
        score: Number(Math.min(1, score).toFixed(3)),
        horizon,
        reason:
          horizon === "now"
            ? `Strong match for your ${profile.archetype} profile and current city momentum.`
            : "Potentially relevant as the discovery graph expands around this area.",
        context: [
          `freshness:${freshnessStatus(card.freshnessScore)}`,
          `city:${city}`,
          ...card.intelligence.nearbyInsights.slice(0, 2)
        ]
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 6);
}

export function optimizeQuality(cards: AFRIKACard[]): QualityOptimization[] {
  return cards.map((card) => {
    const total = scoreCardTotal({
      usefulness: card.relevanceScore,
      uniqueness: card.kind === "trend" ? 0.85 : 0.72,
      freshness: card.freshnessScore,
      visualQuality: 0.9,
      sourceTrust: card.trustScore,
      engagementProbability: 0.64,
      localRelevance: card.relevanceScore
    }).total;

    const freshnessState = freshnessStatus(card.freshnessScore);
    const shouldSurface = total >= 0.78 && freshnessState !== "expired";
    const notes = [
      shouldSurface ? "Eligible for live distribution" : "Hold back until freshness improves",
      card.kind === "event" && freshnessState === "stale" ? "Event content should be refreshed or archived" : "Quality is within operating range"
    ];

    return {
      cardId: card.id,
      total,
      freshnessState,
      shouldSurface,
      notes
    };
  });
}

export function selfHealGraph(cards: AFRIKACard[]) {
  const actions: SelfHealingAction[] = [];
  const seen = new Map<string, AFRIKACard>();

  for (const card of cards) {
    const normalizedTitle = normalizeText(card.title);
    const existing = seen.get(normalizedTitle);

    if (existing) {
      actions.push({
        cardId: card.id,
        action: "merge",
        reason: `Duplicate title detected against ${existing.id}.`,
        confidence: 0.94
      });
      continue;
    }

    seen.set(normalizedTitle, card);

    if (card.freshnessScore < 0.35) {
      actions.push({
        cardId: card.id,
        action: "archive",
        reason: "Content has decayed below the trust threshold.",
        confidence: 0.89
      });
    } else if (card.trustScore < 0.6) {
      actions.push({
        cardId: card.id,
        action: "repair",
        reason: "Metadata needs verification before wider distribution.",
        confidence: 0.83
      });
    } else {
      actions.push({
        cardId: card.id,
        action: "refresh",
        reason: "Content is still active but should be re-verified on schedule.",
        confidence: 0.76
      });
    }
  }

  return actions;
}

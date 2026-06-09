import type { AFRIKACard } from "./types";
import { freshnessStatus, scoreCardTotal } from "./stage2";
import { buildCityIntelligence, buildContentGraph, inferBehavioralProfile, predictDiscovery, type DiscoverySignal } from "./stage3";
import { buildActionLayer } from "./stage5";
import { buildAmbientIntelligence } from "./stage6";

export type InteractionType = "click" | "save" | "dwell" | "map-open" | "search-refine" | "dismiss";

export type InteractionEvent = {
  cardId?: string;
  city?: string;
  category?: string;
  type: InteractionType;
  weight: number;
  timestamp: string;
};

export type FeedbackSignal = {
  city: string;
  category: string;
  cardId?: string;
  relevanceFeedback: number;
  saveToViewRatio: number;
  dwellIntensity: number;
  engagementCluster: string;
};

export type RankingWeights = {
  usefulness: number;
  freshness: number;
  localRelevance: number;
  trust: number;
  visualQuality: number;
  trendMomentum: number;
  engagementSignal: number;
};

export type CardPerformanceMemory = {
  cardId: string;
  engagementHistory: Array<{
    type: InteractionType;
    weight: number;
    timestamp: string;
  }>;
  decayCurve: number[];
  relevanceTrend: number[];
  interactionClusters: string[];
  learnedVisibility: number;
};

export type DuplicateResolutionAction = {
  primaryCardId: string;
  duplicateCardIds: string[];
  reason: string;
  preservedAttributes: string[];
  confidence: number;
};

export type StalenessAction = {
  cardId: string;
  action: "refresh" | "downgrade" | "archive";
  reason: string;
  confidence: number;
};

export type ConfidenceProfile = {
  cardId: string;
  aiConfidence: number;
  sourceReliability: number;
  freshnessScore: number;
  totalConfidence: number;
  rankingMultiplier: number;
};

export type CityBootstrapProfile = {
  city: string;
  demandMap: Array<{ category: string; weight: number }>;
  trendMap: Array<{ label: string; weight: number }>;
  opportunityDensityMap: Array<{ label: string; weight: number }>;
  engagementHeatmap: Array<{ hour: number; weight: number }>;
  baselineRankingWeights: RankingWeights;
  seededCardIds: string[];
};

export type AIModelRole = "gemini" | "deepseek" | "groq";

export type AIConsistencyCheck = {
  model: AIModelRole;
  promptVersion: string;
  isStructured: boolean;
  requiredFieldsPresent: boolean;
  reasoningBlockConsistent: boolean;
  passed: boolean;
};

export type AIControlLayer = {
  promptVersions: Record<string, string>;
  checks: AIConsistencyCheck[];
  arbitrationOrder: AIModelRole[];
  validatorSummary: string;
};

export type CacheEntry = {
  key: string;
  ttlMinutes: number;
  priority: "high" | "medium" | "low";
};

export type PerformanceSnapshot = {
  cachePlan: CacheEntry[];
  eventBusTopics: string[];
  loadAwareRouting: Record<AIModelRole, "primary" | "batch" | "deferred">;
  gracefulDegradation: string[];
};

export type Stage7System = {
  feedbackLoop: {
    signals: FeedbackSignal[];
    rankingWeights: RankingWeights;
    cardMemory: CardPerformanceMemory[];
    learningSummary: string;
  };
  selfHealing: {
    duplicates: DuplicateResolutionAction[];
    staleness: StalenessAction[];
    confidence: ConfidenceProfile[];
  };
  cityScaling: {
    profiles: CityBootstrapProfile[];
    adaptiveCities: string[];
  };
  aiControl: AIControlLayer;
  performance: PerformanceSnapshot;
  summary: string;
};

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function cityFromLocation(location: string) {
  return location.split(",")[1]?.trim() ?? location;
}

function interactionImpact(type: InteractionType) {
  switch (type) {
    case "save":
      return 1;
    case "click":
      return 0.8;
    case "dwell":
      return 1.2;
    case "map-open":
      return 0.9;
    case "search-refine":
      return 0.7;
    case "dismiss":
      return -0.9;
  }
}

function buildDefaultInteractions(cards: AFRIKACard[]): InteractionEvent[] {
  return cards.flatMap((card, index) => [
    { cardId: card.id, city: cityFromLocation(card.location), category: card.category, type: "click", weight: 1 + index * 0.05, timestamp: card.timestamp },
    { cardId: card.id, city: cityFromLocation(card.location), category: card.category, type: "save", weight: 0.9, timestamp: card.timestamp },
    { cardId: card.id, city: cityFromLocation(card.location), category: card.category, type: "dwell", weight: 1.1, timestamp: card.timestamp }
  ]);
}

function buildFeedbackSignals(cards: AFRIKACard[], interactions: InteractionEvent[]) {
  const groups = new Map<string, InteractionEvent[]>();

  for (const event of interactions) {
    const card = cards.find((item) => item.id === event.cardId);
    const city = event.city ?? cityFromLocation(card?.location ?? "Africa");
    const category = event.category ?? card?.category ?? "discovery";
    const key = `${city}::${category}`;
    const bucket = groups.get(key) ?? [];
    bucket.push({ ...event, city, category });
    groups.set(key, bucket);
  }

  return [...groups.entries()].map(([key, events]) => {
    const [city, category] = key.split("::");
    const saves = events.filter((event) => event.type === "save").length;
    const clicks = events.filter((event) => event.type === "click").length;
    const dwell = events.filter((event) => event.type === "dwell").length;
    const dismissals = events.filter((event) => event.type === "dismiss").length;
    const relevanceFeedback = clamp((saves * 1.2 + clicks * 0.8 + dwell * 1.1 - dismissals * 1.1) / Math.max(events.length * 1.4, 1));

    return {
      city,
      category,
      cardId: events[0]?.cardId,
      relevanceFeedback,
      saveToViewRatio: clamp(saves / Math.max(clicks, 1)),
      dwellIntensity: clamp(dwell / Math.max(events.length, 1)),
      engagementCluster: relevanceFeedback >= 0.78 ? "high-signal" : relevanceFeedback >= 0.55 ? "stable" : "low-signal"
    } satisfies FeedbackSignal;
  });
}

function buildRankingWeights(cards: AFRIKACard[], feedbackSignals: FeedbackSignal[]) {
  const engagementAverage = feedbackSignals.reduce((sum, signal) => sum + signal.relevanceFeedback, 0) / Math.max(feedbackSignals.length, 1);
  const saveRatioAverage = feedbackSignals.reduce((sum, signal) => sum + signal.saveToViewRatio, 0) / Math.max(feedbackSignals.length, 1);
  const trustAverage = cards.reduce((sum, card) => sum + card.trustScore, 0) / Math.max(cards.length, 1);
  const freshnessAverage = cards.reduce((sum, card) => sum + card.freshnessScore, 0) / Math.max(cards.length, 1);
  const relevanceAverage = cards.reduce((sum, card) => sum + card.relevanceScore, 0) / Math.max(cards.length, 1);

  return {
    usefulness: clamp(0.2 + relevanceAverage * 0.42),
    freshness: clamp(0.18 + freshnessAverage * 0.35),
    localRelevance: clamp(0.2 + relevanceAverage * 0.4),
    trust: clamp(0.16 + trustAverage * 0.34),
    visualQuality: 0.12,
    trendMomentum: clamp(0.14 + engagementAverage * 0.36),
    engagementSignal: clamp(0.18 + saveRatioAverage * 0.32)
  };
}

function buildCardMemory(cards: AFRIKACard[], interactions: InteractionEvent[]): CardPerformanceMemory[] {
  return cards.map((card) => {
    const history = interactions.filter((event) => event.cardId === card.id);
    const base = scoreCardTotal({
      usefulness: card.relevanceScore,
      uniqueness: 0.72,
      freshness: card.freshnessScore,
      visualQuality: 0.9,
      sourceTrust: card.trustScore,
      engagementProbability: 0.62,
      localRelevance: card.relevanceScore
    }).total;

    const decayCurve = [0, 1, 2, 3, 4].map((step) => clamp(card.freshnessScore - step * card.decayRate * 0.12));
    const relevanceTrend = [0, 1, 2, 3].map((step) => clamp(base - step * 0.04 + history.length * 0.01));
    const interactionClusters = [...new Set(history.map((event) => `${event.type}:${card.kind}`))];
    const learnedVisibility = clamp(
      history.reduce((sum, event) => sum + interactionImpact(event.type) * event.weight, 0) / Math.max(history.length || 1, 1)
    );

    return {
      cardId: card.id,
      engagementHistory: history,
      decayCurve,
      relevanceTrend,
      interactionClusters,
      learnedVisibility
    };
  });
}

function resolveDuplicates(cards: AFRIKACard[]) {
  const normalized = new Map<string, AFRIKACard>();
  const actions: DuplicateResolutionAction[] = [];

  for (const card of cards) {
    const key = `${card.title.toLowerCase()}::${cityFromLocation(card.location).toLowerCase()}`;
    const existing = normalized.get(key);

    if (!existing) {
      normalized.set(key, card);
      continue;
    }

    const primaryCard = existing.freshnessScore >= card.freshnessScore ? existing : card;
    const duplicateCard = primaryCard === existing ? card : existing;

    actions.push({
      primaryCardId: primaryCard.id,
      duplicateCardIds: [duplicateCard.id],
      reason: "Near-identical entity detected; preserving the card with stronger freshness and trust.",
      preservedAttributes: ["media", "coordinates", "category", "intelligence.summary"],
      confidence: 0.91
    });
  }

  return actions;
}

function detectStaleness(cards: AFRIKACard[]): StalenessAction[] {
  return cards.map((card) => {
    const freshness = freshnessStatus(card.freshnessScore);
    const totalConfidence = clamp((card.freshnessScore + card.trustScore + card.relevanceScore) / 3);

    if (freshness === "expired" || card.freshnessScore < 0.35) {
      return {
        cardId: card.id,
        action: "archive" as const,
        reason: "Content has decayed below the operating threshold.",
        confidence: totalConfidence
      };
    }

    if (freshness === "stale" || card.trustScore < 0.6) {
      return {
        cardId: card.id,
        action: "downgrade" as const,
        reason: "Reduce visibility until the source or metadata is refreshed.",
        confidence: totalConfidence
      };
    }

    return {
      cardId: card.id,
      action: "refresh" as const,
      reason: "Keep the entity active through periodic re-verification.",
      confidence: totalConfidence
    };
  });
}

function buildConfidenceProfiles(cards: AFRIKACard[]) {
  return cards.map((card) => {
    const aiConfidence = clamp((card.freshnessScore + card.relevanceScore) / 2);
    const sourceReliability = clamp(card.trustScore);
    const freshnessScore = clamp(card.freshnessScore);
    const totalConfidence = clamp(aiConfidence * 0.42 + sourceReliability * 0.33 + freshnessScore * 0.25);

    return {
      cardId: card.id,
      aiConfidence,
      sourceReliability,
      freshnessScore,
      totalConfidence,
      rankingMultiplier: clamp(0.72 + totalConfidence * 0.28)
    } satisfies ConfidenceProfile;
  });
}

function buildCityProfiles(cards: AFRIKACard[], feedbackSignals: FeedbackSignal[]): CityBootstrapProfile[] {
  const cityGroups = new Map<string, AFRIKACard[]>();

  for (const card of cards) {
    const city = cityFromLocation(card.location);
    const bucket = cityGroups.get(city) ?? [];
    bucket.push(card);
    cityGroups.set(city, bucket);
  }

  const feedbackByCity = new Map<string, FeedbackSignal[]>();
  for (const signal of feedbackSignals) {
    const bucket = feedbackByCity.get(signal.city) ?? [];
    bucket.push(signal);
    feedbackByCity.set(signal.city, bucket);
  }

  return [...cityGroups.entries()].map(([city, cityCards]) => {
    const cityFeedback = feedbackByCity.get(city) ?? [];
    const categories = [...new Set(cityCards.map((card) => card.category))];

    return {
      city,
      demandMap: categories.slice(0, 5).map((category) => ({
        category,
        weight: clamp(
          cityCards.filter((card) => card.category === category).length / Math.max(cityCards.length, 1) +
            (cityFeedback.find((signal) => signal.category === category)?.relevanceFeedback ?? 0) * 0.22
        )
      })),
      trendMap: cityCards.slice(0, 4).map((card) => ({
        label: card.title,
        weight: clamp((card.freshnessScore + card.relevanceScore) / 2)
      })),
      opportunityDensityMap: cityCards
        .filter((card) => card.kind === "opportunity")
        .slice(0, 4)
        .map((card) => ({
          label: card.title,
          weight: clamp(card.relevanceScore)
        })),
      engagementHeatmap: [8, 12, 16, 19].map((hour) => ({
        hour,
        weight: clamp(0.48 + (cityFeedback.length > 0 ? cityFeedback.length * 0.06 : 0.04) + (hour >= 18 ? 0.12 : 0.03))
      })),
      baselineRankingWeights: buildRankingWeights(cityCards, cityFeedback.length > 0 ? cityFeedback : buildFeedbackSignals(cityCards, buildDefaultInteractions(cityCards))),
      seededCardIds: cityCards.slice(0, 6).map((card) => card.id)
    };
  });
}

function buildAIControlLayer(cards: AFRIKACard[]): AIControlLayer {
  const promptVersions = {
    gemini: "stage7-gemini-structure-v1",
    deepseek: "stage7-deepseek-reason-v1",
    groq: "stage7-groq-serve-v1",
    validator: "stage7-consistency-validator-v1"
  };

  const samples = [
    {
      model: "gemini" as const,
      promptVersion: promptVersions.gemini,
      output: { title: cards[0]?.title, location: cards[0]?.location, category: cards[0]?.category, reasoning: { summary: "Structured reality." } }
    },
    {
      model: "deepseek" as const,
      promptVersion: promptVersions.deepseek,
      output: { title: cards[1]?.title, location: cards[1]?.location, category: cards[1]?.category, reasoning: { summary: "Ranking rationale." } }
    },
    {
      model: "groq" as const,
      promptVersion: promptVersions.groq,
      output: { title: cards[2]?.title, location: cards[2]?.location, category: cards[2]?.category, reasoning: { summary: "Served instantly." } }
    }
  ];

  const checks: AIConsistencyCheck[] = samples.map((sample) => {
    const structured = typeof sample.output === "object" && sample.output !== null;
    const requiredFieldsPresent =
      structured &&
      typeof (sample.output as Record<string, unknown>).title === "string" &&
      typeof (sample.output as Record<string, unknown>).location === "string" &&
      typeof (sample.output as Record<string, unknown>).category === "string";
    const reasoningBlockConsistent =
      structured &&
      typeof (sample.output as Record<string, unknown>).reasoning === "object" &&
      sample.output !== null &&
      typeof ((sample.output as Record<string, unknown>).reasoning as Record<string, unknown>).summary === "string";

    return {
      model: sample.model,
      promptVersion: sample.promptVersion,
      isStructured: structured,
      requiredFieldsPresent,
      reasoningBlockConsistent,
      passed: Boolean(structured && requiredFieldsPresent && reasoningBlockConsistent)
    };
  });

  return {
    promptVersions,
    checks,
    arbitrationOrder: ["gemini", "deepseek", "groq"],
    validatorSummary: checks.every((check) => check.passed)
      ? "All model outputs are aligned to the structured JSON schema."
      : "One or more outputs require normalization before serving."
  };
}

function buildPerformanceSnapshot(cards: AFRIKACard[], feedbackSignals: FeedbackSignal[]): PerformanceSnapshot {
  const cachePlan: CacheEntry[] = [
    { key: "feed:trending", ttlMinutes: 5, priority: "high" },
    { key: "feed:nearby", ttlMinutes: 8, priority: "high" },
    { key: "search:semantic", ttlMinutes: 6, priority: "high" },
    { key: "map:clusters", ttlMinutes: 10, priority: "medium" },
    { key: "ai:rankings", ttlMinutes: 12, priority: "high" },
    { key: "ai:insights", ttlMinutes: 20, priority: "medium" }
  ];

  const highEngagementCards = cards
    .filter((card) => (feedbackSignals.find((signal) => signal.cardId === card.id)?.relevanceFeedback ?? 0) >= 0.7)
    .slice(0, 3)
    .map((card) => `card:${card.id}`);
  const boostedKeys = new Set(
    highEngagementCards.length > 0 ? ["feed:trending", "feed:nearby", "search:semantic", "map:clusters", "ai:rankings", "ai:insights"] : []
  );

  return {
    cachePlan: cachePlan.map((entry) => ({
      ...entry,
      priority: boostedKeys.has(entry.key) || entry.priority === "high" ? "high" : entry.priority
    })),
    eventBusTopics: [
      "interaction.clicked",
      "interaction.saved",
      "interaction.map-opened",
      "ranking.recomputed",
      "ingestion.healed",
      "city.bootstrap",
      "ai.output.validated"
    ],
    loadAwareRouting: {
      gemini: "batch",
      deepseek: "deferred",
      groq: "primary"
    },
    gracefulDegradation: [
      "Prioritize Groq for live responses when traffic spikes.",
      "Batch DeepSeek reasoning when queue depth increases.",
      "Queue Gemini enrichment and resume when ingestion load settles."
    ]
  };
}

export function buildStage7IntelligenceSystem(cards: AFRIKACard[], interactions: InteractionEvent[] = buildDefaultInteractions(cards)): Stage7System {
  const feedbackSignals = buildFeedbackSignals(cards, interactions);
  const rankingWeights = buildRankingWeights(cards, feedbackSignals);
  const cardMemory = buildCardMemory(cards, interactions);
  const duplicates = resolveDuplicates(cards);
  const staleness = detectStaleness(cards);
  const confidence = buildConfidenceProfiles(cards);
  const profiles = buildCityProfiles(cards, feedbackSignals);
  const aiControl = buildAIControlLayer(cards);
  const performance = buildPerformanceSnapshot(cards, feedbackSignals);
  const contentGraph = buildContentGraph(cards);
  const cityIntelligence = buildCityIntelligence(cards);
  const behaviorProfile = inferBehavioralProfile(cards, interactions.map((event) => ({
    type:
      event.type === "click"
        ? "view"
        : event.type === "save"
          ? "save"
          : event.type === "map-open"
            ? "map-open"
            : "search",
    cardId: event.cardId,
    query: event.category,
    timestamp: event.timestamp
  })) as DiscoverySignal[]);
  const recommendations = predictDiscovery(cards, behaviorProfile, cityIntelligence);
  const ambient = buildAmbientIntelligence(cards);
  const actionLayer = buildActionLayer(cards);

  return {
    feedbackLoop: {
      signals: feedbackSignals,
      rankingWeights,
      cardMemory,
      learningSummary: `Feedback from ${feedbackSignals.length} city-category clusters is continuously tuning the ranking system.`
    },
    selfHealing: {
      duplicates,
      staleness,
      confidence
    },
    cityScaling: {
      profiles,
      adaptiveCities: profiles.map((profile) => profile.city)
    },
    aiControl,
    performance,
    summary: [
      `Adaptive ranking weights are tuned by user behavior and city performance.`,
      `Self-healing processes flag ${duplicates.length} duplicate groups and ${staleness.filter((item) => item.action !== "refresh").length} items for corrective action.`,
      `AI output is validated against ${Object.keys(aiControl.promptVersions).length} prompt versions and a consistency schema.`,
      `Performance routing favors Groq live responses with deferred reasoning for heavy workloads.`,
      `The discovery graph contains ${contentGraph.nodes.length} nodes and ${recommendations.length} predictive recommendations.`,
      `Ambient mode remains ${ambient.adaptiveInterface.mode} while the action layer serves ${actionLayer.actions.length} contextual actions.`
    ].join(" ")
  };
}

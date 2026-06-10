import type { AFRIKACard } from "./types";
import { buildCityIntelligence, buildContentGraph, inferBehavioralProfile, predictDiscovery } from "./stage3";
import { buildAmbientIntelligence, buildCrossDomainIntelligenceGraph, buildTemporalIntelligence } from "./stage6";
import { buildStage7IntelligenceSystem } from "./stage7";

export type WorldModelSignal = {
  city: string;
  neighborhood: string;
  geography: string[];
  culture: string[];
  behavior: string[];
  economy: string[];
  environment: string[];
  forecast: string[];
};

export type DigitalTwinLayer = {
  city: string;
  currentPulse: number;
  movementDensity: number;
  discoveryDensity: number;
  timingRhythms: string[];
  evolutionNotes: string[];
  futureStates: Array<{
    horizon: "near" | "mid" | "far";
    description: string;
    confidence: number;
  }>;
};

export type ContinentalSimulation = {
  scenario: string;
  region: string;
  outcome: string;
  likelihood: number;
  drivers: string[];
};

export type AutonomousDiscoveryAgent = {
  id: string;
  type: "culture" | "food" | "opportunity" | "tourism";
  focus: string;
  signalCoverage: string[];
  autonomyLevel: number;
  status: "active" | "watching" | "learning";
};

export type MultimodalInsight = {
  cardId: string;
  visualRead: string;
  spatialRead: string;
  behavioralRead: string;
  linguisticRead: string;
  atmosphere: string;
};

export type PredictiveRealityForecast = {
  label: string;
  city: string;
  horizon: "now" | "soon" | "later";
  prediction: string;
  confidence: number;
};

export type CollectiveBehaviorMap = {
  region: string;
  movementFlow: string[];
  trendOrigin: string[];
  socialEnergy: string[];
  culturalSpread: string[];
};

export type Stage8System = {
  worldModel: WorldModelSignal[];
  digitalTwins: DigitalTwinLayer[];
  simulations: ContinentalSimulation[];
  orchestration: {
    agents: AutonomousDiscoveryAgent[];
    coordinationGraph: {
      nodes: number;
      edges: number;
      summary: string;
    };
    eventLoop: string[];
    memoryLayers: string[];
  };
  multimodal: MultimodalInsight[];
  predictiveReality: PredictiveRealityForecast[];
  collectiveBehavior: CollectiveBehaviorMap[];
  selfEvolving: {
    learningLoops: string[];
    memoryLayers: string[];
    optimizationTargets: string[];
    summary: string;
  };
  summary: string;
};

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function cityFromLocation(location: string) {
  return location.split(",")[1]?.trim() ?? location;
}

function neighborhoodFromLocation(location: string) {
  return location.split(",")[0]?.trim() ?? location;
}

function languageFromCard(card: AFRIKACard) {
  const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
  if (/(lagos|nigeria|yaba|lekki|abuja|port harcourt)/.test(text)) return ["English", "Pidgin", "regional slang"];
  if (/(accra|ghana)/.test(text)) return ["English", "Twi", "urban slang"];
  if (/(nairobi|kenya)/.test(text)) return ["English", "Swahili", "urban slang"];
  return ["English", "regional vernacular"];
}

function economySignals(card: AFRIKACard) {
  const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
  const signals = ["opportunity density", "urban acceleration", "creative economy"];
  if (/(property|real estate|rent|housing)/.test(text)) signals.push("property movement");
  if (/(startup|work|remote|cowork|office)/.test(text)) signals.push("workforce flow");
  if (/(tourism|beach|travel|hotel)/.test(text)) signals.push("tourism lift");
  return signals;
}

function cultureSignals(card: AFRIKACard) {
  const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
  const signals = ["social rhythm", "local taste", "movement pattern"];
  if (/(food|cafe|restaurant|brunch)/.test(text)) signals.push("food culture");
  if (/(nightlife|party|music)/.test(text)) signals.push("night energy");
  if (/(gallery|design|creative|art)/.test(text)) signals.push("creative scene");
  return signals;
}

function environmentSignals(card: AFRIKACard) {
  const signals = ["weather", "traffic", "crowd density", "timing rhythm"];
  if (card.freshnessScore < 0.5) signals.push("decay pressure");
  if (card.trustScore > 0.8) signals.push("high confidence");
  return signals;
}

function forecastText(city: string, card: AFRIKACard, horizon: "near" | "mid" | "far") {
  if (horizon === "near") return `${city} may see stronger discovery velocity around ${neighborhoodFromLocation(card.location)}.`;
  if (horizon === "mid") return `${city} could develop a clearer cultural cluster around ${card.category.toLowerCase()}.`;
  return `${city} may evolve into a denser intelligence zone for movement, culture, and opportunities.`;
}

export function buildStage8WorldModel(cards: AFRIKACard[], timestamp = "2026-06-09T19:00:00.000Z"): Stage8System {
  const cityIntelligence = buildCityIntelligence(cards);
  const contentGraph = buildContentGraph(cards);
  const temporal = buildTemporalIntelligence(cards, timestamp);
  const ambient = buildAmbientIntelligence(cards, timestamp);
  const crossDomain = buildCrossDomainIntelligenceGraph(cards, timestamp);
  const stage7 = buildStage7IntelligenceSystem(cards);
  const behavior = inferBehavioralProfile(cards);
  const predictive = predictDiscovery(cards, behavior, cityIntelligence);

  const worldModel: WorldModelSignal[] = cards.map((card, index) => ({
    city: cityFromLocation(card.location),
    neighborhood: neighborhoodFromLocation(card.location),
    geography: [cityFromLocation(card.location), neighborhoodFromLocation(card.location), card.category],
    culture: cultureSignals(card),
    behavior: [behavior.archetype, behavior.discoveryStyle, behavior.socialEnergy],
    economy: economySignals(card),
    environment: environmentSignals(card),
    forecast: [
      forecastText(cityFromLocation(card.location), card, "near"),
      forecastText(cityFromLocation(card.location), card, index % 2 === 0 ? "mid" : "far")
    ]
  }));

  const digitalTwins: DigitalTwinLayer[] = cityIntelligence.map((city, index) => ({
    city: city.city,
    currentPulse: city.trendMomentum,
    movementDensity: city.discoveryDensity,
    discoveryDensity: city.discoveryDensity,
    timingRhythms: temporal.filter((slot) => slot.city === city.city).map((slot) => slot.label),
    evolutionNotes: city.growthIndicators,
    futureStates: [
      {
        horizon: "near",
        description: `${city.city} is likely to stay highly active around its strongest discovery clusters.`,
        confidence: clamp(city.trendMomentum * 0.92)
      },
      {
        horizon: "mid",
        description: `${city.city} may deepen its urban identity as discovery density increases.`,
        confidence: clamp(city.trendMomentum * 0.84)
      },
      {
        horizon: "far",
        description: `${city.city} could become a sustained cultural and movement node across the continent.`,
        confidence: clamp(0.55 + city.discoveryDensity * 0.2 + index * 0.02)
      }
    ]
  }));

  const simulations: ContinentalSimulation[] = cityIntelligence.map((city) => ({
    scenario: `Simulation for ${city.city}`,
    region: city.country,
    outcome: `${city.city} may see increased tourism, cultural clustering, and neighborhood differentiation.`,
    likelihood: clamp((city.trendMomentum + city.discoveryDensity) / 2),
    drivers: [
      `trend momentum ${city.trendMomentum.toFixed(2)}`,
      `discovery density ${city.discoveryDensity.toFixed(2)}`,
      `${city.topNeighborhoods.length} active neighborhood signals`
    ]
  }));

  const agents: AutonomousDiscoveryAgent[] = [
    {
      id: "agent-culture",
      type: "culture",
      focus: "Emerging cultural movements and creative hubs",
      signalCoverage: ["art", "music", "architecture", "community rhythm"],
      autonomyLevel: 0.88,
      status: "active"
    },
    {
      id: "agent-food",
      type: "food",
      focus: "Food culture, local taste, and affordability signals",
      signalCoverage: ["cafes", "restaurants", "local dishes", "street food"],
      autonomyLevel: 0.84,
      status: "active"
    },
    {
      id: "agent-opportunity",
      type: "opportunity",
      focus: "Jobs, grants, startup ecosystems, and innovation zones",
      signalCoverage: ["jobs", "grants", "accelerators", "ecosystems"],
      autonomyLevel: 0.82,
      status: "learning"
    },
    {
      id: "agent-tourism",
      type: "tourism",
      focus: "Hidden destinations and seasonal travel movement",
      signalCoverage: ["tourism", "routes", "seasons", "movement"],
      autonomyLevel: 0.86,
      status: "watching"
    }
  ];

  const multimodal: MultimodalInsight[] = cards.map((card) => ({
    cardId: card.id,
    visualRead: card.media.imageUrl.includes("unsplash") ? "high-clarity visual signal" : "structured media signal",
    spatialRead: `${cityFromLocation(card.location)} / ${neighborhoodFromLocation(card.location)}`,
    behavioralRead: `${behavior.archetype} relevance with ${card.kind} affinity`,
    linguisticRead: `${card.category} matches local discovery language`,
    atmosphere:
      card.kind === "event"
        ? "high-energy and time-sensitive"
        : /(food|cafe|restaurant)/i.test(card.category)
          ? "warm and social"
          : "calm and exploratory"
  }));

  const predictiveReality: PredictiveRealityForecast[] = predictive.slice(0, 6).map((item, index) => ({
    label: `Forecast ${index + 1}`,
    city: cityFromLocation(item.card.location),
    horizon: item.horizon,
    prediction:
      item.horizon === "now"
        ? `${item.card.title} may accelerate immediately in ${cityFromLocation(item.card.location)}.`
        : item.reason,
    confidence: item.score
  }));

  const collectiveBehavior: CollectiveBehaviorMap[] = cityIntelligence.map((city) => ({
    region: city.country,
    movementFlow: [
      `${city.city} movement concentrates around ${city.topNeighborhoods[0]?.name ?? "primary clusters"}`,
      `${city.city} discovery flow expands with trend momentum ${city.trendMomentum.toFixed(2)}`
    ],
    trendOrigin: city.growthIndicators,
    socialEnergy: [
      `community activity in ${city.city}`,
      `creative acceleration in ${city.city}`,
      `temporal peaks align with local routines`
    ],
    culturalSpread: [
      `${city.city} spreads food and culture signals through nearby districts`,
      `${city.city} contributes to regional movement patterns`
    ]
  }));

  const summary = [
    `World model span: ${worldModel.length} city-neighborhood signals across the current graph.`,
    `Digital twins track ${digitalTwins.length} cities with movement and timing rhythms.`,
    `Simulation layer forecasts urban, cultural, and tourism shifts across ${simulations.length} regions.`,
    `Autonomous agents coordinate culture, food, opportunity, and tourism discovery.`,
    `Multimodal understanding links visual, spatial, behavioral, and linguistic context.`,
    `Self-evolving memory sits on top of the Stage 7 feedback loop, content graph, and ambient signals.`
  ].join(" ");

  return {
    worldModel,
    digitalTwins,
    simulations,
    orchestration: {
      agents,
      coordinationGraph: {
        nodes: contentGraph.nodes.length + crossDomain.nodes.length,
        edges: contentGraph.edges.length + crossDomain.edges.length,
        summary: `Shared reasoning spans content graph, cross-domain graph, and ambient timing signals for ${cards.length} cards.`
      },
      eventLoop: [
        "ingestion.agent.detected",
        "world.model.updated",
        "simulation.recomputed",
        "agent.coordinated",
        "prediction.served"
      ],
      memoryLayers: [
        "city memory",
        "neighborhood evolution memory",
        "cultural memory",
        "movement history",
        "simulation memory"
      ]
    },
    multimodal,
    predictiveReality,
    collectiveBehavior,
    selfEvolving: {
      learningLoops: [
        "feedback loop updates ranking and city signals",
        "digital twins adapt to city rhythm changes",
        "simulation outputs refine forecasts",
        "agent network updates focus from new signals"
      ],
      memoryLayers: [
        "long-term city memory",
        "cross-domain memory",
        "behavioral memory",
        "world model embeddings"
      ],
      optimizationTargets: [
        "recommendation quality",
        "simulation accuracy",
        "multimodal coherence",
        "agent coordination stability"
      ],
      summary: `The ecosystem learns continuously from ${stage7.feedbackLoop.signals.length} engagement signals and the current ambient context.`
    },
    summary
  };
}

import type { AFRIKACard } from "./types";
import { buildCityIntelligence, buildContentGraph, inferBehavioralProfile, predictDiscovery } from "./stage3";
import { buildAmbientIntelligence, buildTemporalIntelligence } from "./stage6";
import { buildStage8WorldModel } from "./stage8";

export type CivilizationalMemoryEntry = {
  city: string;
  neighborhood: string;
  memoryType: string;
  narrative: string;
  preservedValue: string;
  timeSpan: string;
  continuityScore: number;
};

export type HistoricalIntelligenceNode = {
  id: string;
  label: string;
  kind: "city" | "memory" | "movement" | "culture" | "architecture" | "language" | "migration";
  period: string;
  intensity: number;
};

export type HistoricalIntelligenceEdge = {
  from: string;
  to: string;
  weight: number;
  reason: string;
};

export type ForecastSignal = {
  label: string;
  city: string;
  horizon: "now" | "soon" | "later";
  prediction: string;
  confidence: number;
  drivers: string[];
};

export type PreservationSignal = {
  id: string;
  target: string;
  summary: string;
  preserveAs: string;
  urgency: "low" | "medium" | "high";
};

export type GenerationalSignal = {
  generation: "youth" | "millennial" | "gen-x" | "intergenerational";
  behaviors: string[];
  shifts: string[];
  futureIntent: string[];
};

export type CollectiveCognitionSignal = {
  region: string;
  pulse: number;
  memoryThreads: string[];
  energy: string[];
  forecast: string[];
};

export type RealitySynthesisSignal = {
  dimension: string;
  insight: string;
  systemicRelationship: string;
};

export type KnowledgeEvolutionSignal = {
  loop: string;
  update: string;
  impact: string;
  confidence: number;
};

export type GlobalAfricanNetworkSignal = {
  region: string;
  diasporaNodes: string[];
  culturalDiffusion: string[];
  influence: string[];
  memoryLinks: string[];
};

export type ContinuitySystem = {
  timelineLayers: string[];
  archivePaths: string[];
  comparisonViews: string[];
  intergenerationalLinks: string[];
  summary: string;
};

export type Stage9System = {
  civilizationalMemory: CivilizationalMemoryEntry[];
  historicalGraph: {
    nodes: HistoricalIntelligenceNode[];
    edges: HistoricalIntelligenceEdge[];
    summary: string;
  };
  futureForecasts: ForecastSignal[];
  preservationAI: PreservationSignal[];
  generationalIntelligence: GenerationalSignal[];
  collectiveCognition: CollectiveCognitionSignal[];
  realitySynthesis: RealitySynthesisSignal[];
  knowledgeEvolution: KnowledgeEvolutionSignal[];
  globalAfricanNetwork: GlobalAfricanNetworkSignal[];
  continuity: ContinuitySystem;
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

function regionFromCity(city: string) {
  const normalized = city.toLowerCase();
  if (/(lagos|accra|abuja|yaba|lekki|port harcourt|ghana|nigeria)/.test(normalized)) return "West Africa";
  if (/(nairobi|mombasa|kenya|kampala|dar es salaam)/.test(normalized)) return "East Africa";
  if (/(cape town|johannesburg|pretoria|south africa)/.test(normalized)) return "Southern Africa";
  if (/(cairo|alexandria|north africa|egypt|casablanca|marrakech)/.test(normalized)) return "North Africa";
  return "Pan-African";
}

function cityNarrative(card: AFRIKACard) {
  const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
  if (/(tech|startup|work|remote|office|cowork)/.test(text)) return "A city memory shaped by work, movement, and urban acceleration.";
  if (/(food|cafe|restaurant|brunch|eat)/.test(text)) return "A cultural memory carried through food, gathering, and local taste.";
  if (/(nightlife|party|music|late)/.test(text)) return "A nightlife memory that captures social energy over time.";
  if (/(culture|gallery|design|art|architecture)/.test(text)) return "A cultural memory rooted in creative identity and place.";
  return "A living neighborhood memory that continues to evolve with the city.";
}

function preserveAs(card: AFRIKACard) {
  const text = `${card.title} ${card.category}`.toLowerCase();
  if (/(language|oral|story|history)/.test(text)) return "oral archive";
  if (/(architecture|building|space|district)/.test(text)) return "spatial archive";
  if (/(food|recipe|cuisine|meal)/.test(text)) return "culinary archive";
  if (/(music|dance|festival|nightlife)/.test(text)) return "cultural performance archive";
  return "living memory record";
}

export function buildStage9CivilizationalIntelligenceSystem(
  cards: AFRIKACard[],
  timestamp = "2026-06-09T19:00:00.000Z"
): Stage9System {
  const cityIntelligence = buildCityIntelligence(cards);
  const contentGraph = buildContentGraph(cards);
  const ambient = buildAmbientIntelligence(cards, timestamp);
  const temporal = buildTemporalIntelligence(cards, timestamp);
  const worldModel = buildStage8WorldModel(cards, timestamp);
  const behavioralProfile = inferBehavioralProfile(cards);
  const predictive = predictDiscovery(cards, behavioralProfile, cityIntelligence);

  const civilizationalMemory: CivilizationalMemoryEntry[] = cards.map((card, index) => ({
    city: cityFromLocation(card.location),
    neighborhood: neighborhoodFromLocation(card.location),
    memoryType: card.kind,
    narrative: cityNarrative(card),
    preservedValue: card.intelligence.whyItMatters,
    timeSpan: new Date(card.timestamp).toLocaleDateString("en-GB"),
    continuityScore: clamp((card.freshnessScore + card.trustScore + card.relevanceScore) / 3 + index * 0.01)
  }));

  const cityNodes: HistoricalIntelligenceNode[] = cityIntelligence.map((city) => ({
      id: `city:${city.cityKey}`,
      label: city.city,
      kind: "city" as const,
      period: "present",
      intensity: clamp(city.trendMomentum)
    }));

  const memoryNodes: HistoricalIntelligenceNode[] = civilizationalMemory.slice(0, 8).map((entry, index) => ({
      id: `memory:${entry.city}:${index}`,
      label: entry.neighborhood,
      kind: index % 3 === 0 ? "culture" : index % 3 === 1 ? "movement" : "memory",
      period: entry.timeSpan,
      intensity: entry.continuityScore
    }));

  const twinNodes: HistoricalIntelligenceNode[] = worldModel.digitalTwins.slice(0, 4).map((twin, index) => ({
      id: `twin:${twin.city}:${index}`,
      label: twin.city,
      kind: "movement" as const,
      period: "forecast",
      intensity: twin.currentPulse
    }));

  const historicalNodes: HistoricalIntelligenceNode[] = [...cityNodes, ...memoryNodes, ...twinNodes];

  const historicalEdges: HistoricalIntelligenceEdge[] = contentGraph.edges.slice(0, 14).map((edge) => ({
    from: edge.from,
    to: edge.to,
    weight: edge.weight,
    reason: "Historical context links discovery, movement, and place over time."
  }));

  const futureForecasts: ForecastSignal[] = predictive.slice(0, 6).map((item, index) => ({
    label: `Forecast ${index + 1}`,
    city: cityFromLocation(item.card.location),
    horizon: item.horizon,
    prediction:
      item.horizon === "now"
        ? `${item.card.title} is accelerating now in ${cityFromLocation(item.card.location)}.`
        : item.horizon === "soon"
          ? `This city may gain stronger cultural density around ${item.card.category.toLowerCase()}.`
          : `Long-term evolution suggests a deeper movement cluster in ${cityFromLocation(item.card.location)}.`,
    confidence: item.score,
    drivers: [
      `freshness:${item.card.freshnessScore.toFixed(2)}`,
      `relevance:${item.card.relevanceScore.toFixed(2)}`,
      `memory:${item.context[0] ?? "active"}`,
      `ambient:${ambient.adaptiveInterface.mode}`
    ]
  }));

  const preservationAI: PreservationSignal[] = civilizationalMemory.slice(0, 8).map((entry, index) => ({
    id: `preserve:${entry.city}:${index}`,
    target: entry.narrative,
    summary: `Preserve ${entry.neighborhood} as a living memory of ${entry.city}.`,
    preserveAs: preserveAs(cards[index] ?? cards[0]!),
    urgency: entry.continuityScore > 0.84 ? "high" : entry.continuityScore > 0.7 ? "medium" : "low"
  }));

  const generationalIntelligence: GenerationalSignal[] = [
    {
      generation: "youth",
      behaviors: ["digital-first discovery", "creative mobility", "social timing"],
      shifts: ["city movement is increasingly intention-led", "visual discovery drives exploration"],
      futureIntent: ["calm city routes", "culture-rich neighborhoods", "opportunity seeking"]
    },
    {
      generation: "millennial",
      behaviors: ["planning", "remote work", "quality-led choices"],
      shifts: ["utility and culture now blend in city selection", "daytime discovery remains strong"],
      futureIntent: ["balanced neighborhoods", "work-friendly districts", "weekend planning"]
    },
    {
      generation: "gen-x",
      behaviors: ["stability", "trust", "practical routing"],
      shifts: ["family and reliability signals matter more over time", "timing and access influence choice"],
      futureIntent: ["safer routes", "clearer planning", "trusted destinations"]
    },
    {
      generation: "intergenerational",
      behaviors: ["shared discovery", "memory preservation", "cultural continuity"],
      shifts: ["cities are interpreted across generations", "cultural memory shapes movement"],
      futureIntent: ["legacy mapping", "historical comparisons", "continuity systems"]
    }
  ];

  const collectiveCognition: CollectiveCognitionSignal[] = cityIntelligence.map((city) => ({
    region: city.country,
    pulse: clamp((city.trendMomentum + city.discoveryDensity) / 2),
    memoryThreads: city.growthIndicators,
    energy: [
      `${city.city} carries discovery energy across neighborhoods.`,
      `${city.city} reflects the emotional rhythm of daily movement.`
    ],
    forecast: [
      `${city.city} may deepen its cultural identity over time.`,
      `${city.city} may become a stronger anchor for collective discovery.`
    ]
  }));

  const realitySynthesis: RealitySynthesisSignal[] = [
    {
      dimension: "history",
      insight: "Historical memory and current discovery are linked through place evolution.",
      systemicRelationship: "Past shifts shape present city pulse and future forecasts."
    },
    {
      dimension: "culture",
      insight: "Culture spreads through food, nightlife, language, and creative movement.",
      systemicRelationship: "Cultural energy determines how neighborhoods become meaningful."
    },
    {
      dimension: "movement",
      insight: "Movement corridors reveal how people actually experience cities.",
      systemicRelationship: "Discovery patterns and timing signals shape flow."
    },
    {
      dimension: "opportunity",
      insight: "Opportunity density tends to align with growth, mobility, and trust.",
      systemicRelationship: "Economic shifts influence how Africa reorganizes around place."
    }
  ];

  const knowledgeEvolution: KnowledgeEvolutionSignal[] = [
    {
      loop: "contributor intelligence",
      update: "Human narratives refine memory and continuity.",
      impact: "Preserves lived nuance that AI alone misses.",
      confidence: 0.88
    },
    {
      loop: "movement learning",
      update: "Route, save, and search behavior update the memory graph.",
      impact: "Improves forecasting of where interest moves next.",
      confidence: 0.91
    },
    {
      loop: "historical synthesis",
      update: "Past city evolution is linked to current cultural signals.",
      impact: "Produces time-aware reasoning and richer comparisons.",
      confidence: 0.84
    },
    {
      loop: "global diffusion",
      update: "Diaspora influence expands the model beyond the continent.",
      impact: "Tracks how African culture travels and returns.",
      confidence: 0.79
    }
  ];

  const globalAfricanNetwork: GlobalAfricanNetworkSignal[] = [
    {
      region: "West Africa",
      diasporaNodes: ["London", "Paris", "New York", "Toronto"],
      culturalDiffusion: ["Afrobeats", "food culture", "creative fashion"],
      influence: ["music exports", "diaspora entrepreneurship", "urban style"],
      memoryLinks: ["Lagos", "Accra", "Abidjan", "Dakar", regionFromCity(cityIntelligence[0]?.city ?? "Lagos")]
    },
    {
      region: "East Africa",
      diasporaNodes: ["Dubai", "Doha", "Berlin", "Amsterdam"],
      culturalDiffusion: ["design", "tech culture", "travel experiences"],
      influence: ["innovation corridors", "urban mobility", "regional trade"],
      memoryLinks: ["Nairobi", "Kampala", "Dar es Salaam", regionFromCity(cityIntelligence[1]?.city ?? "Nairobi")]
    },
    {
      region: "Southern Africa",
      diasporaNodes: ["Cape Town", "Johannesburg", "Harare", "Melbourne"],
      culturalDiffusion: ["architecture", "music", "food movement"],
      influence: ["creative economies", "tourism", "urban continuity"],
      memoryLinks: ["Cape Town", "Johannesburg", "Pretoria", regionFromCity(cityIntelligence[2]?.city ?? "Cape Town")]
    }
  ];

  const summary = [
    `Civilizational memory spans ${civilizationalMemory.length} preserved entries across the current graph.`,
    `Historical intelligence nodes and edges link memory, movement, culture, and geography.`,
    `Forecasting combines behavioral signals, ambient timing, and Stage 8 world-model context.`,
    `Preservation AI keeps traditions, architecture, and evolving identity in a living archive.`,
    `Generational intelligence and collective cognition now describe African movement across time.`,
    `The global African network extends the model into diaspora and cross-continental influence.`
  ].join(" ");

  return {
    civilizationalMemory,
    historicalGraph: {
      nodes: historicalNodes,
      edges: historicalEdges,
      summary: `Historical graph contains ${historicalNodes.length} nodes and ${historicalEdges.length} edges tied to city evolution.`
    },
    futureForecasts,
    preservationAI,
    generationalIntelligence,
    collectiveCognition,
    realitySynthesis,
    knowledgeEvolution,
    globalAfricanNetwork,
    continuity: {
      timelineLayers: temporal.slice(0, 4).map((slot) => `${slot.city}: ${slot.label}`),
      archivePaths: civilizationalMemory.slice(0, 4).map((entry) => `${entry.city}/${entry.neighborhood}`),
      comparisonViews: [
        "then vs now city evolution",
        "cultural spread across generations",
        "movement patterns across districts"
      ],
      intergenerationalLinks: [
        "youth culture to city evolution",
        "legacy memory to future forecasts",
        "personal discovery to civilizational continuity"
      ],
      summary: `Continuity systems preserve ${civilizationalMemory.length} memory records and keep the historical graph alive.`
    },
    summary
  };
}

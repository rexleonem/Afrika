import type { AFRIKACard } from "./types";
import { buildCityIntelligence, buildContentGraph, inferBehavioralProfile, predictDiscovery } from "./stage3";
import { buildHumanIntelligenceLayer } from "./stage4";
import { buildActionLayer, type ActionLayer, type ActionType } from "./stage5";

export type EnvironmentalSignal = {
  city: string;
  weather: "clear" | "cloudy" | "rainy" | "humid";
  traffic: "low" | "medium" | "high";
  crowdDensity: "quiet" | "balanced" | "busy";
  neighborhoodEnergy: "calm" | "creative" | "active" | "night";
  score: number;
};

export type TemporalSignal = {
  city: string;
  hour: number;
  label: string;
  activityLevel: number;
  recommendation: string;
};

export type AmbientSuggestion = {
  title: string;
  reason: string;
  action: ActionType;
  city: string;
  subtle: boolean;
};

export type MemoryRecord = {
  city: string;
  neighborhood: string;
  preferredTiming: string;
  culturalAffinity: string[];
  travelBehavior: string[];
  favoritePatterns: string[];
};

export type AdaptiveInterfaceMode = "calm-exploration" | "night-exploration" | "travel-planning" | "opportunity-search";

export type AdaptiveInterfaceState = {
  mode: AdaptiveInterfaceMode;
  tone: string;
  density: "low" | "medium" | "high";
  emphasis: string[];
};

export type CityPulse = {
  city: string;
  hour: number;
  pulse: number;
  acceleration: number;
  bestWindow: string;
};

export type CrossDomainNode = {
  id: string;
  kind: "card" | "human" | "action" | "time" | "environment" | "memory" | "city";
  label: string;
};

export type CrossDomainEdge = {
  from: string;
  to: string;
  weight: number;
  reason: string;
};

export type ContinentalIntelligence = {
  region: string;
  languageNotes: string[];
  culturalRhythms: string[];
  cityPersonality: string[];
};

export type AmbientIntelligence = {
  suggestions: AmbientSuggestion[];
  temporalSignals: TemporalSignal[];
  environmentalSignals: EnvironmentalSignal[];
  cityPulse: CityPulse[];
  adaptiveInterface: AdaptiveInterfaceState;
  memory: MemoryRecord[];
};

export type OrchestrationLayer = {
  ambient: AmbientIntelligence;
  actionLayer: ActionLayer;
  crossDomainGraph: {
    nodes: CrossDomainNode[];
    edges: CrossDomainEdge[];
  };
  continentalIntelligence: ContinentalIntelligence[];
  personalOS: {
    summary: string;
    routines: string[];
    recommendedMode: AdaptiveInterfaceMode;
  };
};

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function hourFromTimestamp(timestamp: string) {
  return new Date(timestamp).getHours();
}

function cityFromLocation(location: string) {
  return location.split(",")[1]?.trim() ?? location;
}

function neighborhoodFromLocation(location: string) {
  return location.split(",")[0]?.trim() ?? location;
}

function weatherToTone(weather: EnvironmentalSignal["weather"]) {
  return weather === "rainy" ? "soft" : weather === "cloudy" ? "balanced" : "clear";
}

function inferWeather(hour: number): EnvironmentalSignal["weather"] {
  if (hour >= 18 || hour <= 5) return "clear";
  if (hour >= 12 && hour <= 16) return "humid";
  return "cloudy";
}

function inferTraffic(hour: number): EnvironmentalSignal["traffic"] {
  if (hour >= 7 && hour <= 9) return "high";
  if (hour >= 17 && hour <= 19) return "high";
  if (hour >= 12 && hour <= 15) return "medium";
  return "low";
}

function inferCrowdDensity(hour: number, actionLayer: ActionLayer): EnvironmentalSignal["crowdDensity"] {
  if (actionLayer.intent.primaryIntent === "nightlife-planning" || hour >= 19) return "busy";
  if (hour >= 11 && hour <= 16) return "balanced";
  return "quiet";
}

function inferNeighborhoodEnergy(card: AFRIKACard, hour: number): EnvironmentalSignal["neighborhoodEnergy"] {
  const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
  if (/(nightlife|party|music|late)/.test(text) || hour >= 20) return "night";
  if (/(work|remote|cowork|office|startup)/.test(text)) return "creative";
  if (/(food|cafe|restaurant|brunch)/.test(text)) return "active";
  return "calm";
}

export function buildTemporalIntelligence(cards: AFRIKACard[], timestamp = "2026-06-09T19:00:00.000Z"): TemporalSignal[] {
  const hour = hourFromTimestamp(timestamp);
  return cards.map((card) => {
    const city = cityFromLocation(card.location);
    const activityLevel = clamp((card.freshnessScore + card.relevanceScore + (hour >= 18 ? 0.08 : 0.02)) / 3);
    return {
      city,
      hour,
      label:
        hour >= 18
          ? "Best explored after sunset"
          : hour >= 8 && hour <= 11
            ? "Quiet weekday mornings"
            : "Balanced daytime activity",
      activityLevel,
      recommendation:
        hour >= 18
          ? "Night-friendly exploration is more suitable now."
          : hour >= 8 && hour <= 11
            ? "Good time for calm, low-friction visits."
            : "Useful for general discovery and planning."
    };
  });
}

export function buildAmbientIntelligence(
  cards: AFRIKACard[],
  timestamp = "2026-06-09T19:00:00.000Z"
): AmbientIntelligence {
  const actionLayer = buildActionLayer(cards);
  const hour = hourFromTimestamp(timestamp);
  const temporalSignals = buildTemporalIntelligence(cards, timestamp);
  const cityIntelligence = buildCityIntelligence(cards);
  const humanLayer = buildHumanIntelligenceLayer(cards);

  const environmentalSignals: EnvironmentalSignal[] = cityIntelligence.map((city, index) => {
    const card = cards[index] ?? cards[0]!;
    const weather = inferWeather(hour);
    const traffic = inferTraffic(hour);
    const crowdDensity = inferCrowdDensity(hour, actionLayer);
    const neighborhoodEnergy = inferNeighborhoodEnergy(card, hour);

    return {
      city: city.city,
      weather,
      traffic,
      crowdDensity,
      neighborhoodEnergy,
      score: clamp((city.trendMomentum + city.discoveryDensity + (traffic === "low" ? 0.08 : 0.02)) / 3)
    };
  });

  const cityPulse: CityPulse[] = cityIntelligence.map((city) => ({
    city: city.city,
    hour,
    pulse: clamp((city.trendMomentum + city.discoveryDensity) / 2),
    acceleration: clamp(city.trendMomentum * 0.86),
    bestWindow:
      hour >= 18
        ? "tonight"
        : hour >= 8 && hour <= 11
          ? "this morning"
          : "later today"
  }));

  const suggestions: AmbientSuggestion[] = cards.slice(0, 4).map((card, index) => ({
    title:
      index === 0
        ? "A calm nearby café fits your current pattern"
        : index === 1
          ? "Traffic is low - ideal time to explore this district"
          : `A ${card.kind} nearby matches your rhythm`,
    reason:
      index === 0
        ? "Aligned with your recent discovery and planning behavior."
        : index === 1
          ? "Conditions and movement flow are favorable right now."
          : `Supported by ${card.location} intelligence and live city momentum.`,
    action:
      index === 0
        ? "navigate"
        : index === 1
          ? "plan-visit"
          : "view-nearby",
    city: cityFromLocation(card.location),
    subtle: true
  }));

  const memory: MemoryRecord[] = humanLayer.cityIntelligence.map((city) => ({
    city: city.city,
    neighborhood: city.topNeighborhoods[0]?.name ?? city.city,
    preferredTiming: city.trendMomentum > 0.84 ? "evenings" : "daytime",
    culturalAffinity: city.lifestyleSegments,
    travelBehavior: ["discovery-led", "calm planning", "route-aware"],
    favoritePatterns: city.growthIndicators
  }));

  const adaptiveInterface: AdaptiveInterfaceState =
    hour >= 19
      ? {
          mode: "night-exploration",
          tone: "low-light and calm",
          density: "low",
          emphasis: ["nightlife", "routes", "timing"]
        }
      : hour >= 9 && hour <= 16
        ? {
            mode: "travel-planning",
            tone: "structured and clear",
            density: "medium",
            emphasis: ["maps", "movement", "timing"]
          }
        : {
            mode: "calm-exploration",
            tone: "quiet and ambient",
            density: "low",
            emphasis: ["discovery", "nearby", "context"]
          };

  return {
    suggestions,
    temporalSignals,
    environmentalSignals,
    cityPulse,
    adaptiveInterface,
    memory
  };
}

export function buildCrossDomainIntelligenceGraph(cards: AFRIKACard[], timestamp = "2026-06-09T19:00:00.000Z") {
  const ambient = buildAmbientIntelligence(cards, timestamp);
  const actionLayer = buildActionLayer(cards);
  const humanLayer = buildHumanIntelligenceLayer(cards);
  const nodes: CrossDomainNode[] = [];
  const edges: CrossDomainEdge[] = [];

  for (const card of cards) {
    nodes.push({ id: `card:${card.id}`, kind: "card", label: card.title });
  }

  for (const city of ambient.cityPulse) {
    nodes.push({ id: `city:${city.city}`, kind: "city", label: city.city });
  }

  nodes.push({ id: `action:${actionLayer.intent.primaryIntent}`, kind: "action", label: actionLayer.intent.primaryIntent.replace("-", " ") });
  nodes.push({ id: `memory:${ambient.adaptiveInterface.mode}`, kind: "memory", label: ambient.adaptiveInterface.mode.replace("-", " ") });
  nodes.push({ id: "environment:current", kind: "environment", label: "Current environment" });
  nodes.push({ id: "time:current", kind: "time", label: "Current time" });
  nodes.push({ id: "human:layer", kind: "human", label: "Human intelligence" });

  for (const card of cards.slice(0, 4)) {
    edges.push({
      from: `card:${card.id}`,
      to: `city:${cityFromLocation(card.location)}`,
      weight: 0.84,
      reason: "Card intelligence is anchored to its city context."
    });
    edges.push({
      from: `card:${card.id}`,
      to: "human:layer",
      weight: 0.72,
      reason: "Human context enriches the discovery signal."
    });
  }

  edges.push({
    from: `action:${actionLayer.intent.primaryIntent}`,
    to: "time:current",
    weight: 0.88,
    reason: "Intent is interpreted with temporal context."
  });

  edges.push({
    from: "environment:current",
    to: "human:layer",
    weight: 0.74,
    reason: "Environmental context changes how people move through the city."
  });

  return { nodes, edges };
}

export function buildPersonalOperatingSystem(cards: AFRIKACard[], timestamp = "2026-06-09T19:00:00.000Z") {
  const ambient = buildAmbientIntelligence(cards, timestamp);
  const actionLayer = buildActionLayer(cards);
  const humanLayer = buildHumanIntelligenceLayer(cards);
  const memory = ambient.memory;
  const adaptiveInterface = ambient.adaptiveInterface;
  const crossDomainGraph = buildCrossDomainIntelligenceGraph(cards, timestamp);
  const predictions = predictDiscovery(cards, inferBehavioralProfile(cards), buildCityIntelligence(cards));

  return {
    ambient,
    actionLayer,
    memory,
    adaptiveInterface,
    crossDomainGraph,
    summary: `Ambient mode set to ${adaptiveInterface.mode}.`,
    routines: [
      `Preferred timing: ${memory[0]?.preferredTiming ?? "daytime"}`,
      `Top city pulse: ${ambient.cityPulse[0]?.city ?? "Africa"}`,
      `Prediction count: ${predictions.length}`,
      `Human layer cities: ${humanLayer.cityIntelligence.length}`
    ]
  };
}

export function buildContinentalIntelligence() {
  return [
    {
      region: "West Africa",
      languageNotes: ["English", "French", "Pidgin", "regional slang"],
      culturalRhythms: ["weekend movement", "market cadence", "creative evenings"],
      cityPersonality: ["calm discovery", "social energy", "food culture"]
    },
    {
      region: "East Africa",
      languageNotes: ["English", "Swahili", "urban slang"],
      culturalRhythms: ["weekday work rhythm", "night activity", "weekend escapes"],
      cityPersonality: ["structured movement", "opportunity seeking", "design culture"]
    },
    {
      region: "Southern Africa",
      languageNotes: ["English", "Zulu", "Afrikaans", "local vernacular"],
      culturalRhythms: ["event peaks", "creative districts", "travel windows"],
      cityPersonality: ["urban planning", "culture-first", "premium calm"]
    }
  ] satisfies ContinentalIntelligence[];
}

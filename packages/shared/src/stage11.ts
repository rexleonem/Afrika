import type { AFRIKACard } from "./types";
import { buildCityIntelligence } from "./stage3";
import { buildActionLayer } from "./stage5";
import { buildAmbientIntelligence } from "./stage6";
import { buildStage9CivilizationalIntelligenceSystem } from "./stage9";
import { buildStage10ConsciousnessSystem } from "./stage10";

export type RealityOrchestrationSignal = {
  city: string;
  discoveryTiming: string[];
  movementFlow: string[];
  opportunityFlow: string[];
  culturalEnergy: string[];
  flowScore: number;
  summary: string;
};

export type UrbanHarmonizationSignal = {
  city: string;
  overcrowding: number;
  quietZones: string[];
  trafficBuildUp: string;
  nightlifeBalance: number;
  tourismSaturation: number;
  stressLevel: number;
  optimization: string;
};

export type CollectiveFlowSignal = {
  region: string;
  explorationEfficiency: number;
  culturalExposure: number;
  opportunityVisibility: number;
  movementHarmony: number;
  urbanCalmness: number;
  summary: string;
};

export type EnvironmentalSynchronizationSignal = {
  city: string;
  weather: string;
  noise: string;
  pollution: string;
  traffic: string;
  heat: string;
  crowdDensity: string;
  comfortScore: number;
  summary: string;
};

export type CoordinationAgent = {
  id: string;
  type: "flow" | "cultural" | "environmental" | "opportunity" | "urban";
  focus: string;
  activeScope: string[];
  autonomyLevel: number;
  status: "active" | "watching" | "coordinating";
};

export type AdaptiveOpportunityRouting = {
  cardId: string;
  city: string;
  title: string;
  timing: string;
  relevance: number;
  route: string[];
  reason: string;
  visibility: "quiet" | "subtle" | "ambient";
};

export type SocietalFrictionReduction = {
  category: string;
  frictionReduced: string[];
  outcome: string;
  confidence: number;
};

export type ContinentalAwarenessNode = {
  region: string;
  cities: string[];
  systems: string[];
  awarenessScore: number;
  summary: string;
};

export type CivilizationStabilitySignal = {
  region: string;
  culturalImbalance: number;
  tourismLoad: number;
  environmentalStress: number;
  discoveryDiversity: number;
  stabilityScore: number;
  safeguards: string[];
};

export type InvisibleAmbientCoordination = {
  signals: string[];
  interfaceShifts: string[];
  passiveActions: string[];
  summary: string;
};

export type Stage11System = {
  realityOrchestration: RealityOrchestrationSignal[];
  urbanHarmonization: UrbanHarmonizationSignal[];
  collectiveFlow: CollectiveFlowSignal[];
  environmentalSynchronization: EnvironmentalSynchronizationSignal[];
  coordinationAgents: CoordinationAgent[];
  opportunityRouting: AdaptiveOpportunityRouting[];
  frictionReduction: SocietalFrictionReduction[];
  continentalAwareness: ContinentalAwarenessNode[];
  civilizationStability: CivilizationStabilitySignal[];
  invisibleAmbient: InvisibleAmbientCoordination;
  summary: string;
};

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function cityFromLocation(location: string) {
  return location.split(",")[1]?.trim() ?? location;
}

function regionFromCity(city: string) {
  const normalized = city.toLowerCase();
  if (/(lagos|accra|abuja|yaba|lekki|port harcourt|ghana|nigeria)/.test(normalized)) return "West Africa";
  if (/(nairobi|mombasa|kenya|kampala|dar es salaam)/.test(normalized)) return "East Africa";
  if (/(cape town|johannesburg|pretoria|south africa)/.test(normalized)) return "Southern Africa";
  if (/(cairo|alexandria|north africa|egypt|casablanca|marrakech)/.test(normalized)) return "North Africa";
  return "Pan-African";
}

function environmentalTone(weather: string, traffic: string, crowdDensity: string, heat: string) {
  if (weather === "rainy") return "soft";
  if (traffic === "high" || crowdDensity === "busy") return "dense";
  if (heat === "high") return "warm";
  return "balanced";
}

export function buildStage11OrchestrationSystem(cards: AFRIKACard[], timestamp = "2026-06-09T19:00:00.000Z"): Stage11System {
  const cityIntelligence = buildCityIntelligence(cards);
  const stage10 = buildStage10ConsciousnessSystem(cards, timestamp);
  const stage9 = buildStage9CivilizationalIntelligenceSystem(cards, timestamp);
  const ambient = buildAmbientIntelligence(cards, timestamp);
  const actionLayer = buildActionLayer(cards);

  const realityOrchestration: RealityOrchestrationSignal[] = cityIntelligence.map((city) => {
    const cityCards = cards.filter((card) => cityFromLocation(card.location) === city.city);
    const stage10Pulse = stage10.consciousnessEngine.find((pulse) => pulse.city === city.city);

    return {
      city: city.city,
      discoveryTiming: [
        `Best discovery windows align with ${ambient.cityPulse.find((pulse) => pulse.city === city.city)?.bestWindow ?? "balanced timing"}.`,
        `Users should move through ${city.topNeighborhoods[0]?.name ?? city.city} with low-friction pacing.`
      ],
      movementFlow: [
        `${city.city} movement distributes across ${city.topNeighborhoods.length > 0 ? "known clusters" : "emerging clusters"}.`,
        `Crowd flow stays subtle when ${ambient.adaptiveInterface.mode.replace(/-/g, " ")} is active.`
      ],
      opportunityFlow: [
        `${actionLayer.opportunityApplications.length} opportunity signals can be surfaced with contextual timing.`,
        `Opportunity visibility should stay quiet and locally relevant.`
      ],
      culturalEnergy: [
        `Cultural rhythm leans toward ${stage10Pulse?.resonance ?? "balanced"}.`,
        `${city.growthIndicators[0] ?? "Cultural activity remains stable."}`
      ],
      flowScore: clamp((city.trendMomentum + city.discoveryDensity + (stage10Pulse?.collectivePulse ?? 0.5)) / 3),
      summary: `${city.city} is orchestrated as a calm, adaptive discovery field with ${cityCards.length} live signals.`
    };
  });

  const urbanHarmonization: UrbanHarmonizationSignal[] = cityIntelligence.map((city) => {
    const cityAmbient = ambient.environmentalSignals.find((signal) => signal.city === city.city);
    const overcrowding = clamp(city.discoveryDensity * 0.66 + city.trendMomentum * 0.38);
    const nightlifeBalance = clamp((city.trendMomentum + (cityAmbient?.crowdDensity === "busy" ? 0.25 : 0.1)) / 1.3);
    const tourismSaturation = clamp(city.discoveryDensity * 0.5 + (cityAmbient?.traffic === "high" ? 0.18 : 0.06));
    const stressLevel = clamp((overcrowding + tourismSaturation + (cityAmbient?.traffic === "high" ? 0.12 : 0.04)) / 3);

    return {
      city: city.city,
      overcrowding,
      quietZones: city.topNeighborhoods.slice(0, 3).map((item) => item.name),
      trafficBuildUp: cityAmbient?.traffic ?? "balanced",
      nightlifeBalance,
      tourismSaturation,
      stressLevel,
      optimization:
        overcrowding > 0.7
          ? "Redirect discovery toward quieter neighborhoods and off-peak timings."
          : "Maintain balanced exposure across the city."
    };
  });

  const collectiveFlow: CollectiveFlowSignal[] = cityIntelligence.map((city) => ({
    region: city.country,
    explorationEfficiency: clamp(city.trendMomentum * 0.44 + city.discoveryDensity * 0.38 + 0.12),
    culturalExposure: clamp((stage10.emotionalCivilization.find((item) => item.region === city.country)?.creativity ?? 0.5) * 0.82),
    opportunityVisibility: clamp((actionLayer.opportunityApplications.length / Math.max(cards.length, 1)) + 0.28),
    movementHarmony: clamp((city.trendMomentum + city.discoveryDensity) / 2),
    urbanCalmness: clamp(1 - (city.discoveryDensity * 0.45 + city.trendMomentum * 0.28)),
    summary: `Flow across ${city.country} is balanced through calmer timing, cultural exposure, and context-aware opportunity surfacing.`
  }));

  const environmentalSynchronization: EnvironmentalSynchronizationSignal[] = ambient.environmentalSignals.map((signal) => ({
    city: signal.city,
    weather: signal.weather,
    noise: environmentalTone(signal.weather, signal.traffic, signal.crowdDensity, signal.neighborhoodEnergy === "night" ? "high" : "low"),
    pollution: signal.traffic === "high" ? "elevated" : signal.traffic === "medium" ? "moderate" : "low",
    traffic: signal.traffic,
    heat: signal.weather === "humid" ? "elevated" : signal.weather === "clear" ? "moderate" : "low",
    crowdDensity: signal.crowdDensity,
    comfortScore: signal.score,
    summary: `Environmental coordination keeps ${signal.city} aligned with ${signal.weather} weather and ${signal.traffic} traffic conditions.`
  }));

  const coordinationAgents: CoordinationAgent[] = [
    {
      id: "agent-flow",
      type: "flow",
      focus: "Balance movement, timing, and discovery pressure",
      activeScope: ["movement", "timing", "crowd harmony"],
      autonomyLevel: 0.9,
      status: "coordinating"
    },
    {
      id: "agent-cultural",
      type: "cultural",
      focus: "Distribute cultural exposure without overwhelming neighborhoods",
      activeScope: ["culture", "creative density", "event flow"],
      autonomyLevel: 0.88,
      status: "active"
    },
    {
      id: "agent-environmental",
      type: "environmental",
      focus: "Adapt discovery to comfort, weather, heat, and noise",
      activeScope: ["weather", "noise", "traffic", "comfort"],
      autonomyLevel: 0.86,
      status: "watching"
    },
    {
      id: "agent-opportunity",
      type: "opportunity",
      focus: "Route opportunities to the right context and timing",
      activeScope: ["jobs", "events", "creative opportunities", "timing"],
      autonomyLevel: 0.89,
      status: "coordinating"
    },
    {
      id: "agent-urban",
      type: "urban",
      focus: "Reduce neighborhood stress and spread discovery evenly",
      activeScope: ["city balance", "quiet zones", "overcrowding", "tourism"],
      autonomyLevel: 0.87,
      status: "active"
    }
  ];

  const opportunityRouting: AdaptiveOpportunityRouting[] = actionLayer.opportunityApplications.map((application) => {
    const card = cards.find((item) => item.id === application.cardId);
    const city = cityFromLocation(card?.location ?? "Africa");
    const cityPulse = ambient.cityPulse.find((pulse) => pulse.city === city);
    const timing = cityPulse?.bestWindow ?? "balanced timing";
    const visibility: AdaptiveOpportunityRouting["visibility"] =
      application.fitScore > 0.82 ? "ambient" : application.fitScore > 0.7 ? "subtle" : "quiet";

    return {
      cardId: application.cardId,
      city,
      title: application.title,
      timing,
      relevance: application.fitScore,
      route: [
        `Route through ${city} with ${timing}.`,
        `Keep visibility ${visibility} and context-aware.`
      ],
      reason: `${application.summary} Timing and local relevance keep the route human and calm.`,
      visibility
    };
  });

  const frictionReduction: SocietalFrictionReduction[] = [
    {
      category: "discovery overload",
      frictionReduced: ["fewer competing recommendations", "more contextual timing", "clearer spatial grouping"],
      outcome: "Discovery feels quieter and more legible.",
      confidence: 0.92
    },
    {
      category: "movement inefficiency",
      frictionReduced: ["route sequencing", "timing awareness", "nearby clustering"],
      outcome: "Movement becomes calmer and more intentional.",
      confidence: 0.9
    },
    {
      category: "opportunity invisibility",
      frictionReduced: ["adaptive surfacing", "local relevance", "moment-aware routing"],
      outcome: "Useful opportunities appear at the right time.",
      confidence: 0.88
    }
  ];

  const continentalAwareness: ContinentalAwarenessNode[] = stage10.culturalSynchronization.map((sync) => ({
    region: sync.region,
    cities: cityIntelligence.filter((city) => regionFromCity(city.city) === sync.region || city.country === sync.region).map((city) => city.city),
    systems: ["discovery", "movement", "culture", "opportunity", "environment"],
    awarenessScore: clamp(sync.syncScore * 0.8 + 0.18),
    summary: `Aware of cultural synchronization, memory continuity, and opportunity flow in ${sync.region}.`
  }));

  const civilizationStability: CivilizationStabilitySignal[] = stage9.globalAfricanNetwork.map((item) => ({
    region: item.region,
    culturalImbalance: clamp(1 - (item.culturalDiffusion.length * 0.12 + 0.28)),
    tourismLoad: clamp(item.diasporaNodes.length * 0.08 + 0.2),
    environmentalStress: clamp(0.28 + item.influence.length * 0.05),
    discoveryDiversity: clamp((item.culturalDiffusion.length + item.influence.length) / 10),
    stabilityScore: clamp(0.74 + item.memoryLinks.length * 0.03),
    safeguards: [
      "protect neighborhood identity",
      "balance cultural exposure",
      "avoid tourism saturation",
      "preserve discovery diversity"
    ]
  }));

  const invisibleAmbient: InvisibleAmbientCoordination = {
    signals: [
      `Ambient interface mode is ${ambient.adaptiveInterface.mode.replace(/-/g, " ")}`,
      `Stage 10 vitality sits at ${stage10.livingOrganism.vitality.toFixed(2)}`,
      `Stage 9 continuity summary: ${stage9.continuity.summary}`
    ],
    interfaceShifts: [
      "reduce cognitive load silently",
      "adapt recommendation density to context",
      "shift exploration emphasis with environment"
    ],
    passiveActions: [
      "subtle recommendation balancing",
      "quiet route harmonization",
      "ambient opportunity surfacing"
    ],
    summary: "The interface coordinates around the user without exposing the orchestration machinery."
  };

  const summary = [
    `Reality orchestration spans ${realityOrchestration.length} city-level coordination layers.`,
    `Urban harmonization tracks congestion, nightlife balance, and tourism saturation.`,
    `Collective flow optimization keeps discovery, movement, and opportunity exposure calm.`,
    `Environmental synchronization adapts to weather, noise, heat, and crowd density.`,
    `Invisible ambient coordination reduces friction without making the system feel manipulative.`
  ].join(" ");

  return {
    realityOrchestration,
    urbanHarmonization,
    collectiveFlow,
    environmentalSynchronization,
    coordinationAgents,
    opportunityRouting,
    frictionReduction,
    continentalAwareness,
    civilizationStability,
    invisibleAmbient,
    summary
  };
}

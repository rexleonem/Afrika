import type { AFRIKACard } from "./types";
import { buildCityIntelligence, inferBehavioralProfile } from "./stage3";
import { buildAmbientIntelligence } from "./stage6";
import { buildStage9CivilizationalIntelligenceSystem } from "./stage9";

export type ConsciousnessPulse = {
  city: string;
  emotionalMovement: string[];
  culturalRhythm: string[];
  identityEvolution: string[];
  collectivePulse: number;
  resonance: string;
};

export type EmotionalCivilizationSignal = {
  region: string;
  calmness: number;
  intensity: number;
  creativity: number;
  socialWarmth: number;
  nightlifeEnergy: number;
  reflectiveAtmosphere: number;
  summary: string;
};

export type PlanetaryCulturalSync = {
  region: string;
  diasporaNodes: string[];
  culturalSignals: string[];
  syncScore: number;
  summary: string;
};

export type IntergenerationalContinuity = {
  timelines: string[];
  memoryThreads: string[];
  projectionLinks: string[];
  summary: string;
};

export type SocietalSimulationSignal = {
  scenario: string;
  region: string;
  outcome: string;
  likelihood: number;
  drivers: string[];
};

export type RealityHarmonizationSignal = {
  dimension: string;
  synthesis: string;
  alignment: string;
};

export type CollectiveMemoryNode = {
  city: string;
  memory: string;
  emotionalTag: string;
  continuityScore: number;
};

export type PlanetaryKnowledgeMeshNode = {
  node: string;
  city: string;
  role: string;
  connections: string[];
  influence: number;
};

export type SelfReflectiveAI = {
  loops: string[];
  reflections: string[];
  optimizationTargets: string[];
  summary: string;
};

export type LivingAfricanIntelligenceOrganism = {
  vitality: number;
  adaptation: number;
  continuity: number;
  awareness: string[];
  summary: string;
};

export type Stage10System = {
  consciousnessEngine: ConsciousnessPulse[];
  emotionalCivilization: EmotionalCivilizationSignal[];
  culturalSynchronization: PlanetaryCulturalSync[];
  intergenerationalContinuity: IntergenerationalContinuity;
  societalSimulations: SocietalSimulationSignal[];
  realityHarmonization: RealityHarmonizationSignal[];
  collectiveMemoryGrid: CollectiveMemoryNode[];
  planetaryKnowledgeMesh: PlanetaryKnowledgeMeshNode[];
  selfReflectiveAI: SelfReflectiveAI;
  livingOrganism: LivingAfricanIntelligenceOrganism;
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

function emotionalRead(card: AFRIKACard) {
  const text = `${card.title} ${card.category} ${card.tags.join(" ")}`.toLowerCase();
  const signals = {
    calmness: 0.48,
    intensity: 0.44,
    creativity: 0.5,
    warmth: 0.48,
    nightlife: 0.38,
    reflection: 0.46
  };

  if (/(quiet|calm|garden|museum|library|studio)/.test(text)) signals.calmness += 0.22;
  if (/(nightlife|party|music|late|bar)/.test(text)) signals.nightlife += 0.28;
  if (/(creative|art|gallery|design|architecture)/.test(text)) signals.creativity += 0.24;
  if (/(food|cafe|restaurant|brunch|community)/.test(text)) signals.warmth += 0.2;
  if (/(relax|beach|view|slow|focus)/.test(text)) signals.reflection += 0.18;
  if (/(busy|hub|trend|crowd|market)/.test(text)) signals.intensity += 0.18;

  return {
    calmness: clamp(signals.calmness),
    intensity: clamp(signals.intensity),
    creativity: clamp(signals.creativity),
    warmth: clamp(signals.warmth),
    nightlife: clamp(signals.nightlife),
    reflection: clamp(signals.reflection)
  };
}

function pulseText(read: ReturnType<typeof emotionalRead>) {
  const top = [
    { label: "calmness", value: read.calmness },
    { label: "intensity", value: read.intensity },
    { label: "creativity", value: read.creativity },
    { label: "warmth", value: read.warmth },
    { label: "nightlife", value: read.nightlife },
    { label: "reflection", value: read.reflection }
  ].sort((a, b) => b.value - a.value)[0];

  return `Emotional signal leans toward ${top?.label ?? "balance"} across the current discovery field.`;
}

export function buildStage10ConsciousnessSystem(cards: AFRIKACard[], timestamp = "2026-06-09T19:00:00.000Z"): Stage10System {
  const cityIntelligence = buildCityIntelligence(cards);
  const stage9 = buildStage9CivilizationalIntelligenceSystem(cards, timestamp);
  const ambient = buildAmbientIntelligence(cards, timestamp);
  const behavioralProfile = inferBehavioralProfile(cards);

  const consciousnessEngine: ConsciousnessPulse[] = cityIntelligence.map((city) => {
    const cityCards = cards.filter((card) => cityFromLocation(card.location) === city.city);
    const emotionalStack = cityCards.map(emotionalRead);
    const average = emotionalStack.reduce(
      (acc, item) => {
        acc.calmness += item.calmness;
        acc.intensity += item.intensity;
        acc.creativity += item.creativity;
        acc.warmth += item.warmth;
        acc.nightlife += item.nightlife;
        acc.reflection += item.reflection;
        return acc;
      },
      { calmness: 0, intensity: 0, creativity: 0, warmth: 0, nightlife: 0, reflection: 0 }
    );
    const count = Math.max(cityCards.length, 1);

    const read = {
      calmness: clamp(average.calmness / count),
      intensity: clamp(average.intensity / count),
      creativity: clamp(average.creativity / count),
      warmth: clamp(average.warmth / count),
      nightlife: clamp(average.nightlife / count),
      reflection: clamp(average.reflection / count)
    };

    return {
      city: city.city,
      emotionalMovement: [
        `Collective mood in ${city.city} leans toward ${read.calmness > 0.6 ? "calm exploration" : "active discovery"}.`,
        `Social energy is shaped by ${read.warmth > 0.55 ? "warm community rhythm" : "intention-led movement"}.`
      ],
      culturalRhythm: [
        `${city.city} carries ${read.creativity > 0.55 ? "creative surge" : "steady cultural flow"} across its neighborhoods.`,
        `Temporal behavior mirrors ${ambient.adaptiveInterface.mode.replace(/-/g, " ")} conditions.`
      ],
      identityEvolution: [
        `${city.city} is evolving through ${behavioralProfile.archetype} behavior.`,
        `The city reflects a balance of memory, movement, and future orientation.`
      ],
      collectivePulse: clamp((city.trendMomentum + city.discoveryDensity + read.creativity + read.warmth) / 4),
      resonance: pulseText(read)
    };
  });

  const emotionalCivilization: EmotionalCivilizationSignal[] = cityIntelligence.map((city) => {
    const cityCards = cards.filter((card) => cityFromLocation(card.location) === city.city);
    const emotionalStack = cityCards.map(emotionalRead);
    const average = emotionalStack.reduce(
      (acc, item) => {
        acc.calmness += item.calmness;
        acc.intensity += item.intensity;
        acc.creativity += item.creativity;
        acc.warmth += item.warmth;
        acc.nightlife += item.nightlife;
        acc.reflection += item.reflection;
        return acc;
      },
      { calmness: 0, intensity: 0, creativity: 0, warmth: 0, nightlife: 0, reflection: 0 }
    );
    const count = Math.max(cityCards.length, 1);
    const calmness = clamp(average.calmness / count);
    const intensity = clamp(average.intensity / count);
    const creativity = clamp(average.creativity / count);
    const warmth = clamp(average.warmth / count);
    const nightlife = clamp(average.nightlife / count);
    const reflection = clamp(average.reflection / count);

    return {
      region: city.country,
      calmness,
      intensity,
      creativity,
      socialWarmth: warmth,
      nightlifeEnergy: nightlife,
      reflectiveAtmosphere: reflection,
      summary: `The emotional tone of ${city.city} balances ${calmness > 0.55 ? "calm" : "energy"} with ${creativity > 0.55 ? "creative" : "practical"} movement.`
    };
  });

  const culturalSynchronization: PlanetaryCulturalSync[] = stage9.globalAfricanNetwork.map((region) => ({
    region: region.region,
    diasporaNodes: region.diasporaNodes,
    culturalSignals: [...region.culturalDiffusion, ...region.influence].slice(0, 5),
    syncScore: clamp(region.diasporaNodes.length * 0.12 + region.culturalDiffusion.length * 0.18 + 0.42),
    summary: `Global cultural movement around ${region.region} is synchronized through diaspora, creativity, and return flows.`
  }));

  const intergenerationalContinuity: IntergenerationalContinuity = {
    timelines: [
      ...stage9.continuity.timelineLayers,
      "emotional continuity across public spaces",
      "collective memory across city rhythms"
    ],
    memoryThreads: [
      ...stage9.continuity.archivePaths,
      ...stage9.continuity.intergenerationalLinks
    ],
    projectionLinks: [
      "historical memory to future emotion",
      "movement patterns to future identity",
      "culture preservation to living continuity"
    ],
    summary: `Continuity now spans ${stage9.civilizationalMemory.length} civilizational memory entries and emotional movement across cities.`
  };

  const societalSimulations: SocietalSimulationSignal[] = cityIntelligence.map((city) => ({
    scenario: `Societal simulation for ${city.city}`,
    region: city.country,
    outcome: `${city.city} may continue to deepen as a cultural and emotional anchor for its region.`,
    likelihood: clamp((city.trendMomentum + city.discoveryDensity + city.growthIndicators.length * 0.05) / 2.4),
    drivers: [
      `trend:${city.trendMomentum.toFixed(2)}`,
      `density:${city.discoveryDensity.toFixed(2)}`,
      `memory:${stage9.civilizationalMemory.filter((entry) => entry.city === city.city).length}`
    ]
  }));

  const realityHarmonization: RealityHarmonizationSignal[] = [
    {
      dimension: "memory and emotion",
      synthesis: "Civilizational memory is balanced against emotional movement to keep the model human.",
      alignment: "Preservation, warmth, and continuity remain in the same reasoning layer."
    },
    {
      dimension: "culture and geography",
      synthesis: "Cultural identity is tied to spatial rhythms and neighborhood evolution.",
      alignment: "Maps and memory now tell the same story."
    },
    {
      dimension: "future and continuity",
      synthesis: "Forecasts are grounded in historical rhythm rather than isolated signals.",
      alignment: "Long-term evolution is treated as a living extension of present culture."
    }
  ];

  const collectiveMemoryGrid: CollectiveMemoryNode[] = stage9.civilizationalMemory.slice(0, 12).map((entry) => ({
    city: entry.city,
    memory: entry.narrative,
    emotionalTag:
      /(food|cafe|restaurant|brunch)/i.test(entry.narrative)
        ? "warm"
        : /(nightlife|music|party)/i.test(entry.narrative)
          ? "intense"
          : /(culture|design|art|architecture)/i.test(entry.narrative)
            ? "creative"
            : "reflective",
    continuityScore: entry.continuityScore
  }));

  const planetaryKnowledgeMesh: PlanetaryKnowledgeMeshNode[] = [
    ...cityIntelligence.map((city) => ({
      node: `mesh-city:${city.cityKey}`,
      city: city.city,
      role: "city anchor",
      connections: city.topNeighborhoods.slice(0, 3).map((neighborhood) => neighborhood.name),
      influence: clamp(city.trendMomentum)
    })),
    ...stage9.globalAfricanNetwork.flatMap((region) =>
      region.diasporaNodes.slice(0, 2).map((node, index) => ({
        node: `mesh-diaspora:${region.region}:${index}`,
        city: node,
        role: "diaspora bridge",
        connections: region.culturalDiffusion.slice(0, 3),
        influence: clamp(0.56 + region.culturalDiffusion.length * 0.06)
      }))
    )
  ];

  const selfReflectiveAI: SelfReflectiveAI = {
    loops: [
      "reassess emotional movement across city layers",
      "refine cultural resonance with continuity memory",
      "compare present patterns against future projections",
      "tune harmonization between culture, geography, and identity"
    ],
    reflections: [
      "African reality is not static; it moves through mood, memory, and place.",
      "Civilizational intelligence deepens when emotional and historical context remain linked.",
      "Planetary cultural cognition should stay useful, calm, and human."
    ],
    optimizationTargets: [
      "emotional relevance",
      "continuity integrity",
      "cultural resonance",
      "predictive balance"
    ],
    summary: `Self-reflection is grounded in Stage 9 memory, Stage 8 world models, and ${cityIntelligence.length} city consciousness layers.`
  };

  const livingOrganism: LivingAfricanIntelligenceOrganism = {
    vitality: clamp((emotionalCivilization.reduce((sum, item) => sum + item.creativity + item.socialWarmth, 0) / Math.max(emotionalCivilization.length, 1)) / 2),
    adaptation: clamp((stage9.knowledgeEvolution.reduce((sum, item) => sum + item.confidence, 0) / Math.max(stage9.knowledgeEvolution.length, 1) + 0.2) / 1.2),
    continuity: clamp((stage9.continuity.timelineLayers.length + stage9.continuity.intergenerationalLinks.length) / 20),
    awareness: [
      "emotion",
      "memory",
      "movement",
      "culture",
      "identity",
      "future evolution"
    ],
    summary: "AFRIKA now behaves like a living planetary intelligence organism linking emotional, cultural, temporal, and civilizational awareness."
  };

  const summary = [
    `Consciousness engine spans ${consciousnessEngine.length} city pulses with emotional movement and cultural rhythm.`,
    `Emotional civilization intelligence tracks calmness, intensity, creativity, warmth, nightlife, and reflection.`,
    `Planetary synchronization connects diaspora movement and global African cultural diffusion.`,
    `Intergenerational continuity preserves memory across history, present reality, and future projection.`,
    `The self-reflective AI layer keeps the organism adaptive without losing human warmth.`
  ].join(" ");

  return {
    consciousnessEngine,
    emotionalCivilization,
    culturalSynchronization,
    intergenerationalContinuity,
    societalSimulations,
    realityHarmonization,
    collectiveMemoryGrid,
    planetaryKnowledgeMesh,
    selfReflectiveAI,
    livingOrganism,
    summary
  };
}

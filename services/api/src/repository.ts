import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { featuredCards, samplePlans } from "@afrika/shared/content";
import { freshnessStatus, scoreCardTotal } from "@afrika/shared/stage2";
import type { AFRIKACard } from "@afrika/shared/types";
import { enrichCard } from "@afrika/shared/stage2";
import type { ApiState, StoredCard } from "./types.js";
import { hashPassword } from "./auth.js";

const stateFile = resolve(process.cwd(), process.env.API_STATE_FILE ?? "data/api-state.json");

function buildSeedCards(): StoredCard[] {
  return featuredCards.map((card, index) => {
    const freshness = card.freshnessScore;
    const quality = scoreCardTotal({
      usefulness: 0.86,
      uniqueness: 0.72,
      freshness,
      visualQuality: 0.9,
      sourceTrust: card.trustScore,
      engagementProbability: 0.66,
      localRelevance: card.relevanceScore
    });

    return {
      ...card,
      status: "active",
      confidenceScore: Number((0.78 + index * 0.02).toFixed(2)),
      qualityScore: quality.total,
      trendScore: Number((0.7 + index * 0.05).toFixed(2)),
      freshnessStatus: freshnessStatus(freshness)
    };
  });
}

function mergeSeedCards(cards: StoredCard[] | undefined) {
  const seedCards = buildSeedCards();
  if (!Array.isArray(cards) || cards.length === 0) return seedCards;
  const seedIds = new Set(seedCards.map((card) => card.id));
  return [...seedCards, ...cards.filter((card) => !seedIds.has(card.id))];
}

function mergeSeedPlans(plans: ApiState["plans"] | undefined) {
  const seedPlans = samplePlans.map((plan) => ({ ...plan }));
  if (!Array.isArray(plans) || plans.length === 0) return seedPlans;
  const seedIds = new Set(seedPlans.map((plan) => plan.id));
  return [...seedPlans, ...plans.filter((plan) => !seedIds.has(plan.id))];
}

function buildSeedState(): ApiState {
  return {
    cards: buildSeedCards(),
    plans: samplePlans.map((plan) => ({ ...plan })),
    sources: [
      {
        id: "source-google-maps",
        name: "Google Maps Discovery Signals",
        kind: "google-maps",
        url: "https://maps.google.com",
        reliabilityScore: 0.92,
        active: true,
        crawlIntervalMinutes: 240
      },
      {
        id: "source-openstreetmap",
        name: "OpenStreetMap Neighborhood Graph",
        kind: "openstreetmap",
        url: "https://www.openstreetmap.org",
        reliabilityScore: 0.9,
        active: true,
        crawlIntervalMinutes: 360
      },
      {
        id: "source-tripadvisor",
        name: "Tripadvisor Travel Signals",
        kind: "tripadvisor",
        url: "https://www.tripadvisor.com",
        reliabilityScore: 0.78,
        active: true,
        crawlIntervalMinutes: 480
      }
    ],
    users: [
      {
        id: "user-demo",
        email: "demo@afrika.local",
        name: "AFRIKA Member",
        role: "user",
        ...hashPassword(process.env.DEFAULT_DEMO_PASSWORD ?? "afrika-demo-password"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          preferredCities: ["Lagos", "Accra", "Nairobi"],
          interests: ["discovery", "culture", "food"],
          ambientSuggestions: true,
          notificationsEnabled: true
        }
      },
      {
        id: "user-admin",
        email: "admin@afrika.local",
        name: "AFRIKA Admin",
        role: "admin",
        ...hashPassword(process.env.DEFAULT_ADMIN_PASSWORD ?? "afrika-demo-password"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          preferredCities: ["Lagos", "Accra", "Nairobi"],
          interests: ["discovery", "culture", "opportunities"],
          ambientSuggestions: true,
          notificationsEnabled: true
        }
      }
    ],
    searchHistory: [],
    saves: [],
    viewHistory: []
  };
}

let cachedState: ApiState | null = null;
let loadPromise: Promise<ApiState> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function persistState(state: ApiState) {
  await mkdir(dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2), "utf8");
}

async function loadState() {
  try {
    const raw = await readFile(stateFile, "utf8");
    const parsed = JSON.parse(raw) as ApiState;
    return {
      ...buildSeedState(),
      ...parsed,
      cards: mergeSeedCards(parsed.cards),
      plans: mergeSeedPlans(parsed.plans),
      sources: Array.isArray(parsed.sources) && parsed.sources.length > 0 ? parsed.sources : buildSeedState().sources,
      users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : buildSeedState().users,
      searchHistory: Array.isArray(parsed.searchHistory) ? parsed.searchHistory : [],
      saves: Array.isArray(parsed.saves) ? parsed.saves : [],
      viewHistory: Array.isArray(parsed.viewHistory) ? parsed.viewHistory : []
    } satisfies ApiState;
  } catch {
    const seed = buildSeedState();
    await persistState(seed);
    return seed;
  }
}

export async function readState(): Promise<ApiState> {
  if (cachedState) return cachedState;
  if (!loadPromise) {
    loadPromise = loadState().then((state) => {
      cachedState = state;
      return state;
    });
  }
  return loadPromise;
}

export async function writeState(mutator: (state: ApiState) => ApiState | Promise<ApiState>) {
  const current = await readState();
  const draft = structuredClone(current);
  const next = await mutator(draft);
  cachedState = next;
  writeQueue = writeQueue.then(() => persistState(next));
  await writeQueue;
  return next;
}

function scoreStoredCard(card: AFRIKACard, index = 0): StoredCard {
  const quality = scoreCardTotal({
    usefulness: 0.84,
    uniqueness: 0.72,
    freshness: card.freshnessScore ?? 0.78,
    visualQuality: 0.9,
    sourceTrust: card.trustScore ?? 0.8,
    engagementProbability: 0.66,
    localRelevance: card.relevanceScore ?? 0.78
  });

  return {
    ...card,
    status: "active",
    confidenceScore: Number((0.78 + index * 0.01).toFixed(2)),
    qualityScore: quality.total,
    trendScore: Number((0.7 + index * 0.03).toFixed(2)),
    freshnessStatus: freshnessStatus(card.freshnessScore ?? 0.78)
  };
}

export function createCardFromInput(input: Partial<AFRIKACard> & { summary?: string; whyItMatters?: string; sourceId?: string; sourceUrl?: string }): StoredCard {
  const enrichment = enrichCard({
    title: input.title ?? "Untitled discovery",
    location: input.location ?? "Africa",
    category: input.category ?? "Discovery",
    rawText: `${input.title ?? ""} ${input.location ?? ""} ${input.category ?? ""}`
  });

  const baseCard: AFRIKACard = {
    id: input.id ?? randomUUID(),
    title: input.title ?? "Untitled discovery",
    location: input.location ?? "Africa",
    category: input.category ?? "Discovery",
    kind: input.kind ?? "discovery",
    tags: input.tags ?? ["discovery"],
    coordinates: input.coordinates ?? { lat: 0, lng: 0 },
    timestamp: input.timestamp ?? new Date().toISOString(),
    media: input.media ?? {
      imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80",
      alt: input.title ?? "AFRIKA discovery"
    },
    intelligence: {
      summary: input.intelligence?.summary ?? enrichment.summary,
      whyItMatters: input.intelligence?.whyItMatters ?? enrichment.whyItMatters,
      nearbyInsights: input.intelligence?.nearbyInsights ?? [],
      recommendations: input.intelligence?.recommendations ?? [],
      comparison: input.intelligence?.comparison
    },
    freshnessScore: input.freshnessScore ?? 0.78,
    trustScore: input.trustScore ?? 0.8,
    relevanceScore: input.relevanceScore ?? 0.8,
    decayRate: input.decayRate ?? 0.1,
    lastVerifiedAt: input.lastVerifiedAt ?? new Date().toISOString()
  };

  return {
    ...scoreStoredCard(baseCard),
    sourceId: input.sourceId,
    sourceUrl: input.sourceUrl
  };
}

export function sortCards(cards: StoredCard[]) {
  return [...cards].sort((left, right) => {
    const leftScore = (left.qualityScore ?? 0) + left.freshnessScore + left.relevanceScore;
    const rightScore = (right.qualityScore ?? 0) + right.freshnessScore + right.relevanceScore;
    return rightScore - leftScore;
  });
}

import { randomUUID } from "node:crypto";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { interpretSearch, scoreCardTotal } from "@afrika/shared/stage2";
import type { AFRIKACard, AFRIKAPlan, PlanItem } from "@afrika/shared/types";
import { buildStore } from "./store.js";
import { createCardFromInput, readState, sortCards, writeState } from "./repository.js";
import type { ApiState, ApiUser, SearchHistoryRecord, StoredCard } from "./types.js";
import { clearSessionCookie, createSessionToken, hashPassword, readSessionUserId, sanitizeUser, setSessionCookie, verifyPassword } from "./auth.js";

const app = Fastify({ logger: true });

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

await app.register(cors, {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
});

async function getRuntimeState() {
  const state = await readState();
  const runtime = buildStore(state.cards);
  return { state, runtime };
}

function parseNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pickPlanTitle(type: AFRIKAPlan["type"]) {
  return type === "weekend plan" ? "Weekend Plan" : type === "food route" ? "Food Route" : "Discovery Plan";
}

function validateCardPayload(payload: Partial<AFRIKACard>) {
  const errors: string[] = [];
  if (!payload.title?.trim()) errors.push("title");
  if (!payload.location?.trim()) errors.push("location");
  if (!payload.category?.trim()) errors.push("category");
  if (!payload.kind?.trim()) errors.push("kind");
  if (!Array.isArray(payload.tags) || payload.tags.length === 0) errors.push("tags");
  if (!payload.coordinates || typeof payload.coordinates.lat !== "number" || typeof payload.coordinates.lng !== "number") errors.push("coordinates");
  if (!payload.media?.imageUrl?.trim()) errors.push("media.imageUrl");
  if (!payload.media?.alt?.trim()) errors.push("media.alt");
  return errors;
}

function filterCards(cards: StoredCard[], query: string, interpretation = interpretSearch(query)) {
  const normalized = query.toLowerCase();
  return cards.filter((card) => {
    const haystack = [
      card.title,
      card.location,
      card.category,
      card.kind,
      card.tags.join(" "),
      card.intelligence.summary,
      card.intelligence.whyItMatters
    ]
      .join(" ")
      .toLowerCase();

    const keywordMatch =
      normalized.length === 0 ||
      haystack.includes(normalized) ||
      interpretation.categoryHints.some((hint) => haystack.includes(hint)) ||
      (interpretation.locationHint ? card.location.toLowerCase().includes(interpretation.locationHint.toLowerCase()) : true);

    return keywordMatch;
  });
}

function buildSearchHistoryRecord(query: string, interpretation: ReturnType<typeof interpretSearch>, resultCount: number): SearchHistoryRecord {
  return {
    id: randomUUID(),
    query,
    intent: interpretation.intent,
    resultCount,
    createdAt: new Date().toISOString()
  };
}

async function resolveCurrentUser(request: FastifyRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return null;
  const { state } = await getRuntimeState();
  return state.users.find((user) => user.id === userId) ?? null;
}

async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  const user = await resolveCurrentUser(request);
  if (!user) {
    reply.code(401).send({ error: "Authentication required." });
    return null;
  }
  return user;
}

async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = await requireUser(request, reply);
  if (!user) return null;
  if (user.role !== "admin") {
    reply.code(403).send({ error: "Admin access required." });
    return null;
  }
  return user;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canManageCard(user: ApiUser) {
  return user.role === "admin" || user.role === "moderator" || user.role === "creator" || user.role === "contributor" || user.role === "verified-contributor";
}

function buildNommoAnswer(query: string, items: StoredCard[], interpretation: ReturnType<typeof interpretSearch>) {
  if (items.length === 0) {
    return {
      summary: "I couldn't find a strong match yet. Try naming a city, mood, or specific kind of place.",
      suggestions: ["Quiet work corners in Lagos", "Food spots locals return to in Accra", "Calm weekend routes in Nairobi"]
    };
  }

  const [first, second, third] = items;
  const lines = [
    `${first.title} stands out first because ${first.intelligence.whyItMatters.toLowerCase()}`,
    second ? `${second.title} is the cleaner alternative if you want a different pace.` : null,
    interpretation.locationHint ? `I weighted ${interpretation.locationHint} more heavily because you asked with location in mind.` : null,
    third ? `${third.title} is worth keeping nearby as a fallback.` : null
  ].filter(Boolean);

  return {
    summary: lines.join(" "),
    suggestions: [
      ...first.intelligence.recommendations,
      ...(second?.intelligence.recommendations ?? []),
      ...(third?.intelligence.nearbyInsights ?? [])
    ].slice(0, 4)
  };
}

function buildNotifications(user: ApiUser, state: ApiState, runtime: Awaited<ReturnType<typeof getRuntimeState>>["runtime"]) {
  const saved = state.saves
    .filter((item) => item.userId === user.id)
    .map((item) => ({
      ...item,
      card: runtime.cards.find((card) => card.id === item.cardId)
    }))
    .filter((item): item is typeof item & { card: StoredCard } => Boolean(item.card));

  const history = state.viewHistory
    .filter((item) => item.userId === user.id)
    .map((item) => ({
      ...item,
      card: runtime.cards.find((card) => card.id === item.cardId)
    }))
    .filter((item): item is typeof item & { card: StoredCard } => Boolean(item.card));

  return [
    saved[0]
      ? {
          id: `save-${saved[0].id}`,
          kind: "saved",
          title: `Still thinking about ${saved[0].card.title}?`,
          body: saved[0].card.intelligence.whyItMatters,
          href: `/discover/${saved[0].card.id}`,
          createdAt: saved[0].createdAt
        }
      : null,
    history[0]
      ? {
          id: `history-${history[0].id}`,
          kind: "history",
          title: `You spent time with ${history[0].card.title}.`,
          body: "Pick it back up or compare it with nearby options.",
          href: `/discover/${history[0].card.id}`,
          createdAt: history[0].createdAt
        }
      : null,
    runtime.trendSignals[0]
      ? {
          id: `trend-${runtime.trendSignals[0].locationKey}`,
          kind: "trend",
          title: runtime.trendSignals[0].label,
          body: `Momentum score ${runtime.trendSignals[0].score.toFixed(2)} is pulling this area upward.`,
          href: "/search",
          createdAt: new Date().toISOString()
        }
      : null,
    runtime.culturalStories[0]
      ? {
          id: `story-${runtime.culturalStories[0].id}`,
          kind: "story",
          title: runtime.culturalStories[0].title,
          body: runtime.culturalStories[0].summary,
          href: "/nommo",
          createdAt: new Date().toISOString()
        }
      : null
  ]
    .filter(Boolean)
    .slice(0, 8);
}

function planBelongsToUser(plan: ApiState["plans"][number], user: ApiUser | null) {
  if (!plan.userId) return !user;
  return user?.id === plan.userId;
}

function authCookieHeaders(reply: FastifyReply) {
  reply.header("Cache-Control", "no-store");
  return reply;
}

app.get("/health", async () => ({ ok: true, service: "afrika-api" }));

app.get("/auth/session", async (request, reply) => {
  const user = await resolveCurrentUser(request);
  if (!user) return authCookieHeaders(reply).send({ authenticated: false, user: null });
  return { authenticated: true, user: sanitizeUser(user), token: undefined };
});

app.post("/auth/register", async (request, reply) => {
  const body = request.body as { email?: string; password?: string; name?: string };
  if (!body.email?.trim() || !body.password?.trim()) {
    return reply.code(400).send({ error: "Email and password are required." });
  }

  const { state } = await getRuntimeState();
  if (state.users.some((user) => user.email.toLowerCase() === body.email!.trim().toLowerCase())) {
    return reply.code(409).send({ error: "User already exists." });
  }

  const { salt, hash } = hashPassword(body.password);
  const user = {
    id: randomUUID(),
    email: body.email.trim().toLowerCase(),
    name: body.name?.trim() || body.email.split("@")[0] || "AFRIKA Member",
    role: "user" as const,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      preferredCities: [],
      interests: []
    }
  };

  await writeState((current) => ({
    ...current,
    users: [user, ...current.users]
  }));

  setSessionCookie(reply, user.id);
  return reply.code(201).send({ authenticated: true, user: sanitizeUser(user), token: createSessionToken(user.id) });
});

app.post("/auth/login", async (request, reply) => {
  const body = request.body as { email?: string; password?: string };
  if (!body.email?.trim() || !body.password?.trim()) {
    return reply.code(400).send({ error: "Email and password are required." });
  }

  const { state } = await getRuntimeState();
  const user = state.users.find((item) => item.email.toLowerCase() === body.email!.trim().toLowerCase());
  if (!user?.passwordHash || !user.passwordSalt) {
    return reply.code(401).send({ error: "Invalid credentials." });
  }

  if (!verifyPassword(body.password, user.passwordSalt, user.passwordHash)) {
    return reply.code(401).send({ error: "Invalid credentials." });
  }

  setSessionCookie(reply, user.id);
  return { authenticated: true, user: sanitizeUser(user), token: createSessionToken(user.id) };
});

app.post("/auth/logout", async (_request, reply) => {
  clearSessionCookie(reply);
  return { ok: true, loggedOut: true };
});

app.get("/feed", async (request) => {
  const city = String((request.query as { city?: string }).city ?? "").trim().toLowerCase();
  const limit = parseNumber((request.query as { limit?: string | number }).limit, 20);
  const { state, runtime } = await getRuntimeState();
  const items = sortCards(runtime.cards).filter((card) => (city ? card.location.toLowerCase().includes(city) : true)).slice(0, limit);

  return {
    items,
    meta: {
      rankedBy: ["usefulness", "freshness", "local relevance", "trust", "visual quality"],
      freshnessBuckets: {
        fresh: items.filter((item) => item.freshnessStatus === "fresh").length,
        warming: items.filter((item) => item.freshnessStatus === "warming").length,
        stale: items.filter((item) => item.freshnessStatus === "stale").length
      },
      totalCards: runtime.cards.length,
      totalPlans: state.plans.length
    }
  };
});

app.get("/cards", async (request) => {
  const search = String((request.query as { q?: string }).q ?? "").trim();
  const limit = parseNumber((request.query as { limit?: string | number }).limit, 50);
  const offset = parseNumber((request.query as { offset?: string | number }).offset, 0);
  const { runtime } = await getRuntimeState();
  const filtered = filterCards(runtime.cards, search);
  const items = sortCards(filtered).slice(offset, offset + limit);

  return {
    items,
    total: filtered.length,
    limit,
    offset
  };
});

app.post("/cards", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;
  if (!canManageCard(user)) {
    return reply.code(403).send({ error: "You do not have permission to create cards." });
  }

  const body = request.body as Partial<AFRIKACard> & { sourceId?: string; sourceUrl?: string };
  const errors = validateCardPayload(body);
  if (errors.length > 0) {
    return reply.code(400).send({ error: "Invalid card payload", missing: errors });
  }

  const card = createCardFromInput(body);
  const next = await writeState((state) => ({
    ...state,
    cards: [card, ...state.cards]
  }));

  return reply.code(201).send({
    card,
    feed: buildStore(next.cards).cards.slice(0, 20)
  });
});

app.get("/cards/:id", async (request, reply) => {
  const params = request.params as { id: string };
  const { runtime } = await getRuntimeState();
  const card = runtime.cards.find((item) => item.id === params.id);
  if (!card) return reply.code(404).send({ error: "Card not found" });
  return card;
});

app.patch("/cards/:id", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;
  if (!canManageCard(user)) {
    return reply.code(403).send({ error: "You do not have permission to edit cards." });
  }

  const params = request.params as { id: string };
  const body = request.body as Partial<AFRIKACard> & { sourceId?: string; sourceUrl?: string };

  const next = await writeState((state) => {
    const index = state.cards.findIndex((item) => item.id === params.id);
    if (index === -1) return state;
    const current = state.cards[index]!;
    const merged = createCardFromInput({
      ...current,
      ...body,
      id: current.id
    });
    state.cards[index] = {
      ...merged,
      sourceId: body.sourceId ?? current.sourceId,
      sourceUrl: body.sourceUrl ?? current.sourceUrl,
      status: current.status ?? "active"
    };
    return state;
  });

  const updated = next.cards.find((item) => item.id === params.id);
  if (!updated) return reply.code(404).send({ error: "Card not found" });
  return updated;
});

app.delete("/cards/:id", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;
  if (!canManageCard(user)) {
    return reply.code(403).send({ error: "You do not have permission to archive cards." });
  }

  const params = request.params as { id: string };
  const { state } = await getRuntimeState();
  const exists = state.cards.some((item) => item.id === params.id);
  if (!exists) return reply.code(404).send({ error: "Card not found" });

  await writeState((state) => {
    const target = state.cards.find((item) => item.id === params.id);
    if (!target) return state;
    target.status = "archived";
    return state;
  });
  return { ok: true, archived: true, id: params.id };
});

app.post("/search/interpret", async (request) => {
  const body = request.body as { query?: string };
  return interpretSearch(body.query ?? "");
});

app.get("/search", async (request) => {
  const query = String((request.query as { q?: string }).q ?? "");
  const recordHistory = String((request.query as { record?: string }).record ?? "true") !== "false";
  const interpretation = interpretSearch(query);
  const { runtime } = await getRuntimeState();
  const filtered = filterCards(runtime.cards, query, interpretation);
  const items = sortCards(filtered).slice(0, 24);
  const currentUser = await resolveCurrentUser(request);

  if (recordHistory && query.trim().length > 0 && currentUser) {
    await writeState((state) => ({
      ...state,
      searchHistory: [
        {
          ...buildSearchHistoryRecord(query, interpretation, items.length),
          userId: currentUser.id
        },
        ...state.searchHistory.filter((item) => item.userId === currentUser.id)
      ].slice(0, 250)
    }));
  }

  return {
    query,
    interpretation,
    items,
    summary: `Search resolved to ${items.length} intelligent discovery cards.`
  };
});

app.get("/search/history", async (request) => {
  const { state } = await getRuntimeState();
  const user = await resolveCurrentUser(request);
  const items = user ? state.searchHistory.filter((entry) => entry.userId === user.id) : [];
  return {
    items,
    total: items.length
  };
});

app.delete("/search/history", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  await writeState((state) => ({
    ...state,
    searchHistory: state.searchHistory.filter((entry) => entry.userId !== user.id)
  }));
  return { ok: true, cleared: true };
});

app.get("/saves", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const { state, runtime } = await getRuntimeState();
  const items = state.saves
    .filter((item) => item.userId === user.id)
    .map((item) => ({
      id: item.id,
      cardId: item.cardId,
      createdAt: item.createdAt,
      card: runtime.cards.find((card) => card.id === item.cardId)
    }))
    .filter((item): item is typeof item & { card: StoredCard } => Boolean(item.card));

  return { items, total: items.length };
});

app.post("/saves", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const body = request.body as { cardId?: string };
  if (!body.cardId?.trim()) {
    return reply.code(400).send({ error: "cardId is required." });
  }

  const { runtime } = await getRuntimeState();
  const card = runtime.cards.find((item) => item.id === body.cardId);
  if (!card) return reply.code(404).send({ error: "Card not found." });

  const next = await writeState((state) => {
    const existing = state.saves.find((item) => item.userId === user.id && item.cardId === body.cardId);
    if (existing) return state;
    state.saves.unshift({
      id: randomUUID(),
      userId: user.id,
      cardId: body.cardId!,
      createdAt: new Date().toISOString()
    });
    return state;
  });

  const saved = next.saves.find((item) => item.userId === user.id && item.cardId === body.cardId);
  return reply.code(201).send({ ok: true, saved, card });
});

app.delete("/saves/:cardId", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;
  const params = request.params as { cardId: string };

  await writeState((state) => {
    state.saves = state.saves.filter((item) => !(item.userId === user.id && item.cardId === params.cardId));
    return state;
  });

  return { ok: true, removed: true, cardId: params.cardId };
});

app.get("/history/views", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const limit = parseNumber((request.query as { limit?: string | number }).limit, 20);
  const { state, runtime } = await getRuntimeState();
  const items = state.viewHistory
    .filter((item) => item.userId === user.id)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      card: runtime.cards.find((card) => card.id === item.cardId)
    }))
    .filter((item): item is typeof item & { card: StoredCard } => Boolean(item.card));

  return { items, total: items.length };
});

app.post("/history/views", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const body = request.body as { cardId?: string };
  if (!body.cardId?.trim()) {
    return reply.code(400).send({ error: "cardId is required." });
  }

  const { runtime } = await getRuntimeState();
  const card = runtime.cards.find((item) => item.id === body.cardId);
  if (!card) return reply.code(404).send({ error: "Card not found." });

  await writeState((state) => {
    state.viewHistory = [
      {
        id: randomUUID(),
        userId: user.id,
        cardId: body.cardId!,
        createdAt: new Date().toISOString()
      },
      ...state.viewHistory.filter((item) => !(item.userId === user.id && item.cardId === body.cardId))
    ].slice(0, 1000);
    return state;
  });

  return reply.code(201).send({ ok: true, tracked: true, cardId: body.cardId });
});

app.get("/notifications", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const runtimeState = await getRuntimeState();
  return {
    items: buildNotifications(user, runtimeState.state, runtimeState.runtime)
  };
});

app.post("/nommo/ask", async (request) => {
  const body = request.body as { query?: string };
  const query = body.query?.trim() ?? "";
  const interpretation = interpretSearch(query);
  const { runtime } = await getRuntimeState();
  const items = sortCards(filterCards(runtime.cards, query, interpretation)).slice(0, 5);
  const answer = buildNommoAnswer(query, items, interpretation);

  return {
    query,
    interpretation,
    answer: answer.summary,
    suggestions: answer.suggestions,
    items
  };
});

app.get("/trends", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.trendSignals,
    summary: "Trending intelligence based on saves, searches, and geo activity."
  };
});

app.get("/recommendations", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.recommendationEdges
  };
});

app.get("/graph", async () => {
  const { runtime } = await getRuntimeState();
  return {
    nodes: runtime.contentGraph.nodes,
    edges: runtime.contentGraph.edges,
    summary: "Content graph intelligence linking cities, clusters, and discovery pathways."
  };
});

app.get("/cities", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.cityIntelligence,
    summary: "City intelligence layers for trend momentum, density, and neighborhood context."
  };
});

app.get("/behavior", async () => {
  const { runtime } = await getRuntimeState();
  return {
    profile: runtime.behavioralProfile,
    summary: "Inferred user archetype and discovery behavior for personalization."
  };
});

app.get("/predictive", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.predictiveRecommendations,
    summary: "Predictive discovery ranking for what the user may want next."
  };
});

app.get("/self-healing", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.selfHealingActions,
    summary: "Automatic cleanup actions for stale, duplicate, or low-confidence cards."
  };
});

app.get("/contributors", async () => {
  const { runtime } = await getRuntimeState();
  return {
    profiles: runtime.contributorNetwork.profiles,
    averageTrust: runtime.contributorNetwork.averageTrust,
    trustedContributors: runtime.contributorNetwork.trustedContributors,
    roleDistribution: runtime.contributorNetwork.roleDistribution
  };
});

app.get("/creators/:id", async (request, reply) => {
  const params = request.params as { id: string };
  const { runtime } = await getRuntimeState();
  const profile =
    runtime.contributorNetwork.profiles.find((item) => item.id === params.id) ??
    runtime.contributorNetwork.profiles.find((item) => slugify(item.name) === params.id);

  if (!profile) return reply.code(404).send({ error: "Creator not found." });

  const contributions = runtime.humanContributions.filter((item) => item.contributor.id === profile.id);
  const discoveryIds = new Set(contributions.map((item) => item.insight.cardId));
  const discoveries = runtime.cards.filter((card) => discoveryIds.has(card.id) || card.location.toLowerCase().includes(profile.city.toLowerCase()));

  return {
    profile,
    contributions: contributions.map((item) => ({
      id: item.insight.id,
      note: item.insight.note,
      emotionalContext: item.insight.emotionalContext,
      culturalContext: item.insight.culturalContext,
      localTiming: item.insight.localTiming,
      trustScore: item.insight.trustScore,
      cardId: item.insight.cardId
    })),
    discoveries: discoveries.slice(0, 8)
  };
});

app.get("/verification", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.verificationQueue,
    summary: "Human + AI verification confidence for community intelligence submissions."
  };
});

app.get("/stories", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.culturalStories,
    summary: "Editorial cultural stories generated from real-world local intelligence."
  };
});

app.get("/moderation", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.moderationQueue,
    summary: "Collaborative moderation queue for trust and authenticity control."
  };
});

app.get("/human-layer", async () => {
  const { runtime } = await getRuntimeState();
  return {
    layer: runtime.humanLayer,
    summary: "Human intelligence network blended with the Stage 3 discovery graph."
  };
});

app.get("/intent", async (request) => {
  const query = String((request.query as { q?: string }).q ?? "");
  const { runtime } = await getRuntimeState();
  return {
    query,
    intent: runtime.actionLayer.intent,
    alternateSignals: runtime.intentSignals,
    summary: "Intent engine for translating discovery into real-world actions."
  };
});

app.get("/actions", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.smartActions,
    summary: "Subtle, contextual action suggestions for places, opportunities, and trips."
  };
});

app.get("/reservations", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.reservationRequests,
    summary: "Lightweight reservation drafts for venues and experiences."
  };
});

app.get("/inquiries", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.inquiries,
    summary: "Inquiry workflows for viewing requests, follow-ups, and direct contact."
  };
});

app.get("/plans/intelligence", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.movementPlans,
    summary: "Route and itinerary intelligence for movement-aware planning."
  };
});

app.get("/opportunities", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.opportunityApplications,
    summary: "Opportunity summaries and external application pathways."
  };
});

app.get("/fulfillment", async () => {
  const { runtime } = await getRuntimeState();
  return {
    analytics: runtime.actionAnalytics,
    summary: "Trust and fulfillment intelligence for action outcomes."
  };
});

app.get("/ambient", async () => {
  const { runtime } = await getRuntimeState();
  return {
    ambient: runtime.ambientIntelligence,
    summary: "Ambient suggestions, temporal patterns, and environment-aware signals."
  };
});

app.get("/temporal", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.temporalIntelligence,
    summary: "Temporal rhythm intelligence for African city life."
  };
});

app.get("/orchestration", async () => {
  const { runtime } = await getRuntimeState();
  return {
    personalOS: runtime.personalOperatingSystem,
    summary: "Cross-context orchestration for adaptive discovery and movement."
  };
});

app.get("/cross-domain", async () => {
  const { runtime } = await getRuntimeState();
  return {
    graph: runtime.crossDomainGraph,
    summary: "Unified graph linking places, people, time, movement, and environment."
  };
});

app.get("/continent", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.continentalIntelligence,
    summary: "Continental intelligence layers for regional rhythm and cultural patterns."
  };
});

app.get("/feedback-loop", async () => {
  const { runtime } = await getRuntimeState();
  return {
    feedbackLoop: runtime.stage7System.feedbackLoop,
    summary: "Adaptive engagement learning loop for ranking and city performance."
  };
});

app.get("/self-healing/pipeline", async () => {
  const { runtime } = await getRuntimeState();
  return {
    selfHealing: runtime.stage7System.selfHealing,
    summary: "Duplicate resolution, staleness detection, and confidence scoring."
  };
});

app.get("/city-scaling", async () => {
  const { runtime } = await getRuntimeState();
  return {
    profiles: runtime.stage7System.cityScaling.profiles,
    summary: "City bootstrapping and adaptive geo-context profiles."
  };
});

app.get("/ai-control", async () => {
  const { runtime } = await getRuntimeState();
  return {
    aiControl: runtime.stage7System.aiControl,
    summary: "Prompt versioning, consistency validation, and model arbitration."
  };
});

app.get("/performance", async () => {
  const { runtime } = await getRuntimeState();
  return {
    performance: runtime.stage7System.performance,
    summary: "Caching, event-driven processing, and load-aware routing."
  };
});

app.get("/stage7", async () => {
  const { runtime } = await getRuntimeState();
  return {
    stage7: runtime.stage7System,
    summary: "Self-optimizing intelligence network for scaling African discovery."
  };
});

app.get("/stage8", async () => {
  const { runtime } = await getRuntimeState();
  return {
    stage8: runtime.stage8System,
    summary: "Living world model and simulation layer for African reality."
  };
});

app.get("/stage9", async () => {
  const { runtime } = await getRuntimeState();
  return {
    stage9: runtime.stage9System,
    summary: "Civilizational intelligence layer for African memory, synthesis, and continuity."
  };
});

app.get("/stage10", async () => {
  const { runtime } = await getRuntimeState();
  return {
    stage10: runtime.stage10System,
    summary: "Consciousness layer for emotional, cultural, and generational intelligence."
  };
});

app.get("/stage11", async () => {
  const { runtime } = await getRuntimeState();
  return {
    stage11: runtime.stage11System,
    summary: "Orchestration layer coordinating movement, opportunity, and urban flow."
  };
});

app.get("/freshness", async () => {
  const { runtime } = await getRuntimeState();
  return {
    items: runtime.cards.map((card) => ({
      id: card.id,
      freshnessScore: card.freshnessScore,
      freshnessStatus: card.freshnessStatus,
      trustScore: card.trustScore,
      relevanceScore: card.relevanceScore
    }))
  };
});

app.get("/admin/overview", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return reply;
  const { runtime } = await getRuntimeState();
  const qualityPreview = scoreCardTotal({
    usefulness: 0.84,
    uniqueness: 0.7,
    freshness: 0.81,
    visualQuality: 0.9,
    sourceTrust: 0.83,
    engagementProbability: 0.67,
    localRelevance: 0.88
  });

  return {
    cardsInGraph: runtime.cards.length,
    activeTrends: runtime.trendSignals.length,
    recommendationEdges: runtime.recommendationEdges.length,
    cityIntelligence: runtime.cityIntelligence.length,
    graphNodes: runtime.contentGraph.nodes.length,
    contributorProfiles: runtime.contributorNetwork.profiles.length,
    culturalStories: runtime.culturalStories.length,
    actionSignals: runtime.smartActions.length,
    opportunityApplications: runtime.opportunityApplications.length,
    ambientSuggestions: runtime.ambientIntelligence.suggestions.length,
    qualityPreview: qualityPreview.total
  };
});

app.get("/admin/monitoring", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return reply;
  const { runtime, state } = await getRuntimeState();
  return {
    ingestion: {
      activeCrawlers: state.sources.filter((source) => source.active).length,
      failedExtractions: 3,
      queuedSources: state.sources.length,
      sourceReliability: Number((state.sources.reduce((sum, source) => sum + source.reliabilityScore, 0) / Math.max(state.sources.length, 1)).toFixed(2))
    },
    ai: {
      pendingSummaries: runtime.moderationQueue.length * 8,
      flaggedOutputs: runtime.moderationQueue.filter((item) => item.action === "suppress" || item.risk === "high").length,
      confidenceFloor: 0.78
    },
    trends: runtime.trendSignals,
    freshness: runtime.cards.map((card) => ({
      id: card.id,
      status: card.freshnessStatus,
      lastVerifiedAt: card.lastVerifiedAt
    })),
    contributors: runtime.contributorNetwork.averageTrust,
    verification: runtime.verificationQueue.length,
    actionAnalytics: runtime.actionAnalytics,
    actionSignals: runtime.smartActions.length,
    opportunityApplications: runtime.opportunityApplications.length,
    ambientMode: runtime.ambientIntelligence.adaptiveInterface.mode
  };
});

app.get("/plans", async (request) => {
  const { state } = await getRuntimeState();
  const user = await resolveCurrentUser(request);
  const items = state.plans.filter((plan) => planBelongsToUser(plan, user));
  return {
    items,
    total: items.length
  };
});

app.post("/plans", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const body = request.body as { title?: string; type?: AFRIKAPlan["type"]; userId?: string };
  const title = body.title?.trim() || pickPlanTitle(body.type ?? "weekend plan");
  const plan: AFRIKAPlan = {
    id: randomUUID(),
    title,
    type: body.type ?? "weekend plan",
    items: []
  };

  const next = await writeState((state) => ({
    ...state,
    plans: [{ ...plan, userId: user.id }, ...state.plans]
  }));

  return reply.code(201).send({ plan: { ...plan, userId: user.id }, total: next.plans.filter((item) => item.userId === user.id).length });
});

app.get("/plans/:id", async (request, reply) => {
  const params = request.params as { id: string };
  const user = await resolveCurrentUser(request);
  const { state } = await getRuntimeState();
  const plan = state.plans.find((item) => item.id === params.id);
  if (!plan) return reply.code(404).send({ error: "Plan not found" });
  if (!planBelongsToUser(plan, user)) return reply.code(403).send({ error: "You do not have access to this plan." });
  return plan;
});

app.patch("/plans/:id", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const params = request.params as { id: string };
  const body = request.body as Partial<AFRIKAPlan>;
  const next = await writeState((state) => {
    const index = state.plans.findIndex((item) => item.id === params.id);
    if (index === -1) return state;
    if (state.plans[index]!.userId !== user.id && user.role !== "admin") return state;
    state.plans[index] = {
      ...state.plans[index]!,
      ...body,
      id: state.plans[index]!.id,
      items: body.items ?? state.plans[index]!.items
    };
    return state;
  });

  const plan = next.plans.find((item) => item.id === params.id);
  if (!plan) return reply.code(404).send({ error: "Plan not found" });
  if (plan.userId !== user.id && user.role !== "admin") return reply.code(403).send({ error: "You do not have access to this plan." });
  return plan;
});

app.delete("/plans/:id", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const params = request.params as { id: string };
  const { state } = await getRuntimeState();
  const exists = state.plans.some((item) => item.id === params.id && (item.userId === user.id || user.role === "admin"));
  if (!exists) return reply.code(404).send({ error: "Plan not found" });

  await writeState((state) => ({
    ...state,
    plans: state.plans.filter((item) => !(item.id === params.id && (item.userId === user.id || user.role === "admin")))
  }));
  return { ok: true, deleted: true, id: params.id };
});

app.post("/plans/:id/items", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const params = request.params as { id: string };
  const body = request.body as { title?: string; note?: string; cardId?: string };
  const item: PlanItem = {
    id: randomUUID(),
    title: body.title?.trim() || "Planned stop",
    note: body.note,
    cardId: body.cardId
  };

  const next = await writeState((state) => {
    const plan = state.plans.find((item) => item.id === params.id);
    if (!plan) return state;
    if (plan.userId !== user.id && user.role !== "admin") return state;
    plan.items = [...plan.items, item];
    return state;
  });

  const plan = next.plans.find((item) => item.id === params.id);
  if (!plan) return reply.code(404).send({ error: "Plan not found" });
  if (plan.userId !== user.id && user.role !== "admin") return reply.code(403).send({ error: "You do not have access to this plan." });
  return { plan, item };
});

app.patch("/plans/:id/items/:itemId", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const params = request.params as { id: string; itemId: string };
  const body = request.body as Partial<PlanItem>;
  const next = await writeState((state) => {
    const plan = state.plans.find((item) => item.id === params.id);
    if (!plan) return state;
    if (plan.userId !== user.id && user.role !== "admin") return state;
    const index = plan.items.findIndex((item) => item.id === params.itemId);
    if (index === -1) return state;
    plan.items[index] = {
      ...plan.items[index]!,
      ...body,
      id: plan.items[index]!.id
    };
    return state;
  });

  const plan = next.plans.find((item) => item.id === params.id);
  if (!plan) return reply.code(404).send({ error: "Plan not found" });
  if (plan.userId !== user.id && user.role !== "admin") return reply.code(403).send({ error: "You do not have access to this plan." });
  return plan.items.find((item) => item.id === params.itemId) ?? reply.code(404).send({ error: "Plan item not found" });
});

app.delete("/plans/:id/items/:itemId", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const params = request.params as { id: string; itemId: string };
  const next = await writeState((state) => {
    const plan = state.plans.find((item) => item.id === params.id);
    if (!plan) return state;
    if (plan.userId !== user.id && user.role !== "admin") return state;
    plan.items = plan.items.filter((item) => item.id !== params.itemId);
    return state;
  });
  const plan = next.plans.find((item) => item.id === params.id);
  if (!plan) return reply.code(404).send({ error: "Plan not found" });
  if (plan.userId !== user.id && user.role !== "admin") return reply.code(403).send({ error: "You do not have access to this plan." });
  return { ok: true, deleted: true, id: params.itemId };
});

app.get("/sources", async () => {
  const { state } = await getRuntimeState();
  return {
    items: state.sources,
    total: state.sources.length
  };
});

app.post("/sources", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return reply;

  const body = request.body as Partial<ApiState["sources"][number]>;
  if (!body.name?.trim() || !body.kind?.trim() || !body.url?.trim()) {
    return reply.code(400).send({ error: "Invalid source payload" });
  }

  const source = {
    id: randomUUID(),
    name: body.name.trim(),
    kind: body.kind,
    url: body.url,
    reliabilityScore: Number.isFinite(body.reliabilityScore ?? NaN) ? Number(body.reliabilityScore) : 0.7,
    active: body.active ?? true,
    crawlIntervalMinutes: Number.isFinite(body.crawlIntervalMinutes ?? NaN) ? Number(body.crawlIntervalMinutes) : 360,
    lastCrawledAt: body.lastCrawledAt,
    blockedAt: body.blockedAt
  };

  const next = await writeState((state) => ({
    ...state,
    sources: [source, ...state.sources]
  }));

  return reply.code(201).send({ source, total: next.sources.length });
});

app.patch("/sources/:id", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return reply;

  const params = request.params as { id: string };
  const body = request.body as Partial<ApiState["sources"][number]>;
  const next = await writeState((state) => {
    const index = state.sources.findIndex((item) => item.id === params.id);
    if (index === -1) return state;
    state.sources[index] = {
      ...state.sources[index]!,
      ...body,
      id: state.sources[index]!.id
    };
    return state;
  });
  const source = next.sources.find((item) => item.id === params.id);
  if (!source) return reply.code(404).send({ error: "Source not found" });
  return source;
});

app.delete("/sources/:id", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return reply;

  const params = request.params as { id: string };
  const { state } = await getRuntimeState();
  const exists = state.sources.some((item) => item.id === params.id);
  if (!exists) return reply.code(404).send({ error: "Source not found" });

  await writeState((state) => ({
    ...state,
    sources: state.sources.filter((item) => item.id !== params.id)
  }));
  return { ok: true, deleted: true, id: params.id };
});

app.get("/users", async (request, reply) => {
  const admin = await requireAdmin(request, reply);
  if (!admin) return reply;

  const { state } = await getRuntimeState();
  return {
    items: state.users.map((user) => sanitizeUser(user)),
    total: state.users.length
  };
});

app.get("/profiles/me", async (request) => {
  const user = await resolveCurrentUser(request);
  return user ? sanitizeUser(user) : null;
});

app.patch("/users/:id", async (request, reply) => {
  const user = await requireUser(request, reply);
  if (!user) return reply;

  const params = request.params as { id: string };
  if (user.role !== "admin" && user.id !== params.id) {
    return reply.code(403).send({ error: "You do not have permission to edit this user." });
  }
  const body = request.body as Partial<ApiState["users"][number]>;
  const next = await writeState((state) => {
    const index = state.users.findIndex((item) => item.id === params.id);
    if (index === -1) return state;
    state.users[index] = {
      ...state.users[index]!,
      ...body,
      id: state.users[index]!.id,
      updatedAt: new Date().toISOString()
    };
    return state;
  });
  const targetUser = next.users.find((item) => item.id === params.id);
  if (!targetUser) return reply.code(404).send({ error: "User not found" });
  return targetUser;
});

const port = Number(process.env.PORT ?? 4000);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});

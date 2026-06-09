import Fastify from "fastify";
import cors from "@fastify/cors";
import { store } from "./store.js";
import { freshnessStatus, interpretSearch, scoreCardTotal } from "@afrika/shared/stage2";

const app = Fastify({ logger: true });

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);

await app.register(cors, {
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true
});

app.get("/health", async () => ({ ok: true, service: "afrika-api" }));

app.get("/feed", async () => ({
  items: store.cards,
  meta: {
    rankedBy: ["usefulness", "freshness", "local relevance", "trust", "visual quality"],
    freshnessBuckets: {
      fresh: store.cards.filter((item) => item.freshnessStatus === "fresh").length,
      warming: store.cards.filter((item) => item.freshnessStatus === "warming").length,
      stale: store.cards.filter((item) => item.freshnessStatus === "stale").length
    }
  }
}));

app.post("/search/interpret", async (request) => {
  const body = request.body as { query?: string };
  return interpretSearch(body.query ?? "");
});

app.get("/search", async (request) => {
  const query = String((request.query as { q?: string }).q ?? "");
  const interpretation = interpretSearch(query);

  return {
    query,
    interpretation,
    items: store.cards.filter((card) =>
      interpretation.categoryHints.some((hint) => card.category.toLowerCase().includes(hint) || card.tags.includes(hint))
    )
  };
});

app.get("/trends", async () => ({
  items: store.trendSignals,
  summary: "Trending intelligence based on saves, searches, and geo activity."
}));

app.get("/recommendations", async () => ({
  items: store.recommendationEdges
}));

app.get("/graph", async () => ({
  nodes: store.contentGraph.nodes,
  edges: store.contentGraph.edges,
  summary: "Content graph intelligence linking cities, clusters, and discovery pathways."
}));

app.get("/cities", async () => ({
  items: store.cityIntelligence,
  summary: "City intelligence layers for trend momentum, density, and neighborhood context."
}));

app.get("/behavior", async () => ({
  profile: store.behavioralProfile,
  summary: "Inferred user archetype and discovery behavior for personalization."
}));

app.get("/predictive", async () => ({
  items: store.predictiveRecommendations,
  summary: "Predictive discovery ranking for what the user may want next."
}));

app.get("/self-healing", async () => ({
  items: store.selfHealingActions,
  summary: "Automatic cleanup actions for stale, duplicate, or low-confidence cards."
}));

app.get("/contributors", async () => ({
  profiles: store.contributorNetwork.profiles,
  averageTrust: store.contributorNetwork.averageTrust,
  trustedContributors: store.contributorNetwork.trustedContributors,
  roleDistribution: store.contributorNetwork.roleDistribution
}));

app.get("/verification", async () => ({
  items: store.verificationQueue,
  summary: "Human + AI verification confidence for community intelligence submissions."
}));

app.get("/stories", async () => ({
  items: store.culturalStories,
  summary: "Editorial cultural stories generated from real-world local intelligence."
}));

app.get("/moderation", async () => ({
  items: store.moderationQueue,
  summary: "Collaborative moderation queue for trust and authenticity control."
}));

app.get("/human-layer", async () => ({
  layer: store.humanLayer,
  summary: "Human intelligence network blended with the Stage 3 discovery graph."
}));

app.get("/intent", async (request) => {
  const query = String((request.query as { q?: string }).q ?? "");
  return {
    query,
    intent: store.actionLayer.intent,
    alternateSignals: store.intentSignals,
    summary: "Intent engine for translating discovery into real-world actions."
  };
});

app.get("/actions", async () => ({
  items: store.smartActions,
  summary: "Subtle, contextual action suggestions for places, opportunities, and trips."
}));

app.get("/reservations", async () => ({
  items: store.reservationRequests,
  summary: "Lightweight reservation drafts for venues and experiences."
}));

app.get("/inquiries", async () => ({
  items: store.inquiries,
  summary: "Inquiry workflows for viewing requests, follow-ups, and direct contact."
}));

app.get("/plans/intelligence", async () => ({
  items: store.movementPlans,
  summary: "Route and itinerary intelligence for movement-aware planning."
}));

app.get("/opportunities", async () => ({
  items: store.opportunityApplications,
  summary: "Opportunity summaries and external application pathways."
}));

app.get("/fulfillment", async () => ({
  analytics: store.actionAnalytics,
  summary: "Trust and fulfillment intelligence for action outcomes."
}));

app.get("/freshness", async () => ({
  items: store.cards.map((card) => ({
    id: card.id,
    freshnessScore: card.freshnessScore,
    freshnessStatus: freshnessStatus(card.freshnessScore),
    trustScore: card.trustScore,
    relevanceScore: card.relevanceScore
  }))
}));

app.get("/cards/:id", async (request, reply) => {
  const params = request.params as { id: string };
  const card = store.cards.find((item) => item.id === params.id);
  if (!card) return reply.code(404).send({ error: "Card not found" });
  return card;
});

app.get("/admin/overview", async () => {
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
    cardsInGraph: store.cards.length,
    activeTrends: store.trendSignals.length,
    recommendationEdges: store.recommendationEdges.length,
    cityIntelligence: store.cityIntelligence.length,
    graphNodes: store.contentGraph.nodes.length,
    contributorProfiles: store.contributorNetwork.profiles.length,
    culturalStories: store.culturalStories.length,
    actionSignals: store.smartActions.length,
    opportunityApplications: store.opportunityApplications.length,
    qualityPreview: qualityPreview.total
  };
});

app.get("/admin/monitoring", async () => ({
  ingestion: {
    activeCrawlers: 12,
    failedExtractions: 3,
    queuedSources: 8,
    sourceReliability: 0.82
  },
  ai: {
    pendingSummaries: 128,
    flaggedOutputs: 7,
    confidenceFloor: 0.78
  },
  trends: store.trendSignals,
  freshness: store.cards.map((card) => ({
    id: card.id,
    status: card.freshnessStatus,
    lastVerifiedAt: card.lastVerifiedAt
  })),
  contributors: store.contributorNetwork.averageTrust,
  verification: store.verificationQueue.length,
  actionAnalytics: store.actionAnalytics,
  actionSignals: store.smartActions.length,
  opportunityApplications: store.opportunityApplications.length
}));

const port = Number(process.env.PORT ?? 4000);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});

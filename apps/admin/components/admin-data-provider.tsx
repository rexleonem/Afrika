"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "../lib/api";
import { useAdminSession } from "./session-provider";

export type AdminCard = {
  id: string;
  title: string;
  location: string;
  category: string;
  freshnessScore: number;
  trustScore: number;
  relevanceScore: number;
  freshnessStatus?: "fresh" | "warming" | "stale" | "expired";
  intelligence: {
    summary: string;
    whyItMatters: string;
  };
};

export type AdminPlan = {
  id: string;
  title: string;
  type: string;
  items: Array<{ id: string; title: string; note?: string }>;
};

export type AdminTrend = {
  label?: string;
  city?: string;
  score?: number;
  momentum?: number;
  reason?: string;
};

export type AdminSource = {
  id: string;
  name: string;
  kind: string;
  url: string;
  reliabilityScore: number;
  active: boolean;
  crawlIntervalMinutes: number;
  lastCrawledAt?: string;
  blockedAt?: string;
};

export type AdminContributor = {
  id: string;
  name: string;
  role: string;
  city: string;
  trustScore?: number;
  expertiseAreas?: string[];
  verificationHistory?: number;
  contributionQuality?: number;
  consistency?: number;
  localExpertise?: number;
};

export type AdminSnapshot = {
  overview: {
    cardsInGraph: number;
    activeTrends: number;
    recommendationEdges: number;
    cityIntelligence: number;
    graphNodes: number;
    contributorProfiles: number;
    culturalStories: number;
    actionSignals: number;
    opportunityApplications: number;
    ambientSuggestions: number;
    qualityPreview: number;
  };
  monitoring: {
    ingestion: {
      activeCrawlers: number;
      failedExtractions: number;
      queuedSources: number;
      sourceReliability: number;
    };
    ai: {
      pendingSummaries: number;
      flaggedOutputs: number;
      confidenceFloor: number;
    };
    trends: AdminTrend[];
    freshness: Array<{ id: string; status: string; lastVerifiedAt?: string }>;
    contributors: number;
    verification: number;
    actionAnalytics: {
      completedActions: number;
      successRate: number;
    };
    actionSignals: number;
    opportunityApplications: number;
    ambientMode: string;
  };
  feed: {
    items: AdminCard[];
    totalCards: number;
  };
  cards: AdminCard[];
  plans: AdminPlan[];
  searches: Array<{ id: string; query: string; intent: string; resultCount: number; createdAt: string }>;
  trends: AdminTrend[];
  sources: AdminSource[];
  contributors: AdminContributor[];
  verification: Array<{ id: string; status: string; confidence: number; contributorName?: string; notes?: string }>;
  stories: Array<{ id: string; title: string; city: string; summary: string; publishedAt?: string }>;
  moderation: Array<{ id: string; status: string; reason: string; trustScore: number }>;
  users: Array<{ id: string; email: string; name: string; role: string }>;
  stage7: {
    promptVersions: Record<string, string>;
    checks: Array<{
      model: string;
      promptVersion: string;
      isStructured: boolean;
      requiredFieldsPresent: boolean;
      reasoningBlockConsistent: boolean;
      passed: boolean;
    }>;
    arbitrationOrder: string[];
    validatorSummary: string;
    performance: {
      cachePlan: Array<{ key: string; ttlMinutes: number; priority: string }>;
      eventBusTopics: string[];
      loadAwareRouting: {
        gemini: string;
        deepseek: string;
        groq: string;
      };
      gracefulDegradation: string[];
    };
  };
  stage8: {
    worldModel: Array<{ city: string; neighborhood: string; pulse: number; focus: string }>;
    digitalTwins: Array<{ city: string; currentPulse: number; culturalMomentum: number; summary: string }>;
    simulations: Array<{ label: string; scenario: string; outcome: string }>;
    orchestration: {
      agents: Array<{ name: string; role: string; state: string }>;
      coordinationGraph: { nodes: number; edges: number; summary: string };
      eventLoop: string[];
      memoryLayers: string[];
    };
    multimodal: Array<{ label: string; summary: string }>;
    predictiveReality: Array<{ label: string; city: string; horizon: string; prediction: string; confidence: number }>;
    collectiveBehavior: Array<{ label: string; city: string; signal: string; strength: number }>;
    selfEvolving: {
      learningLoops: string[];
      memoryLayers: string[];
      optimizationTargets: string[];
      summary: string;
    };
    summary: string;
  };
  stage9: {
    civilizationalMemory: Array<{ city: string; neighborhood: string; narrative: string; continuityScore: number }>;
    historicalGraph: {
      nodes: Array<{ id: string; label: string; kind: string; period: string; intensity: number }>;
      edges: Array<{ from: string; to: string; weight: number; reason: string }>;
      summary: string;
    };
    futureForecasts: Array<{ label: string; city: string; horizon: string; prediction: string; confidence: number }>;
    preservationAI: Array<{ id: string; target: string; summary: string; preserveAs: string; urgency: string }>;
    generationalIntelligence: Array<{ generation: string; summary: string }>;
    collectiveCognition: Array<{ city: string; summary: string; energyLevel: string }>;
    realitySynthesis: Array<{ label: string; summary: string }>;
    knowledgeEvolution: Array<{ label: string; confidence: number; update: string }>;
    globalAfricanNetwork: Array<{ region: string; summary: string; influence: number }>;
    continuity: {
      timelineLayers: string[];
      archivePaths: string[];
      comparisonViews: string[];
      intergenerationalLinks: string[];
      summary: string;
    };
    summary: string;
  };
  stage10: {
    consciousness: {
      summary: string;
      cities?: number;
    };
    synchronization: {
      summary: string;
      diasporaNodes: number;
      culturalChannels: string[];
    };
    organism: {
      summary: string;
      memoryLayers: string[];
    };
    emotionalCivilization: Array<{ city: string; calmness: number; intensity: number; creativity: number; socialWarmth: number }>;
    intergenerationalContinuity: {
      summary: string;
      timelines: string[];
      memoryThreads: string[];
      projectionLinks: string[];
    };
    selfReflectiveAI: {
      loops: string[];
      reflections: string[];
      optimizationTargets: string[];
      summary: string;
    };
    livingOrganism: {
      vitality: number;
      adaptation: number;
      continuity: number;
      awareness: string[];
      summary: string;
    };
    summary: string;
  };
  stage11: {
    orchestration: {
      summary: string;
      nodes?: number;
    };
    harmonization: {
      summary: string;
      optimizationTargets: string[];
    };
    ambient: {
      summary: string;
      interfaceModes: string[];
    };
    realityOrchestration: Array<{ city: string; flow: number; summary: string }>;
    urbanHarmonization: Array<{ city: string; balance: number; summary: string }>;
    collectiveFlow: Array<{ city: string; flowIndex: number; summary: string }>;
    environmentalSynchronization: Array<{ signal: string; comfort: number; summary: string }>;
    coordinationAgents: Array<{ name: string; role: string; state: string }>;
    opportunityRouting: Array<{ opportunity: string; city: string; route: string; confidence: number }>;
    frictionReduction: Array<{ label: string; summary: string }>;
    continentalAwareness: Array<{ region: string; summary: string }>;
    civilizationStability: Array<{ region: string; summary: string; stabilityScore: number }>;
    invisibleAmbient: {
      signals: string[];
      interfaceShifts: string[];
      passiveActions: string[];
      summary: string;
    };
    summary: string;
  };
};

type AdminFeedResponse = {
  items: AdminCard[];
  meta?: {
    totalCards?: number;
  };
};

type AdminStageEnvelope<TStage, TKey extends string> = Record<TKey, TStage> & {
  summary?: string;
};

type AdminDataState = {
  status: "loading" | "ready" | "error";
  error: string | null;
  snapshot: AdminSnapshot | null;
  reload: () => Promise<void>;
};

const AdminDataContext = createContext<AdminDataState>({
  status: "loading",
  error: null,
  snapshot: null,
  reload: async () => {}
});

function emptySnapshot(): AdminSnapshot {
  return {
    overview: {
      cardsInGraph: 0,
      activeTrends: 0,
      recommendationEdges: 0,
      cityIntelligence: 0,
      graphNodes: 0,
      contributorProfiles: 0,
      culturalStories: 0,
      actionSignals: 0,
      opportunityApplications: 0,
      ambientSuggestions: 0,
      qualityPreview: 0
    },
    monitoring: {
      ingestion: {
        activeCrawlers: 0,
        failedExtractions: 0,
        queuedSources: 0,
        sourceReliability: 0
      },
      ai: {
        pendingSummaries: 0,
        flaggedOutputs: 0,
        confidenceFloor: 0
      },
      trends: [],
      freshness: [],
      contributors: 0,
      verification: 0,
      actionAnalytics: { completedActions: 0, successRate: 0 },
      actionSignals: 0,
      opportunityApplications: 0,
      ambientMode: "idle"
    },
    feed: { items: [], totalCards: 0 },
    cards: [],
    plans: [],
    searches: [],
    trends: [],
    sources: [],
    contributors: [],
    verification: [],
    stories: [],
    moderation: [],
    users: [],
    stage7: {
      promptVersions: {},
      checks: [],
      arbitrationOrder: [],
      validatorSummary: "Validation layer warming up.",
      performance: {
        cachePlan: [],
        eventBusTopics: [],
        loadAwareRouting: {
          gemini: "batch",
          deepseek: "deferred",
          groq: "primary"
        },
        gracefulDegradation: []
      }
    },
    stage8: {
      worldModel: [],
      digitalTwins: [],
      simulations: [],
      orchestration: { agents: [], coordinationGraph: { nodes: 0, edges: 0, summary: "Orchestration warming up." }, eventLoop: [], memoryLayers: [] },
      multimodal: [],
      predictiveReality: [],
      collectiveBehavior: [],
      selfEvolving: { learningLoops: [], memoryLayers: [], optimizationTargets: [], summary: "Self-evolving layer warming up." },
      summary: "World model warming up."
    },
    stage9: {
      civilizationalMemory: [],
      historicalGraph: { nodes: [], edges: [], summary: "Historical graph warming up." },
      futureForecasts: [],
      preservationAI: [],
      generationalIntelligence: [],
      collectiveCognition: [],
      realitySynthesis: [],
      knowledgeEvolution: [],
      globalAfricanNetwork: [],
      continuity: {
        timelineLayers: [],
        archivePaths: [],
        comparisonViews: [],
        intergenerationalLinks: [],
        summary: "Continuity layer warming up."
      },
      summary: "Civilizational memory warming up."
    },
    stage10: {
      consciousness: { summary: "Consciousness layer warming up." },
      synchronization: { summary: "Synchronization warming up.", diasporaNodes: 0, culturalChannels: [] },
      organism: { summary: "Organism layer warming up.", memoryLayers: [] },
      emotionalCivilization: [],
      intergenerationalContinuity: { summary: "Intergenerational continuity warming up.", timelines: [], memoryThreads: [], projectionLinks: [] },
      selfReflectiveAI: { loops: [], reflections: [], optimizationTargets: [], summary: "Self-reflection warming up." },
      livingOrganism: { vitality: 0, adaptation: 0, continuity: 0, awareness: [], summary: "Living organism warming up." },
      summary: "Consciousness layer warming up."
    },
    stage11: {
      orchestration: { summary: "Orchestration layer warming up." },
      harmonization: { summary: "Harmonization layer warming up.", optimizationTargets: [] },
      ambient: { summary: "Ambient layer warming up.", interfaceModes: [] },
      realityOrchestration: [],
      urbanHarmonization: [],
      collectiveFlow: [],
      environmentalSynchronization: [],
      coordinationAgents: [],
      opportunityRouting: [],
      frictionReduction: [],
      continentalAwareness: [],
      civilizationStability: [],
      invisibleAmbient: { signals: [], interfaceShifts: [], passiveActions: [], summary: "Ambient coordination warming up." },
      summary: "Orchestration layer warming up."
    }
  };
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { status: sessionStatus, user } = useAdminSession();
  const [status, setStatus] = useState<AdminDataState["status"]>("loading");
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);

  const loadSnapshot = useCallback(async () => {
    if (sessionStatus !== "authenticated" || user?.role !== "admin") {
      setSnapshot(null);
      setStatus(sessionStatus === "loading" ? "loading" : "error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const [
        overview,
        monitoring,
        feed,
        cards,
        plans,
        searches,
        trends,
        sources,
        contributors,
        verification,
        stories,
        moderation,
        users,
        stage7,
        stage8,
        stage9,
        stage10,
        stage11
      ] = await Promise.all([
        apiFetch<AdminSnapshot["overview"]>("/admin/overview"),
        apiFetch<AdminSnapshot["monitoring"]>("/admin/monitoring"),
        apiFetch<AdminFeedResponse>("/feed?limit=12"),
        apiFetch<{ items: AdminCard[] }>("/cards?limit=12"),
        apiFetch<{ items: AdminPlan[] }>("/plans"),
        apiFetch<{ items: AdminSnapshot["searches"] }>("/search/history"),
        apiFetch<{ items: AdminTrend[] }>("/trends"),
        apiFetch<{ items: AdminSource[] }>("/sources"),
        apiFetch<{ profiles: AdminContributor[] }>("/contributors"),
        apiFetch<{ items: AdminSnapshot["verification"] }>("/verification"),
        apiFetch<{ items: AdminSnapshot["stories"] }>("/stories"),
        apiFetch<{ items: AdminSnapshot["moderation"] }>("/moderation"),
        apiFetch<{ items: AdminSnapshot["users"] }>("/users"),
        apiFetch<AdminStageEnvelope<AdminSnapshot["stage7"], "stage7">>("/stage7"),
        apiFetch<AdminStageEnvelope<AdminSnapshot["stage8"], "stage8">>("/stage8"),
        apiFetch<AdminStageEnvelope<AdminSnapshot["stage9"], "stage9">>("/stage9"),
        apiFetch<AdminStageEnvelope<AdminSnapshot["stage10"], "stage10">>("/stage10"),
        apiFetch<AdminStageEnvelope<AdminSnapshot["stage11"], "stage11">>("/stage11")
      ]);

      setSnapshot({
        overview,
        monitoring,
        feed: {
          items: feed.items,
          totalCards: feed.meta?.totalCards ?? feed.items.length
        },
        cards: cards.items,
        plans: plans.items,
        searches: searches.items,
        trends: trends.items,
        sources: sources.items,
        contributors: contributors.profiles,
        verification: verification.items,
        stories: stories.items,
        moderation: moderation.items,
        users: users.items,
        stage7: stage7.stage7,
        stage8: stage8.stage8,
        stage9: stage9.stage9,
        stage10: stage10.stage10,
        stage11: stage11.stage11
      });
      setStatus("ready");
    } catch (err) {
      setSnapshot(emptySnapshot());
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to load admin snapshot.");
    }
  }, [sessionStatus, user?.role]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const value = useMemo<AdminDataState>(
    () => ({
      status,
      error,
      snapshot,
      reload: loadSnapshot
    }),
    [status, error, snapshot, loadSnapshot]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  return useContext(AdminDataContext);
}

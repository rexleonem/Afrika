import type { AFRIKACard } from "./types";
import { enrichCard } from "./stage2";
import { buildCityIntelligence, buildContentGraph, inferBehavioralProfile, predictDiscovery } from "./stage3";

export type ContributorRole =
  | "explorer"
  | "food-scout"
  | "city-observer"
  | "opportunity-scout"
  | "culture-contributor";

export type ContributorProfile = {
  id: string;
  name: string;
  role: ContributorRole;
  city: string;
  expertiseAreas: string[];
  verificationHistory: number;
  contributionQuality: number;
  consistency: number;
  localExpertise: number;
  trustScore: number;
  status: string;
};

export type HumanInsight = {
  id: string;
  cardId: string;
  contributorId: string;
  note: string;
  emotionalContext: string;
  culturalContext: string;
  localTiming: string;
  trustScore: number;
};

export type VerificationCheck = {
  name: string;
  passed: boolean;
  weight: number;
  note: string;
};

export type VerificationResult = {
  cardId: string;
  confidenceScore: number;
  verificationState: "verified" | "review" | "flagged";
  aiConfidence: number;
  humanValidationSignals: string[];
  freshnessCertainty: number;
  checks: VerificationCheck[];
};

export type ContributorModeration = {
  contributorId: string;
  risk: "low" | "medium" | "high";
  reasons: string[];
  action: "approve" | "review" | "suppress";
};

export type CulturalStory = {
  id: string;
  title: string;
  summary: string;
  city: string;
  theme: string;
  cards: string[];
  humanSignals: string[];
};

export type HumanAIContribution = {
  contributor: ContributorProfile;
  insight: HumanInsight;
  verification: VerificationResult;
  aiEnrichment: ReturnType<typeof enrichCard>;
};

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function cityFromLocation(location: string) {
  return location.split(",")[1]?.trim() ?? location;
}

export function scoreContributor(profile: Omit<ContributorProfile, "trustScore" | "status">) {
  const trustScore = clamp(
    profile.verificationHistory * 0.24 +
      profile.contributionQuality * 0.28 +
      profile.consistency * 0.22 +
      profile.localExpertise * 0.26
  );

  const status =
    trustScore >= 0.88
      ? `Verified ${profile.role.replace("-", " ")}`
      : trustScore >= 0.72
        ? `Trusted ${profile.role.replace("-", " ")}`
        : `Emerging ${profile.role.replace("-", " ")}`;

  return {
    ...profile,
    trustScore,
    status
  };
}

export function verifyContribution(payload: {
  card: AFRIKACard;
  note: string;
  mediaUrl?: string;
  contributorTrust: number;
  historicalConsistency: number;
  geoValidation: number;
}): VerificationResult {
  const note = normalizeText(payload.note);
  const checks: VerificationCheck[] = [
    {
      name: "geo-validation",
      passed: payload.geoValidation >= 0.7,
      weight: 0.28,
      note: payload.geoValidation >= 0.7 ? "Location context aligns with the card." : "Location needs re-checking."
    },
    {
      name: "contributor-trust",
      passed: payload.contributorTrust >= 0.72,
      weight: 0.32,
      note: payload.contributorTrust >= 0.72 ? "Contributor history is credible." : "Contributor is still building trust."
    },
    {
      name: "historical-consistency",
      passed: payload.historicalConsistency >= 0.68,
      weight: 0.2,
      note: payload.historicalConsistency >= 0.68 ? "Observation matches prior signals." : "Observed pattern is still uncertain."
    },
    {
      name: "media-context",
      passed: Boolean(payload.mediaUrl),
      weight: 0.2,
      note: payload.mediaUrl ? "Media supports the submission." : "No media supplied yet."
    }
  ];

  const confidenceScore = clamp(
    checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0) +
      payload.contributorTrust * 0.2 +
      payload.historicalConsistency * 0.1 +
      payload.geoValidation * 0.1
  );

  const verificationState =
    confidenceScore >= 0.84
      ? "verified"
      : confidenceScore >= 0.62
        ? "review"
        : "flagged";

  return {
    cardId: payload.card.id,
    confidenceScore,
    verificationState,
    aiConfidence: clamp((payload.card.freshnessScore + payload.card.trustScore + payload.geoValidation) / 3),
    humanValidationSignals: [
      payload.note,
      payload.mediaUrl ? "media attached" : "text only",
      payload.geoValidation >= 0.7 ? "geo aligned" : "geo uncertain"
    ],
    freshnessCertainty: clamp((payload.card.freshnessScore + payload.historicalConsistency) / 2),
    checks
  };
}

export function buildContributorNetwork(contributors: Omit<ContributorProfile, "trustScore" | "status">[]) {
  const profiles = contributors.map(scoreContributor);
  const totals = profiles.reduce(
    (acc, contributor) => {
      acc.trustScore += contributor.trustScore;
      acc.count += 1;
      acc.roles[contributor.role] = (acc.roles[contributor.role] ?? 0) + 1;
      return acc;
    },
    {
      trustScore: 0,
      count: 0,
      roles: {} as Record<ContributorRole, number>
    }
  );

  return {
    profiles,
    averageTrust: clamp(totals.trustScore / Math.max(totals.count, 1)),
    roleDistribution: totals.roles,
    trustedContributors: profiles.filter((item) => item.trustScore >= 0.8).length
  };
}

export function structureHumanContribution(payload: {
  card: AFRIKACard;
  contributor: Omit<ContributorProfile, "trustScore" | "status">;
  note: string;
  emotionalContext: string;
  culturalContext: string;
  localTiming: string;
  mediaUrl?: string;
}): HumanAIContribution {
  const contributor = scoreContributor(payload.contributor);
  const insight: HumanInsight = {
    id: `insight_${payload.card.id}_${contributor.id}`,
    cardId: payload.card.id,
    contributorId: contributor.id,
    note: payload.note,
    emotionalContext: payload.emotionalContext,
    culturalContext: payload.culturalContext,
    localTiming: payload.localTiming,
    trustScore: contributor.trustScore
  };

  const verification = verifyContribution({
    card: payload.card,
    note: payload.note,
    mediaUrl: payload.mediaUrl,
    contributorTrust: contributor.trustScore,
    historicalConsistency: contributor.consistency,
    geoValidation: payload.card.coordinates.lat !== 0 || payload.card.coordinates.lng !== 0 ? 0.9 : 0.4
  });

  const aiEnrichment = enrichCard({
    title: payload.card.title,
    location: payload.card.location,
    category: payload.card.category,
    sourceReliability: contributor.trustScore,
    rawText: `${payload.note} ${payload.emotionalContext} ${payload.culturalContext}`
  });

  return {
    contributor,
    insight,
    verification,
    aiEnrichment
  };
}

export function generateCulturalStories(cards: AFRIKACard[], insights: HumanInsight[]) {
  const cityGroups = new Map<string, AFRIKACard[]>();

  for (const card of cards) {
    const city = cityFromLocation(card.location);
    const bucket = cityGroups.get(city) ?? [];
    bucket.push(card);
    cityGroups.set(city, bucket);
  }

  return [...cityGroups.entries()].map(([city, cityCards]) => {
    const relatedInsights = insights.filter((insight) => cityCards.some((card) => card.id === insight.cardId));
    const theme = cityCards.some((card) => /(food|cafe|restaurant|brunch)/i.test(`${card.title} ${card.tags.join(" ")}`))
      ? "food culture"
      : cityCards.some((card) => /(nightlife|music|party)/i.test(`${card.title} ${card.tags.join(" ")}`))
        ? "cultural movement"
        : "neighborhood evolution";

    return {
      id: `story_${normalizeText(city)}`,
      title: `${city} cultural story`,
      summary: `${city} is showing signs of ${theme} with ${relatedInsights.length} verified human observations.`,
      city,
      theme,
      cards: cityCards.map((card) => card.id),
      humanSignals: relatedInsights.slice(0, 3).map((insight) => insight.note)
    } satisfies CulturalStory;
  });
}

export function moderateContribution(payload: {
  contributorId: string;
  note: string;
  trustScore: number;
  hasMedia: boolean;
  duplicatesDetected: boolean;
  misleadingSignals: boolean;
}): ContributorModeration {
  const reasons = [
    !payload.hasMedia ? "missing media" : null,
    payload.duplicatesDetected ? "duplicate pattern" : null,
    payload.misleadingSignals ? "context mismatch" : null,
    payload.trustScore < 0.6 ? "low trust" : null
  ].filter(Boolean) as string[];

  const risk = payload.trustScore >= 0.8 && reasons.length === 0 ? "low" : reasons.length >= 2 ? "high" : "medium";
  const action = risk === "low" ? "approve" : risk === "medium" ? "review" : "suppress";

  return {
    contributorId: payload.contributorId,
    risk,
    reasons,
    action
  };
}

export function buildHumanIntelligenceLayer(cards: AFRIKACard[]) {
  const cityIntelligence = buildCityIntelligence(cards);
  const graph = buildContentGraph(cards);
  const behavioralProfile = inferBehavioralProfile(cards, [
    { type: "search", query: "places with calm creative energy", timestamp: cards[0]?.timestamp ?? "2026-06-09T00:00:00.000Z" }
  ]);
  const predictive = predictDiscovery(cards, behavioralProfile, cityIntelligence);

  return {
    cityIntelligence,
    graph,
    behavioralProfile,
    predictive
  };
}

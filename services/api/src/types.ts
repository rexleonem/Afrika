import type { AFRIKACard, AFRIKAPlan } from "@afrika/shared/types";
import type { IngestionSource } from "@afrika/shared/stage2";

export type StoredCard = AFRIKACard & {
  sourceId?: string;
  sourceUrl?: string;
  confidenceScore?: number;
  qualityScore?: number;
  trendScore?: number;
  freshnessStatus?: "fresh" | "warming" | "stale" | "expired";
  status?: "active" | "archived";
};

export type ApiUserRole = "user" | "admin" | "moderator" | "creator" | "contributor" | "verified-contributor";

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: ApiUserRole;
  imageUrl?: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    preferredCities: string[];
    interests: string[];
  };
};

export type SearchHistoryRecord = {
  id: string;
  query: string;
  intent: string;
  resultCount: number;
  createdAt: string;
  userId?: string;
};

export type ApiSource = IngestionSource & {
  blockedAt?: string;
};

export type ApiState = {
  cards: StoredCard[];
  plans: AFRIKAPlan[];
  sources: ApiSource[];
  users: ApiUser[];
  searchHistory: SearchHistoryRecord[];
};

export type AFRIKACardInput = Pick<
  AFRIKACard,
  "title" | "location" | "category" | "kind" | "tags" | "coordinates" | "media"
> & {
  summary?: string;
  whyItMatters?: string;
  freshnessScore?: number;
  trustScore?: number;
  relevanceScore?: number;
  decayRate?: number;
  timestamp?: string;
  lastVerifiedAt?: string;
  sourceId?: string;
  sourceUrl?: string;
};

export type CardUpsertInput = Partial<AFRIKACardInput>;

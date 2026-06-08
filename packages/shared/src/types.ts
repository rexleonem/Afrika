export type ContentKind =
  | "place"
  | "neighborhood"
  | "opportunity"
  | "event"
  | "culture"
  | "trend"
  | "discovery"
  | "movement";

export type AFRIKACard = {
  id: string;
  title: string;
  location: string;
  category: string;
  kind: ContentKind;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  media: {
    imageUrl: string;
    videoUrl?: string;
    alt: string;
  };
  intelligence: {
    summary: string;
    whyItMatters: string;
    nearbyInsights: string[];
    recommendations: string[];
    comparison?: string;
  };
  freshnessScore: number;
  trustScore: number;
  relevanceScore: number;
  decayRate: number;
  lastVerifiedAt: string;
};

export type PlanItem = {
  id: string;
  title: string;
  note?: string;
  cardId?: string;
};

export type AFRIKAPlan = {
  id: string;
  title: string;
  type: "trip" | "idea" | "food route" | "weekend plan" | "places to visit";
  items: PlanItem[];
};

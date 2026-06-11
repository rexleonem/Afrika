import type { AFRIKACard, AFRIKAPlan } from "./types";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "./stage3";
import { buildHumanIntelligenceLayer, type ContributorProfile, type HumanInsight } from "./stage4";

export type IntentType =
  | "visiting"
  | "relocating"
  | "eating-out"
  | "planning-trip"
  | "discovering-neighborhood"
  | "attending-event"
  | "finding-opportunity"
  | "remote-work-exploration"
  | "nightlife-planning"
  | "culture-exploration";

export type ActionType =
  | "navigate"
  | "save"
  | "plan-visit"
  | "view-nearby"
  | "reserve"
  | "reserve-table"
  | "add-to-calendar"
  | "request-viewing"
  | "contact"
  | "apply"
  | "save-search"
  | "share-plan";

export type IntentProfile = {
  query: string;
  primaryIntent: IntentType;
  secondaryIntents: IntentType[];
  confidence: number;
  budgetHint?: string;
  locationHint?: string;
  timingHint: string;
  nextStepPrompt: string;
  actionPathways: ActionType[];
};

export type SmartAction = {
  label: string;
  type: ActionType;
  description: string;
  subtle: boolean;
};

export type ReservationRequest = {
  cardId: string;
  type: "restaurant" | "event" | "experience" | "space";
  requestedTime: string;
  partySize?: number;
  notes?: string;
  trustScore: number;
  status: "draft" | "pending" | "confirmed" | "failed";
};

export type InquiryWorkflow = {
  cardId: string;
  subject: string;
  message: string;
  channel: "email" | "call" | "chat";
  status: "draft" | "sent" | "replied" | "closed";
};

export type OpportunityApplication = {
  cardId: string;
  title: string;
  fitScore: number;
  summary: string;
  actionLabel: "apply" | "save-opportunity" | "explore-similar";
  externalUrl?: string;
};

export type MovementPlan = {
  title: string;
  city: string;
  timing: string;
  budgetHint: string;
  route: string[];
  totalStops: number;
  estimatedDurationHours: number;
  actionPrompt: string;
};

export type FulfillmentSignal = {
  id: string;
  type: "reservation" | "application" | "visit" | "plan";
  completed: boolean;
  trustScore: number;
  note: string;
};

export type ActionAnalytics = {
  completedVisits: number;
  completedPlans: number;
  acceptedRecommendations: number;
  applicationsSubmitted: number;
  reservationSuccessRate: number;
};

function normalizeText(value: string) {
  return value.toLowerCase();
}

function clamp(value: number) {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function cityFromLocation(location: string) {
  return location.split(",")[1]?.trim() ?? location;
}

function kindToIntent(card: AFRIKACard): IntentType {
  if (card.kind === "opportunity") return "finding-opportunity";
  if (card.kind === "event") return "attending-event";
  if (card.kind === "neighborhood") return "discovering-neighborhood";
  if (/food|cafe|restaurant|brunch/i.test(`${card.category} ${card.tags.join(" ")}`)) return "eating-out";
  if (/work|remote|office|cowork/i.test(`${card.category} ${card.tags.join(" ")}`)) return "remote-work-exploration";
  if (/culture|gallery|music|design/i.test(`${card.category} ${card.tags.join(" ")}`)) return "culture-exploration";
  return "visiting";
}

function fallbackCard(): AFRIKACard {
  return {
    id: "fallback-action-card",
    title: "Discovery signal pending",
    location: "Africa",
    category: "Discovery",
    kind: "discovery",
    tags: ["discovery"],
    coordinates: { lat: 0, lng: 0 },
    timestamp: "2026-06-09T00:00:00.000Z",
    media: {
      imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
      alt: "AFRIKA discovery signal"
    },
    intelligence: {
      summary: "A calm fallback discovery card until a live signal is available.",
      whyItMatters: "Keeps action pathways working even before a fresh card is loaded.",
      nearbyInsights: ["Nearby signals will appear here once a live discovery is available."],
      recommendations: ["Save for later"],
      comparison: "Neutral fallback"
    },
    freshnessScore: 0.5,
    trustScore: 0.5,
    relevanceScore: 0.5,
    decayRate: 0.1,
    lastVerifiedAt: "2026-06-09T00:00:00.000Z"
  };
}

export function detectIntent(query: string, signals: Array<{ type: string; weight: number }> = []): IntentProfile {
  const normalized = normalizeText(query);
  const primaryIntent: IntentType =
    /(relocate|move|live)/.test(normalized)
      ? "relocating"
      : /(job|grant|apply|opportunity)/.test(normalized)
        ? "finding-opportunity"
        : /(event|concert|nightlife|party)/.test(normalized)
          ? "attending-event"
          : /(food|eat|restaurant|brunch|cafe)/.test(normalized)
            ? "eating-out"
            : /(remote|work|cowork|office)/.test(normalized)
              ? "remote-work-exploration"
              : /(culture|art|gallery|history)/.test(normalized)
                ? "culture-exploration"
                : /(weekend|trip|route|plan)/.test(normalized)
                  ? "planning-trip"
                  : "discovering-neighborhood";

  const locationMatch = normalized.match(/\b(lagos|yaba|lekki|nairobi|accra|abuja|port harcourt|cape town)\b/);
  const budgetMatch = normalized.match(/(cheap|budget|under\s*₦?\d+|under\s*\$?\d+)/);
  const secondaryIntents = [primaryIntent].filter(Boolean) as IntentType[];
  if (/(navigate|go to|how to get)/.test(normalized)) secondaryIntents.push("visiting");
  if (/(plan|itinerary|route)/.test(normalized)) secondaryIntents.push("planning-trip");

  const intensity = signals.reduce((sum, signal) => sum + signal.weight, 0);
  const confidence = clamp(0.58 + Math.min(0.3, intensity / 10));

  return {
    query,
    primaryIntent,
    secondaryIntents: [...new Set(secondaryIntents)],
    confidence,
    budgetHint: budgetMatch?.[0],
    locationHint: locationMatch?.[0],
    timingHint: /(today|tonight|weekend|after work|weekday)/.test(normalized) ? "timing-aware" : "flexible timing",
    nextStepPrompt:
      primaryIntent === "finding-opportunity"
        ? "Review fit, then apply externally when the timing feels right."
        : primaryIntent === "planning-trip"
          ? "Build a calm route and lock in your stops."
          : "Move from discovery into a lightweight plan.",
    actionPathways:
      primaryIntent === "finding-opportunity"
        ? ["save", "apply", "share-plan"]
        : primaryIntent === "eating-out"
          ? ["reserve-table", "save", "view-nearby"]
          : primaryIntent === "attending-event"
            ? ["reserve", "add-to-calendar", "share-plan"]
            : primaryIntent === "relocating"
              ? ["request-viewing", "save-search", "contact"]
              : ["navigate", "plan-visit", "view-nearby"]
  };
}

export function buildSmartActions(card: AFRIKACard, intent: IntentProfile): SmartAction[] {
  const base: Record<IntentType, SmartAction[]> = {
    visiting: [
      { label: "Navigate", type: "navigate", description: "Open a calm route to the place.", subtle: true },
      { label: "Plan Visit", type: "plan-visit", description: "Add this stop to a simple plan.", subtle: true },
      { label: "View Nearby", type: "view-nearby", description: "See what else is around this area.", subtle: true }
    ],
    relocating: [
      { label: "Request Viewing", type: "request-viewing", description: "Ask for a lightweight viewing inquiry.", subtle: true },
      { label: "Save Search", type: "save-search", description: "Track similar areas within your range.", subtle: true },
      { label: "Contact", type: "contact", description: "Open a direct contact workflow.", subtle: true }
    ],
    "eating-out": [
      { label: "Reserve Table", type: "reserve-table", description: "Hold a table without a heavy flow.", subtle: true },
      { label: "Add to Plan", type: "plan-visit", description: "Place it inside a food route.", subtle: true },
      { label: "Discover Similar", type: "view-nearby", description: "Find similar places nearby.", subtle: true }
    ],
    "planning-trip": [
      { label: "Plan Route", type: "plan-visit", description: "Build a short route around this discovery.", subtle: true },
      { label: "Save to Plan", type: "save", description: "Keep it inside your itinerary.", subtle: true },
      { label: "Share Plan", type: "share-plan", description: "Send the route to someone else.", subtle: true }
    ],
    "discovering-neighborhood": [
      { label: "Open Map", type: "navigate", description: "Explore the surrounding area.", subtle: true },
      { label: "Plan Visit", type: "plan-visit", description: "Use this as a neighborhood stop.", subtle: true },
      { label: "View Nearby", type: "view-nearby", description: "See related places and patterns.", subtle: true }
    ],
    "attending-event": [
      { label: "Reserve Spot", type: "reserve", description: "Secure attendance in a light workflow.", subtle: true },
      { label: "Add to Calendar", type: "add-to-calendar", description: "Place it in your schedule.", subtle: true },
      { label: "Share Plan", type: "share-plan", description: "Coordinate with others if needed.", subtle: true }
    ],
    "finding-opportunity": [
      { label: "Apply", type: "apply", description: "Open an external application flow.", subtle: true },
      { label: "Save Opportunity", type: "save", description: "Keep it inside your opportunity plan.", subtle: true },
      { label: "Explore Similar", type: "view-nearby", description: "See related opportunities nearby.", subtle: true }
    ],
    "remote-work-exploration": [
      { label: "Save Search", type: "save-search", description: "Remember this work-focused search.", subtle: true },
      { label: "View Nearby", type: "view-nearby", description: "Compare cafes and spaces close by.", subtle: true },
      { label: "Plan Visit", type: "plan-visit", description: "Add a work route to your plan.", subtle: true }
    ],
    "nightlife-planning": [
      { label: "Reserve", type: "reserve", description: "Hold a spot if the venue supports it.", subtle: true },
      { label: "Add to Calendar", type: "add-to-calendar", description: "Set the timing in your plan.", subtle: true },
      { label: "Share Plan", type: "share-plan", description: "Coordinate the night smoothly.", subtle: true }
    ],
    "culture-exploration": [
      { label: "Plan Visit", type: "plan-visit", description: "Add this cultural stop to your route.", subtle: true },
      { label: "View Nearby", type: "view-nearby", description: "See connected cultural discoveries.", subtle: true },
      { label: "Save", type: "save", description: "Keep it for later exploration.", subtle: true }
    ]
  };

  return base[intent.primaryIntent].map((action) => ({
    ...action,
    description: `${action.description} ${card.title} in ${card.location}.`
  }));
}

export function buildReservationRequest(card: AFRIKACard, type: ReservationRequest["type"], partySize = 2): ReservationRequest {
  return {
    cardId: card.id,
    type,
    requestedTime: "2026-06-10T19:00:00.000Z",
    partySize,
    notes: `Calm request for ${card.title}.`,
    trustScore: card.trustScore,
    status: "draft"
  };
}

export function buildInquiryWorkflow(card: AFRIKACard): InquiryWorkflow {
  return {
    cardId: card.id,
    subject: `Inquiry about ${card.title}`,
    message: `I discovered ${card.title} through AFRIKA and want to know more.`,
    channel: "email",
    status: "draft"
  };
}

export function buildOpportunityApplications(cards: AFRIKACard[]): OpportunityApplication[] {
  return cards
    .filter((card) => card.kind === "opportunity")
    .map((card) => ({
      cardId: card.id,
      title: card.title,
      fitScore: clamp((card.freshnessScore + card.relevanceScore + card.trustScore) / 3),
      summary: `Useful for users looking for opportunities aligned with ${card.title}.`,
      actionLabel: "apply" as const,
      externalUrl: `https://afrika.ng/opportunities/${card.id}`
    }));
}

export function buildMovementPlan(cards: AFRIKACard[], title = "Calm discovery route"): MovementPlan {
  const city = cityFromLocation(cards[0]?.location ?? "Africa");
  const route = cards.slice(0, 3).map((card) => card.title);
  return {
    title,
    city,
    timing: "weekday afternoon to sunset",
    budgetHint: "moderate",
    route,
    totalStops: route.length,
    estimatedDurationHours: Number((route.length * 1.5).toFixed(1)),
    actionPrompt: "Review the route, then save it as a plan."
  };
}

export function buildActionAnalytics(actions: Array<{ type: string; completed: boolean }>): ActionAnalytics {
  const completed = actions.filter((item) => item.completed);
  const reservationSuccessRate = clamp(
    completed.filter((item) => item.type === "reservation").length /
      Math.max(actions.filter((item) => item.type === "reservation").length, 1)
  );

  return {
    completedVisits: completed.filter((item) => item.type === "visit").length,
    completedPlans: completed.filter((item) => item.type === "plan").length,
    acceptedRecommendations: completed.filter((item) => item.type === "recommendation").length,
    applicationsSubmitted: completed.filter((item) => item.type === "application").length,
    reservationSuccessRate
  };
}

export function buildActionLayer(cards: AFRIKACard[]) {
  const primaryCard = cards[0] ?? fallbackCard();
  const humanLayer = buildHumanIntelligenceLayer(cards);
  const intent = detectIntent("quiet places for a date in Lagos", [
    { type: "save", weight: 2 },
    { type: "search", weight: 3 },
    { type: "map-open", weight: 1 }
  ]);
  const actions = buildSmartActions(primaryCard, intent);
  const reservation = buildReservationRequest(primaryCard, primaryCard.kind === "event" ? "event" : "experience");
  const inquiry = buildInquiryWorkflow(primaryCard);
  const opportunityApplications = buildOpportunityApplications(cards);
  const plan = buildMovementPlan(cards, "Weekend discovery flow");
  const analytics = buildActionAnalytics([
    { type: "reservation", completed: true },
    { type: "visit", completed: true },
    { type: "plan", completed: true },
    { type: "application", completed: false }
  ]);
  const suggestions = predictDiscovery(cards, humanLayer.behavioralProfile, humanLayer.cityIntelligence).slice(0, 3);
  const cityIntelligence = buildCityIntelligence(cards);
  const decisionAssistant = {
    summary: `The user appears to be ${intent.primaryIntent.replace("-", " ")}.`,
    recommendation:
      intent.primaryIntent === "eating-out"
        ? "Reserve early if this is for a group."
        : intent.primaryIntent === "finding-opportunity"
          ? "Review fit, then apply externally when ready."
          : "Plan the route and move at the best time window.",
    alternatives: suggestions.map((item) => item.card.title)
  };

  return {
    intent,
    actions,
    reservation,
    inquiry,
    opportunityApplications,
    plan,
    analytics,
    decisionAssistant,
    suggestions,
    cityIntelligence
  };
}

export type ActionLayer = ReturnType<typeof buildActionLayer>;
export type Stage5ContributorSnapshot = ContributorProfile;
export type Stage5HumanInsightSnapshot = HumanInsight;
export type Stage5Plan = AFRIKAPlan;

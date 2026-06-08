import type { AFRIKACard, AFRIKAPlan } from "./types";

export const featuredCards: AFRIKACard[] = [
  {
    id: "lagos-lekki-art-district",
    title: "Lekki's New Creative Corridor",
    location: "Lekki, Lagos",
    category: "Neighborhood insight",
    kind: "neighborhood",
    tags: ["creative", "growth", "design", "nightlife"],
    coordinates: { lat: 6.4474, lng: 3.4963 },
    timestamp: "2026-06-08T08:00:00.000Z",
    media: {
      imageUrl:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80",
      alt: "Modern city street at dusk",
    },
    intelligence: {
      summary: "A fast-rising district where design studios, restaurants, and weekend culture are clustering.",
      whyItMatters: "Useful for creators, founders, and visitors looking for a modern Lagos pulse without a noisy commercial layer.",
      nearbyInsights: ["Gallery openings are peaking on Thursdays", "Cafes are becoming informal work hubs"],
      recommendations: ["Explore nearby studios", "Compare with Victoria Island", "Open map view"],
      comparison: "Feels more experimental than VI, but more polished than older core districts.",
    },
    freshnessScore: 0.91,
    trustScore: 0.84,
    relevanceScore: 0.88,
    decayRate: 0.12,
    lastVerifiedAt: "2026-06-07T14:10:00.000Z",
  },
  {
    id: "accra-coastal-escape",
    title: "A Quiet Coastal Escape Near Accra",
    location: "Labadi, Accra",
    category: "Discovery",
    kind: "discovery",
    tags: ["beach", "weekend", "calm", "scenic"],
    coordinates: { lat: 5.5678, lng: -0.1509 },
    timestamp: "2026-06-08T08:00:00.000Z",
    media: {
      imageUrl:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
      alt: "Beach shoreline at sunset",
    },
    intelligence: {
      summary: "A low-friction escape for people who want a calm reset with easy access from the city.",
      whyItMatters: "Helps people act on a real weekend idea rather than just bookmarking another vague place.",
      nearbyInsights: ["Best sunsets are usually after 5:45 PM", "Pair with a short food route nearby"],
      recommendations: ["Save to a weekend plan", "Compare nearby shoreline spots", "View nearby insights"],
    },
    freshnessScore: 0.87,
    trustScore: 0.79,
    relevanceScore: 0.86,
    decayRate: 0.08,
    lastVerifiedAt: "2026-06-08T09:22:00.000Z",
  },
  {
    id: "nairobi-work-ecosystem",
    title: "Where Nairobi's Quiet Work Energy Lives",
    location: "Kilimani, Nairobi",
    category: "Opportunity",
    kind: "opportunity",
    tags: ["work", "focus", "coffee", "productivity"],
    coordinates: { lat: -1.2921, lng: 36.8219 },
    timestamp: "2026-06-08T08:00:00.000Z",
    media: {
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
      alt: "Bright workspace interior",
    },
    intelligence: {
      summary: "A focused area with strong remote-work energy, useful cafes, and a stable daily rhythm.",
      whyItMatters: "This is the kind of practical local intelligence that turns a search into a decision.",
      nearbyInsights: ["Mid-morning is the quietest window", "Several places support longer stays"],
      recommendations: ["Compare to Westlands", "Read insight", "Add to plan"],
    },
    freshnessScore: 0.93,
    trustScore: 0.82,
    relevanceScore: 0.9,
    decayRate: 0.1,
    lastVerifiedAt: "2026-06-09T05:30:00.000Z",
  },
];

export const samplePlans: AFRIKAPlan[] = [
  {
    id: "weekend-lagos",
    title: "Weekend Lagos Reset",
    type: "weekend plan",
    items: [
      { id: "p1", title: "Lekki creative corridor", cardId: "lagos-lekki-art-district" },
      { id: "p2", title: "Dinner with a view" },
      { id: "p3", title: "Late afternoon map walk" },
    ],
  },
];

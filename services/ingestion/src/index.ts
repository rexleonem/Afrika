import Fastify from "fastify";
import {
  freshnessStatus,
  scoreCardTotal,
  type CrawlRun,
  type IngestionSource,
  type NormalizedCardDraft,
  type RawDiscovery
} from "@afrika/shared/stage2";

const app = Fastify({ logger: true });

const sources: IngestionSource[] = [
  {
    id: "source-lagos-tourism",
    name: "Lagos Tourism Signals",
    kind: "tourism",
    url: "https://www.tripadvisor.com",
    reliabilityScore: 0.82,
    active: true,
    crawlIntervalMinutes: 360
  },
  {
    id: "source-nairobi-jobs",
    name: "Nairobi Opportunity Radar",
    kind: "job-board",
    url: "https://www.linkedin.com/jobs",
    reliabilityScore: 0.74,
    active: true,
    crawlIntervalMinutes: 180
  }
];

const crawlRuns: CrawlRun[] = [];

function fingerprint(raw: RawDiscovery) {
  return `${raw.url}|${raw.title}`.toLowerCase();
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function titleSimilarity(a: string, b: string) {
  const left = new Set(normalizeText(a).split(/\s+/));
  const right = new Set(normalizeText(b).split(/\s+/));
  const overlap = [...left].filter((token) => right.has(token)).length;
  return overlap / Math.max(left.size, right.size, 1);
}

function geoDistanceKm(
  a?: { lat: number; lng: number },
  b?: { lat: number; lng: number }
) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const haversine =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(haversine));
}

function normalize(raw: RawDiscovery, source: IngestionSource): NormalizedCardDraft {
  return {
    id: `draft_${Buffer.from(fingerprint(raw)).toString("hex").slice(0, 24)}`,
    title: raw.title.trim(),
    location: raw.coordinates ? "African city signal" : "Unknown location",
    category: raw.categoryHint ?? "Discovery",
    kind: raw.categoryHint === "event" ? "event" : "place",
    tags: [source.kind, raw.categoryHint ?? "discovery"],
    coordinates: raw.coordinates ?? { lat: 0, lng: 0 },
    timestamp: raw.publishedAt ?? new Date().toISOString(),
    media: {
      imageUrl: raw.images?.[0] ?? "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
      videoUrl: raw.videos?.[0],
      alt: raw.title
    },
    sourceId: source.id,
    sourceUrl: raw.url,
    sourceReliability: source.reliabilityScore,
    rawFingerprint: fingerprint(raw),
    discoveryType: raw.categoryHint === "opportunity" ? "opportunity" : raw.categoryHint === "event" ? "event" : "place"
  };
}

function dedupeDraft(draft: NormalizedCardDraft, drafts: NormalizedCardDraft[]) {
  return drafts.some((item) => {
    const exactMatch = item.rawFingerprint === draft.rawFingerprint;
    const titleMatch = titleSimilarity(item.title, draft.title) > 0.66;
    const geoMatch = geoDistanceKm(item.coordinates, draft.coordinates) < 0.75;
    const mediaMatch = item.media.imageUrl === draft.media.imageUrl;
    return exactMatch || (titleMatch && geoMatch) || (titleMatch && mediaMatch);
  });
}

app.get("/health", async () => ({ ok: true, service: "afrika-ingestion" }));

app.get("/sources", async () => ({ items: sources }));

app.post("/crawl/preview", async (request) => {
  const body = request.body as { sourceId?: string; raw: RawDiscovery };
  const source = sources.find((item) => item.id === body.sourceId) ?? sources[0];
  const draft = normalize(body.raw, source);
  const quality = scoreCardTotal({
    usefulness: 0.82,
    uniqueness: 0.7,
    freshness: 0.88,
    visualQuality: 0.76,
    sourceTrust: source.reliabilityScore,
    engagementProbability: 0.61,
    localRelevance: 0.85
  });

  return {
    draft,
    freshnessStatus: freshnessStatus(quality.freshness),
    quality
  };
});

app.post("/crawl/run", async (request) => {
  const body = request.body as { sourceId?: string; rawItems: RawDiscovery[] };
  const source = sources.find((item) => item.id === body.sourceId) ?? sources[0];
  const startedAt = new Date().toISOString();
  const run: CrawlRun = {
    id: `crawl_${Date.now()}`,
    sourceId: source.id,
    startedAt,
    status: "success",
    fetchedCount: body.rawItems.length,
    dedupedCount: 0,
    errorCount: 0,
    finishedAt: new Date().toISOString()
  };

  const normalized = body.rawItems.map((raw) => normalize(raw, source));
  const unique = normalized.filter((draft) => !dedupeDraft(draft, normalized.filter((item) => item !== draft)));
  run.dedupedCount = normalized.length - unique.length;
  crawlRuns.unshift(run);

  return {
    run,
    items: unique.slice(0, 50)
  };
});

app.get("/runs", async () => ({ items: crawlRuns }));

const port = Number(process.env.PORT ?? 5100);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});

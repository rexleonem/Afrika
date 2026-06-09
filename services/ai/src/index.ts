import Fastify from "fastify";
import cors from "@fastify/cors";
import { enrichCard, interpretSearch, recommendNearby } from "./intelligence.js";
import { providerForRole, roleLabel } from "./providers.js";

const app = Fastify({ logger: true });

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);

await app.register(cors, {
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true
});

app.get("/health", async () => ({ ok: true, service: "afrika-ai" }));

app.get("/roles", async () => ({
  roles: {
    structure: {
      provider: roleLabel("structure"),
      purpose: "Turn messy real-world data into structured cards",
      providerConfig: providerForRole("structure")
    },
    speed: {
      provider: roleLabel("speed"),
      purpose: "Serve fast user-facing parsing and response layers",
      providerConfig: providerForRole("speed")
    },
    reason: {
      provider: roleLabel("reason"),
      purpose: "Rank, judge, compare, and generate deep insight",
      providerConfig: providerForRole("reason")
    }
  }
}));

app.post("/enrich", async (request) => {
  const body = request.body as {
    title?: string;
    location?: string;
    category?: string;
    rawText?: string;
    sourceReliability?: number;
  };

  return enrichCard({
    title: body.title ?? "Untitled card",
    location: body.location ?? "Africa",
    category: body.category ?? "Discovery",
    sourceReliability: body.sourceReliability,
    rawText: body.rawText
  });
});

app.post("/search-interpret", async (request) => {
  const body = request.body as { query?: string };
  return {
    role: roleLabel("speed"),
    interpretation: interpretSearch(body.query ?? "")
  };
});

app.post("/recommend", async (request) => {
  const body = request.body as { title?: string; location?: string };
  return {
    role: roleLabel("reason"),
    items: recommendNearby(body.title ?? "This place", body.location ?? "the area")
  };
});

app.post("/compare", async (request) => {
  const body = request.body as { a?: string; b?: string; context?: string };
  return {
    role: roleLabel("reason"),
    comparison: `${body.a ?? "Option A"} is better for discovery flow, while ${body.b ?? "Option B"} may fit different budget or lifestyle priorities.`,
    context: body.context ?? "general"
  };
});

app.post("/structure", async (request) => {
  const body = request.body as { title?: string; location?: string; rawText?: string };
  return {
    role: roleLabel("structure"),
    structured: {
      title: body.title ?? "Untitled card",
      location: body.location ?? "Unknown",
      category: "Discovery",
      tags: ["structured", "africa"],
      entities: []
    }
  };
});

const port = Number(process.env.PORT ?? 5000);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});

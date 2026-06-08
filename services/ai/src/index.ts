import Fastify from "fastify";

const app = Fastify({ logger: true });

app.post("/enrich", async (request) => {
  const body = request.body as { title?: string; location?: string; rawText?: string };

  return {
    summary: `A concise intelligence layer for ${body.title ?? "this item"} in ${body.location ?? "Africa"}.`,
    whyItMatters: "Transforms raw internet data into useful local intelligence.",
    tags: ["fresh", "useful", "contextual"],
    relevanceScore: 0.87,
    trustScore: 0.81
  };
});

app.post("/search-intent", async (request) => {
  const body = request.body as { query?: string };

  return {
    query: body.query ?? "",
    intent: "discover",
    facets: ["places", "neighborhoods", "insights"],
    responseHint: "Return visually ranked cards with nearby context."
  };
});

const port = Number(process.env.PORT ?? 5000);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});

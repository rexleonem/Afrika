import Fastify from "fastify";
import { featuredCards } from "@afrika/shared/content";

const app = Fastify({ logger: true });

app.get("/health", async () => ({ ok: true, service: "afrika-api" }));

app.get("/cards/featured", async () => ({
  items: featuredCards,
  meta: {
    rankedBy: ["usefulness", "freshness", "local relevance", "trust", "visual quality"]
  }
}));

app.get("/plans/sample", async () => ({
  items: [
    {
      id: "weekend-lagos",
      title: "Weekend Lagos Reset",
      type: "weekend plan"
    }
  ]
}));

const port = Number(process.env.PORT ?? 4000);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});

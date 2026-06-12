# AFRIKA

AFRIKA is a visual intelligence layer for African life.

This repository is scaffolded as a monorepo with:

- `apps/mobile` for the Expo React Native experience
- `apps/web` for the Next.js editorial web app
- `apps/admin` for internal operations
- `services/api` for the Fastify backend
- `services/ai` for the DeepSeek-powered AI microservice
- `packages/shared` for shared content models, design tokens, and utility helpers

## Product Direction

AFRIKA is not social media, a marketplace, classifieds, or a generic AI content generator.

It is a continuously updating intelligence layer for African places, culture, opportunities, and movement.

The operating loop is:

1. discover
2. structure
3. enrich
4. rank
5. keep fresh
6. distribute

## AI Model Roles

AFRIKA uses a layered intelligence pipeline:

- Gemini: structure and multimodal understanding
- Groq: fast user-facing parsing and response
- DeepSeek: deep reasoning, ranking, comparisons, and judgments

The rule is simple: structure with Gemini, serve fast with Groq, reason with DeepSeek.

## Build Priority

Stage 1 focuses on:

- admin control center
- backend API foundation
- web discovery experience
- AI enrichment service
- mobile discovery shell

The platform should feel alive through useful intelligence, not random automatic posting.

## Deployment Split

- Web app and admin app deploy to Vercel
- API, AI, and ingestion services deploy to a separate server
- Public domains:
  - `afrika.ng`
  - `www.afrika.ng`
  - `admin.afrika.ng`
  - API service origin
  - AI service origin
- Web and admin call the server over public HTTPS endpoints
- The server should allow CORS from the AFRIKA frontend origins

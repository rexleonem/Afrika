# AFRIKA Architecture

## Product Loop

Discover -> Structure -> Enrich -> Rank -> Keep Fresh -> Distribute

## Core Product Philosophy

AFRIKA is a visual intelligence layer for African life.

It should feel like Africa itself is updating in real time, but only with useful intelligence.

## Surfaces

- Web app: first-class discovery experience, hosted on Vercel
- Admin app: operating system for content operations, hosted on Vercel
- Mobile app: light immersive companion

## Services

- API service: cards, feed, search, plans, users, geo, hosted on a separate server
- AI service: enrichment, intent parsing, recommendations, trends, scoring, hosted on a separate server
- Ingestion service: discovery, extraction, deduplication, normalization

## Deployment Topology

- Vercel: web app at `afrika.ng` and `www.afrika.ng`, admin app at `admin.afrika.ng`
- Server: API at `afrika.techculture.live`, AI at `afrika-ai.techculture.live`, ingestion as a private/internal service
- Public frontends communicate with server services over HTTPS
- CORS must allow the AFRIKA origins defined in environment variables

## Autonomous Intelligence Network

The platform runs on five autonomous layers:

1. discovery
2. structuring
3. intelligence
4. ranking
5. freshness

## Data Model

Core entities:

- users
- cards
- locations
- categories
- plans
- saves
- trends
- embeddings
- recommendations

## Ingestion Philosophy

The platform should continuously discover, normalize, deduplicate, enrich, score, and redistribute useful local intelligence.

The system must never be designed around random automatic posting.

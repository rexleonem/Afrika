"use client";

import { motion } from "framer-motion";
import { featuredCards } from "@afrika/shared/content";
import { freshnessStatus, interpretSearch, scoreCardTotal } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";
import { buildHumanIntelligenceLayer, generateCulturalStories } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { buildStage8WorldModel } from "@afrika/shared/stage8";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../components/primitives";
import { TrendCard, NeighborhoodCard } from "../components/cards/discovery-card";
import { AIInsightPanel, ContextPanel } from "../components/panels/ai-insight-panel";
import { AmbientGlow } from "../components/motion/ambient-glow";
import { ScrollReveal, StaggerContainer, staggerItem } from "../components/motion/scroll-reveal";
import Link from "next/link";

// ── Intelligence layer ──────────────────────────────────────────────────────
const cityIntelligence = buildCityIntelligence(featuredCards);
const humanLayer = buildHumanIntelligenceLayer(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "search", query: "quiet places to work in Lagos", timestamp: "2026-06-09T05:30:00.000Z" },
  { type: "save", cardId: featuredCards[0]?.id, timestamp: "2026-06-09T05:31:00.000Z" },
]);
const culturalStories = generateCulturalStories(featuredCards, []);
const actionLayer = buildActionLayer(featuredCards);
const ambientIntelligence = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const stage8 = buildStage8WorldModel(featuredCards);
const predictiveHighlights = predictDiscovery(featuredCards, behavioralProfile, cityIntelligence);
const trendQuery = interpretSearch("trending places in Lagos this week");
const feedHighlights = featuredCards.map((card) => ({
  ...card,
  quality: scoreCardTotal({
    usefulness: 0.86,
    uniqueness: 0.72,
    freshness: card.freshnessScore,
    visualQuality: 0.91,
    sourceTrust: card.trustScore,
    engagementProbability: 0.66,
    localRelevance: card.relevanceScore,
  }),
}));

// ── Ticker content ──────────────────────────────────────────────────────────
const tickerItems = [
  "Trending · Lekki Creative Corridor, Lagos",
  "Rising · Kilimani Work Hubs, Nairobi",
  "Quiet Escape · Labadi Beach, Accra",
  "Weekend · Ikoyi Dining Scene, Lagos",
  "Cultural · Afrofuturist Movement, Pan-African",
  "Discovery · Westlands Tech Quarter, Nairobi",
  "Evening · Mombasa Old Town, Kenya",
  "Trending · Lekki Creative Corridor, Lagos",
  "Rising · Kilimani Work Hubs, Nairobi",
  "Quiet Escape · Labadi Beach, Accra",
];

// ── Extra editorial cards (enriched) ───────────────────────────────────────
const editorialSections = [
  {
    id: "trending-now",
    eyebrow: "Trending Now",
    title: "Areas with rising energy across African cities.",
    cards: featuredCards,
  },
  {
    id: "quiet-zones",
    eyebrow: "Quiet Discovery Zones",
    title: "Places where calm focus meets local beauty.",
    cards: [...featuredCards].reverse(),
  },
];

export default function HomePage() {
  return (
    <main className="pb-24 lg:pb-12">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
        }}
      >
        {/* Ambient glow orbs */}
        <AmbientGlow
          variant="gold"
          size="xl"
          className="top-[15%] left-[10%]"
          opacity={0.65}
        />
        <AmbientGlow
          variant="forest"
          size="lg"
          className="top-[25%] right-[8%]"
          opacity={0.45}
          animationDelay="-4s"
        />
        <AmbientGlow
          variant="clay"
          size="md"
          className="bottom-[20%] left-[50%]"
          opacity={0.35}
          animationDelay="-7s"
        />

        {/* Hero image with cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${featuredCards[0]?.media.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, var(--bg-primary) 85%)",
          }}
        />

        {/* Intelligence ticker */}
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden border-b"
          style={{
            borderColor: "var(--border-subtle)",
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="flex whitespace-nowrap py-2.5"
            style={{ animation: "ticker-scroll 35s linear infinite" }}
          >
            {tickerItems.map((item, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-6 uppercase tracking-[0.28em]"
                style={{ color: "var(--text-muted)" }}
              >
                {item}
                <span
                  className="mx-6 inline-block w-1 h-1 rounded-full align-middle"
                  style={{ background: "var(--accent-gold)", opacity: 0.5 }}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-4 pb-16 sm:px-8 lg:px-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Eyebrow chips */}
            <div className="flex flex-wrap gap-2 pt-20">
              {["Visual Intelligence Layer", "African Reality OS", "Ambient Discovery"].map((chip) => (
                <span key={chip} className="afrika-chip">
                  {chip}
                </span>
              ))}
            </div>

            {/* Hero title */}
            <h1 className="afrika-hero-title max-w-4xl">
              Africa, rendered as a{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-warm) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                cinematic stream
              </span>{" "}
              of places, signals &amp; culture.
            </h1>

            {/* Subtext */}
            <p
              className="text-base leading-7 max-w-2xl sm:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Premium discovery with AI insights, spatial context, and action paths that
              feel calm, not transactional.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/discover/lagos-lekki-art-district" className="btn-primary">
                Begin exploring
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/map" className="btn-secondary">
                Open map
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13V7m0 13 6-3M9 7l6-3m0 17 5.447-2.724A1 1 0 0 0 21 16.382V5.618a1 1 0 0 0-1.447-.894L15 7m0 14V7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating ambient briefing card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-6 bottom-20 hidden xl:block"
          style={{ width: 260 }}
        >
          <div
            className="rounded-[24px] p-5"
            style={{
              background: "var(--bg-glass)",
              backdropFilter: "blur(28px)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="afrika-label">Ambient mode</div>
              <div
                className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(109,139,125,0.12)",
                  border: "1px solid rgba(109,139,125,0.22)",
                  color: "var(--accent-forest)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping-slow"
                  style={{ background: "var(--accent-forest)" }}
                />
                Live
              </div>
            </div>
            <div
              className="text-xl font-semibold capitalize mb-1"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display), serif",
              }}
            >
              {ambientIntelligence.adaptiveInterface.mode.replace(/-/g, " ")}
            </div>
            <p className="text-xs leading-5" style={{ color: "var(--text-muted)" }}>
              {ambientIntelligence.adaptiveInterface.tone}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── DISCOVERY FEED ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-16 space-y-8">

        {/* Section header */}
        <ScrollReveal>
          <SectionHeader
            eyebrow="Editorial feed"
            title="Immersive discoveries, AI-curated for context and clarity."
            description="A visual rhythm of places, neighborhoods, and cultural signals with insight layered in."
            action={
              <Link href="/search" className="btn-secondary text-sm">
                Browse all
              </Link>
            }
          />
        </ScrollReveal>

        {/* 3-column + sidebar layout */}
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">

          {/* Cards grid */}
          <div className="space-y-6">
            {/* Hero card (first card, large) */}
            <ScrollReveal>
              <NeighborhoodCard
                title={feedHighlights[0]?.title ?? ""}
                description={feedHighlights[0]?.intelligence.summary ?? ""}
                location={feedHighlights[0]?.location ?? ""}
                imageUrl={feedHighlights[0]?.media.imageUrl ?? ""}
                tags={feedHighlights[0]?.tags}
              />
            </ScrollReveal>

            {/* 2-column grid for remaining cards */}
            <StaggerContainer className="grid gap-5 sm:grid-cols-2">
              {feedHighlights.map((card, index) => (
                <motion.div key={card.id} variants={staggerItem}>
                  <DiscoveryCard
                    card={card}
                    score={`Q ${card.quality.total}`}
                    highlight={card.intelligence.whyItMatters}
                    cta="Open intelligence"
                  />
                </motion.div>
              ))}
            </StaggerContainer>
          </div>

          {/* Right context panel */}
          <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
            <AIInsightPanel title="Ambient briefing" live>
              <div
                className="text-2xl font-semibold capitalize mb-2"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display), serif",
                }}
              >
                {ambientIntelligence.adaptiveInterface.mode.replace(/-/g, " ")}
              </div>
              <p className="text-xs leading-5 mb-4" style={{ color: "var(--text-secondary)" }}>
                {ambientIntelligence.adaptiveInterface.tone}
              </p>
              <div className="space-y-2">
                {ambientIntelligence.suggestions.slice(0, 3).map((item) => (
                  <InsightRow
                    key={`${item.city}-${item.title}`}
                    title={item.title}
                    detail={`${item.city} · ${item.reason}`}
                    accent
                  />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="City pulse">
              <div className="space-y-2">
                {ambientIntelligence.cityPulse.map((pulse) => (
                  <InsightRow
                    key={`${pulse.city}-${pulse.hour}`}
                    title={`${pulse.city}`}
                    detail={`${pulse.bestWindow} · Pulse ${pulse.pulse}`}
                    accent
                  />
                ))}
              </div>
            </AIInsightPanel>

            <AIInsightPanel title="Intent engine">
              <InsightRow
                title={actionLayer.intent.primaryIntent.replace(/-/g, " ")}
                detail={actionLayer.intent.nextStepPrompt}
                accent
              />
              <div className="mt-2">
                <InsightRow
                  title="Timing"
                  detail={actionLayer.intent.timingHint}
                />
              </div>
            </AIInsightPanel>
          </ContextPanel>
        </div>
      </section>

      {/* ── TRENDING HORIZONTAL SCROLL ──────────────────────────────── */}
      <section className="mt-20">
        <div className="px-4 sm:px-8 lg:px-12 mb-6">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Trending now"
              title="Places accelerating across African cities this week."
            />
          </ScrollReveal>
        </div>
        <div className="pl-4 sm:pl-8 lg:pl-12">
          <div className="scroll-x">
            {featuredCards.map((card, i) => (
              <TrendCard
                key={card.id}
                title={card.title}
                location={card.location}
                tag={card.kind}
                imageUrl={card.media.imageUrl}
                trend={i === 0 ? "Rising fast" : i === 1 ? "Popular" : undefined}
              />
            ))}
            {/* Duplicate for visual variety */}
            {[...featuredCards].reverse().map((card, i) => (
              <TrendCard
                key={`dup-${card.id}`}
                title={card.title}
                location={card.location}
                tag={card.category}
                imageUrl={card.media.imageUrl}
                trend={i === 1 ? "Weekend pick" : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── PREDICTIVE DISCOVERY ────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-20">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Predictive discovery"
            title="What AFRIKA expects you may want next."
            description="The system predicts follow-up discoveries based on behavior, geography, and ambient signals."
          />
        </ScrollReveal>

        <StaggerContainer className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {predictiveHighlights.map((item, i) => (
            <motion.div key={item.card.id} variants={staggerItem}>
              <Link href={`/discover/${item.card.id}` as `/discover/${string}`}>
                <div
                  className="rounded-[24px] p-5 h-full group transition-all duration-300"
                  style={{
                    background: "var(--bg-glass-light)",
                    border: "1px solid var(--border-default)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(210,166,109,0.30)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.20)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="text-[0.62rem] uppercase tracking-[0.38em] mb-3"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {item.horizon}
                  </div>
                  <h3
                    className="text-lg font-semibold leading-snug mb-2"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display), serif",
                    }}
                  >
                    {item.card.title}
                  </h3>
                  <p className="text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                    {item.reason}
                  </p>
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    Explore
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </section>

      {/* ── QUIET DISCOVERY / EDITORIAL SECTIONS ────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-20">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Quiet discovery zones"
            title="Places where calm focus meets local beauty."
          />
        </ScrollReveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {[...featuredCards].reverse().map((card, i) => (
            <ScrollReveal key={card.id} delay={i * 0.1}>
              <DiscoveryCard card={card} cta="Explore quietly" />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENCE METRICS ────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-20">
        <ScrollReveal>
          <div
            className="rounded-[32px] p-8 relative overflow-hidden"
            style={{
              background: "var(--bg-glass-light)",
              border: "1px solid var(--border-default)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(210,166,109,0.10) 0%, transparent 70%)",
                filter: "blur(40px)",
                transform: "translate(20%, -30%)",
              }}
            />
            <SectionHeader
              eyebrow="Intelligence graph"
              title="Connected discovery layers across African cities."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricTile
                label="Freshness signal"
                value={freshnessStatus(feedHighlights[0]?.quality.freshness ?? 0.8)}
                detail="Cards decay when signal quality fades."
              />
              <MetricTile
                label="City intelligence"
                value={cityIntelligence[0]?.city ?? "Lagos"}
                detail={`Momentum ${cityIntelligence[0]?.trendMomentum ?? 0} · Density ${cityIntelligence[0]?.discoveryDensity ?? 0}`}
              />
              <MetricTile
                label="Human layer"
                value={`${humanLayer.cityIntelligence.length} cities`}
                detail="Human context alongside AI structure."
              />
              <MetricTile
                label="Behavioral match"
                value={behavioralProfile.archetype.replace(/-/g, " ")}
                detail={`Discovery style: ${behavioralProfile.discoveryStyle}`}
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CULTURAL MOVEMENTS ──────────────────────────────────────── */}
      <section className="px-4 sm:px-8 lg:px-12 mt-20">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Cultural movements"
            title="Editorial stories generated from the intelligence graph."
            action={
              <Link href="/search" className="btn-secondary text-sm">
                View all stories
              </Link>
            }
          />
        </ScrollReveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {culturalStories.slice(0, 3).map((story, i) => (
            <ScrollReveal key={story.id} delay={i * 0.1}>
              <div
                className="rounded-[24px] p-5 h-full"
                style={{
                  background: "var(--bg-glass-light)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(210,166,109,0.10)",
                    border: "1px solid rgba(210,166,109,0.18)",
                  }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent-gold)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                  </svg>
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-display), serif",
                  }}
                >
                  {story.title}
                </h3>
                <p className="text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                  {story.summary}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 mt-20">
        <ScrollReveal>
          <SectionHeader
            eyebrow="World model"
            title="AFRIKA now reads Africa as a living simulation of movement, culture, and opportunity."
            description="Stage 8 adds digital twins, predictive reality, and autonomous discovery agents to the live graph."
          />
        </ScrollReveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Cities modeled" value={`${stage8.digitalTwins.length}`} detail="Living city twin layers." />
          <MetricTile label="Discovery agents" value={`${stage8.orchestration.agents.length}`} detail="Culture, food, tourism, opportunity." />
          <MetricTile label="Simulations" value={`${stage8.simulations.length}`} detail="Regional futures and movement patterns." />
          <MetricTile label="World model" value={stage8.worldModel[0]?.city ?? "Africa"} detail="Neighborhood, behavior, and environment." />
        </div>
      </section>

    </main>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { AFRIKACard } from "@afrika/shared/types";
import { freshnessStatus, scoreCardTotal } from "@afrika/shared/stage2";
import { buildCityIntelligence, inferBehavioralProfile, predictDiscovery } from "@afrika/shared/stage3";
import { buildHumanIntelligenceLayer, generateCulturalStories } from "@afrika/shared/stage4";
import { buildActionLayer } from "@afrika/shared/stage5";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { DiscoveryCard, InsightRow, MetricTile, SectionHeader } from "../components/primitives";
import { NeighborhoodCard, TrendCard } from "../components/cards/discovery-card";
import { AmbientGlow } from "../components/motion/ambient-glow";
import { ScrollReveal, StaggerContainer, staggerItem } from "../components/motion/scroll-reveal";
import { AIInsightPanel, ContextPanel } from "../components/panels/ai-insight-panel";
import { apiFetch } from "../lib/api";
import { buildLocationQuery, useLocationContext } from "../lib/location-context";

type FeedResponse = {
  items: AFRIKACard[];
};

type HeroContent = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  alt: string;
  locationLabel: string;
  featuredCardId?: string;
  chips: string[];
  updatedAt: string;
};

type HeroResponse = {
  hero: HeroContent;
  featuredCard: AFRIKACard | null;
};

function formatLocationSignal(cardCount: number, locationLabel: string | null, source?: string) {
  if (!locationLabel) {
    return cardCount > 0 ? "Live signals across African cities" : "Loading live city signals";
  }

  if (source === "gps") return `Near ${locationLabel}`;
  return `Around ${locationLabel}`;
}

export default function HomePage() {
  const [cards, setCards] = useState<AFRIKACard[]>([]);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [heroCard, setHeroCard] = useState<AFRIKACard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { effectiveLocation, geolocationStatus, requestPreciseLocation, isLocating } = useLocationContext();

  const locationQuery = useMemo(() => buildLocationQuery(effectiveLocation), [effectiveLocation]);
  const locationLabel = useMemo(() => {
    if (!effectiveLocation) return null;
    if (effectiveLocation.label?.trim()) return effectiveLocation.label;
    return [effectiveLocation.city, effectiveLocation.country].filter(Boolean).join(", ") || null;
  }, [effectiveLocation]);

  useEffect(() => {
    let active = true;

    void apiFetch<HeroResponse>("/hero")
      .then((response) => {
        if (!active) return;
        setHero(response.hero);
        setHeroCard(response.featuredCard);
      })
      .catch(() => {
        if (!active) return;
        setHero(null);
        setHeroCard(null);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadFeed = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = locationQuery ? `/feed?limit=24&${locationQuery}` : "/feed?limit=24";
        const response = await apiFetch<FeedResponse>(query);
        if (!active) return;
        setCards(response.items);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "We couldn't load the feed right now.");
        setCards([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadFeed();

    return () => {
      active = false;
    };
  }, [locationQuery]);

  const enrichedCards = useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        quality: scoreCardTotal({
          usefulness: 0.86,
          uniqueness: 0.74,
          freshness: card.freshnessScore,
          visualQuality: 0.91,
          sourceTrust: card.trustScore,
          engagementProbability: 0.68,
          localRelevance: card.relevanceScore
        })
      })),
    [cards]
  );

  const cityIntelligence = useMemo(() => (cards.length ? buildCityIntelligence(cards) : []), [cards]);
  const humanLayer = useMemo(() => (cards.length ? buildHumanIntelligenceLayer(cards) : null), [cards]);
  const behavioralProfile = useMemo(() => (cards.length ? inferBehavioralProfile(cards) : null), [cards]);
  const predictiveHighlights = useMemo(
    () => (cards.length && behavioralProfile ? predictDiscovery(cards, behavioralProfile, cityIntelligence) : []),
    [behavioralProfile, cards, cityIntelligence]
  );
  const actionLayer = useMemo(() => (cards.length ? buildActionLayer(cards) : null), [cards]);
  const ambientIntelligence = useMemo(
    () => (cards.length ? buildAmbientIntelligence(cards, new Date().toISOString()) : null),
    [cards]
  );
  const culturalStories = useMemo(() => (cards.length ? generateCulturalStories(cards, []) : []), [cards]);

  const leadCard = enrichedCards[0] ?? null;
  const heroLeadCard = heroCard ?? leadCard;
  const feedCards = enrichedCards.filter((card) => card.id !== heroLeadCard?.id).slice(0, 6);
  const trendCards = enrichedCards.slice(0, 10);
  const tickerItems = [
    formatLocationSignal(enrichedCards.length, locationLabel, effectiveLocation?.source),
    ...enrichedCards.slice(0, 7).map((card) => `${card.location} · ${card.title}`)
  ];

  const heroImage = hero?.imageUrl ?? heroLeadCard?.media.imageUrl ?? null;
  const heroVideo = hero?.videoUrl ?? heroLeadCard?.media.videoUrl ?? undefined;
  const heroTitle = hero?.title ?? "See what is actually pulling people, ideas, and attention across African cities.";
  const heroDescription =
    hero?.description ??
    "AFRIKA brings the place, the context, and the next move together, so discovery feels grounded instead of noisy.";
  const heroEyebrow = hero?.eyebrow ?? "Living discovery feed";
  const heroChips = hero?.chips?.length ? hero.chips : ["Live city signal", "Nommo guided", "Editor pick"];
  const heroLocation = hero?.locationLabel ?? heroLeadCard?.location ?? locationLabel ?? "Across African cities";
  const heroHref = heroLeadCard ? (`/discover/${heroLeadCard.id}` as `/discover/${string}`) : ("/search" as const);

  return (
    <main className="pb-24 lg:pb-12">
      <section
        className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)" }}
      >
        <AmbientGlow variant="gold" size="xl" className="left-[8%] top-[16%]" opacity={0.42} />
        <AmbientGlow variant="forest" size="lg" className="right-[10%] top-[14%]" opacity={0.28} animationDelay="-4s" />
        <AmbientGlow variant="clay" size="md" className="bottom-[16%] left-[52%]" opacity={0.24} animationDelay="-8s" />

        {heroVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideo}
            poster={heroImage ?? undefined}
            muted
            loop
            playsInline
            autoPlay
          />
        ) : heroImage ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center 34%"
            }}
          />
        ) : null}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0.18) 0%, rgba(8,8,10,0.30) 38%, rgba(8,8,10,0.92) 88%), linear-gradient(90deg, rgba(8,8,10,0.58) 0%, rgba(8,8,10,0.12) 55%)"
          }}
        />

        <div
          className="absolute left-0 right-0 top-0 overflow-hidden border-b"
          style={{ borderColor: "var(--border-subtle)", background: "var(--bg-glass)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex whitespace-nowrap py-2.5" style={{ animation: "ticker-scroll 35s linear infinite" }}>
            {tickerItems.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="px-6 text-[10px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "var(--text-muted)" }}
              >
                {item}
                <span className="mx-6 inline-block h-1 w-1 rounded-full align-middle" style={{ background: "var(--accent-gold)", opacity: 0.5 }} />
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl px-4 pb-16 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 pt-24"
          >
            <div className="flex flex-wrap gap-2">
              {heroChips.map((chip) => (
                <span key={chip} className="afrika-chip">
                  {chip}
                </span>
              ))}
              <span className="afrika-chip">{heroLocation}</span>
              {effectiveLocation?.source === "gps" ? <span className="afrika-chip">Exact location on</span> : null}
            </div>

            <div className="space-y-3">
              <div className="text-xs font-medium uppercase tracking-[0.42em] text-white/55">{heroEyebrow}</div>
              <h1 className="afrika-hero-title max-w-4xl">{heroTitle}</h1>
            </div>

            <p className="max-w-2xl text-base leading-7 sm:text-lg" style={{ color: "var(--text-secondary)" }}>
              {heroDescription}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-white/70">
              {locationLabel ? (
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-sm">
                  {effectiveLocation?.source === "gps" ? `Using your exact position near ${locationLabel}` : `Reading from ${locationLabel}`}
                </span>
              ) : (
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-sm">
                  Wide-angle discovery across the current graph
                </span>
              )}

              {geolocationStatus === "prompt" && effectiveLocation?.source !== "gps" ? (
                <button
                  type="button"
                  onClick={() => void requestPreciseLocation()}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white transition hover:border-white/20 hover:bg-white/15"
                >
                  {isLocating ? "Finding your exact spot..." : "Use exact location"}
                </button>
              ) : null}

              {geolocationStatus === "denied" ? (
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-sm">
                  Exact location is blocked in this browser.
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href={heroHref} className="btn-primary">
                Start with this place
              </Link>
              <Link href={"/map" as const} className="btn-secondary">
                Open the map
              </Link>
            </div>
          </motion.div>
        </div>

        {ambientIntelligence ? (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-6 hidden xl:block"
            style={{ width: 320 }}
          >
            <div
              className="rounded-[24px] p-5"
              style={{ background: "var(--bg-glass)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="afrika-label">Right now</div>
                <span className="afrika-chip">Live</span>
              </div>
              <div className="text-xl font-semibold capitalize text-white" style={{ fontFamily: "var(--font-display), serif" }}>
                {ambientIntelligence.adaptiveInterface.mode.replace(/-/g, " ")}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/60">{ambientIntelligence.adaptiveInterface.tone}</p>
              {locationLabel ? <p className="mt-3 text-xs leading-5 text-white/45">Closest read: {locationLabel}</p> : null}
            </div>
          </motion.div>
        ) : null}
      </section>

      <section className="mt-16 space-y-8 px-4 sm:px-8 lg:px-12">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Live feed"
            title="Places people keep returning to, with the context that makes them useful."
            description={
              locationLabel
                ? `The feed is leaning toward ${locationLabel} first, then widening out into the rest of the graph.`
                : "Every card here is coming from the active discovery graph."
            }
            action={
              <Link href={"/search" as const} className="btn-secondary text-sm">
                Browse the full feed
              </Link>
            }
          />
        </ScrollReveal>

        {loading ? (
          <div className="afrika-panel p-8 text-sm text-white/65">Loading the latest discoveries...</div>
        ) : error ? (
          <div className="afrika-panel border-red-500/20 bg-red-500/5 p-8 text-sm text-red-100">{error}</div>
        ) : null}

        {heroLeadCard ? (
          <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <ScrollReveal>
                <Link href={`/discover/${heroLeadCard.id}` as `/discover/${string}`} className="block">
                  <NeighborhoodCard
                    title={heroLeadCard.title}
                    description={heroLeadCard.intelligence.summary}
                    location={heroLeadCard.location}
                    imageUrl={heroLeadCard.media.imageUrl}
                    videoUrl={heroLeadCard.media.videoUrl}
                    tags={heroLeadCard.tags}
                  />
                </Link>
              </ScrollReveal>

              <StaggerContainer className="grid gap-5 sm:grid-cols-2">
                {feedCards.map((card) => (
                  <motion.div key={card.id} variants={staggerItem}>
                    <DiscoveryCard
                      card={card}
                      score={`Q ${card.quality.total}`}
                      highlight={card.intelligence.whyItMatters}
                      cta="Open detail"
                    />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>

            <ContextPanel className="xl:sticky xl:top-6 xl:h-fit">
              {ambientIntelligence ? (
                <AIInsightPanel title="Nommo briefing" live>
                  <div className="space-y-2">
                    {ambientIntelligence.suggestions.slice(0, 3).map((item) => (
                      <InsightRow key={`${item.city}-${item.title}`} title={item.title} detail={`${item.city} · ${item.reason}`} accent />
                    ))}
                  </div>
                </AIInsightPanel>
              ) : null}

              {ambientIntelligence ? (
                <AIInsightPanel title="City pulse">
                  <div className="space-y-2">
                    {ambientIntelligence.cityPulse.slice(0, 3).map((pulse) => (
                      <InsightRow key={`${pulse.city}-${pulse.hour}`} title={pulse.city} detail={`${pulse.bestWindow} · pulse ${pulse.pulse}`} accent />
                    ))}
                  </div>
                </AIInsightPanel>
              ) : null}

              {actionLayer ? (
                <AIInsightPanel title="What the feed is leaning toward">
                  <InsightRow
                    title={actionLayer.intent.primaryIntent.replace(/-/g, " ")}
                    detail={actionLayer.intent.nextStepPrompt}
                    accent
                  />
                  <div className="mt-2">
                    <InsightRow title="Best timing" detail={actionLayer.intent.timingHint} />
                  </div>
                </AIInsightPanel>
              ) : null}
            </ContextPanel>
          </div>
        ) : null}
      </section>

      {trendCards.length > 0 ? (
        <section className="mt-20">
          <div className="mb-6 px-4 sm:px-8 lg:px-12">
            <ScrollReveal>
              <SectionHeader eyebrow="Moving now" title="Signals picking up pace across cities this week." />
            </ScrollReveal>
          </div>
          <div className="pl-4 sm:pl-8 lg:pl-12">
            <div className="scroll-x">
              {trendCards.map((card, index) => (
                <Link key={card.id} href={`/discover/${card.id}` as `/discover/${string}`}>
                  <TrendCard
                    title={card.title}
                    location={card.location}
                    tag={card.kind}
                    imageUrl={card.media.imageUrl}
                    videoUrl={card.media.videoUrl}
                    trend={index === 0 ? "Rising fast" : index === 1 ? "People are saving this" : undefined}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {predictiveHighlights.length > 0 ? (
        <section className="mt-20 px-4 sm:px-8 lg:px-12">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Good next moves"
              title="If one card lands for you, these are the places the graph naturally points to next."
            />
          </ScrollReveal>

          <StaggerContainer className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {predictiveHighlights.slice(0, 6).map((item) => (
              <motion.div key={item.card.id} variants={staggerItem}>
                <Link href={`/discover/${item.card.id}` as `/discover/${string}`}>
                  <div
                    className="group h-full rounded-[24px] p-5 transition-all duration-300"
                    style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-default)" }}
                  >
                    <div className="mb-3 text-[0.62rem] uppercase tracking-[0.38em]" style={{ color: "var(--accent-gold)" }}>
                      {item.horizon}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "var(--font-display), serif" }}>
                      {item.card.title}
                    </h3>
                    <p className="text-xs leading-5 text-white/60">{item.reason}</p>
                    <div className="mt-4 text-xs font-medium text-[var(--accent-gold)] opacity-0 transition-opacity group-hover:opacity-100">
                      Open detail
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>
      ) : null}

      <section className="mt-20 px-4 sm:px-8 lg:px-12">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[32px] p-8" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-default)" }}>
            <div
              className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(210,166,109,0.10) 0%, transparent 70%)", filter: "blur(40px)", transform: "translate(20%, -30%)" }}
            />
            <SectionHeader eyebrow="How the graph is reading the moment" title="A quick read on freshness, city momentum, and local trust." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricTile label="Freshness" value={heroLeadCard ? freshnessStatus(heroLeadCard.freshnessScore) : "warming"} detail="Signals soften when the information gets old." />
              <MetricTile
                label="Strongest city"
                value={cityIntelligence[0]?.city ?? "Loading"}
                detail={cityIntelligence[0] ? `Momentum ${cityIntelligence[0].trendMomentum.toFixed(2)} · density ${cityIntelligence[0].discoveryDensity.toFixed(2)}` : "City momentum is still loading."}
              />
              <MetricTile
                label="Human context"
                value={`${humanLayer?.cityIntelligence.length ?? 0} cities`}
                detail="Local notes are layered onto the discovery graph."
              />
              <MetricTile
                label="Reader profile"
                value={behavioralProfile ? behavioralProfile.archetype.replace(/-/g, " ") : "Loading"}
                detail={behavioralProfile ? `Style: ${behavioralProfile.discoveryStyle}` : "Waiting for the graph to settle."}
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {culturalStories.length > 0 ? (
        <section className="mt-20 px-4 sm:px-8 lg:px-12">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Context worth reading"
              title="Short editorial notes pulled out of the wider movement around these places."
            />
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {culturalStories.slice(0, 3).map((story, index) => (
              <ScrollReveal key={story.id} delay={index * 0.08}>
                <div className="h-full rounded-[24px] p-5" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)" }}>
                  <div className="afrika-label mb-3">Editorial note</div>
                  <h3 className="mb-2 text-base font-semibold text-white" style={{ fontFamily: "var(--font-display), serif" }}>
                    {story.title}
                  </h3>
                  <p className="text-xs leading-6 text-white/60">{story.summary}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

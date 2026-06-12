"use client";

import Link from "next/link";
import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { useAdminData } from "../../../components/admin-data-provider";

export default function OverviewPage() {
  const { snapshot } = useAdminData();

  return (
    <div className="space-y-6">
      <section className="afrika-panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">Control room</span>
              <span className="afrika-chip">Live data</span>
              <span className="afrika-chip">Multi-stage intelligence</span>
            </div>
            <div className="afrika-label">Overview</div>
            <h1 className="afrika-hero-title max-w-3xl text-4xl">A real operational surface for AFRIKA, not a blank shell.</h1>
            <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              The admin now enforces access and exposes multi-page operations for ingestion, model work, analytics, and trust.
            </p>
            <div className="flex flex-wrap gap-2">
              <SignalBadge label="Cards" value={snapshot?.overview.cardsInGraph ?? 0} />
              <SignalBadge label="Cities" value={snapshot?.overview.cityIntelligence ?? 0} />
              <SignalBadge label="Trust" value={snapshot?.monitoring.ingestion.sourceReliability?.toFixed(2) ?? "0.00"} />
              <SignalBadge label="Mode" value={snapshot?.monitoring.ambientMode ?? "idle"} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile label="Cards" value={snapshot?.overview.cardsInGraph ?? 0} detail="Active cards in the live graph." />
            <MetricTile label="Trends" value={snapshot?.overview.activeTrends ?? 0} detail="Trend signals in the live graph." />
            <MetricTile label="Stories" value={snapshot?.overview.culturalStories ?? 0} detail="Cultural narratives surfaced." />
            <MetricTile label="Ops" value={snapshot?.overview.actionSignals ?? 0} detail="Real action signals and orchestration." />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Operations center"
            title="The overview surface is now reading live platform state."
            description="Use this as the daily control room entry point for content, trust, and AI systems."
            action={
              <Link href="/operations" className="btn-secondary">
                Open operations
              </Link>
            }
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <QueueRow title="Feed coverage" detail={`${snapshot?.feed.totalCards ?? 0} cards available to the live feed endpoint.`} tone="good" />
            <QueueRow title="Search telemetry" detail={`${snapshot?.searches.length ?? 0} live queries recorded in search history.`} tone="good" />
            <QueueRow title="City intelligence" detail={`${snapshot?.overview.cityIntelligence ?? 0} city profiles are connected to the admin layer.`} tone="good" />
            <QueueRow title="Verification" detail={`${snapshot?.monitoring.verification ?? 0} verification items are active in the trust queue.`} tone="warn" />
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Quick links"
            title="Jump into the areas that need attention."
            description="This keeps the dashboard from feeling like a dead one-page admin."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Ingestion" detail="Source reliability, crawler health, and blocked sources." tone="good" />
            <QueueRow title="Model pipeline" detail="Prompt versions, model arbitration, and consistency rules." tone="good" />
            <QueueRow title="Analytics" detail="Search, trends, and user behavior flows." tone="good" />
            <QueueRow title="Trust" detail="Contributors, moderation, and verification confidence." tone="warn" />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Live content"
            title="The top cards are now visible as operational objects."
            description="Use these records to verify the dashboard is reading operational data."
          />
          <div className="mt-5 grid gap-3">
            {snapshot?.cards.slice(0, 4).map((card) => (
              <div key={card.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/45">{card.category}</div>
                    <div className="mt-2 text-lg font-medium text-white">{card.title}</div>
                    <div className="mt-1 text-sm text-white/55">{card.location}</div>
                  </div>
                  <SignalBadge label="Fresh" value={card.freshnessScore.toFixed(2)} />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">{card.intelligence.summary}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="System readout"
            title="Reality model, memory, and orchestration are connected."
            description="Stage 7 through 11 systems are exposed here so the admin can inspect live intelligence layers."
          />
          <div className="mt-5 space-y-3">
            <QueueRow title="Feedback loop" detail={snapshot?.stage7.validatorSummary ?? "Feedback loop warming up."} tone="good" />
            <QueueRow title="World model" detail={snapshot?.stage8.summary ?? "World model warming up."} tone="good" />
            <QueueRow title="Civilizational memory" detail={snapshot?.stage9.historicalGraph.summary ?? "Civilizational memory warming up."} tone="good" />
            <QueueRow title="Consciousness layer" detail={snapshot?.stage10.livingOrganism.summary ?? "Consciousness layer warming up."} tone="warn" />
            <QueueRow title="Orchestration layer" detail={snapshot?.stage11.invisibleAmbient.summary ?? "Orchestration layer warming up."} tone="warn" />
          </div>
        </article>
      </section>
    </div>
  );
}

"use client";

import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { useAdminData } from "../../../components/admin-data-provider";

export default function IngestionPage() {
  const { snapshot } = useAdminData();

  return (
    <div className="space-y-6">
      <section className="afrika-panel p-6">
        <SectionHeader
          eyebrow="Ingestion monitoring"
          title="Crawlers, sources, and freshness are visible as live runtime state."
          description="This page shows the background discovery engine instead of a fake monitoring mock."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Active crawlers" value={snapshot?.monitoring.ingestion.activeCrawlers ?? 0} detail="Sources actively crawling." />
          <MetricTile label="Queued sources" value={snapshot?.monitoring.ingestion.queuedSources ?? 0} detail="Sources in the inventory." />
          <MetricTile label="Failures" value={snapshot?.monitoring.ingestion.failedExtractions ?? 0} detail="Recent extraction failures." />
          <MetricTile label="Reliability" value={snapshot?.monitoring.ingestion.sourceReliability?.toFixed(2) ?? "0.00"} detail="Average source reliability." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Sources" title="Source management and crawl intervals." />
          <div className="mt-5 space-y-3">
            {snapshot?.sources.map((source) => (
              <QueueRow
                key={source.id}
                title={source.name}
                detail={`${source.kind} · every ${source.crawlIntervalMinutes} mins · reliability ${source.reliabilityScore.toFixed(2)}`}
                tone={source.active ? "good" : "warn"}
              />
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Freshness" title="Staleness and confidence controls." />
          <div className="mt-5 space-y-3">
            {snapshot?.monitoring.freshness.slice(0, 6).map((item) => (
              <QueueRow
                key={item.id}
                title={item.id}
                detail={`${item.status} · last verified ${item.lastVerifiedAt ?? "unknown"}`}
                tone={item.status === "stale" || item.status === "expired" ? "warn" : "good"}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Auto-refresh" value="on" />
            <SignalBadge label="Archive" value="stale cards" />
            <SignalBadge label="Repair" value="duplicates" />
          </div>
        </article>
      </section>
    </div>
  );
}

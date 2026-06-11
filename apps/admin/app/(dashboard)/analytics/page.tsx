"use client";

import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { useAdminData } from "../../../components/admin-data-provider";

export default function AnalyticsPage() {
  const { snapshot } = useAdminData();

  return (
    <div className="space-y-6">
      <section className="afrika-panel p-6">
        <SectionHeader
          eyebrow="Analytics"
          title="Search behavior, city momentum, and trust signals in one view."
          description="The analytics experience is now a live operations surface instead of a generic chart stub."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Searches" value={snapshot?.searches.length ?? 0} detail="Recorded live search queries." />
          <MetricTile label="Trend signals" value={snapshot?.trends.length ?? 0} detail="Live trend records." />
          <MetricTile label="Contributors" value={snapshot?.contributors.length ?? 0} detail="Live contributor profiles." />
          <MetricTile label="Verification" value={snapshot?.monitoring.verification ?? 0} detail="Trust queue volume." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Search history" title="What people are asking for right now." />
          <div className="mt-5 space-y-3">
            {snapshot?.searches.slice(0, 6).map((search) => (
              <QueueRow key={search.id} title={search.query} detail={`${search.intent} · ${search.resultCount} results`} tone="good" />
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Trend state" title="Signals that shape the live feed." />
          <div className="mt-5 space-y-3">
            {snapshot?.trends.slice(0, 6).map((trend, index) => (
              <QueueRow
                key={`${trend.label ?? trend.city ?? "trend"}-${index}`}
                title={trend.label ?? trend.city ?? "Trend signal"}
                detail={trend.reason ?? `Score ${trend.score ?? trend.momentum ?? 0}`}
                tone="warn"
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Mode" value={snapshot?.monitoring.ambientMode ?? "idle"} />
            <SignalBadge label="Quality" value={snapshot?.overview.qualityPreview ?? 0} />
          </div>
        </article>
      </section>
    </div>
  );
}

"use client";

import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { useAdminData } from "../../../components/admin-data-provider";

export default function OperationsPage() {
  const { snapshot } = useAdminData();

  return (
    <div className="space-y-6">
      <section className="afrika-panel p-6">
        <SectionHeader
          eyebrow="Content operations"
          title="Moderation queues, feed controls, and content health."
          description="This page focuses on the records the admin team actually needs to inspect and edit."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Cards" value={snapshot?.cards.length ?? 0} detail="Live cards in the content graph." />
          <MetricTile label="Plans" value={snapshot?.plans.length ?? 0} detail="Planning records in the backend." />
          <MetricTile label="Moderation" value={snapshot?.moderation.length ?? 0} detail="Items awaiting review." />
          <MetricTile label="Sources" value={snapshot?.sources.length ?? 0} detail="Ingestion sources under management." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Card queue" title="Live cards that can be moderated or inspected." />
          <div className="mt-5 space-y-3">
            {snapshot?.cards.slice(0, 6).map((card) => (
              <div key={card.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/45">{card.category}</div>
                    <div className="mt-2 text-base font-medium text-white">{card.title}</div>
                    <div className="mt-1 text-sm text-white/55">{card.location}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SignalBadge label="Trust" value={card.trustScore.toFixed(2)} />
                    <SignalBadge label="Relevance" value={card.relevanceScore.toFixed(2)} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">{card.intelligence.whyItMatters}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Moderation queue" title="Trust and editorial controls." />
          <div className="mt-5 space-y-3">
            {snapshot?.moderation.slice(0, 6).map((item) => (
              <QueueRow
                key={item.id}
                title={item.reason}
                detail={`Status: ${item.status} · Trust score ${item.trustScore.toFixed(2)}`}
                tone={item.status === "flagged" || item.status === "review" ? "warn" : "good"}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Controls" value="feature pinning" />
            <SignalBadge label="Controls" value="quality override" />
            <SignalBadge label="Controls" value="source blocking" />
          </div>
        </article>
      </section>

      <section className="afrika-panel p-6">
        <SectionHeader eyebrow="Feed control" title="Priority, seasonal, and regional controls are visible here." />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <QueueRow title="Top signal" detail={snapshot?.trends[0]?.reason ?? "Trend signals are warming up."} tone="good" />
          <QueueRow title="Plan depth" detail={`${snapshot?.plans.length ?? 0} live plans can be overseen.`} tone="good" />
          <QueueRow title="Action readiness" detail={`${snapshot?.monitoring.actionSignals ?? 0} action signals tracked.`} tone="warn" />
        </div>
      </section>
    </div>
  );
}

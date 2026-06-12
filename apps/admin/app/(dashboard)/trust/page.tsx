"use client";

import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { useAdminData } from "../../../components/admin-data-provider";

export default function TrustPage() {
  const { snapshot } = useAdminData();

  return (
    <div className="space-y-6">
      <section className="afrika-panel p-6">
        <SectionHeader
          eyebrow="Trust and verification"
          title="Contributors, verification, and cultural authenticity."
          description="This page surfaces the human trust layer that keeps the platform credible."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Profiles" value={snapshot?.contributors.length ?? 0} detail="Contributors in the network." />
          <MetricTile label="Verification" value={snapshot?.verification.length ?? 0} detail="Items awaiting trust review." />
          <MetricTile label="Stories" value={snapshot?.stories.length ?? 0} detail="Cultural stories published." />
          <MetricTile label="Users" value={snapshot?.users.length ?? 0} detail="Known users in the system." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Contributors" title="The local intelligence network is visible here." />
          <div className="mt-5 space-y-3">
            {snapshot?.contributors.map((contributor) => (
              <QueueRow
                key={contributor.id}
                title={contributor.name}
                detail={`${contributor.role} · ${contributor.city} · trust ${contributor.trustScore?.toFixed(2) ?? "0.00"}`}
                tone="good"
              />
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Verification" title="Human + model verification queue." />
          <div className="mt-5 space-y-3">
            {snapshot?.verification.slice(0, 6).map((item) => (
              <QueueRow key={item.id} title={item.contributorName ?? item.id} detail={`${item.status} · confidence ${item.confidence.toFixed(2)}`} tone={item.status === "flagged" ? "warn" : "good"} />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Trust" value="subtle" />
            <SignalBadge label="Moderation" value="collaborative" />
            <SignalBadge label="Authenticity" value="active" />
          </div>
        </article>
      </section>

      <section className="afrika-panel p-6">
          <SectionHeader eyebrow="Cultural stories" title="Editorial narratives grounded in local intelligence." />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {snapshot?.stories.map((story) => (
            <div key={story.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">{story.city}</div>
              <div className="mt-2 text-lg font-medium text-white">{story.title}</div>
              <p className="mt-3 text-sm leading-6 text-white/60">{story.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

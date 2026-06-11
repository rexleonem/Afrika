"use client";

import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { useAdminData } from "../../../components/admin-data-provider";

export default function AiPage() {
  const { snapshot } = useAdminData();

  return (
    <div className="space-y-6">
      <section className="afrika-panel p-6">
        <SectionHeader
          eyebrow="Nommo pipeline"
          title="Prompt versions, model arbitration, and consistency rules."
          description="This page is where the admin inspects how Gemini, DeepSeek, and Groq are coordinated."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Pending summaries" value={snapshot?.monitoring.ai.pendingSummaries ?? 0} detail="Queued model jobs." />
          <MetricTile label="Flagged outputs" value={snapshot?.monitoring.ai.flaggedOutputs ?? 0} detail="Outputs needing review." />
          <MetricTile label="Confidence floor" value={snapshot?.monitoring.ai.confidenceFloor?.toFixed(2) ?? "0.00"} detail="Minimum quality threshold." />
          <MetricTile label="Prompt versions" value={Object.keys(snapshot?.stage7.promptVersions ?? {}).length} detail="Versioned prompt inventory." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Model arbitration" title="Structure, reason, and serve are visible as separate layers." />
          <div className="mt-5 space-y-3">
            {(snapshot?.stage7.arbitrationOrder ?? []).map((entry) => (
              <QueueRow key={entry} title={entry} detail="Part of the coordinated model pipeline." tone="good" />
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Consistency rules" title="The admin watches for drift and silent regressions." />
          <div className="mt-5 space-y-3">
            {(snapshot?.stage7.checks ?? []).map((entry) => (
              <QueueRow
                key={`${entry.model}-${entry.promptVersion}`}
                title={`${entry.model} · ${entry.promptVersion}`}
                detail={entry.passed ? "Consistency validated through the runtime control layer." : "Validation needs attention."}
                tone={entry.passed ? "good" : "warn"}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Gemini" value="structuring" />
            <SignalBadge label="DeepSeek" value="reasoning" />
            <SignalBadge label="Groq" value="speed" />
          </div>
        </article>
      </section>

      <section className="afrika-panel p-6">
        <SectionHeader eyebrow="Performance routing" title="Cache, routing, and queue priorities." />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <QueueRow
            title="Cache layers"
            detail={(snapshot?.stage7.performance.cachePlan ?? []).map((item) => item.key).join(" · ") || "No cache layers reported yet."}
            tone="good"
          />
          <QueueRow
            title="Routing"
            detail={
              snapshot?.stage7.performance.loadAwareRouting
                ? Object.entries(snapshot.stage7.performance.loadAwareRouting)
                    .map(([model, mode]) => `${model}: ${mode}`)
                    .join(" · ")
                : "No routing rules reported yet."
            }
            tone="good"
          />
          <QueueRow title="Priority queues" detail={snapshot?.stage7.performance.gracefulDegradation.join(" · ") || "No queue priorities reported yet."} tone="warn" />
        </div>
      </section>
    </div>
  );
}

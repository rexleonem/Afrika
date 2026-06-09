const ingestionHealth = [
  { label: "Active crawlers", value: "12" },
  { label: "Failed extractions", value: "3" },
  { label: "Queued sources", value: "8" },
  { label: "Source reliability", value: "0.82" }
];

const trendSignals = [
  "Trending in Lagos",
  "Fast-rising neighborhoods",
  "Weekend hotspots",
  "Growing opportunity zones"
];

const freshnessAlerts = [
  "12 stale cards",
  "4 expiring trends",
  "3 inactive place clusters",
  "5 cards need revalidation"
];

const contentManagement = [
  "Create and edit cards",
  "Manage categories and tags",
  "Attach or replace media",
  "Assign locations and coordinates"
];

const analytics = [
  "Saves",
  "Discovery engagement",
  "Popular locations",
  "Trending searches"
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-[#F5F1EA]">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Operations center</div>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Ingestion, AI, trends, and freshness.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
            AFRIKA's admin layer monitors the autonomous intelligence network and gives the team precise override controls.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ingestionHealth.map((item) => (
            <article key={item.label} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/55">{item.label}</div>
              <div className="mt-3 text-4xl font-semibold">{item.value}</div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Ingestion monitoring</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["Crawler queue", "Healthy"],
                ["Extraction errors", "Low"],
                ["Deduplication backlog", "Moderate"],
                ["Source reliability drift", "Stable"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{label}</div>
                  <div className="mt-2 text-lg font-medium">{value}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">AI monitoring</div>
            <div className="mt-4 space-y-3">
              {[
                ["Generated summaries", "128 pending review"],
                ["Flagged outputs", "7 need correction"],
                ["Confidence floor", "0.78"],
                ["Comparisons generated", "54"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{label}</div>
                  <div className="mt-2 text-lg font-medium">{value}</div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Source management</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Prioritize tourism and local blog sources</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Throttle social-signal crawls when duplicate noise rises</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Block low-reliability feeds</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Re-run active sources on freshness decay</div>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">AI generation queue</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Pending enrichments: 42</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Flagged summaries: 7</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Comparison jobs: 16</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Trend recompute due now</div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Content management</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              {contentManagement.map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Analytics</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {analytics.map((item) => (
                <div key={item} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{item}</div>
                  <div className="mt-2 text-lg font-medium">Live</div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Trend monitoring</div>
            <div className="mt-4 space-y-3">
              {trendSignals.map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Freshness monitoring</div>
            <div className="mt-4 space-y-3">
              {freshnessAlerts.map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Manual overrides</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Pin a card to the feed</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Block a noisy source</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Override quality score</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Moderate a trend cluster</div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

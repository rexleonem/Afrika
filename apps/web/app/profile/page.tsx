import { featuredCards } from "@afrika/shared/content";
import { buildActionLayer } from "@afrika/shared/stage5";
import { inferBehavioralProfile } from "@afrika/shared/stage3";
import { buildAmbientIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";

const actionLayer = buildActionLayer(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "save", cardId: featuredCards[0]?.id, timestamp: "2026-06-09T05:31:00.000Z" },
  { type: "search", query: "weekend plan under budget", timestamp: "2026-06-09T05:32:00.000Z" },
]);
const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

export default function ProfilePage() {
  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel-strong overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">Identity graph</span>
              <span className="afrika-chip">Taste profile</span>
              <span className="afrika-chip">Exploration memory</span>
            </div>
            <div className="afrika-label">Profile</div>
            <h1 className="afrika-title max-w-3xl">A personal exploration identity instead of a plain account page.</h1>
            <p className="afrika-copy max-w-2xl">
              Taste clusters, saved regions, and AI-inferred behavior create a profile that feels like a living decision layer.
            </p>
          </div>
          <div className="afrika-panel p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(200,155,92,0.25),rgba(255,255,255,0.06))] text-2xl font-semibold text-white">
                A
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.35em] text-white/45">Explorer mode</div>
                <div className="mt-2 text-2xl font-semibold text-white capitalize">{behavioralProfile.archetype.replace("-", " ")}</div>
                <p className="mt-1 text-sm leading-6 text-white/60">{behavioralProfile.discoveryStyle}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricTile label="Action intent" value={actionLayer.intent.primaryIntent.replace("-", " ")} detail={actionLayer.intent.nextStepPrompt} />
        <MetricTile label="Timing bias" value={actionLayer.intent.timingHint} detail="Planning sophistication is tracked quietly." />
        <MetricTile label="Adaptive mode" value={ambient.adaptiveInterface.mode.replace("-", " ")} detail={ambient.adaptiveInterface.tone} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <SectionHeader eyebrow="Profile intelligence" title="Your taste profile becomes a map of what you naturally explore." />
          <div className="afrika-panel p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Preferred cities" value={`${ambient.cityPulse.length}`} detail="Based on spatial and timing behavior." />
              <MetricTile label="Saved regions" value="5" detail="Clusters are organized by discovery habits." />
              <MetricTile label="Route style" value="Curated" detail="Plans become more spatial as behavior matures." />
              <MetricTile label="Memory depth" value="Adaptive" detail="The profile remembers timing, frequency, and intent." />
            </div>
          </div>
          <div className="afrika-panel p-5">
            <div className="afrika-label">Interest clusters</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Calm exploration", "Food routes", "Creative neighborhoods", "Weekend planning", "Trustworthy places"].map((item) => (
                <span key={item} className="afrika-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Activity history" title="A visual rhythm of saves, searches, and plans." />
            <div className="mt-4 space-y-3">
              <InsightRow title="Recent searches" detail="Quiet work spaces, weekend plans, and budget-aware discovery remain dominant." />
              <InsightRow title="Saved cards" detail={featuredCards.map((card) => card.title).join(" / ")} />
              <InsightRow title="Planning style" detail="Structured but calm: the profile prefers routes and outcomes over endless browsing." />
            </div>
          </div>
          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Memory layer" title="Adaptive continuity across cities and time." />
            <div className="mt-4 space-y-3">
              {ambient.memory.map((item) => (
                <InsightRow key={`${item.neighborhood}-${item.city}`} title={item.neighborhood} detail={`${item.city} - preferred timing ${item.preferredTiming}`} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

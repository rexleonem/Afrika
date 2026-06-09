import { featuredCards } from "@afrika/shared/content";
import { buildAmbientIntelligence, buildTemporalIntelligence } from "@afrika/shared/stage6";
import { InsightRow, MetricTile, SectionHeader } from "../../components/primitives";

const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const temporal = buildTemporalIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

const pins = [
  { top: "18%", left: "18%", tone: "emerald" },
  { top: "32%", left: "68%", tone: "gold" },
  { top: "63%", left: "42%", tone: "coral" },
];

export default function MapPage() {
  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel-strong overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="afrika-chip">Spatial discovery layer</span>
              <span className="afrika-chip">Heat regions</span>
              <span className="afrika-chip">Live city pulse</span>
            </div>
            <div className="space-y-3">
              <div className="afrika-label">Map</div>
              <h1 className="afrika-title max-w-3xl">Google Maps energy, with discovery intelligence layered on top.</h1>
              <p className="afrika-copy max-w-2xl">
                Region focus, floating previews, category overlays, and temporal heat all work together to make the map feel alive.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <MetricTile label="Active cities" value={`${ambient.cityPulse.length}`} detail="Tracked with timing and pulse data." />
              <MetricTile label="Temporal layers" value={`${temporal.length}`} detail="Best windows and movement rhythms." />
              <MetricTile label="Environmental fit" value="Aware" detail={`${ambient.environmentalSignals[0]?.weather ?? "Clear"} weather, ${ambient.environmentalSignals[0]?.traffic ?? "low"} traffic.`} />
            </div>
          </div>

          <aside className="afrika-panel p-5">
            <div className="afrika-label">Map context</div>
            <div className="mt-4 space-y-3">
              {ambient.cityPulse.map((pulse) => (
                <InsightRow
                  key={`${pulse.city}-${pulse.hour}`}
                  title={`${pulse.city} - ${pulse.bestWindow}`}
                  detail={`Pulse ${pulse.pulse}, acceleration ${pulse.acceleration}, best for ${ambient.adaptiveInterface.mode.replace("-", " ")}.`}
                />
              ))}
            </div>
          </aside>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="afrika-panel overflow-hidden p-4">
          <div className="afrika-map-surface relative min-h-[700px] overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
            <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
              Live discovery map
            </div>

            {pins.map((pin, index) => (
              <div
                key={`${pin.top}-${pin.left}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: pin.top, left: pin.left }}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 border-white/90 shadow-[0_0_30px_rgba(255,255,255,0.25)] ${
                    pin.tone === "gold" ? "bg-[var(--afrika-gold)]" : pin.tone === "emerald" ? "bg-[var(--afrika-emerald)]" : "bg-[var(--afrika-coral)]"
                  }`}
                />
                <div className="mt-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
                  Cluster {index + 1}
                </div>
              </div>
            ))}

            <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-3">
              {ambient.cityPulse.map((pulse) => (
                <div key={`${pulse.city}-${pulse.hour}`} className="rounded-[24px] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <div className="text-xs uppercase tracking-[0.35em] text-white/45">{pulse.city}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{pulse.bestWindow}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Pulse {pulse.pulse}, acceleration {pulse.acceleration}, best for {ambient.adaptiveInterface.mode.replace("-", " ")}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Temporal intelligence" title="Time-aware layers make the map behave like a living system." />
            <div className="mt-5 space-y-3">
              {temporal.map((slot) => (
                <InsightRow key={slot.label} title={slot.label} detail={slot.recommendation} />
              ))}
            </div>
          </div>

          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Environmental signals" title="Weather, traffic, and crowd density influence what surfaces." />
            <div className="mt-5 grid gap-3">
              <MetricTile label="Weather" value={ambient.environmentalSignals[0]?.weather ?? "Clear"} detail="Ideal for low-friction exploration." />
              <MetricTile label="Traffic" value={ambient.environmentalSignals[0]?.traffic ?? "Low"} detail="Route planning remains calm and efficient." />
              <MetricTile label="Crowd density" value={ambient.environmentalSignals[0]?.crowdDensity ?? "Moderate"} detail="Live intensity updates appear here." />
            </div>
          </div>

          <div className="afrika-panel p-5">
            <SectionHeader eyebrow="Map/feed sync" title="Featured discoveries stay linked to geography." />
            <div className="mt-5 space-y-3">
              {featuredCards.slice(0, 3).map((card) => (
                <InsightRow key={card.id} title={card.title} detail={`${card.location} - ${card.intelligence.summary}`} />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

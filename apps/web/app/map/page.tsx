import { featuredCards } from "@afrika/shared/content";
import { buildAmbientIntelligence, buildTemporalIntelligence } from "@afrika/shared/stage6";

const ambient = buildAmbientIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");
const temporal = buildTemporalIntelligence(featuredCards, "2026-06-09T19:00:00.000Z");

export default function MapPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Map</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Live city pulse and temporal movement intelligence.</h1>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid min-h-[640px] gap-4 rounded-[28px] border border-white/10 bg-black/30 p-5">
              <div className="grid place-items-center rounded-[24px] border border-dashed border-white/15 bg-black/20">
                <p className="text-sm uppercase tracking-[0.4em] text-white/40">Interactive map surface</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {ambient.cityPulse.map((pulse) => (
                  <div key={`${pulse.city}-${pulse.hour}`} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.35em] text-white/45">{pulse.city}</div>
                    <div className="mt-2 text-lg font-medium">{pulse.bestWindow}</div>
                    <div className="mt-1 text-sm text-white/60">Pulse {pulse.pulse} - acceleration {pulse.acceleration}</div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">Live context</div>
                <p className="mt-3 text-lg">Ambient suggestions appear only when timing and environment make them useful.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">Temporal heat</div>
                <p className="mt-3 text-sm text-white/60">{temporal[0]?.label}</p>
                <p className="mt-2 text-sm text-white/60">{temporal[0]?.recommendation}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-white/45">Environment</div>
                <p className="mt-3 text-sm text-white/60">
                  {ambient.environmentalSignals[0]?.weather} weather, {ambient.environmentalSignals[0]?.traffic} traffic, {ambient.environmentalSignals[0]?.crowdDensity} crowd density.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

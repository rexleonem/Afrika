import { ScrollReveal } from "../../../components/motion/scroll-reveal";
import { SectionHeader } from "../../../components/primitives";
import { AmbientGlow } from "../../../components/motion/ambient-glow";

type CreatorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { id } = await params;

  return (
    <main className="pb-24 lg:pb-12">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex flex-col justify-end overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <AmbientGlow variant="clay" size="lg" className="top-10 left-1/2" opacity={0.4} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
        
        <div className="relative z-10 px-4 sm:px-8 lg:px-12 pb-8 flex items-end gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl" style={{ border: "2px solid var(--border-default)", background: "var(--bg-glass-light)" }}>
            {/* Avatar placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <div className="pb-2">
            <div className="afrika-label mb-2">Curator</div>
            <h1 className="text-3xl font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display), serif" }}>
              @{id}
            </h1>
            <p className="text-sm text-white/70 mt-1">Discovering the hidden layers of the city.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-8 lg:px-12 mt-12">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Curated"
            title="Discoveries & Stories"
          />
        </ScrollReveal>
        
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center border rounded-3xl" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-glass-light)" }}>
          <p className="text-sm text-white/50">This curator hasn't published any public stories yet.</p>
        </div>
      </section>
    </main>
  );
}

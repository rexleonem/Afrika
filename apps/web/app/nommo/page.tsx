import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";
import { AmbientGlow } from "../../components/motion/ambient-glow";

export default function NommoPage() {
  return (
    <main className="pb-24 lg:pb-12 px-4 sm:px-8 lg:px-12 mt-16 relative overflow-hidden min-h-[80vh]">
      <AmbientGlow variant="forest" size="lg" className="top-10 left-[20%]" opacity={0.3} />
      <AmbientGlow variant="gold" size="md" className="bottom-20 right-[20%]" opacity={0.2} animationDelay="-2s" />
      
      <ScrollReveal>
        <SectionHeader
          eyebrow="Intelligence"
          title="Nommo"
          description="Your ambient intelligence layer for deep discovery."
        />
      </ScrollReveal>
      
      <div className="mt-12 max-w-3xl mx-auto flex flex-col items-center justify-center py-16 text-center relative z-10">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: "var(--accent-gold)", opacity: 0.2 }}></div>
          <div className="absolute inset-2 rounded-full" style={{ background: "var(--bg-glass)", border: "1px solid var(--accent-gold)", backdropFilter: "blur(12px)" }}></div>
          <svg className="relative z-10" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="var(--accent-gold)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h3 className="text-3xl font-semibold mb-4 tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display), serif" }}>
          I am Nommo.
        </h3>
        <p className="max-w-md text-base leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
          I synthesize cultural patterns, spatial context, and local judgment to help you discover the hidden rhythms of African cities.
        </p>
        
        <div className="w-full max-w-xl">
          <div className="relative flex items-center">
            <input 
              type="text" 
              className="w-full rounded-full border px-6 py-4 text-sm outline-none transition"
              style={{
                background: "var(--bg-glass-light)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)"
              }}
              placeholder="Ask about a neighborhood, culture, or movement..."
              disabled
            />
            <div className="absolute right-2 top-2 bottom-2 aspect-square rounded-full flex items-center justify-center" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
               </svg>
            </div>
          </div>
          <div className="mt-4 text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Nommo connection initializing...
          </div>
        </div>
      </div>
    </main>
  );
}

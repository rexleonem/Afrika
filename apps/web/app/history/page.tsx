import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";

export default function HistoryPage() {
  return (
    <main className="pb-24 lg:pb-12 px-4 sm:px-8 lg:px-12 mt-16">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Activity"
          title="Your Discovery History"
          description="A timeline of places and stories you've explored."
        />
      </ScrollReveal>
      
      <div className="mt-12 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)" }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2" style={{ color: "var(--text-primary)" }}>No history yet</h3>
        <p className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Your recently viewed places and stories will be saved here so you can easily return to them.
        </p>
      </div>
    </main>
  );
}

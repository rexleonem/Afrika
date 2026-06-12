import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";
import Link from "next/link";

export default function SavedPage() {
  return (
    <main className="pb-24 lg:pb-12 px-4 sm:px-8 lg:px-12 mt-16">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Collection"
          title="Saved Discoveries"
          description="Your personal index of places, stories, and cultural signals."
        />
      </ScrollReveal>
      
      <div className="mt-12 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)" }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--accent-gold)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2" style={{ color: "var(--text-primary)" }}>Your collection is empty</h3>
        <p className="max-w-sm text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
          Save places and insights from the feed to build your personal map of the continent.
        </p>
        
        <Link href="/" className="btn-primary px-6 py-2.5">
          Explore the feed
        </Link>
      </div>
    </main>
  );
}

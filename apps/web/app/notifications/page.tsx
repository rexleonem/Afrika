import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";

export default function NotificationsPage() {
  return (
    <main className="pb-24 lg:pb-12 px-4 sm:px-8 lg:px-12 mt-16">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Updates"
          title="Your Notifications"
          description="Stay connected with the latest signals and discoveries."
        />
      </ScrollReveal>
      
      <div className="mt-12 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)" }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2" style={{ color: "var(--text-primary)" }}>No new notifications</h3>
        <p className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          When there are new cultural movements, places, or updates matching your intelligence graph, they will appear here.
        </p>
      </div>
    </main>
  );
}

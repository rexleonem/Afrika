import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";

export default function SettingsPage() {
  return (
    <main className="pb-24 lg:pb-12 px-4 sm:px-8 lg:px-12 mt-16">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Preferences"
          title="Settings"
          description="Manage your account, discovery preferences, and notifications."
        />
      </ScrollReveal>
      
      <div className="mt-12 max-w-2xl">
        <div className="rounded-[24px] overflow-hidden" style={{ background: "var(--bg-glass-light)", border: "1px solid var(--border-subtle)" }}>
          <div className="p-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <h3 className="text-lg font-medium text-white mb-1">Discovery Engine</h3>
            <p className="text-sm text-white/50 mb-4">Tune how AFRIKA learns from your interactions.</p>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-white">Ambient Suggestions</div>
                <div className="text-xs text-white/50">Show contextual insights while browsing</div>
              </div>
              <div className="w-10 h-6 rounded-full bg-white/20 relative">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-1">Account</h3>
            <p className="text-sm text-white/50 mb-4">Manage your personal details and security.</p>
            
            <div className="flex items-center justify-between py-3 cursor-pointer group">
              <div className="text-sm font-medium text-white group-hover:text-white/80 transition-colors">Profile Information</div>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center justify-between py-3 cursor-pointer group">
              <div className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">Sign Out</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

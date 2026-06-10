import type { ReactNode } from "react";

type AIPanelProps = {
  title?: string;
  children: ReactNode;
  live?: boolean;
  className?: string;
};

export function AIInsightPanel({ title = "Intelligence", children, live, className = "" }: AIPanelProps) {
  return (
    <div
      className={`rounded-[28px] p-5 ${className}`}
      style={{
        background: "var(--bg-glass-light)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-panel)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(210,166,109,0.12)",
              border: "1px solid rgba(210,166,109,0.20)",
            }}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent-gold)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: "var(--accent-gold)" }}>
            {title}
          </span>
        </div>
        {live && (
          <div
            className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(109,139,125,0.12)",
              border: "1px solid rgba(109,139,125,0.22)",
              color: "var(--accent-forest)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--accent-forest)",
                boxShadow: "0 0 6px var(--accent-forest)",
                animation: "pulse 2s infinite",
              }}
            />
            Live
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

type ContextPanelProps = {
  children: ReactNode;
  className?: string;
};

export function ContextPanel({ children, className = "" }: ContextPanelProps) {
  return (
    <aside className={`space-y-4 ${className}`}>
      {children}
    </aside>
  );
}

import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="section-line" />
          <div className="afrika-label">{eyebrow}</div>
        </div>
        <h2 className="afrika-title">{title}</h2>
        {description ? <p className="afrika-copy">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type MetricTileProps = {
  label: string;
  value: ReactNode;
  detail?: string;
};

export function MetricTile({ label, value, detail }: MetricTileProps) {
  return (
    <article className="afrika-stat glass-subtle group">
      <div className="afrika-label">{label}</div>
      <div
        className="mt-3 text-3xl font-semibold tracking-tight"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-display), var(--font-sans), serif",
        }}
      >
        {value}
      </div>
      {detail ? <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>{detail}</p> : null}
    </article>
  );
}

type QueueRowProps = {
  title: string;
  detail: string;
  tone?: "good" | "warn" | "neutral";
};

export function QueueRow({ title, detail, tone = "neutral" }: QueueRowProps) {
  const toneStyle =
    tone === "good"
      ? { border: "1px solid rgba(109, 139, 125, 0.3)", background: "rgba(109, 139, 125, 0.1)" }
      : tone === "warn"
        ? { border: "1px solid rgba(193, 123, 88, 0.3)", background: "rgba(193, 123, 88, 0.1)" }
        : {};

  return (
    <div className="insight-row glass-subtle" style={toneStyle}>
      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{title}</div>
      <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-muted)" }}>{detail}</p>
    </div>
  );
}

type SignalBadgeProps = {
  label: string;
  value: ReactNode;
};

export function SignalBadge({ label, value }: SignalBadgeProps) {
  return (
    <div className="afrika-chip">
      <span style={{ color: "var(--text-muted)" }}>{label}</span> <span style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

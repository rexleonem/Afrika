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
        <div className="afrika-admin-kicker">{eyebrow}</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-white/60 sm:text-base">{description}</p> : null}
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
    <article className="afrika-admin-stat">
      <div className="text-xs uppercase tracking-[0.35em] text-white/45">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
      {detail ? <p className="mt-2 text-sm leading-6 text-white/60">{detail}</p> : null}
    </article>
  );
}

type QueueRowProps = {
  title: string;
  detail: string;
  tone?: "good" | "warn" | "neutral";
};

export function QueueRow({ title, detail, tone = "neutral" }: QueueRowProps) {
  const toneClass =
    tone === "good"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
      : tone === "warn"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
        : "border-white/10 bg-black/20 text-white/80";

  return (
    <div className={`rounded-[20px] border px-4 py-3 ${toneClass}`}>
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-sm leading-6 text-white/60">{detail}</p>
    </div>
  );
}

type SignalBadgeProps = {
  label: string;
  value: string;
};

export function SignalBadge({ label, value }: SignalBadgeProps) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
      <span className="text-white/45">{label}</span> {value}
    </div>
  );
}

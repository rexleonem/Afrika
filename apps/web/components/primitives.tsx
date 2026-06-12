import type { ReactNode } from "react";
import Link from "next/link";
import type { AFRIKACard } from "@afrika/shared/types";

// ─── Section Header ───────────────────────────────────────────────────────────

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
        <h2
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-display), var(--font-sans), serif",
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

// ─── Metric Tile ──────────────────────────────────────────────────────────────

type MetricTileProps = {
  label: string;
  value: ReactNode;
  detail?: string;
};

export function MetricTile({ label, value, detail }: MetricTileProps) {
  return (
    <article className="afrika-stat group">
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
      {detail ? (
        <p className="mt-2 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
          {detail}
        </p>
      ) : null}
    </article>
  );
}

// ─── Insight Row ──────────────────────────────────────────────────────────────

type InsightRowProps = {
  title: string;
  detail: string;
  accent?: boolean;
};

export function InsightRow({ title, detail, accent }: InsightRowProps) {
  return (
    <div className="insight-row group">
      <div
        className="flex items-start gap-2.5"
      >
        {accent && (
          <div
            className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "var(--accent-gold)" }}
          />
        )}
        <div className="min-w-0">
          <div
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </div>
          <p
            className="mt-1 text-xs leading-5"
            style={{ color: "var(--text-muted)" }}
          >
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Discovery Card (legacy compat) ───────────────────────────────────────────

type DiscoveryCardProps = {
  card: AFRIKACard;
  score?: string;
  highlight?: string;
  cta?: string;
  link?: `/discover/${string}`;
};

export function DiscoveryCard({
  card,
  score,
  highlight,
  cta = "Open insight",
  link,
}: DiscoveryCardProps) {
  const href = (link ?? `/discover/${card.id}`) as `/discover/${string}`;
  return (
    <article
      className="group overflow-hidden transition duration-500 hover:-translate-y-1"
      style={{
        borderRadius: 28,
        border: "1px solid var(--border-default)",
        background: "var(--bg-glass-light)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <Link href={href} className="block">
        <div className="relative overflow-hidden aspect-[4/5]">
          {card.media.videoUrl ? (
            <video
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={card.media.videoUrl}
              poster={card.media.imageUrl}
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <div
              className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: `url(${card.media.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, transparent 35%, rgba(0,0,0,0.70) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {card.category}
            </span>
            <span
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {card.location}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p
              className="text-[0.62rem] uppercase tracking-[0.35em] mb-1"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {card.kind}
            </p>
            <h3 className="text-2xl font-semibold leading-tight text-white">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {card.intelligence.summary}
            </p>
          </div>
          {score && (
            <div
              className="absolute bottom-5 right-5 text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.50)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {score}
            </div>
          )}
        </div>
        <div className="space-y-3 p-5">
          {highlight ? (
            <div
              className="text-xs leading-5 px-3 py-2.5 rounded-2xl"
              style={{
                background: "rgba(210,166,109,0.07)",
                border: "1px solid rgba(210,166,109,0.14)",
                color: "var(--text-secondary)",
              }}
            >
              {highlight}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {card.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="afrika-chip text-[10px]">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Fresh {card.freshnessScore.toFixed(2)}</span>
            <span>Trust {card.trustScore.toFixed(2)}</span>
          </div>
          <div
            className="inline-flex items-center gap-1.5 text-sm font-medium transition group-hover:gap-2"
            style={{ color: "var(--accent-gold)" }}
          >
            <span>{cta}</span>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}

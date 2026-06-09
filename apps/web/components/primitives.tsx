import type { AFRIKACard } from "@afrika/shared/types";
import Link from "next/link";
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
        <div className="afrika-label">{eyebrow}</div>
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
    <article className="afrika-stat">
      <div className="text-xs uppercase tracking-[0.35em] text-white/45">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
      {detail ? <p className="mt-2 text-sm leading-6 text-white/60">{detail}</p> : null}
    </article>
  );
}

type DiscoveryCardProps = {
  card: AFRIKACard;
  score?: string;
  highlight?: string;
  cta?: string;
  link?: `/discover/${string}`;
};

export function DiscoveryCard({ card, score, highlight, cta = "Open insight", link = `/discover/${card.id}` }: DiscoveryCardProps) {
  const href = (link ?? `/discover/${card.id}`) as `/discover/${string}`;
  return (
    <article className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/20">
      <Link href={href} className="block">
        <div className="afrika-media aspect-[4/5]" style={{ backgroundImage: `url(${card.media.imageUrl})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
            <span className="afrika-chip border-white/15 bg-black/30 text-white/80">{card.category}</span>
            <span className="afrika-chip border-white/15 bg-black/30 text-white/75">{card.location}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-end justify-between gap-4">
              <div className="max-w-[75%] space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/55">{card.kind}</p>
                <h3 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">{card.title}</h3>
              </div>
              {score ? <div className="rounded-full border border-white/15 bg-black/35 px-3 py-2 text-xs text-white/80">{score}</div> : null}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/76">{card.intelligence.summary}</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          {highlight ? (
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">{highlight}</div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {card.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="afrika-chip">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 text-sm text-white/60">
            <span>Fresh {card.freshnessScore.toFixed(2)}</span>
            <span>Trust {card.trustScore.toFixed(2)}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition group-hover:text-white">
            <span>{cta}</span>
            <span aria-hidden="true">-&gt;</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

type InsightRowProps = {
  title: string;
  detail: string;
};

export function InsightRow({ title, detail }: InsightRowProps) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <div className="text-sm font-medium text-white">{title}</div>
      <p className="mt-1 text-sm leading-6 text-white/60">{detail}</p>
    </div>
  );
}

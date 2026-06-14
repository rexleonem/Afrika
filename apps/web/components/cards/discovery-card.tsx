"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AFRIKACard } from "@afrika/shared/types";

type DiscoveryCardProps = {
  card: AFRIKACard;
  score?: string;
  highlight?: string;
  cta?: string;
  size?: "default" | "hero" | "compact";
};

export function DiscoveryCard({
  card,
  score,
  highlight,
  cta = "Explore",
  size = "default",
}: DiscoveryCardProps) {
  const href = `/discover/${card.id}` as `/discover/${string}`;

  const aspectRatio =
    size === "hero" ? "aspect-[16/10]" : size === "compact" ? "aspect-[4/3]" : "aspect-[3/4]";

  return (
    <motion.article
      className="group relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: 28,
        background: "var(--bg-glass-light)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
      whileHover={{
        y: -6,
        scale: 1.008,
        boxShadow: "0 32px 100px rgba(0,0,0,0.45), 0 0 60px rgba(210,166,109,0.12)",
      }}
      transition={{ type: "spring", damping: 22, stiffness: 220 }}
    >
      <Link href={href} className="block">
        {/* Media */}
        <div className={`relative overflow-hidden ${aspectRatio}`}>
          {card.media.videoUrl ? (
            <video
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              src={card.media.videoUrl}
              poster={card.media.imageUrl}
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.media.imageUrl})` }}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          {/* Top overlay for chips */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.40) 0%, transparent 40%)",
            }}
          />

          {/* Top chips */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full truncate max-w-[60%]"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.90)",
              }}
            >
              {card.category}
            </span>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full truncate"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {card.location.split(",")[0]}
            </span>
          </div>

          {/* Save button */}
          <motion.button
            aria-label="Save to plans"
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
            style={{
              background: "rgba(0,0,0,0.50)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.80)",
            }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(210,166,109,0.30)" }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.preventDefault()}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
            </svg>
          </motion.button>

          {/* Bottom text on image */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[0.62rem] uppercase tracking-[0.35em] mb-2 text-white/55">
              {card.kind}
            </p>
            <h3
              className="text-xl font-semibold leading-tight text-white"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {card.title}
            </h3>
            {size !== "compact" && (
              <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-2">
                {card.intelligence.summary}
              </p>
            )}
          </div>
        </div>

        {/* Card footer */}
        <div className="p-4 space-y-3">
          {highlight && size !== "compact" && (
            <div
              className="text-xs leading-5 px-3 py-2.5 rounded-2xl line-clamp-2"
              style={{
                background: "rgba(210,166,109,0.07)",
                border: "1px solid rgba(210,166,109,0.14)",
                color: "var(--text-secondary)",
              }}
            >
              {highlight}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {card.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="afrika-chip text-[10px] px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              {/* Freshness bar */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-12 h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--border-subtle)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${card.freshnessScore * 100}%`,
                      background: "linear-gradient(90deg, var(--accent-forest), var(--accent-gold))",
                    }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  Fresh
                </span>
              </div>
              {score && (
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--bg-glass-light)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--accent-gold)",
                  }}
                >
                  {score}
                </span>
              )}
            </div>
            <motion.span
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--accent-gold)" }}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {cta}
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

type TrendCardProps = {
  title: string;
  location: string;
  tag: string;
  imageUrl: string;
  videoUrl?: string;
  trend?: string;
};

export function TrendCard({ title, location, tag, imageUrl, videoUrl, trend }: TrendCardProps) {
  return (
    <motion.article
      className="group relative flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        width: 220,
        height: 280,
        borderRadius: 24,
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", damping: 22, stiffness: 220 }}
    >
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          src={videoUrl}
          poster={imageUrl}
          muted
          loop
          playsInline
          autoPlay
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      {trend && (
        <div
          className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
          style={{
            background: "rgba(210,166,109,0.25)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(210,166,109,0.35)",
            color: "#E3B07A",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#E3B07A" }}
          />
          {trend}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span
          className="text-[10px] uppercase tracking-[0.3em] mb-1 block"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {tag}
        </span>
        <h4 className="text-sm font-semibold text-white leading-snug">{title}</h4>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
          {location}
        </p>
      </div>
    </motion.article>
  );
}

type NeighborhoodCardProps = {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  videoUrl?: string;
  tags?: string[];
};

export function NeighborhoodCard({ title, description, location, imageUrl, videoUrl, tags }: NeighborhoodCardProps) {
  return (
    <motion.article
      className="group relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: 28,
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", damping: 22, stiffness: 220 }}
    >
      <div className="relative overflow-hidden aspect-[16/8]">
        {videoUrl ? (
          <video
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            src={videoUrl}
            poster={imageUrl}
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <p className="text-[0.62rem] uppercase tracking-[0.38em] mb-2 text-white/50">
            {location}
          </p>
          <h3 className="text-2xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-display), serif" }}>
            {title}
          </h3>
          <p className="text-sm mt-2 text-white/65 max-w-md leading-6">{description}</p>
          {tags && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

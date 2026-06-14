"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { MetricTile, QueueRow, SectionHeader, SignalBadge } from "../../../components/primitives";
import { type AdminCard, useAdminData } from "../../../components/admin-data-provider";

type HeroContent = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  alt: string;
  locationLabel: string;
  featuredCardId?: string;
  chips: string[];
  updatedAt: string;
};

type HeroResponse = {
  hero: HeroContent;
};

type HeroFormState = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  alt: string;
  locationLabel: string;
  featuredCardId: string;
  chipsText: string;
  updatedAt?: string;
};

function createHeroForm(hero: HeroContent): HeroFormState {
  return {
    eyebrow: hero.eyebrow,
    title: hero.title,
    description: hero.description,
    imageUrl: hero.imageUrl,
    videoUrl: hero.videoUrl ?? "",
    alt: hero.alt,
    locationLabel: hero.locationLabel,
    featuredCardId: hero.featuredCardId ?? "",
    chipsText: hero.chips.join(", "),
    updatedAt: hero.updatedAt
  };
}

export default function OperationsPage() {
  const { snapshot, reload } = useAdminData();
  const [availableCards, setAvailableCards] = useState<AdminCard[]>([]);
  const [heroForm, setHeroForm] = useState<HeroFormState | null>(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [heroMessage, setHeroMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadOperationsData = async () => {
      setLoadingHero(true);
      try {
        const [heroResponse, cardsResponse] = await Promise.all([
          apiFetch<HeroResponse>("/hero"),
          apiFetch<{ items: AdminCard[] }>("/cards?limit=200")
        ]);

        if (!active) return;
        setHeroForm(createHeroForm(heroResponse.hero));
        setAvailableCards(cardsResponse.items);
      } catch (error) {
        if (!active) return;
        setHeroMessage(error instanceof Error ? error.message : "Unable to load hero controls.");
      } finally {
        if (active) setLoadingHero(false);
      }
    };

    void loadOperationsData();

    return () => {
      active = false;
    };
  }, []);

  const selectedCard = useMemo(
    () => availableCards.find((card) => card.id === heroForm?.featuredCardId) ?? null,
    [availableCards, heroForm?.featuredCardId]
  );

  const queueCards = availableCards.length > 0 ? availableCards.slice(0, 6) : snapshot?.cards.slice(0, 6) ?? [];

  const updateHeroField = <K extends keyof HeroFormState>(field: K, value: HeroFormState[K]) => {
    setHeroForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const pullMediaFromSelectedCard = () => {
    if (!selectedCard) return;
    setHeroForm((current) =>
      current
        ? {
            ...current,
            imageUrl: selectedCard.media.imageUrl,
            videoUrl: selectedCard.media.videoUrl ?? "",
            alt: selectedCard.media.alt,
            locationLabel: selectedCard.location
          }
        : current
    );
  };

  const saveHero = async () => {
    if (!heroForm) return;
    setSavingHero(true);
    setHeroMessage(null);

    try {
      const payload = {
        eyebrow: heroForm.eyebrow,
        title: heroForm.title,
        description: heroForm.description,
        imageUrl: heroForm.imageUrl,
        videoUrl: heroForm.videoUrl,
        alt: heroForm.alt,
        locationLabel: heroForm.locationLabel,
        featuredCardId: heroForm.featuredCardId,
        chips: heroForm.chipsText
          .split(",")
          .map((chip) => chip.trim())
          .filter(Boolean)
      };

      const response = await apiFetch<{ hero: HeroContent }>("/admin/hero", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });

      setHeroForm(createHeroForm(response.hero));
      setHeroMessage("Homepage hero updated.");
      await reload();
    } catch (error) {
      setHeroMessage(error instanceof Error ? error.message : "Unable to save the hero.");
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="afrika-panel p-6">
        <SectionHeader
          eyebrow="Content operations"
          title="Moderation queues, feed controls, and homepage presentation."
          description="This page focuses on the records the admin team actually needs to inspect, edit, and publish."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Cards" value={snapshot?.cards.length ?? 0} detail="Live cards in the content graph." />
          <MetricTile label="Plans" value={snapshot?.plans.length ?? 0} detail="Planning records available to operations." />
          <MetricTile label="Moderation" value={snapshot?.moderation.length ?? 0} detail="Items awaiting review." />
          <MetricTile label="Sources" value={snapshot?.sources.length ?? 0} detail="Ingestion sources under management." />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="afrika-panel overflow-hidden p-0">
          <div className="relative min-h-[360px] overflow-hidden p-6 sm:p-8">
            {heroForm?.videoUrl ? (
              <video className="absolute inset-0 h-full w-full object-cover" src={heroForm.videoUrl} poster={heroForm.imageUrl} muted loop playsInline autoPlay />
            ) : heroForm?.imageUrl ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroForm.imageUrl})` }} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/45 to-black/80" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="flex flex-wrap gap-2">
                {(heroForm?.chipsText.split(",").map((chip) => chip.trim()).filter(Boolean) ?? ["Hero preview"]).slice(0, 4).map((chip) => (
                  <span key={chip} className="afrika-chip">
                    {chip}
                  </span>
                ))}
              </div>

              <div className="max-w-2xl space-y-4">
                <div className="text-xs uppercase tracking-[0.38em] text-white/55">{heroForm?.eyebrow ?? "Homepage hero"}</div>
                <h2 className="afrika-hero-title max-w-2xl text-4xl">{heroForm?.title ?? "Loading hero preview..."}</h2>
                <p className="max-w-xl text-sm leading-7 text-white/70">{heroForm?.description ?? "Previewing the live homepage lead."}</p>
                <div className="flex flex-wrap gap-2">
                  <SignalBadge label="Location" value={heroForm?.locationLabel ?? "Not set"} />
                  <SignalBadge label="Updated" value={heroForm?.updatedAt ? new Date(heroForm.updatedAt).toLocaleDateString() : "Draft"} />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader
            eyebrow="Homepage hero"
            title="Swap the lead image, video, and description without a code edit."
            description="The web app reads this record directly, so saving here changes the live homepage presentation."
          />

          {heroMessage ? <div className="mt-5 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">{heroMessage}</div> : null}

          {loadingHero || !heroForm ? (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-5 text-sm text-white/65">Loading hero controls...</div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="afrika-label">Eyebrow</span>
                  <input
                    value={heroForm.eyebrow}
                    onChange={(event) => updateHeroField("eyebrow", event.target.value)}
                    className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                  />
                </label>
                <label className="space-y-2">
                  <span className="afrika-label">Location label</span>
                  <input
                    value={heroForm.locationLabel}
                    onChange={(event) => updateHeroField("locationLabel", event.target.value)}
                    className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="afrika-label">Title</span>
                <input
                  value={heroForm.title}
                  onChange={(event) => updateHeroField("title", event.target.value)}
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                />
              </label>

              <label className="space-y-2">
                <span className="afrika-label">Description</span>
                <textarea
                  value={heroForm.description}
                  onChange={(event) => updateHeroField("description", event.target.value)}
                  rows={4}
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                />
              </label>

              <label className="space-y-2">
                <span className="afrika-label">Featured card</span>
                <select
                  value={heroForm.featuredCardId}
                  onChange={(event) => updateHeroField("featuredCardId", event.target.value)}
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                >
                  <option value="">None</option>
                  {availableCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="afrika-label">Image URL</span>
                  <input
                    value={heroForm.imageUrl}
                    onChange={(event) => updateHeroField("imageUrl", event.target.value)}
                    className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                  />
                </label>
                <label className="space-y-2">
                  <span className="afrika-label">Video URL</span>
                  <input
                    value={heroForm.videoUrl}
                    onChange={(event) => updateHeroField("videoUrl", event.target.value)}
                    className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="afrika-label">Alt text</span>
                <input
                  value={heroForm.alt}
                  onChange={(event) => updateHeroField("alt", event.target.value)}
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                />
              </label>

              <label className="space-y-2">
                <span className="afrika-label">Chips</span>
                <input
                  value={heroForm.chipsText}
                  onChange={(event) => updateHeroField("chipsText", event.target.value)}
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                  placeholder="Live city signal, Nommo guided, Editor pick"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={pullMediaFromSelectedCard} className="btn-secondary" disabled={!selectedCard}>
                  Pull media from selected card
                </button>
                <button type="button" onClick={() => void saveHero()} className="btn-primary" disabled={savingHero}>
                  {savingHero ? "Saving..." : "Save hero"}
                </button>
              </div>
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Card queue" title="Live cards that can feed the homepage or moderation flow." />
          <div className="mt-5 space-y-3">
            {queueCards.map((card) => (
              <div key={card.id} className="overflow-hidden rounded-[22px] border border-white/10 bg-white/5">
                <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                  <div className="min-h-[160px] bg-cover bg-center" style={{ backgroundImage: `url(${card.media.imageUrl})` }} />
                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.35em] text-white/45">{card.category}</div>
                        <div className="mt-2 text-base font-medium text-white">{card.title}</div>
                        <div className="mt-1 text-sm text-white/55">{card.location}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <SignalBadge label="Trust" value={card.trustScore.toFixed(2)} />
                        <SignalBadge label="Relevance" value={card.relevanceScore.toFixed(2)} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/60">{card.intelligence.whyItMatters}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="afrika-panel p-6">
          <SectionHeader eyebrow="Moderation queue" title="Trust and editorial controls." />
          <div className="mt-5 space-y-3">
            {snapshot?.moderation.slice(0, 6).map((item) => (
              <QueueRow
                key={item.id}
                title={item.reason}
                detail={`Status: ${item.status} · Trust score ${item.trustScore.toFixed(2)}`}
                tone={item.status === "flagged" || item.status === "review" ? "warn" : "good"}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalBadge label="Controls" value="feature pinning" />
            <SignalBadge label="Controls" value="quality override" />
            <SignalBadge label="Controls" value="source blocking" />
          </div>
        </article>
      </section>

      <section className="afrika-panel p-6">
        <SectionHeader eyebrow="Feed control" title="Priority, seasonal, and regional controls are visible here." />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <QueueRow title="Top signal" detail={snapshot?.trends[0]?.reason ?? "Trend signals are warming up."} tone="good" />
          <QueueRow title="Plan depth" detail={`${snapshot?.plans.length ?? 0} live plans can be overseen.`} tone="good" />
          <QueueRow title="Action readiness" detail={`${snapshot?.monitoring.actionSignals ?? 0} action signals tracked.`} tone="warn" />
        </div>
      </section>
    </div>
  );
}

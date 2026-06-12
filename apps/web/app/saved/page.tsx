"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { SectionHeader } from "../../components/primitives";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SaveButton } from "../../components/user/save-button";

type SavedItem = {
  id: string;
  cardId: string;
  createdAt: string;
  card: {
    id: string;
    title: string;
    location: string;
    category: string;
    tags: string[];
    media: {
      imageUrl: string;
      alt: string;
    };
    intelligence: {
      summary: string;
      whyItMatters: string;
    };
  };
};

export default function SavedPage() {
  const { status } = useSession();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
      setLoading(false);
      return;
    }

    let active = true;
    void apiFetch<{ items: SavedItem[] }>("/saves")
      .then((response) => {
        if (!active) return;
        setItems(response.items);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

  if (loading) {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-6 text-sm text-white/65">Loading saved discoveries...</div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-8">
          <SectionHeader
            eyebrow="Collection"
            title="Sign in to keep your saved discoveries close."
            description="Saved places only appear once they belong to a real session."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-in" className="btn-primary">
              Sign in
            </Link>
            <Link href="/" className="btn-secondary">
              Browse the feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Collection"
          title="Saved discoveries"
          description="Places you chose to hold onto, with the reasons still attached."
        />
      </ScrollReveal>

      {items.length === 0 ? (
        <div className="afrika-panel mt-10 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Nothing saved yet.</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Save a place from a discovery page and it will show up here with the context that made it worth keeping.
          </p>
          <div className="mt-6">
            <Link href="/" className="btn-primary">
              Explore discoveries
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="afrika-panel overflow-hidden p-0">
              <Link href={`/discover/${item.card.id}`} className="block">
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${item.card.media.imageUrl})` }} />
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="afrika-label">{item.card.category}</div>
                    <Link href={`/discover/${item.card.id}`} className="mt-2 block text-lg font-semibold text-white">
                      {item.card.title}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{item.card.location}</p>
                  </div>
                  <SaveButton
                    cardId={item.card.id}
                    initialSaved
                    label="Remove"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:border-white/20 hover:bg-white/10"
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-white/65">{item.card.intelligence.summary}</p>
                <p className="mt-3 text-xs leading-5 text-white/50">{item.card.intelligence.whyItMatters}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

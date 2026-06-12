"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";

type HistoryItem = {
  id: string;
  createdAt: string;
  card: {
    id: string;
    title: string;
    location: string;
    category: string;
    media: {
      imageUrl: string;
    };
    intelligence: {
      summary: string;
    };
  };
};

export default function HistoryPage() {
  const { status } = useSession();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
      setLoading(false);
      return;
    }

    let active = true;
    void apiFetch<{ items: HistoryItem[] }>("/history/views?limit=24")
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
        <div className="afrika-panel p-6 text-sm text-white/65">Loading your history...</div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-8">
          <SectionHeader
            eyebrow="Activity"
            title="Sign in to keep a real discovery trail."
            description="AFRIKA can only remember what you opened once it has a session to anchor it to."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-in" className="btn-primary">
              Sign in
            </Link>
            <Link href="/" className="btn-secondary">
              Return to the feed
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
          eyebrow="Activity"
          title="Your discovery history"
          description="Every card you open can come back here, so the places that caught your eye do not disappear."
        />
      </ScrollReveal>

      {items.length === 0 ? (
        <div className="afrika-panel mt-10 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No viewed places yet.</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Open a discovery card and AFRIKA will keep a lightweight trail here for easy return trips.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <Link key={item.id} href={`/discover/${item.card.id}`} className="afrika-panel flex gap-4 overflow-hidden p-0">
              <div className="h-32 w-32 flex-none bg-cover bg-center" style={{ backgroundImage: `url(${item.card.media.imageUrl})` }} />
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
                <div className="afrika-label">{item.card.category}</div>
                <div className="mt-2 text-lg font-semibold text-white">{item.card.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{item.card.location}</div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/65">{item.card.intelligence.summary}</p>
                <div className="mt-3 text-xs text-white/45">
                  Viewed {new Date(item.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";

type NotificationItem = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: `/${string}`;
  createdAt: string;
};

export default function NotificationsPage() {
  const { status } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
      setLoading(false);
      return;
    }

    let active = true;
    void apiFetch<{ items: NotificationItem[] }>("/notifications")
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
        <div className="afrika-panel p-6 text-sm text-white/65">Loading notifications...</div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-8">
          <SectionHeader
            eyebrow="Updates"
            title="Sign in to see your live signals."
            description="Notifications are generated from your saved places, recent views, and movement in the intelligence graph."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-in" className="btn-primary">
              Sign in
            </Link>
            <Link href="/search" className="btn-secondary">
              Keep exploring
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
          eyebrow="Updates"
          title="Your notifications"
          description="Signals worth returning to, based on what you saved, opened, and asked Nommo."
        />
      </ScrollReveal>

      {items.length === 0 ? (
        <div className="afrika-panel mt-10 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Nothing new just yet.</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            As soon as a saved place picks up momentum or a relevant cultural story lands, it will show up here.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <Link key={item.id} href={item.href as Route} className="afrika-panel block p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="afrika-label">{item.kind}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-white/65">{item.body}</p>
                </div>
                <div className="text-xs text-white/45">
                  {new Date(item.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

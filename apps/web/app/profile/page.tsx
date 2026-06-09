import { featuredCards } from "@afrika/shared/content";
import { buildActionLayer } from "@afrika/shared/stage5";
import { inferBehavioralProfile } from "@afrika/shared/stage3";

const actionLayer = buildActionLayer(featuredCards);
const behavioralProfile = inferBehavioralProfile(featuredCards, [
  { type: "save", cardId: featuredCards[0]?.id, timestamp: "2026-06-09T05:31:00.000Z" },
  { type: "search", query: "weekend plan under budget", timestamp: "2026-06-09T05:32:00.000Z" }
]);

export default function ProfilePage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Profile</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Minimal personalization, now with action intent.</h1>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-medium">Discovery style</h2>
            <p className="mt-2 text-sm text-white/60 capitalize">{behavioralProfile.archetype.replace("-", " ")}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-medium">Action intent</h2>
            <p className="mt-2 text-sm text-white/60 capitalize">{actionLayer.intent.primaryIntent.replace("-", " ")}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-medium">Planning style</h2>
            <p className="mt-2 text-sm text-white/60">{actionLayer.intent.timingHint}</p>
          </article>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-medium">Saved plans</h2>
            <p className="mt-2 text-sm text-white/60">Weekend routes, cultural loops, and action-ready discovery plans.</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-medium">Action history</h2>
            <p className="mt-2 text-sm text-white/60">Reservations, inquiries, and plan completions will shape recommendations here.</p>
          </article>
        </section>
      </div>
    </main>
  );
}

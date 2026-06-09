import { featuredCards } from "@afrika/shared/content";
import { enrichCard, recommendNearby, scoreCardTotal } from "@afrika/shared/stage2";
import { notFound } from "next/navigation";

export default function DiscoverDetailPage({ params }: { params: { id: string } }) {
  const card = featuredCards.find((item) => item.id === params.id);

  if (!card) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5">
        <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${card.media.imageUrl})` }} />
        <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="text-xs uppercase tracking-[0.4em] text-white/45">{card.location}</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">{card.title}</h1>
            <p className="mt-4 text-base leading-7 text-white/70">{card.intelligence.summary}</p>
            <p className="mt-4 text-base leading-7 text-white/70">{card.intelligence.whyItMatters}</p>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/45">
              score {scoreCardTotal({
                usefulness: 0.86,
                uniqueness: 0.72,
                freshness: card.freshnessScore,
                visualQuality: 0.91,
                sourceTrust: card.trustScore,
                engagementProbability: 0.66,
                localRelevance: card.relevanceScore
              }).total}
            </p>
          </section>
          <aside className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">Near by</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                {card.intelligence.nearbyInsights.map((item) => (
                  <div key={item}>• {item}</div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">AI context</div>
              <p className="mt-3 text-sm text-white/70">
                {enrichCard({
                  title: card.title,
                  location: card.location,
                  category: card.category,
                  rawText: card.intelligence.summary,
                  sourceReliability: card.trustScore
                }).whyItMatters}
              </p>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                {recommendNearby(card.title, card.location).map((item) => (
                  <div key={item}>• {item}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

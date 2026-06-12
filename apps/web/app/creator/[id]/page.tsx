import Link from "next/link";
import { notFound } from "next/navigation";
import { AmbientGlow } from "../../../components/motion/ambient-glow";
import { ScrollReveal } from "../../../components/motion/scroll-reveal";
import { SectionHeader } from "../../../components/primitives";

type CreatorPageProps = {
  params: Promise<{ id: string }>;
};

type CreatorResponse = {
  profile: {
    id: string;
    name: string;
    role: string;
    city: string;
    trustScore: number;
    expertiseAreas: string[];
  };
  contributions: Array<{
    id: string;
    note: string;
    emotionalContext: string;
    culturalContext: string;
    localTiming: string;
    trustScore: number;
    cardId: string;
  }>;
  discoveries: Array<{
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
  }>;
};

const apiOrigin =
  process.env.API_PUBLIC_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://afrika.techculture.live";

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { id } = await params;
  const response = await fetch(`${apiOrigin.replace(/\/$/, "")}/creators/${id}`, { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Unable to load creator.");

  const creator = (await response.json()) as CreatorResponse;

  return (
    <main className="pb-24 lg:pb-12">
      <section className="relative flex h-[42vh] flex-col justify-end overflow-hidden border-b border-white/10 bg-[var(--bg-secondary)]">
        <AmbientGlow variant="clay" size="lg" className="left-1/2 top-10" opacity={0.35} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

        <div className="relative z-10 flex items-end gap-6 px-4 pb-8 sm:px-8 lg:px-12">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-white/10 bg-white/5 text-3xl font-semibold text-white">
            {creator.profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="pb-2">
            <div className="afrika-label mb-2">{creator.profile.role}</div>
            <h1 className="text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: "var(--font-display), serif" }}>
              {creator.profile.name}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              {creator.profile.city} · Trust {creator.profile.trustScore.toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 px-4 sm:px-8 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Contributions"
                title="Local notes shaped by lived context."
                description="These observations came through the human intelligence layer, then got structured into the wider discovery graph."
              />
            </ScrollReveal>

            <div className="space-y-4">
              {creator.contributions.map((item) => (
                <div key={item.id} className="afrika-panel p-5">
                  <div className="afrika-label">{item.localTiming}</div>
                  <p className="mt-3 text-sm leading-7 text-white/80">{item.note}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/50">
                    <span>{item.emotionalContext}</span>
                    <span>·</span>
                    <span>{item.culturalContext}</span>
                  </div>
                </div>
              ))}
            </div>

            <ScrollReveal>
              <SectionHeader
                eyebrow="Discoveries"
                title="Places tied to this contributor's city context."
              />
            </ScrollReveal>

            <div className="grid gap-4 md:grid-cols-2">
              {creator.discoveries.map((item) => (
                <Link key={item.id} href={`/discover/${item.id}`} className="afrika-panel block overflow-hidden p-0">
                  <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${item.media.imageUrl})` }} />
                  <div className="p-5">
                    <div className="afrika-label">{item.category}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{item.location}</div>
                    <p className="mt-3 text-sm leading-6 text-white/65">{item.intelligence.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="afrika-panel p-5">
              <div className="afrika-label">Expertise</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {creator.profile.expertiseAreas.map((area) => (
                  <span key={area} className="afrika-chip">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

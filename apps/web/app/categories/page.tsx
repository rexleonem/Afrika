import { InsightRow, SectionHeader } from "../../components/primitives";

const categories = [
  {
    name: "Places",
    tone: "from-[rgba(200,155,92,0.28)] to-[rgba(255,255,255,0.05)]",
    detail: "Spatially rich neighborhoods, districts, and destinations.",
  },
  {
    name: "Food",
    tone: "from-[rgba(217,107,95,0.25)] to-[rgba(255,255,255,0.05)]",
    detail: "Useful restaurants, local tastes, and food culture signals.",
  },
  {
    name: "Culture",
    tone: "from-[rgba(60,141,115,0.25)] to-[rgba(255,255,255,0.05)]",
    detail: "Editorial movement stories, rhythms, and neighborhood context.",
  },
  {
    name: "Events",
    tone: "from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0.03)]",
    detail: "Timely experiences with calm action paths and schedule context.",
  },
  {
    name: "Opportunities",
    tone: "from-[rgba(200,155,92,0.18)] to-[rgba(60,141,115,0.05)]",
    detail: "Jobs, grants, and programs interpreted through relevance and fit.",
  },
  {
    name: "Insights",
    tone: "from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.03)]",
    detail: "Why it matters, comparisons, and nearby intelligence panels.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="afrika-shell space-y-8 pb-12">
      <header className="afrika-panel-strong p-6 sm:p-8">
        <div className="space-y-4">
          <div className="afrika-label">Categories</div>
          <h1 className="afrika-title max-w-3xl">Editorial category worlds, each with its own visual energy.</h1>
          <p className="afrika-copy max-w-2xl">
            The app now treats categories as discovery environments rather than simple labels.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <article
            key={category.name}
            className={`afrika-panel group overflow-hidden bg-gradient-to-br ${category.tone} p-5 transition duration-500 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div className="afrika-label">{category.name}</div>
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">0{index + 1}</div>
            </div>
            <div className="mt-12 min-h-[180px] rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="max-w-sm text-lg leading-7 text-white/80">{category.detail}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Visual", "Curated", "Geo-aware"].map((tag) => (
                  <span key={tag} className="afrika-chip border-white/[0.12] bg-black/25">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="afrika-panel p-5">
          <SectionHeader
            eyebrow="Category rhythm"
            title="The feed stays organized by context, mood, and utility."
            description="This prevents the experience from collapsing into a noisy generic grid."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <InsightRow key={category.name} title={category.name} detail={category.detail} />
            ))}
          </div>
        </div>
        <div className="afrika-panel p-5">
          <SectionHeader eyebrow="Discovery layers" title="Each category can surface signals, routes, and decisions." />
          <div className="mt-5 space-y-3">
            <InsightRow title="Places" detail="Neighborhood pulse, map previews, and spatial intelligence." />
            <InsightRow title="Food" detail="Quiet dining, local culture, and timing-aware recommendations." />
            <InsightRow title="Opportunities" detail="Application-ready intelligence with contextual fit." />
          </div>
        </div>
      </section>
    </main>
  );
}

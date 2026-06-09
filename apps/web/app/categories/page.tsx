const categories = ["Places", "Food", "Culture", "Events", "Opportunities", "Insights"];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Categories</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Explore the living layers of African discovery.</h1>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">{category}</div>
              <p className="mt-3 text-lg text-white/75">
                Browse visually ranked cards, insight clusters, and contextual recommendations.
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

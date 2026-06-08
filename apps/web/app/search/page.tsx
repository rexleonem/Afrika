export default function SearchPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Search</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Semantic search for places, trends, and context.</h1>
        </header>

        <section className="grid gap-4">
          {[
            "quiet places to work in Lagos",
            "weekend escapes under 2 hours",
            "areas in Lagos growing fast"
          ].map((query) => (
            <article key={query} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-lg">{query}</p>
              <p className="mt-2 text-sm text-white/60">
                AI-ranked results, nearby intelligence, and useful comparisons appear here.
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

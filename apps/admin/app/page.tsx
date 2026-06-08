export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-[#F5F1EA]">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Admin control room</div>
          <h1 className="mt-4 text-3xl font-semibold">Content, quality, sources, and trend intelligence.</h1>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Cards in review", "128"],
            ["Trending zones", "24"],
            ["Refresh queue", "41"],
            ["Moderation flags", "7"]
          ].map(([label, value]) => (
            <section key={label} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/55">{label}</div>
              <div className="mt-3 text-4xl font-semibold">{value}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

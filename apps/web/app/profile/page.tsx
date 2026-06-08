export default function ProfilePage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Profile</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Minimal personalization, built around discovery.</h1>
        </header>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-medium">Saved cards</h2>
          <p className="mt-2 text-sm text-white/60">
            Interests, recent discoveries, and preferences live here without turning the product into a social feed.
          </p>
        </section>
      </div>
    </main>
  );
}

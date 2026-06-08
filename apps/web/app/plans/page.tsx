import { samplePlans } from "@afrika/shared/content";

export default function PlansPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Plans</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Visual plans for trips, food routes, and ideas.</h1>
        </header>

        <div className="mt-6 grid gap-4">
          {samplePlans.map((plan) => (
            <article key={plan.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">{plan.type}</div>
              <h2 className="mt-3 text-2xl font-medium">{plan.title}</h2>
              <div className="mt-4 space-y-2 text-white/70">
                {plan.items.map((item) => (
                  <div key={item.id}>• {item.title}</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

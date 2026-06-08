export default function MapPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Map</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Clustered intelligence and trending zones.</h1>
          <div className="mt-6 grid min-h-[640px] place-items-center rounded-[28px] border border-dashed border-white/15 bg-black/30">
            <p className="text-sm uppercase tracking-[0.4em] text-white/40">Interactive map surface</p>
          </div>
        </div>
      </div>
    </main>
  );
}

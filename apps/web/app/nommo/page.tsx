"use client";

import { useState } from "react";
import Link from "next/link";
import type { AFRIKACard } from "@afrika/shared/types";
import { apiFetch } from "../../lib/api";
import { DiscoveryCard, SectionHeader } from "../../components/primitives";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { AmbientGlow } from "../../components/motion/ambient-glow";

type NommoResult = {
  query: string;
  answer: string;
  suggestions: string[];
  items: AFRIKACard[];
};

const prompts = [
  "quiet places to work in Lagos",
  "food spots people keep returning to in Accra",
  "creative neighborhoods in Nairobi",
  "calm date ideas in Cape Town"
];

export default function NommoPage() {
  const [query, setQuery] = useState(prompts[0]);
  const [result, setResult] = useState<NommoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(nextQuery: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<NommoResult>("/nommo/ask", {
        method: "POST",
        body: JSON.stringify({ query: nextQuery })
      });
      setResult(response);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nommo could not answer that yet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-16 sm:px-8 lg:px-12">
      <AmbientGlow variant="forest" size="lg" className="left-[20%] top-10" opacity={0.3} />
      <AmbientGlow variant="gold" size="md" className="bottom-20 right-[20%]" opacity={0.2} animationDelay="-2s" />

      <ScrollReveal>
        <SectionHeader
          eyebrow="Nommo"
          title="Ask the question the way you'd actually say it."
          description="Nommo reads the query, checks the live card graph, and gives you a grounded answer instead of a generic assistant speech."
        />
      </ScrollReveal>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <form
            className="afrika-panel p-6"
            onSubmit={async (event) => {
              event.preventDefault();
              await ask(query);
            }}
          >
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="afrika-chip"
                  onClick={() => {
                    setQuery(prompt);
                    void ask(prompt);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
                placeholder="Ask about a neighborhood, culture, food, or timing..."
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Thinking..." : "Ask Nommo"}
              </button>
            </div>

            {error ? <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}
          </form>

          {result ? (
            <>
              <div className="afrika-panel p-6">
                <div className="afrika-label">Nommo reading</div>
                <p className="mt-3 text-base leading-7 text-white/80">{result.answer}</p>
                {result.suggestions.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="afrika-chip"
                        onClick={() => {
                          setQuery(suggestion);
                          void ask(suggestion);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {result.items.map((item) => (
                  <DiscoveryCard
                    key={item.id}
                    card={item}
                    score={`Match ${item.relevanceScore.toFixed(2)}`}
                    highlight={item.intelligence.whyItMatters}
                    cta="Open detail"
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="afrika-panel p-8 text-sm leading-6 text-white/60">
              Start with a real question and Nommo will answer from the live discovery graph.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="afrika-panel p-5">
            <div className="afrika-label">How Nommo works</div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              It reads intent, checks the discovery graph, and answers with actual cards instead of floating abstractions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/search" className="afrika-chip text-xs">
                Open search
              </Link>
              <Link href="/map" className="afrika-chip text-xs">
                Open map
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

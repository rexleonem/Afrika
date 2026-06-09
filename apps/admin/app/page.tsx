import { featuredCards } from "@afrika/shared/content";
import {
  buildContributorNetwork,
  buildHumanIntelligenceLayer,
  generateCulturalStories,
  moderateContribution,
  structureHumanContribution
} from "@afrika/shared/stage4";
import { buildActionAnalytics, buildActionLayer } from "@afrika/shared/stage5";

const contributorSeed = [
  {
    id: "contributor-lagos-explorer",
    name: "Lagos Explorer",
    role: "explorer" as const,
    city: "Lagos",
    expertiseAreas: ["hidden places", "neighborhood context", "calm discovery"],
    verificationHistory: 0.88,
    contributionQuality: 0.86,
    consistency: 0.81,
    localExpertise: 0.89
  },
  {
    id: "contributor-food-scout",
    name: "Food Scout",
    role: "food-scout" as const,
    city: "Accra",
    expertiseAreas: ["food culture", "affordability", "local dining"],
    verificationHistory: 0.84,
    contributionQuality: 0.9,
    consistency: 0.77,
    localExpertise: 0.86
  }
];

const contributorNetwork = buildContributorNetwork(contributorSeed);
const humanLayer = buildHumanIntelligenceLayer(featuredCards);
const actionLayer = buildActionLayer(featuredCards);
const humanContributions = [
  structureHumanContribution({
    card: featuredCards[0]!,
    contributor: contributorSeed[0]!,
    note: "Creative corridors feel calmer and more useful on weekday afternoons.",
    emotionalContext: "calm, focused, and curious",
    culturalContext: "design and studio culture",
    localTiming: "weekday afternoons",
    mediaUrl: featuredCards[0]?.media.imageUrl
  }),
  structureHumanContribution({
    card: featuredCards[1]!,
    contributor: contributorSeed[1]!,
    note: "This coast spot is a reset point for locals after work.",
    emotionalContext: "restful and open",
    culturalContext: "coastal rhythm and weekend movement",
    localTiming: "after work",
    mediaUrl: featuredCards[1]?.media.imageUrl
  })
];
const culturalStories = generateCulturalStories(featuredCards, humanContributions.map((item) => item.insight));
const moderationQueue = humanContributions.map((item) =>
  moderateContribution({
    contributorId: item.contributor.id,
    note: item.insight.note,
    trustScore: item.contributor.trustScore,
    hasMedia: true,
    duplicatesDetected: false,
    misleadingSignals: item.verification.verificationState === "flagged"
  })
);
const actionAnalytics = buildActionAnalytics([
  { type: "reservation", completed: true },
  { type: "visit", completed: true },
  { type: "plan", completed: true },
  { type: "application", completed: false },
  { type: "recommendation", completed: true }
]);

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8 text-[#F5F1EA]">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/45">Operations center</div>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Intelligence, fulfillment, and trust in one calm workspace.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
            AFRIKA&apos;s admin layer now tracks contributor quality, verification, cultural stories, and real-world action outcomes.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/55">Contributor trust</div>
            <div className="mt-3 text-4xl font-semibold">{contributorNetwork.averageTrust}</div>
          </article>
          <article className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/55">Action signals</div>
            <div className="mt-3 text-4xl font-semibold">{actionAnalytics.completedPlans}</div>
          </article>
          <article className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/55">Fulfillment rate</div>
            <div className="mt-3 text-4xl font-semibold">{actionAnalytics.reservationSuccessRate}</div>
          </article>
          <article className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/55">Human stories</div>
            <div className="mt-3 text-4xl font-semibold">{culturalStories.length}</div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Action monitoring</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["Reservations", "Lightweight and stable"],
                ["Inquiries", "Low-friction and tracked"],
                ["Plan activity", "Growing"],
                ["Opportunity actions", "Steady"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{label}</div>
                  <div className="mt-2 text-lg font-medium">{value}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Action layer</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">{actionLayer.intent.nextStepPrompt}</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                Primary action: {actionLayer.actions[0]?.label}
              </div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                Preferred route: {actionLayer.plan.title}
              </div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                Fulfillment trust: {actionLayer.analytics.reservationSuccessRate}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Contributor intelligence</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {contributorNetwork.profiles.map((profile) => (
                <div key={profile.id} className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{profile.status}</div>
                  <div className="mt-2 text-lg font-medium">{profile.name}</div>
                  <div className="mt-1 text-sm text-white/60">
                    {profile.city} - {profile.role.replace("-", " ")}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Verification dashboard</div>
            <div className="mt-4 space-y-3">
              {humanContributions.map((item) => (
                <div key={item.insight.id} className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-white/55">{item.verification.verificationState}</div>
                  <div className="mt-2 text-lg font-medium">{item.insight.note}</div>
                  <div className="mt-1 text-sm text-white/60">
                    confidence {item.verification.confidenceScore} - {item.contributor.status}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Cultural stories</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              {culturalStories.map((story) => (
                <div key={story.id} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                  <div className="font-medium text-white">{story.title}</div>
                  <div className="mt-1 text-white/60">{story.summary}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Moderation queue</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              {moderationQueue.map((item) => (
                <div key={item.contributorId} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                  <div className="font-medium text-white">{item.action}</div>
                  <div className="mt-1 text-white/60">{item.reasons.join(", ") || "clean"}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.35em] text-white/45">Fulfillment analytics</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Completed visits: {actionAnalytics.completedVisits}</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Completed plans: {actionAnalytics.completedPlans}</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Applications: {actionAnalytics.applicationsSubmitted}</div>
              <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">Accepted recommendations: {actionAnalytics.acceptedRecommendations}</div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

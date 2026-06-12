"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useSession } from "../../components/session-provider";
import { ScrollReveal } from "../../components/motion/scroll-reveal";
import { SectionHeader } from "../../components/primitives";

type ProfileResponse = {
  id: string;
  name: string;
  email: string;
  preferences: {
    preferredCities: string[];
    interests: string[];
    ambientSuggestions?: boolean;
    notificationsEnabled?: boolean;
  };
};

export default function SettingsPage() {
  const { status, user, signOut } = useSession();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [name, setName] = useState("");
  const [cities, setCities] = useState("");
  const [interests, setInterests] = useState("");
  const [ambientSuggestions, setAmbientSuggestions] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    let active = true;
    void apiFetch<ProfileResponse | null>("/profiles/me")
      .then((response) => {
        if (!active || !response) return;
        setProfile(response);
        setName(response.name);
        setCities(response.preferences.preferredCities.join(", "));
        setInterests(response.preferences.interests.join(", "));
        setAmbientSuggestions(response.preferences.ambientSuggestions ?? true);
        setNotificationsEnabled(response.preferences.notificationsEnabled ?? true);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [status]);

  if (status !== "authenticated" || !user) {
    return (
      <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
        <div className="afrika-panel p-8">
          <SectionHeader
            eyebrow="Preferences"
            title="Sign in to manage your settings."
            description="Account preferences, saved cities, and notification signals are tied to a real session."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-in" className="btn-primary">
              Sign in
            </Link>
            <Link href="/" className="btn-secondary">
              Back to the feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pb-24 pt-16 sm:px-8 lg:px-12">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Preferences"
          title="Settings"
          description="Adjust the places AFRIKA pays attention to, and how much of that signal you want surfaced."
        />
      </ScrollReveal>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_320px]">
        <form
          className="afrika-panel space-y-6 p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!user) return;

            setSaving(true);
            setMessage(null);
            try {
              const response = await apiFetch<ProfileResponse>(`/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  name,
                  preferences: {
                    preferredCities: cities.split(",").map((item) => item.trim()).filter(Boolean),
                    interests: interests.split(",").map((item) => item.trim()).filter(Boolean),
                    ambientSuggestions,
                    notificationsEnabled
                  }
                })
              });
              setProfile(response);
              setMessage("Settings updated.");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Unable to save settings.");
            } finally {
              setSaving(false);
            }
          }}
        >
          <label className="block space-y-2">
            <span className="afrika-label">Display name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
            />
          </label>

          <label className="block space-y-2">
            <span className="afrika-label">Preferred cities</span>
            <input
              value={cities}
              onChange={(event) => setCities(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
              placeholder="Lagos, Accra, Nairobi"
            />
          </label>

          <label className="block space-y-2">
            <span className="afrika-label">Interests</span>
            <input
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
              placeholder="culture, food, calm places"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setAmbientSuggestions((current) => !current)}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-left"
            >
              <div className="text-sm font-medium text-white">Ambient suggestions</div>
              <div className="mt-2 text-xs leading-5 text-white/55">
                {ambientSuggestions ? "Nommo can quietly surface contextual leads." : "Keep discovery fully manual."}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setNotificationsEnabled((current) => !current)}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-left"
            >
              <div className="text-sm font-medium text-white">Notifications</div>
              <div className="mt-2 text-xs leading-5 text-white/55">
                {notificationsEnabled ? "Saved places and trend shifts can reach you." : "Keep updates out of the way."}
              </div>
            </button>
          </div>

          {message ? <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">{message}</div> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save settings"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="afrika-panel p-5">
            <div className="afrika-label">Session</div>
            <div className="mt-3 text-lg font-semibold text-white">{profile?.email ?? user.email}</div>
            <p className="mt-2 text-sm leading-6 text-white/60">
              These preferences shape the places, timings, and context AFRIKA keeps close in your feed.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

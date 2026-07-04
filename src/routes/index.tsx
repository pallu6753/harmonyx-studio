import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UniversePrompt } from "@/components/ai/UniversePrompt";
import { CardRail } from "@/components/music/CardRail";
import { SongCard, ContinueCard, ArtistAvatar } from "@/components/music/SongCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import {
  TRENDING_SONGS,
  CONTINUE_LISTENING,
  AI_PLAYLISTS,
  FEATURED_PLAYLISTS,
  TRENDING_ARTISTS,
} from "@/lib/mock-data";
import { Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Hero */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{greeting()}, Alex</div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Welcome to your <span className="text-aurora">Music Universe</span>
              </h1>
            </div>
            <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
              <Flame className="h-3.5 w-3.5 text-accent" />
              <span className="font-semibold">47-day streak</span>
            </div>
          </div>

          <UniversePrompt />
        </section>

        {/* Continue listening — compact grid */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold tracking-tight">Jump back in</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONTINUE_LISTENING.map((s) => (
              <ContinueCard key={s.id} song={s} />
            ))}
          </div>
        </section>

        {/* AI Recommendations */}
        <CardRail title="Made by Harmony AI" subtitle="Personalized just for you" seeAllHref="/library">
          {AI_PLAYLISTS.map((p) => (
            <PlaylistCard key={p.id} playlist={p} ai />
          ))}
        </CardRail>

        {/* Trending */}
        <CardRail title="Trending now" subtitle="What the world is listening to">
          {TRENDING_SONGS.slice(0, 8).map((s) => (
            <SongCard key={s.id} song={s} />
          ))}
        </CardRail>

        {/* Featured */}
        <CardRail title="Editor's picks">
          {FEATURED_PLAYLISTS.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </CardRail>

        {/* Artists */}
        <CardRail title="Artists you'll love">
          {TRENDING_ARTISTS.map((a) => (
            <ArtistAvatar key={a.id} hue={a.hue} name={a.name} followers={a.followers} verified={a.verified} />
          ))}
        </CardRail>

        {/* AI Studio banner */}
        <section className="glass-strong relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3 w-3 text-accent" /> AI Song Studio
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                Create original songs with a single prompt
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Lyrics, melody, chords, vocals, and album art — all AI-generated in your Studio.
                Available in Part 2 rollout.
              </p>
            </div>
            <button className="rounded-full bg-aurora px-6 py-3 text-sm font-semibold text-white glow-primary transition hover:scale-105">
              Open Studio
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

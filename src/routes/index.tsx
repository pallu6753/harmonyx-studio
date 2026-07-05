import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { UniversePrompt } from "@/components/ai/UniversePrompt";
import { CardRail } from "@/components/music/CardRail";
import { SongCard, ContinueCard, ArtistAvatar } from "@/components/music/SongCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { AI_PLAYLISTS, FEATURED_PLAYLISTS, TRENDING_ARTISTS } from "@/lib/mock-data";
import { HOME_SECTIONS, searchTracks, type Track } from "@/lib/music-api";
import { Flame, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function useGreeting() {
  const [g, setG] = useState("Welcome");
  useEffect(() => {
    const h = new Date().getHours();
    setG(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  return g;
}

function HomePage() {
  const greeting = useGreeting();

  const results = useQueries({
    queries: HOME_SECTIONS.map((s) => ({
      queryKey: ["tracks", s.term],
      queryFn: () => searchTracks(s.term, 16),
      staleTime: 5 * 60_000,
    })),
  });

  const trending: Track[] = results[0].data ?? [];
  const continueTracks: Track[] = trending.slice(0, 4);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{greeting}, Alex</div>
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

        {continueTracks.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold tracking-tight">Jump back in</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {continueTracks.map((_, i) => (
                <ContinueCard key={continueTracks[i].id} tracks={continueTracks} index={i} />
              ))}
            </div>
          </section>
        )}

        <CardRail title="Made by Harmony AI" subtitle="Personalized just for you" seeAllHref="/library">
          {AI_PLAYLISTS.map((p) => (
            <PlaylistCard key={p.id} playlist={p} ai />
          ))}
        </CardRail>

        {HOME_SECTIONS.map((section, si) => {
          const tracks = results[si].data ?? [];
          if (!tracks.length) {
            return (
              <div key={section.key} className="glass h-40 animate-pulse rounded-2xl" />
            );
          }
          return (
            <CardRail key={section.key} title={section.title} subtitle={section.subtitle}>
              {tracks.map((_, i) => (
                <SongCard key={tracks[i].id} tracks={tracks} index={i} />
              ))}
            </CardRail>
          );
        })}

        <CardRail title="Editor's picks">
          {FEATURED_PLAYLISTS.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </CardRail>

        <CardRail title="Artists you'll love">
          {TRENDING_ARTISTS.map((a) => (
            <ArtistAvatar key={a.id} hue={a.hue} name={a.name} followers={a.followers} verified={a.verified} />
          ))}
        </CardRail>

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

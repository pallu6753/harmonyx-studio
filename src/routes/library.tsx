import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SongRow } from "@/components/music/SongRow";
import { AI_PLAYLISTS, FEATURED_PLAYLISTS } from "@/lib/mock-data";
import { searchTracks } from "@/lib/music-api";
import { usePlayer } from "@/lib/player-store";
import { Grid3x3, Plus, Heart, Download, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Your Library — HarmonyX AI" }] }),
  component: LibraryPage,
});

const TABS = ["Playlists", "Liked Songs", "Recently Played", "History"];

function LibraryPage() {
  const [tab, setTab] = useState("Playlists");
  const all = [...AI_PLAYLISTS, ...FEATURED_PLAYLISTS];

  const liked = usePlayer((s) => s.liked);
  const popular = useQuery({
    queryKey: ["tracks", "top hits"],
    queryFn: () => searchTracks("top hits", 24),
    staleTime: 5 * 60_000,
  });

  const likedTracks = useMemo(
    () => (popular.data ?? []).filter((t) => liked[t.id]),
    [popular.data, liked],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Your Library</h1>
          <div className="flex items-center gap-2">
            <button className="glass flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-full bg-aurora px-4 py-2 text-sm font-semibold text-white glow-primary">
              <Plus className="h-4 w-4" /> New playlist
            </button>
          </div>
        </div>

        <div className="scrollbar-hidden flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                tab === t ? "bg-aurora text-white glow-primary" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Liked Songs", count: `${likedTracks.length} songs`, icon: Heart, hue: 340 },
            { label: "Downloaded", count: "0 songs", icon: Download, hue: 200 },
            { label: "Recently Played", count: "This week", icon: Clock, hue: 260 },
            { label: "AI Creations", count: "0 tracks", icon: Plus, hue: 285 },
          ].map((q) => (
            <button key={q.label} className="glass group flex items-center gap-3 rounded-2xl p-3 pr-4 text-left transition hover:bg-white/10">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `linear-gradient(135deg, oklch(0.55 0.24 ${q.hue}), oklch(0.35 0.2 ${q.hue + 30}))` }}
              >
                <q.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{q.label}</div>
                <div className="truncate text-xs text-muted-foreground">{q.count}</div>
              </div>
            </button>
          ))}
        </div>

        {tab === "Playlists" && (
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Your playlists</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {all.map((p) => <PlaylistCard key={p.id} playlist={p} ai={p.curator === "Harmony AI"} />)}
            </div>
          </section>
        )}

        {tab === "Liked Songs" && (
          <section className="glass-strong rounded-2xl border border-white/10 p-4">
            {likedTracks.length ? (
              <div className="space-y-1">
                {likedTracks.map((_, i) => <SongRow key={likedTracks[i].id} tracks={likedTracks} index={i} />)}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Tap the heart on any song to save it here.
              </div>
            )}
          </section>
        )}

        {(tab === "Recently Played" || tab === "History") && popular.data && (
          <section className="glass-strong rounded-2xl border border-white/10 p-4">
            <div className="space-y-1">
              {popular.data.slice(0, 10).map((_, i) => <SongRow key={popular.data![i].id} tracks={popular.data!} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

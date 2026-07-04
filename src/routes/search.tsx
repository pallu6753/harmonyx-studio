import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Search as SearchIcon, Mic, TrendingUp } from "lucide-react";
import { useState } from "react";
import { CardRail } from "@/components/music/CardRail";
import { SongCard, ArtistAvatar } from "@/components/music/SongCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { TRENDING_SONGS, TRENDING_ARTISTS, FEATURED_PLAYLISTS } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — HarmonyX AI" }] }),
  component: SearchPage,
});

const GENRES = [
  { label: "Synthwave", hue: 280 },
  { label: "Lo-fi", hue: 210 },
  { label: "Indie", hue: 30 },
  { label: "EDM", hue: 260 },
  { label: "Hip-Hop", hue: 340 },
  { label: "Classical", hue: 45 },
  { label: "Jazz", hue: 15 },
  { label: "Ambient", hue: 190 },
  { label: "Rock", hue: 0 },
  { label: "Pop", hue: 320 },
  { label: "Folk", hue: 100 },
  { label: "R&B", hue: 350 },
];

const FILTERS = ["Songs", "Artists", "Albums", "Playlists", "Podcasts", "AI Songs", "Courses"];

function SearchPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Songs");

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Search</h1>
          <div className="glass-strong flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Songs, artists, albums, lyrics, AI tracks…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
            />
            <button className="text-muted-foreground hover:text-foreground">
              <Mic className="h-5 w-5" />
            </button>
          </div>
          <div className="scrollbar-hidden flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  filter === f ? "bg-aurora text-white glow-primary" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {q ? (
          <div className="space-y-8">
            <CardRail title={`Results for "${q}"`}>
              {TRENDING_SONGS.slice(0, 6).map((s) => <SongCard key={s.id} song={s} />)}
            </CardRail>
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="font-display text-lg font-semibold">Trending searches</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Aurora Wave", "Kannada Sunrise", "AI lofi beats", "Neon Dreams remix", "Meera Rao live", "72 BPM piano"].map((t) => (
                  <button key={t} className="glass rounded-full px-4 py-2 text-sm hover:bg-white/10">
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold">Browse genres</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {GENRES.map((g) => (
                  <button
                    key={g.label}
                    className="glass relative h-28 overflow-hidden rounded-2xl p-4 text-left transition hover:scale-[1.02]"
                  >
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background: `radial-gradient(circle at 80% 80%, oklch(0.6 0.24 ${g.hue}) 0%, transparent 70%)`,
                      }}
                    />
                    <div className="relative font-display text-lg font-bold">{g.label}</div>
                  </button>
                ))}
              </div>
            </section>

            <CardRail title="Popular right now">
              {TRENDING_SONGS.map((s) => <SongCard key={s.id} song={s} />)}
            </CardRail>

            <CardRail title="Top artists">
              {TRENDING_ARTISTS.map((a) => (
                <ArtistAvatar key={a.id} hue={a.hue} name={a.name} followers={a.followers} verified={a.verified} />
              ))}
            </CardRail>

            <CardRail title="Featured playlists">
              {FEATURED_PLAYLISTS.map((p) => <PlaylistCard key={p.id} playlist={p} />)}
            </CardRail>
          </>
        )}
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Search as SearchIcon, Mic, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CardRail } from "@/components/music/CardRail";
import { SongCard, ArtistAvatar } from "@/components/music/SongCard";
import { SongRow } from "@/components/music/SongRow";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { TRENDING_ARTISTS, FEATURED_PLAYLISTS } from "@/lib/mock-data";
import { searchTracks, tracksByGenre } from "@/lib/music-api";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — HarmonyX AI" }] }),
  component: SearchPage,
});

const GENRES = [
  { label: "Pop", hue: 320 }, { label: "Hip-Hop", hue: 340 }, { label: "Rock", hue: 0 },
  { label: "Electronic", hue: 260 }, { label: "R&B", hue: 350 }, { label: "Indie", hue: 30 },
  { label: "Jazz", hue: 45 }, { label: "Classical", hue: 200 }, { label: "Country", hue: 15 },
  { label: "Latin", hue: 20 }, { label: "K-Pop", hue: 300 }, { label: "Lofi", hue: 210 },
];

const SUGGESTIONS = ["Weeknd", "Taylor Swift", "Arctic Monkeys", "Bad Bunny", "Lofi beats", "Coldplay"];

function SearchPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const searchQ = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchTracks(debounced, 24),
    enabled: debounced.length > 0,
  });

  const popular = useQuery({
    queryKey: ["tracks", "top hits"],
    queryFn: () => searchTracks("top hits", 16),
    staleTime: 5 * 60_000,
  });

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
              placeholder="Songs, artists, albums…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
            />
            <button className="text-muted-foreground hover:text-foreground">
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>

        {debounced ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">
              {searchQ.isLoading ? "Searching…" : `Results for "${debounced}"`}
            </h2>
            {searchQ.data && searchQ.data.length > 0 ? (
              <div className="glass-strong rounded-2xl border border-white/10 p-3">
                {searchQ.data.map((_, i) => (
                  <SongRow key={searchQ.data![i].id} tracks={searchQ.data!} index={i} />
                ))}
              </div>
            ) : (
              !searchQ.isLoading && <div className="text-sm text-muted-foreground">No results.</div>
            )}
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="font-display text-lg font-semibold">Trending searches</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((t) => (
                  <button key={t} onClick={() => setQ(t)} className="glass rounded-full px-4 py-2 text-sm hover:bg-white/10">
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
                    onClick={() => setQ(g.label)}
                    className="glass relative h-28 overflow-hidden rounded-2xl p-4 text-left transition hover:scale-[1.02]"
                  >
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{ background: `radial-gradient(circle at 80% 80%, oklch(0.6 0.24 ${g.hue}) 0%, transparent 70%)` }}
                    />
                    <div className="relative font-display text-lg font-bold">{g.label}</div>
                  </button>
                ))}
              </div>
            </section>

            {popular.data && (
              <CardRail title="Popular right now">
                {popular.data.map((_, i) => (
                  <SongCard key={popular.data![i].id} tracks={popular.data!} index={i} />
                ))}
              </CardRail>
            )}

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

// Silence unused import warning while keeping the helper available.
void tracksByGenre;

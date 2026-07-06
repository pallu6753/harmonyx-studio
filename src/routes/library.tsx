import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SongRow } from "@/components/music/SongRow";
import { AI_PLAYLISTS, FEATURED_PLAYLISTS } from "@/lib/mock-data";
import { usePlayer } from "@/lib/player-store";
import { Grid3x3, Plus, Heart, Download, Clock, Pin, Copy, Trash2, Pencil, Play } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Your Library — Sonexa" }] }),
  component: LibraryPage,
});

const TABS = ["Playlists", "Liked Songs", "Recently Played", "History", "AI Creations"];

function LibraryPage() {
  const [tab, setTab] = useState("Playlists");
  const [query, setQuery] = useState("");

  const playlists = usePlayer((s) => s.playlists);
  const recentlyPlayed = usePlayer((s) => s.recentlyPlayed);
  const history = usePlayer((s) => s.history);
  const likedIds = usePlayer((s) => s.likedIds);
  const createPlaylist = usePlayer((s) => s.createPlaylist);
  const deletePlaylist = usePlayer((s) => s.deletePlaylist);
  const renamePlaylist = usePlayer((s) => s.renamePlaylist);
  const duplicatePlaylist = usePlayer((s) => s.duplicatePlaylist);
  const togglePinPlaylist = usePlayer((s) => s.togglePinPlaylist);
  const playQueue = usePlayer((s) => s.playQueue);

  const likedTracks = useMemo(() => {
    const liked = playlists.find((p) => p.id === "__liked__");
    if (!liked) return [];
    return likedIds.map((id) => liked.tracks[id]).filter(Boolean);
  }, [playlists, likedIds]);

  const userPlaylists = useMemo(() => {
    const list = playlists.filter((p) => p.id !== "__liked__");
    const filtered = query ? list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : list;
    return [...filtered].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  }, [playlists, query]);

  const onNewPlaylist = () => {
    const name = window.prompt("Playlist name?", "My playlist")?.trim();
    if (name) createPlaylist(name);
  };

  const onRename = (id: string, current: string) => {
    const name = window.prompt("Rename playlist", current)?.trim();
    if (name) renamePlaylist(id, name);
  };

  const seed = [...AI_PLAYLISTS, ...FEATURED_PLAYLISTS];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Your Library</h1>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="glass hidden h-10 rounded-full border border-white/10 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 sm:block"
            />
            <button className="glass flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={onNewPlaylist}
              className="flex items-center gap-2 rounded-full bg-aurora px-4 py-2 text-sm font-semibold text-white glow-primary transition hover:scale-[1.02]"
            >
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
            { label: "Liked Songs", count: `${likedTracks.length} songs`, icon: Heart, hue: 340, onClick: () => setTab("Liked Songs") },
            { label: "Downloaded", count: "Offline", icon: Download, hue: 200, onClick: () => {} },
            { label: "Recently Played", count: `${recentlyPlayed.length} tracks`, icon: Clock, hue: 260, onClick: () => setTab("Recently Played") },
            { label: "AI Creations", count: "0 tracks", icon: Plus, hue: 285, onClick: () => setTab("AI Creations") },
          ].map((q) => (
            <button
              key={q.label}
              onClick={q.onClick}
              className="glass group flex items-center gap-3 rounded-2xl p-3 pr-4 text-left transition hover:bg-white/10"
            >
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
          <>
            {userPlaylists.length > 0 && (
              <section>
                <h2 className="mb-4 font-display text-xl font-bold">Your playlists</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {userPlaylists.map((p) => {
                    const trackList = p.trackIds.map((id) => p.tracks[id]).filter(Boolean);
                    return (
                      <div key={p.id} className="glass group flex items-center gap-3 rounded-2xl p-3 pr-2">
                        <div
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
                          style={{ background: `linear-gradient(135deg, oklch(0.55 0.24 ${p.hue}), oklch(0.35 0.2 ${p.hue + 30}))` }}
                        >
                          {p.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {p.pinned && <Pin className="h-3 w-3 text-accent" />}
                            <div className="truncate text-sm font-semibold">{p.name}</div>
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{p.trackIds.length} songs</div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          {trackList.length > 0 && (
                            <button onClick={() => playQueue(trackList, 0)} className="flex h-8 w-8 items-center justify-center rounded-full bg-aurora text-white" title="Play">
                              <Play className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button onClick={() => togglePinPlaylist(p.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground" title="Pin">
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => onRename(p.id, p.name)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground" title="Rename">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => duplicatePlaylist(p.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground" title="Duplicate">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => confirm(`Delete "${p.name}"?`) && deletePlaylist(p.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-4 font-display text-xl font-bold">Curated for you</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {seed.map((p) => <PlaylistCard key={p.id} playlist={p} ai={p.curator === "Harmony AI"} />)}
              </div>
            </section>
          </>
        )}

        {tab === "Liked Songs" && (
          <section className="glass-strong rounded-2xl border border-white/10 p-4">
            {likedTracks.length ? (
              <div className="space-y-1">
                {likedTracks.map((_, i) => <SongRow key={likedTracks[i].id} tracks={likedTracks} index={i} />)}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Tap the heart on any song to save it here — it syncs across your library.
              </div>
            )}
          </section>
        )}

        {tab === "Recently Played" && (
          <section className="glass-strong rounded-2xl border border-white/10 p-4">
            {recentlyPlayed.length ? (
              <div className="space-y-1">
                {recentlyPlayed.map((_, i) => <SongRow key={recentlyPlayed[i].id + i} tracks={recentlyPlayed} index={i} />)}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">Nothing played yet — start listening!</div>
            )}
          </section>
        )}

        {tab === "History" && (
          <section className="glass-strong rounded-2xl border border-white/10 p-4">
            {history.length ? (
              <div className="space-y-1">
                {history.map((_, i) => <SongRow key={history[i].id + i} tracks={history} index={i} />)}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">Your listening history will appear here.</div>
            )}
          </section>
        )}

        {tab === "AI Creations" && (
          <section className="glass-strong rounded-2xl border border-white/10 p-10 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aurora text-white">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">Create your first AI song</h3>
              <p className="mt-2 text-sm text-muted-foreground">Generate lyrics, melody, and cover art from a single prompt in the Studio.</p>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

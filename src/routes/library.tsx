import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SongRow } from "@/components/music/SongRow";
import { AI_PLAYLISTS, FEATURED_PLAYLISTS, TRENDING_SONGS } from "@/lib/mock-data";
import { Grid3x3, List, Plus, Heart, Download, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Your Library — HarmonyX AI" }] }),
  component: LibraryPage,
});

const TABS = ["Playlists", "Liked Songs", "Albums", "Artists", "Downloads", "History"];

function LibraryPage() {
  const [tab, setTab] = useState("Playlists");
  const all = [...AI_PLAYLISTS, ...FEATURED_PLAYLISTS];

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

        {/* Quick access */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Liked Songs", count: "324 songs", icon: Heart, hue: 340 },
            { label: "Downloaded", count: "48 songs", icon: Download, hue: 200 },
            { label: "Recently Played", count: "This week", icon: Clock, hue: 260 },
            { label: "AI Creations", count: "12 tracks", icon: Plus, hue: 285 },
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

        {(tab === "Liked Songs" || tab === "History") && (
          <section className="glass-strong rounded-2xl border border-white/10 p-4">
            <div className="space-y-1">
              {TRENDING_SONGS.map((s, i) => <SongRow key={s.id} song={s} index={i} />)}
            </div>
          </section>
        )}

        {(tab === "Albums" || tab === "Artists" || tab === "Downloads") && (
          <div className="glass-strong flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 p-8 text-center text-sm text-muted-foreground">
            {tab} view — connect your account to sync
          </div>
        )}
      </div>
    </AppShell>
  );
}

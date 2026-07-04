import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CoverArt } from "@/components/brand/CoverArt";
import { TRENDING_SONGS } from "@/lib/mock-data";
import {
  Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat,
  Volume2, Share2, ListMusic, Download, Mic2,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/player")({
  head: () => ({ meta: [{ title: "Now Playing — HarmonyX AI" }] }),
  component: PlayerPage,
});

function PlayerPage() {
  const song = TRENDING_SONGS[0];
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(true);

  return (
    <AppShell>
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {/* aura backdrop */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] opacity-70 blur-3xl"
          style={{ background: `radial-gradient(ellipse at 50% 0%, oklch(0.6 0.24 ${song.hue}) 0%, transparent 60%)` }}
        />

        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          {/* Cover + meta */}
          <div className="mx-auto text-center lg:mx-0 lg:text-left">
            <CoverArt hue={song.hue} size={420} rounded="rounded-3xl" showIcon={false} />
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent">Now Playing</div>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{song.title}</h1>
              <div className="mt-1 text-lg text-muted-foreground">{song.artist} • {song.album}</div>
            </div>
          </div>

          {/* Controls + lyrics */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="glass-strong rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>1:24</span>
                <span>{song.duration}</span>
              </div>
              <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-aurora" />
                <div className="absolute -top-1 h-3.5 w-3.5 rounded-full bg-white glow-primary" style={{ left: "calc(40% - 7px)" }} />
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button className="text-muted-foreground hover:text-foreground"><Shuffle className="h-5 w-5" /></button>
                <button className="text-muted-foreground hover:text-foreground"><SkipBack className="h-6 w-6" /></button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-aurora text-white glow-primary transition hover:scale-105"
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                </button>
                <button className="text-muted-foreground hover:text-foreground"><SkipForward className="h-6 w-6" /></button>
                <button className="text-muted-foreground hover:text-foreground"><Repeat className="h-5 w-5" /></button>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setLiked(!liked)} className="glass flex h-10 w-10 items-center justify-center rounded-full">
                  <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Volume2 className="h-4 w-4" />
                  <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-white/50" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Mic2 className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><ListMusic className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Download className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Share2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {/* Lyrics */}
            <div className="glass-strong rounded-3xl border border-white/10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Lyrics</h3>
                <button className="text-xs font-semibold uppercase tracking-wider text-accent">Sync</button>
              </div>
              <div className="space-y-3 text-base font-medium leading-relaxed">
                <p className="text-muted-foreground/60">Neon runs deep in the wires tonight</p>
                <p className="text-muted-foreground/60">Circuits glowing, we chase the light</p>
                <p className="text-aurora text-lg">This is where the dream begins</p>
                <p className="text-muted-foreground/60">Aurora waves and city sins</p>
                <p className="text-muted-foreground/40">We could stay here till the sunrise</p>
                <p className="text-muted-foreground/40">Coded hearts, electric ties</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

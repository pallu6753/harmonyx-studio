import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { usePlayer } from "@/lib/player-store";
import {
  Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat,
  Volume2, Share2, ListMusic, Download, Mic2,
} from "lucide-react";
import { useRef } from "react";

export const Route = createFileRoute("/player")({
  head: () => ({ meta: [{ title: "Now Playing — HarmonyX AI" }] }),
  component: PlayerPage,
});

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayerPage() {
  const song = usePlayer((s) => s.queue[s.index]);
  const playing = usePlayer((s) => s.playing);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  const seek = usePlayer((s) => s.seek);
  const volume = usePlayer((s) => s.volume);
  const setVolume = usePlayer((s) => s.setVolume);
  const liked = usePlayer((s) => (song ? s.liked[song.id] : false));
  const toggleLike = usePlayer((s) => s.toggleLike);

  const barRef = useRef<HTMLDivElement>(null);

  if (!song) {
    return (
      <AppShell>
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-3xl font-bold">Nothing playing yet</h1>
          <p className="mt-2 text-muted-foreground">Pick a song from Home, Search, or your Library.</p>
        </div>
      </AppShell>
    );
  }

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(p * duration);
  };

  return (
    <AppShell>
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] opacity-70 blur-3xl"
          style={{ background: `radial-gradient(ellipse at 50% 0%, oklch(0.6 0.24 ${song.hue}) 0%, transparent 60%)` }}
        />

        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <div className="mx-auto text-center lg:mx-0 lg:text-left">
            <img
              src={song.artworkLarge || song.artwork}
              alt={song.title}
              className="mx-auto h-[320px] w-[320px] rounded-3xl object-cover shadow-2xl lg:h-[420px] lg:w-[420px]"
            />
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent">Now Playing</div>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{song.title}</h1>
              <div className="mt-1 text-lg text-muted-foreground">{song.artist} • {song.album}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-strong rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
              <div
                ref={barRef}
                onClick={onScrub}
                className="relative mt-2 h-1.5 cursor-pointer overflow-visible rounded-full bg-white/10"
              >
                <div className="absolute inset-y-0 left-0 rounded-full bg-aurora" style={{ width: `${pct}%` }} />
                <div
                  className="absolute -top-1 h-3.5 w-3.5 rounded-full bg-white glow-primary"
                  style={{ left: `calc(${pct}% - 7px)` }}
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button className="text-muted-foreground hover:text-foreground"><Shuffle className="h-5 w-5" /></button>
                <button onClick={prev} className="text-muted-foreground hover:text-foreground"><SkipBack className="h-6 w-6" /></button>
                <button
                  onClick={toggle}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-aurora text-white glow-primary transition hover:scale-105"
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                </button>
                <button onClick={next} className="text-muted-foreground hover:text-foreground"><SkipForward className="h-6 w-6" /></button>
                <button className="text-muted-foreground hover:text-foreground"><Repeat className="h-5 w-5" /></button>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => toggleLike(song.id)} className="glass flex h-10 w-10 items-center justify-center rounded-full">
                  <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Volume2 className="h-4 w-4" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="h-1 w-28 accent-primary"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Mic2 className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><ListMusic className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Download className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Share2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-3xl border border-white/10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">About this preview</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Streaming a 30-second preview of <span className="text-foreground">{song.title}</span> by{" "}
                <span className="text-foreground">{song.artist}</span>. Full-length playback requires a licensed catalog
                subscription — HarmonyX uses the public iTunes Search catalog for previews and metadata.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="glass rounded-xl p-3">
                  <div className="text-muted-foreground">Album</div>
                  <div className="mt-1 font-semibold">{song.album}</div>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="text-muted-foreground">Genre</div>
                  <div className="mt-1 font-semibold">{song.genre}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

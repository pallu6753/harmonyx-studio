import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { usePlayer } from "@/lib/player-store";
import {
  Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1,
  Volume2, VolumeX, Share2, ListMusic, Download, Mic2, Timer, Gauge, X, GripVertical,
} from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/player")({
  head: () => ({ meta: [{ title: "Now Playing — Sonexa" }] }),
  component: PlayerPage,
});

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_OPTIONS = [5, 15, 30, 45, 60];

function PlayerPage() {
  const song = usePlayer((s) => s.queue[s.index]);
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const playing = usePlayer((s) => s.playing);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  const seek = usePlayer((s) => s.seek);
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const setVolume = usePlayer((s) => s.setVolume);
  const toggleMute = usePlayer((s) => s.toggleMute);
  const liked = usePlayer((s) => (song ? s.likedIds.includes(song.id) : false));
  const toggleLike = usePlayer((s) => s.toggleLike);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const rate = usePlayer((s) => s.playbackRate);
  const setRate = usePlayer((s) => s.setPlaybackRate);
  const sleepAt = usePlayer((s) => s.sleepAt);
  const setSleep = usePlayer((s) => s.setSleepTimer);
  const removeFromQueue = usePlayer((s) => s.removeFromQueue);
  const reorderQueue = usePlayer((s) => s.reorderQueue);
  const playQueue = usePlayer((s) => s.playQueue);

  const barRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"info" | "queue">("info");
  const dragFrom = useRef<number | null>(null);

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
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;
  const sleepRemaining = sleepAt ? Math.max(0, Math.ceil((sleepAt - Date.now()) / 60000)) : 0;

  return (
    <AppShell>
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] opacity-70 blur-3xl"
          style={{ background: `radial-gradient(ellipse at 50% 0%, oklch(0.6 0.24 ${song.hue}) 0%, transparent 60%)` }}
        />

        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <div className="mx-auto text-center lg:mx-0 lg:text-left">
            <div className="relative mx-auto h-[320px] w-[320px] lg:h-[420px] lg:w-[420px]">
              <img
                src={song.artworkLarge || song.artwork}
                alt={song.title}
                className={`h-full w-full rounded-3xl object-cover shadow-2xl transition-transform ${playing ? "scale-100" : "scale-95"}`}
              />
              <div
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-3xl"
                style={{ background: `radial-gradient(circle, oklch(0.6 0.24 ${song.hue}) 0%, transparent 70%)` }}
              />
            </div>
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
                <button onClick={toggleShuffle} className={shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
                  <Shuffle className="h-5 w-5" />
                </button>
                <button onClick={prev} className="text-muted-foreground hover:text-foreground"><SkipBack className="h-6 w-6" /></button>
                <button
                  onClick={toggle}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-aurora text-white glow-primary transition hover:scale-105"
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                </button>
                <button onClick={next} className="text-muted-foreground hover:text-foreground"><SkipForward className="h-6 w-6" /></button>
                <button onClick={cycleRepeat} className={repeat !== "off" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
                  <RepeatIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button onClick={() => toggleLike(song)} className="glass flex h-10 w-10 items-center justify-center rounded-full">
                  <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <button onClick={toggleMute}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
                  <input
                    type="range" min={0} max={1} step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="h-1 w-28 accent-primary"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full" title="Lyrics"><Mic2 className="h-4 w-4" /></button>
                  <button
                    onClick={() => setTab(tab === "queue" ? "info" : "queue")}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${tab === "queue" ? "bg-aurora text-white" : "glass"}`}
                    title="Queue"
                  >
                    <ListMusic className="h-4 w-4" />
                  </button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full" title="Download"><Download className="h-4 w-4" /></button>
                  <button className="glass flex h-10 w-10 items-center justify-center rounded-full" title="Share"><Share2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="glass flex flex-col gap-1 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Gauge className="h-3 w-3" /> Speed</div>
                  <select
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="rounded-md bg-white/5 px-2 py-1 text-sm font-semibold outline-none"
                  >
                    {RATES.map((r) => <option key={r} value={r}>{r}×</option>)}
                  </select>
                </div>
                <div className="glass flex flex-col gap-1 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Timer className="h-3 w-3" /> Sleep</div>
                  <select
                    value={sleepRemaining || ""}
                    onChange={(e) => setSleep(e.target.value ? parseInt(e.target.value) : null)}
                    className="rounded-md bg-white/5 px-2 py-1 text-sm font-semibold outline-none"
                  >
                    <option value="">Off</option>
                    {SLEEP_OPTIONS.map((m) => <option key={m} value={m}>{m} min</option>)}
                  </select>
                </div>
                <div className="glass col-span-2 flex items-center justify-between rounded-xl p-3 text-xs">
                  <span className="text-muted-foreground">Up next</span>
                  <span className="font-semibold">{queue[(index + 1) % queue.length]?.title ?? "—"}</span>
                </div>
              </div>
            </div>

            {tab === "info" ? (
              <div className="glass-strong rounded-3xl border border-white/10 p-6">
                <h3 className="mb-3 font-display text-lg font-bold">About this preview</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  30-second preview of <span className="text-foreground">{song.title}</span> by{" "}
                  <span className="text-foreground">{song.artist}</span>. Full-length playback requires a licensed catalog subscription.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="glass rounded-xl p-3"><div className="text-muted-foreground">Album</div><div className="mt-1 font-semibold">{song.album}</div></div>
                  <div className="glass rounded-xl p-3"><div className="text-muted-foreground">Genre</div><div className="mt-1 font-semibold">{song.genre}</div></div>
                </div>
              </div>
            ) : (
              <div className="glass-strong rounded-3xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between px-2">
                  <h3 className="font-display text-lg font-bold">Queue ({queue.length})</h3>
                </div>
                <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
                  {queue.map((t, i) => (
                    <div
                      key={t.id + i}
                      draggable
                      onDragStart={() => { dragFrom.current = i; }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => { if (dragFrom.current !== null) { reorderQueue(dragFrom.current, i); dragFrom.current = null; } }}
                      className={`group flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5 ${i === index ? "bg-white/5" : ""}`}
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-40 group-hover:opacity-100" />
                      <button onClick={() => playQueue(queue, i)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <img src={t.artwork} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <div className={`truncate text-sm font-medium ${i === index ? "text-aurora" : ""}`}>{t.title}</div>
                          <div className="truncate text-xs text-muted-foreground">{t.artist}</div>
                        </div>
                      </button>
                      <button onClick={() => removeFromQueue(t.id)} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

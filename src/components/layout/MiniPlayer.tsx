import { Heart, Pause, Play, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { usePlayer } from "@/lib/player-store";

export function MiniPlayer() {
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const playing = usePlayer((s) => s.playing);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  const liked = usePlayer((s) => s.liked);
  const toggleLike = usePlayer((s) => s.toggleLike);

  const song = queue[index];
  if (!song) return null;

  const fmt = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = liked[song.id];

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 lg:bottom-0 lg:px-4 lg:pb-3">
      <div className="glass-strong mx-auto flex max-w-[1600px] items-center gap-3 rounded-2xl border border-white/10 p-2 pr-3 lg:gap-4 lg:p-3">
        <Link to="/player" className="flex min-w-0 flex-1 items-center gap-3">
          <img src={song.artwork} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{song.title}</div>
            <div className="truncate text-xs text-muted-foreground">{song.artist}</div>
          </div>
        </Link>

        <div className="flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => toggleLike(song.id)}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground sm:flex"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
          </button>
          <button onClick={prev} className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground lg:flex">
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-aurora text-white glow-primary transition hover:scale-105"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
          <button onClick={next} className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground lg:flex">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden flex-1 items-center gap-3 lg:flex">
          <span className="font-mono text-xs text-muted-foreground">{fmt(currentTime)}</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 rounded-full bg-aurora" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-xs text-muted-foreground">{fmt(duration)}</span>
          <button className="text-muted-foreground hover:text-foreground">
            <Volume2 className="h-4 w-4" />
          </button>
          <Link to="/player" className="text-muted-foreground hover:text-foreground">
            <Maximize2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

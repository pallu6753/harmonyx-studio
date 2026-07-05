import { Play, Pause } from "lucide-react";
import type { Track } from "@/lib/music-api";
import { usePlayer } from "@/lib/player-store";

export function SongCard({ tracks, index }: { tracks: Track[]; index: number }) {
  const song = tracks[index];
  const playQueue = usePlayer((s) => s.playQueue);
  const toggle = usePlayer((s) => s.toggle);
  const current = usePlayer((s) => s.queue[s.index]?.id);
  const playing = usePlayer((s) => s.playing);
  const isCurrent = current === song.id;

  const onPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) toggle();
    else playQueue(tracks, index);
  };

  return (
    <button
      onClick={onPlay}
      className="group glass w-[180px] shrink-0 rounded-2xl p-3 text-left transition hover:bg-white/[0.08]"
    >
      <div className="relative">
        <img src={song.artwork} alt="" className="h-[156px] w-[156px] rounded-xl object-cover" loading="lazy" />
        <span
          className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-aurora text-white shadow-xl glow-primary transition ${
            isCurrent && playing ? "opacity-100 translate-y-0" : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }`}
        >
          {isCurrent && playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
        </span>
      </div>
      <div className={`mt-3 line-clamp-1 text-sm font-semibold ${isCurrent ? "text-aurora" : ""}`}>{song.title}</div>
      <div className="line-clamp-1 text-xs text-muted-foreground">{song.artist}</div>
    </button>
  );
}

export function ContinueCard({ tracks, index }: { tracks: Track[]; index: number }) {
  const song = tracks[index];
  const playQueue = usePlayer((s) => s.playQueue);
  return (
    <button
      onClick={() => playQueue(tracks, index)}
      className="group glass flex w-full shrink-0 items-center gap-3 overflow-hidden rounded-xl p-2 pr-4 text-left transition hover:bg-white/[0.08]"
    >
      <img src={song.artwork} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{song.title}</div>
        <div className="truncate text-xs text-muted-foreground">{song.artist}</div>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aurora text-white opacity-0 transition group-hover:opacity-100">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </div>
    </button>
  );
}

import { Play, Pause, Heart, MoreHorizontal } from "lucide-react";
import type { Track } from "@/lib/music-api";
import { usePlayer } from "@/lib/player-store";

export function SongRow({ tracks, index }: { tracks: Track[]; index: number }) {
  const song = tracks[index];
  const playQueue = usePlayer((s) => s.playQueue);
  const toggle = usePlayer((s) => s.toggle);
  const liked = usePlayer((s) => s.liked[song.id]);
  const toggleLike = usePlayer((s) => s.toggleLike);
  const current = usePlayer((s) => s.queue[s.index]?.id);
  const playing = usePlayer((s) => s.playing);
  const isCurrent = current === song.id;

  const onPlay = () => {
    if (isCurrent) toggle();
    else playQueue(tracks, index);
  };

  return (
    <div className="group grid grid-cols-[24px_1fr_auto] items-center gap-4 rounded-xl px-3 py-2 transition hover:bg-white/5 sm:grid-cols-[24px_1fr_100px_60px_80px]">
      <button
        onClick={onPlay}
        className="relative flex items-center justify-center text-sm text-muted-foreground"
      >
        <span className={`group-hover:hidden ${isCurrent ? "text-aurora" : ""}`}>{index + 1}</span>
        {isCurrent && playing ? (
          <Pause className="hidden h-4 w-4 fill-current text-foreground group-hover:block" />
        ) : (
          <Play className="hidden h-4 w-4 fill-current text-foreground group-hover:block" />
        )}
      </button>
      <button onClick={onPlay} className="flex min-w-0 items-center gap-3 text-left">
        <img src={song.artwork} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" loading="lazy" />
        <div className="min-w-0">
          <div className={`truncate font-medium ${isCurrent ? "text-aurora" : ""}`}>{song.title}</div>
          <div className="truncate text-xs text-muted-foreground">{song.artist} • {song.album}</div>
        </div>
      </button>
      <div className="hidden truncate text-sm text-muted-foreground sm:block">{song.genre}</div>
      <div className="hidden font-mono text-xs text-muted-foreground sm:block">{song.duration}</div>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => toggleLike(song.id)}
          className={`hidden h-8 w-8 items-center justify-center rounded-full sm:flex ${liked ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-primary" : ""}`} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

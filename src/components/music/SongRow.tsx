import { Play, Heart, MoreHorizontal, Sparkles } from "lucide-react";
import { CoverArt } from "../brand/CoverArt";
import type { Song } from "@/lib/mock-data";

export function SongRow({ song, index }: { song: Song; index: number }) {
  return (
    <div className="group grid grid-cols-[24px_1fr_auto] items-center gap-4 rounded-xl px-3 py-2 transition hover:bg-white/5 sm:grid-cols-[24px_1fr_120px_60px_40px]">
      <div className="relative flex items-center justify-center text-sm text-muted-foreground">
        <span className="group-hover:hidden">{index + 1}</span>
        <Play className="hidden h-4 w-4 fill-current text-foreground group-hover:block" />
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <CoverArt hue={song.hue} size={44} rounded="rounded-lg" showIcon={false} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-medium">{song.title}</span>
            {song.aiGenerated && (
              <Sparkles className="h-3 w-3 shrink-0 text-accent" />
            )}
          </div>
          <div className="truncate text-xs text-muted-foreground">{song.artist} • {song.album}</div>
        </div>
      </div>
      <div className="hidden truncate text-sm text-muted-foreground sm:block">{song.plays} plays</div>
      <div className="hidden font-mono text-xs text-muted-foreground sm:block">{song.duration}</div>
      <div className="flex items-center gap-1">
        <button className="hidden h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-foreground sm:flex">
          <Heart className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

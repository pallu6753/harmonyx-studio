import { Play, Sparkles } from "lucide-react";
import { CoverArt } from "../brand/CoverArt";
import type { Song } from "@/lib/mock-data";

export function SongCard({ song }: { song: Song }) {
  return (
    <button className="group glass w-[180px] shrink-0 rounded-2xl p-3 text-left transition hover:bg-white/[0.08]">
      <div className="relative">
        <CoverArt hue={song.hue} size={156} rounded="rounded-xl" showIcon={false} />
        <button className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-aurora text-white opacity-0 shadow-xl glow-primary transition group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </button>
        {song.aiGenerated && (
          <div className="glass absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
            <Sparkles className="h-2.5 w-2.5 text-accent" /> AI
          </div>
        )}
      </div>
      <div className="mt-3 line-clamp-1 text-sm font-semibold">{song.title}</div>
      <div className="line-clamp-1 text-xs text-muted-foreground">{song.artist}</div>
    </button>
  );
}

export function ContinueCard({ song }: { song: Song }) {
  return (
    <button className="group glass flex w-full shrink-0 items-center gap-3 overflow-hidden rounded-xl p-2 pr-4 text-left transition hover:bg-white/[0.08] sm:w-[320px]">
      <CoverArt hue={song.hue} size={56} rounded="rounded-lg" showIcon={false} />
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

export function ArtistAvatar({ hue, name, followers, verified }: { hue: number; name: string; followers: string; verified?: boolean }) {
  return (
    <button className="group w-[140px] shrink-0 text-center">
      <div className="relative mx-auto">
        <CoverArt hue={hue} size={124} rounded="rounded-full" showIcon={false} />
        {verified && (
          <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-aurora text-[10px] text-white glow-primary">✓</div>
        )}
      </div>
      <div className="mt-3 line-clamp-1 text-sm font-semibold">{name}</div>
      <div className="text-xs text-muted-foreground">{followers} followers</div>
    </button>
  );
}

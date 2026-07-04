import { Sparkles, Play } from "lucide-react";
import { CoverArt } from "../brand/CoverArt";
import type { Playlist } from "@/lib/mock-data";

export function PlaylistCard({ playlist, ai }: { playlist: Playlist; ai?: boolean }) {
  return (
    <button className="group glass w-[200px] shrink-0 rounded-2xl p-3 text-left transition hover:bg-white/[0.08]">
      <div className="relative">
        <CoverArt hue={playlist.hue} size={176} rounded="rounded-xl" showIcon={false} />
        <button className="absolute bottom-2 right-2 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-aurora text-white opacity-0 shadow-xl glow-primary transition group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </button>
        {ai && (
          <div className="glass absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
            <Sparkles className="h-2.5 w-2.5 text-accent" /> AI
          </div>
        )}
      </div>
      <div className="mt-3 line-clamp-1 text-sm font-semibold">{playlist.title}</div>
      <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{playlist.description}</div>
      <div className="mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {playlist.tracks} tracks
      </div>
    </button>
  );
}

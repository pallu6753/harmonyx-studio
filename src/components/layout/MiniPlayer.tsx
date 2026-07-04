import { Heart, Pause, Play, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { useState } from "react";
import { CoverArt } from "../brand/CoverArt";
import { TRENDING_SONGS } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

export function MiniPlayer() {
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const song = TRENDING_SONGS[0];

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 lg:bottom-0 lg:px-4 lg:pb-3">
      <div className="glass-strong mx-auto flex max-w-[1600px] items-center gap-3 rounded-2xl border border-white/10 p-2 pr-3 lg:gap-4 lg:p-3">
        {/* Track */}
        <Link to="/player" className="flex flex-1 min-w-0 items-center gap-3">
          <CoverArt hue={song.hue} size={48} rounded="rounded-xl" showIcon={false} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{song.title}</div>
            <div className="truncate text-xs text-muted-foreground">{song.artist}</div>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground sm:flex"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground lg:flex">
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-aurora text-white glow-primary transition hover:scale-105"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground lg:flex">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Progress — desktop only */}
        <div className="hidden flex-1 items-center gap-3 lg:flex">
          <span className="font-mono text-xs text-muted-foreground">1:24</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-aurora" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">{song.duration}</span>
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

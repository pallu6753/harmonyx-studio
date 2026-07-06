import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { searchTracks, type Track } from "@/lib/music-api";
import { useQuery } from "@tanstack/react-query";
import { usePlayer } from "@/lib/player-store";
import { Heart, MessageCircle, Share2, Music, Play, Pause, Plus, ListPlus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/reels")({
  head: () => ({ meta: [{ title: "Reels — Sonexa" }] }),
  component: ReelsPage,
});

const CATEGORIES = [
  { key: "trending", label: "Trending", term: "viral hits 2025" },
  { key: "global", label: "Global", term: "top 40 global" },
  { key: "india", label: "India", term: "bollywood hits" },
  { key: "kannada", label: "Kannada", term: "kannada songs" },
  { key: "tamil", label: "Tamil", term: "tamil hits" },
  { key: "telugu", label: "Telugu", term: "telugu songs" },
  { key: "malayalam", label: "Malayalam", term: "malayalam songs" },
  { key: "hindi", label: "Hindi", term: "hindi songs" },
  { key: "pop", label: "Pop", term: "pop hits" },
  { key: "hiphop", label: "Hip Hop", term: "hip hop" },
  { key: "edm", label: "EDM", term: "edm dance" },
  { key: "lofi", label: "LoFi", term: "lofi chill" },
  { key: "rock", label: "Rock", term: "rock anthems" },
  { key: "classical", label: "Classical", term: "classical music" },
  { key: "indie", label: "Indie", term: "indie rock" },
];

function ReelsPage() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const { data, isLoading } = useQuery({
    queryKey: ["reels", cat.key],
    queryFn: () => searchTracks(cat.term, 24),
    staleTime: 5 * 60_000,
  });

  const reels = useMemo(() => (data ?? []).filter((t) => t.previewUrl), [data]);

  return (
    <AppShell>
      <div className="mx-auto max-w-md px-4 py-4 sm:px-6 lg:py-6">
        <h1 className="mb-3 font-display text-3xl font-bold">Reels</h1>
        <div className="scrollbar-hidden -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                cat.key === c.key ? "bg-aurora text-white glow-primary" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="glass aspect-[9/14] w-full animate-pulse rounded-3xl" />
        )}

        <div className="scrollbar-hidden max-h-[calc(100vh-14rem)] snap-y snap-mandatory space-y-4 overflow-y-scroll pb-4">
          {reels.map((r, i) => <Reel key={r.id} track={r} allTracks={reels} index={i} />)}
        </div>
      </div>
    </AppShell>
  );
}

function Reel({ track, allTracks, index }: { track: Track; allTracks: Track[]; index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likes] = useState(() => Math.floor(1200 + Math.random() * 80000));
  const [comments] = useState(() => Math.floor(20 + Math.random() * 900));

  const addToLibrary = usePlayer((s) => s.toggleLike);
  const addToQueue = usePlayer((s) => s.addToQueue);
  const playQueue = usePlayer((s) => s.playQueue);
  const pauseGlobal = usePlayer((s) => s.setPlaying);

  // Pause the main player while a reel is showing so audio doesn't overlap
  useEffect(() => {
    if (visible && playing) pauseGlobal(false);
  }, [visible, playing, pauseGlobal]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (visible) {
      a.currentTime = 0;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [visible]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className="glass-strong relative aspect-[9/14] w-full snap-start snap-always overflow-hidden rounded-3xl border border-white/10"
      style={{ background: `radial-gradient(circle at 50% 30%, oklch(0.6 0.24 ${track.hue}) 0%, oklch(0.15 0.05 ${track.hue}) 70%)` }}
    >
      <img src={track.artworkLarge || track.artwork} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-xl" />
      <div className="relative flex h-full flex-col">
        <div className="flex-1" onClick={togglePlay}>
          <div className="flex h-full items-center justify-center">
            <img
              src={track.artworkLarge || track.artwork}
              alt={track.title}
              className={`h-56 w-56 rounded-2xl object-cover shadow-2xl transition-transform ${playing ? "scale-100" : "scale-95 opacity-80"}`}
            />
          </div>
          {!playing && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="glass-strong flex h-16 w-16 items-center justify-center rounded-full">
                <Play className="ml-1 h-6 w-6" />
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pr-16">
          <div className="text-sm font-semibold">@{track.artist.split(" ")[0].toLowerCase()}</div>
          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{track.title}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <Music className="h-3 w-3 text-accent" />
            <span className="truncate font-medium">{track.title} · {track.artist}</span>
          </div>
        </div>

        <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4 text-white">
          <button onClick={() => { setLiked((v) => !v); addToLibrary(track); }} className="flex flex-col items-center gap-1">
            <div className={`glass flex h-11 w-11 items-center justify-center rounded-full transition ${liked ? "text-primary" : ""}`}>
              <Heart className={`h-5 w-5 ${liked ? "fill-primary" : ""}`} />
            </div>
            <span className="text-[10px] font-semibold">{(likes + (liked ? 1 : 0)).toLocaleString()}</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="glass flex h-11 w-11 items-center justify-center rounded-full"><MessageCircle className="h-5 w-5" /></div>
            <span className="text-[10px] font-semibold">{comments}</span>
          </button>
          <button onClick={() => addToQueue(track)} className="flex flex-col items-center gap-1" title="Add to queue">
            <div className="glass flex h-11 w-11 items-center justify-center rounded-full"><ListPlus className="h-5 w-5" /></div>
            <span className="text-[10px] font-semibold">Queue</span>
          </button>
          <button onClick={() => playQueue(allTracks, index)} className="flex flex-col items-center gap-1" title="Open in player">
            <div className="glass flex h-11 w-11 items-center justify-center rounded-full"><Plus className="h-5 w-5" /></div>
            <span className="text-[10px] font-semibold">Play</span>
          </button>
          <button className="glass flex h-11 w-11 items-center justify-center rounded-full"><Share2 className="h-5 w-5" /></button>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
          <div className="h-full bg-aurora transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.previewUrl}
        preload="metadata"
        loop
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
        }}
      />
    </article>
  );
}

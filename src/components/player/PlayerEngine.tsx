import { useEffect, useRef } from "react";
import { usePlayer } from "@/lib/player-store";

// Mounts a single <audio> element and syncs it with the Zustand player store.
export function PlayerEngine() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const playing = usePlayer((s) => s.playing);
  const volume = usePlayer((s) => s.volume);
  const currentTime = usePlayer((s) => s.currentTime);
  const setTime = usePlayer((s) => s.setTime);
  const setPlaying = usePlayer((s) => s.setPlaying);
  const next = usePlayer((s) => s.next);

  const track = queue[index];
  const src = track?.previewUrl ?? "";

  // Load a new src whenever the current track changes.
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (el.src !== src) {
      el.src = src;
      el.load();
    }
  }, [src]);

  // Play / pause
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (playing) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [playing, src, setPlaying]);

  // Volume
  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
  }, [volume]);

  // External seek: only when diff is large (avoid feedback loops on timeupdate)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (Math.abs(el.currentTime - currentTime) > 0.75) {
      el.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <audio
      ref={ref}
      preload="metadata"
      onTimeUpdate={(e) => setTime(e.currentTarget.currentTime, e.currentTarget.duration || undefined)}
      onLoadedMetadata={(e) => setTime(e.currentTarget.currentTime, e.currentTarget.duration)}
      onEnded={() => next()}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    />
  );
}

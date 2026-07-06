import { useEffect, useRef } from "react";
import { usePlayer } from "@/lib/player-store";

// Global audio engine: single <audio> element synced with the Zustand store,
// wired to Media Session API + keyboard shortcuts + sleep timer.
export function PlayerEngine() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const playing = usePlayer((s) => s.playing);
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const rate = usePlayer((s) => s.playbackRate);
  const currentTime = usePlayer((s) => s.currentTime);
  const sleepAt = usePlayer((s) => s.sleepAt);
  const setTime = usePlayer((s) => s.setTime);
  const setPlaying = usePlayer((s) => s.setPlaying);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const toggle = usePlayer((s) => s.toggle);
  const seek = usePlayer((s) => s.seek);
  const setVolume = usePlayer((s) => s.setVolume);
  const toggleMute = usePlayer((s) => s.toggleMute);

  const track = queue[index];
  const src = track?.previewUrl ?? "";

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (el.src !== src) {
      el.src = src;
      el.load();
    }
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, src, setPlaying]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
      ref.current.muted = muted;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (Math.abs(el.currentTime - currentTime) > 0.75) el.currentTime = currentTime;
  }, [currentTime]);

  // Sleep timer — pause when we hit the target time
  useEffect(() => {
    if (!sleepAt) return;
    const remaining = sleepAt - Date.now();
    if (remaining <= 0) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setPlaying(false), remaining);
    return () => clearTimeout(id);
  }, [sleepAt, setPlaying]);

  // Media Session API — lock-screen and headphone controls
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: track.artwork, sizes: "100x100", type: "image/jpeg" },
        { src: track.artworkLarge, sizes: "600x600", type: "image/jpeg" },
      ],
    });
    const handlers: Array<[MediaSessionAction, () => void]> = [
      ["play", () => setPlaying(true)],
      ["pause", () => setPlaying(false)],
      ["previoustrack", () => prev()],
      ["nexttrack", () => next()],
    ];
    handlers.forEach(([a, h]) => {
      try { navigator.mediaSession.setActionHandler(a, h); } catch { /* unsupported action */ }
    });
    return () => handlers.forEach(([a]) => {
      try { navigator.mediaSession.setActionHandler(a, null); } catch { /* noop */ }
    });
  }, [track, next, prev, setPlaying]);

  // Keyboard shortcuts (ignore when typing in inputs)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const el = ref.current;
      switch (e.key) {
        case " ":
          e.preventDefault(); toggle(); break;
        case "ArrowRight":
          if (e.shiftKey) next();
          else if (el) seek(Math.min((el.duration || 0), el.currentTime + 5));
          break;
        case "ArrowLeft":
          if (e.shiftKey) prev();
          else if (el) seek(Math.max(0, el.currentTime - 5));
          break;
        case "ArrowUp":
          e.preventDefault(); setVolume(Math.min(1, volume + 0.05)); break;
        case "ArrowDown":
          e.preventDefault(); setVolume(Math.max(0, volume - 0.05)); break;
        case "m": case "M":
          toggleMute(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev, seek, setVolume, toggleMute, volume]);

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

import { create } from "zustand";
import type { Track } from "./music-api";

type PlayerState = {
  queue: Track[];
  index: number;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  liked: Record<string, boolean>;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  setTime: (t: number, d?: number) => void;
  setPlaying: (p: boolean) => void;
  toggleLike: (id: string) => void;
};

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  index: 0,
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: 0.85,
  liked: {},
  playQueue: (tracks, startIndex = 0) => {
    if (!tracks.length) return;
    set({ queue: tracks, index: Math.max(0, Math.min(startIndex, tracks.length - 1)), playing: true, currentTime: 0 });
  },
  toggle: () => set({ playing: !get().playing }),
  next: () => {
    const { index, queue } = get();
    if (!queue.length) return;
    set({ index: (index + 1) % queue.length, currentTime: 0, playing: true });
  },
  prev: () => {
    const { index, queue, currentTime } = get();
    if (!queue.length) return;
    if (currentTime > 3) return set({ currentTime: 0 });
    set({ index: (index - 1 + queue.length) % queue.length, currentTime: 0, playing: true });
  },
  seek: (t) => set({ currentTime: t }),
  setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
  setTime: (t, d) => set(d ? { currentTime: t, duration: d } : { currentTime: t }),
  setPlaying: (p) => set({ playing: p }),
  toggleLike: (id) => set({ liked: { ...get().liked, [id]: !get().liked[id] } }),
}));

export const currentTrack = (s: PlayerState) => s.queue[s.index];

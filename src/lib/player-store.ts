import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Track } from "./music-api";

export type RepeatMode = "off" | "all" | "one";

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  cover?: string; // data URL or hue-based fallback
  hue: number;
  isPublic: boolean;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  trackIds: string[];
  // Snapshot of track metadata so playlists work fully offline
  tracks: Record<string, Track>;
};

type PlayerState = {
  // Playback
  queue: Track[];
  originalQueue: Track[]; // unshuffled
  index: number;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  shuffle: boolean;
  repeat: RepeatMode;

  // Sleep timer (epoch ms when playback should pause; 0 = off)
  sleepAt: number;

  // Library
  likedIds: string[];
  history: Track[]; // most recent first, max 200
  recentlyPlayed: Track[]; // deduped, most recent first, max 40
  playlists: Playlist[];

  // Actions — playback
  playQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (t: Track) => void;
  playNext: (t: Track) => void;
  removeFromQueue: (id: string) => void;
  reorderQueue: (from: number, to: number) => void;
  clearQueue: () => void;
  toggle: () => void;
  setPlaying: (p: boolean) => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setTime: (t: number, d?: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (r: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setSleepTimer: (minutes: number | null) => void;

  // Library
  toggleLike: (t: Track) => void;
  isLiked: (id: string) => boolean;
  pushHistory: (t: Track) => void;
  clearHistory: () => void;

  // Playlists CRUD
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  updatePlaylist: (id: string, patch: Partial<Pick<Playlist, "description" | "isPublic" | "cover">>) => void;
  duplicatePlaylist: (id: string) => Playlist | null;
  togglePinPlaylist: (id: string) => void;
  addToPlaylist: (id: string, track: Track) => void;
  removeFromPlaylist: (id: string, trackId: string) => void;
  reorderPlaylist: (id: string, from: number, to: number) => void;
};

function shuffleArray<T>(arr: T[], keepIndex: number): { arr: T[]; index: number } {
  if (arr.length <= 1) return { arr: [...arr], index: keepIndex };
  const keep = arr[keepIndex];
  const rest = arr.filter((_, i) => i !== keepIndex);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return { arr: [keep, ...rest], index: 0 };
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      originalQueue: [],
      index: 0,
      playing: false,
      currentTime: 0,
      duration: 0,
      volume: 0.85,
      muted: false,
      playbackRate: 1,
      shuffle: false,
      repeat: "off",
      sleepAt: 0,

      likedIds: [],
      history: [],
      recentlyPlayed: [],
      playlists: [],

      playQueue: (tracks, startIndex = 0) => {
        if (!tracks.length) return;
        const idx = Math.max(0, Math.min(startIndex, tracks.length - 1));
        const { shuffle } = get();
        if (shuffle) {
          const { arr, index } = shuffleArray(tracks, idx);
          set({ queue: arr, originalQueue: tracks, index, playing: true, currentTime: 0 });
        } else {
          set({ queue: tracks, originalQueue: tracks, index: idx, playing: true, currentTime: 0 });
        }
        get().pushHistory(tracks[idx]);
      },
      addToQueue: (t) => {
        const { queue, originalQueue } = get();
        set({ queue: [...queue, t], originalQueue: [...originalQueue, t] });
      },
      playNext: (t) => {
        const { queue, index, originalQueue } = get();
        const q = [...queue];
        q.splice(index + 1, 0, t);
        set({ queue: q, originalQueue: [...originalQueue, t] });
      },
      removeFromQueue: (id) => {
        const { queue, index } = get();
        const pos = queue.findIndex((t) => t.id === id);
        if (pos === -1) return;
        const q = queue.filter((_, i) => i !== pos);
        let newIndex = index;
        if (pos < index) newIndex = index - 1;
        if (pos === index) newIndex = Math.min(index, q.length - 1);
        set({ queue: q, index: Math.max(0, newIndex) });
      },
      reorderQueue: (from, to) => {
        const { queue, index } = get();
        if (from === to || from < 0 || to < 0 || from >= queue.length || to >= queue.length) return;
        const q = [...queue];
        const [m] = q.splice(from, 1);
        q.splice(to, 0, m);
        let newIndex = index;
        if (from === index) newIndex = to;
        else if (from < index && to >= index) newIndex = index - 1;
        else if (from > index && to <= index) newIndex = index + 1;
        set({ queue: q, index: newIndex });
      },
      clearQueue: () => set({ queue: [], originalQueue: [], index: 0, playing: false, currentTime: 0 }),

      toggle: () => set({ playing: !get().playing }),
      setPlaying: (p) => set({ playing: p }),
      next: () => {
        const { index, queue, repeat } = get();
        if (!queue.length) return;
        if (repeat === "one") {
          set({ currentTime: 0, playing: true });
          return;
        }
        const last = index >= queue.length - 1;
        if (last && repeat === "off") {
          set({ playing: false, currentTime: 0 });
          return;
        }
        const nextIdx = (index + 1) % queue.length;
        set({ index: nextIdx, currentTime: 0, playing: true });
        get().pushHistory(queue[nextIdx]);
      },
      prev: () => {
        const { index, queue, currentTime } = get();
        if (!queue.length) return;
        if (currentTime > 3) return set({ currentTime: 0 });
        const p = (index - 1 + queue.length) % queue.length;
        set({ index: p, currentTime: 0, playing: true });
        get().pushHistory(queue[p]);
      },
      seek: (t) => set({ currentTime: t }),
      setTime: (t, d) => set(d ? { currentTime: t, duration: d } : { currentTime: t }),
      setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)), muted: false }),
      toggleMute: () => set({ muted: !get().muted }),
      setPlaybackRate: (r) => set({ playbackRate: Math.max(0.25, Math.min(3, r)) }),
      toggleShuffle: () => {
        const { shuffle, queue, originalQueue, index } = get();
        const willShuffle = !shuffle;
        if (!queue.length) return set({ shuffle: willShuffle });
        if (willShuffle) {
          const { arr, index: nIdx } = shuffleArray(queue, index);
          set({ shuffle: true, queue: arr, index: nIdx });
        } else {
          const current = queue[index];
          const originalIdx = Math.max(0, originalQueue.findIndex((t) => t.id === current?.id));
          set({ shuffle: false, queue: originalQueue, index: originalIdx });
        }
      },
      cycleRepeat: () => {
        const modes: RepeatMode[] = ["off", "all", "one"];
        set({ repeat: modes[(modes.indexOf(get().repeat) + 1) % 3] });
      },
      setSleepTimer: (minutes) => set({ sleepAt: minutes ? Date.now() + minutes * 60_000 : 0 }),

      toggleLike: (t) => {
        const { likedIds, playlists } = get();
        const has = likedIds.includes(t.id);
        set({ likedIds: has ? likedIds.filter((x) => x !== t.id) : [t.id, ...likedIds] });
        // Cache track metadata inside a synthetic "Liked" playlist for later lookup
        const liked = playlists.find((p) => p.id === "__liked__");
        if (!liked) {
          set({
            playlists: [
              ...playlists,
              {
                id: "__liked__",
                name: "Liked Songs",
                hue: 340,
                isPublic: false,
                pinned: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                trackIds: [t.id],
                tracks: { [t.id]: t },
              },
            ],
          });
        } else {
          const nextTracks = { ...liked.tracks, [t.id]: t };
          set({
            playlists: playlists.map((p) =>
              p.id === "__liked__" ? { ...p, tracks: nextTracks, updatedAt: Date.now() } : p,
            ),
          });
        }
      },
      isLiked: (id) => get().likedIds.includes(id),
      pushHistory: (t) => {
        if (!t) return;
        const { history, recentlyPlayed } = get();
        const nextHist = [t, ...history.filter((x) => x.id !== t.id)].slice(0, 200);
        const nextRecent = [t, ...recentlyPlayed.filter((x) => x.id !== t.id)].slice(0, 40);
        set({ history: nextHist, recentlyPlayed: nextRecent });
      },
      clearHistory: () => set({ history: [], recentlyPlayed: [] }),

      createPlaylist: (name, description) => {
        const p: Playlist = {
          id: uid(),
          name,
          description,
          hue: Math.floor(Math.random() * 360),
          isPublic: false,
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          trackIds: [],
          tracks: {},
        };
        set({ playlists: [p, ...get().playlists] });
        return p;
      },
      deletePlaylist: (id) => set({ playlists: get().playlists.filter((p) => p.id !== id) }),
      renamePlaylist: (id, name) =>
        set({
          playlists: get().playlists.map((p) => (p.id === id ? { ...p, name, updatedAt: Date.now() } : p)),
        }),
      updatePlaylist: (id, patch) =>
        set({
          playlists: get().playlists.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)),
        }),
      duplicatePlaylist: (id) => {
        const src = get().playlists.find((p) => p.id === id);
        if (!src) return null;
        const copy: Playlist = { ...src, id: uid(), name: `${src.name} copy`, pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
        set({ playlists: [copy, ...get().playlists] });
        return copy;
      },
      togglePinPlaylist: (id) =>
        set({
          playlists: get().playlists.map((p) => (p.id === id ? { ...p, pinned: !p.pinned, updatedAt: Date.now() } : p)),
        }),
      addToPlaylist: (id, track) =>
        set({
          playlists: get().playlists.map((p) => {
            if (p.id !== id) return p;
            if (p.trackIds.includes(track.id)) return p;
            return {
              ...p,
              trackIds: [...p.trackIds, track.id],
              tracks: { ...p.tracks, [track.id]: track },
              updatedAt: Date.now(),
            };
          }),
        }),
      removeFromPlaylist: (id, trackId) =>
        set({
          playlists: get().playlists.map((p) => {
            if (p.id !== id) return p;
            const { [trackId]: _drop, ...rest } = p.tracks;
            return { ...p, trackIds: p.trackIds.filter((x) => x !== trackId), tracks: rest, updatedAt: Date.now() };
          }),
        }),
      reorderPlaylist: (id, from, to) =>
        set({
          playlists: get().playlists.map((p) => {
            if (p.id !== id) return p;
            const ids = [...p.trackIds];
            if (from < 0 || to < 0 || from >= ids.length || to >= ids.length) return p;
            const [m] = ids.splice(from, 1);
            ids.splice(to, 0, m);
            return { ...p, trackIds: ids, updatedAt: Date.now() };
          }),
        }),
    }),
    {
      name: "sonexa-player-v2",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : (undefined as unknown as Storage))),
      partialize: (s) => ({
        volume: s.volume,
        muted: s.muted,
        playbackRate: s.playbackRate,
        shuffle: s.shuffle,
        repeat: s.repeat,
        likedIds: s.likedIds,
        history: s.history.slice(0, 100),
        recentlyPlayed: s.recentlyPlayed,
        playlists: s.playlists,
      }),
      version: 2,
    },
  ),
);

export const currentTrack = (s: PlayerState) => s.queue[s.index];

// Two-way sync between the local Zustand player store and Lovable Cloud.
// - On sign-in: pull cloud state, merge with local, push merged back.
// - While signed in: debounce-push liked/playlists/recently-played changes.
// - Local store still runs offline; cloud is the source of truth once signed in.

import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlayer, type Playlist } from "./player-store";
import type { Track } from "./music-api";
import { useAuth } from "@/hooks/use-auth";

function debounce<T extends (...a: never[]) => void>(fn: T, ms: number) {
  let id: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

async function pullFromCloud(userId: string) {
  const [likedRes, playlistsRes, itemsRes, recentRes] = await Promise.all([
    supabase.from("liked_songs").select("track_id, track, liked_at").eq("user_id", userId).order("liked_at", { ascending: false }),
    supabase.from("playlists").select("*").eq("user_id", userId).order("sort_order", { ascending: true }),
    supabase.from("playlist_items").select("playlist_id, track_id, track, position").eq("user_id", userId).order("position", { ascending: true }),
    supabase.from("recently_played").select("track, played_at").eq("user_id", userId).order("played_at", { ascending: false }).limit(40),
  ]);

  const liked = (likedRes.data ?? []) as unknown as Array<{ track_id: string; track: Track }>;
  const cloudPlaylists = (playlistsRes.data ?? []) as Array<{
    id: string; name: string; description: string | null; cover_url: string | null;
    is_public: boolean; is_pinned: boolean; created_at: string; updated_at: string;
  }>;
  const items = (itemsRes.data ?? []) as unknown as Array<{ playlist_id: string; track_id: string; track: Track; position: number }>;
  const recent = (recentRes.data ?? []) as unknown as Array<{ track: Track }>;

  const playlists: Playlist[] = cloudPlaylists.map((p) => {
    const rows = items.filter((i) => i.playlist_id === p.id);
    const tracks: Record<string, Track> = {};
    rows.forEach((r) => (tracks[r.track_id] = r.track));
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? undefined,
      cover: p.cover_url ?? undefined,
      hue: Math.abs([...p.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)) % 360,
      isPublic: p.is_public,
      pinned: p.is_pinned,
      createdAt: new Date(p.created_at).getTime(),
      updatedAt: new Date(p.updated_at).getTime(),
      trackIds: rows.map((r) => r.track_id),
      tracks,
    };
  });

  // Merge Liked as synthetic __liked__ playlist for track metadata lookup
  if (liked.length) {
    const tracks: Record<string, Track> = {};
    liked.forEach((l) => (tracks[l.track_id] = l.track));
    playlists.unshift({
      id: "__liked__",
      name: "Liked Songs",
      hue: 340,
      isPublic: false,
      pinned: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      trackIds: liked.map((l) => l.track_id),
      tracks,
    });
  }

  return {
    likedIds: liked.map((l) => l.track_id),
    playlists,
    recentlyPlayed: recent.map((r) => r.track),
  };
}

async function pushLiked(userId: string, likedIds: string[], playlists: Playlist[]) {
  const liked = playlists.find((p) => p.id === "__liked__");
  const rows = likedIds
    .map((id) => liked?.tracks[id])
    .filter((t): t is Track => !!t)
    .map((t) => ({ user_id: userId, track_id: t.id, track: t }));

  // Full replace strategy — small dataset, keeps cloud in sync with local truth.
  await supabase.from("liked_songs").delete().eq("user_id", userId);
  if (rows.length) await supabase.from("liked_songs").insert(rows);
}

async function pushPlaylists(userId: string, playlists: Playlist[]) {
  const real = playlists.filter((p) => p.id !== "__liked__");
  await supabase.from("playlist_items").delete().eq("user_id", userId);
  await supabase.from("playlists").delete().eq("user_id", userId);
  if (!real.length) return;

  const rows = real.map((p, i) => ({
    id: p.id,
    user_id: userId,
    name: p.name,
    description: p.description ?? null,
    cover_url: p.cover ?? null,
    is_public: p.isPublic,
    is_pinned: p.pinned,
    sort_order: i,
  }));
  await supabase.from("playlists").insert(rows);

  const items: Array<{ playlist_id: string; user_id: string; track_id: string; track: Track; position: number }> = [];
  real.forEach((p) => {
    p.trackIds.forEach((tid, pos) => {
      const track = p.tracks[tid];
      if (track) items.push({ playlist_id: p.id, user_id: userId, track_id: tid, track, position: pos });
    });
  });
  if (items.length) await supabase.from("playlist_items").insert(items as never);
}

async function pushRecent(userId: string, recent: Track[]) {
  await supabase.from("recently_played").delete().eq("user_id", userId);
  if (!recent.length) return;
  const now = Date.now();
  const rows = recent.slice(0, 40).map((t, i) => ({
    user_id: userId,
    track_id: t.id,
    track: t,
    played_at: new Date(now - i * 1000).toISOString(),
  }));
  await supabase.from("recently_played").insert(rows);
}

export function useCloudSync() {
  const { user } = useAuth();
  const hydratedRef = useRef<string | null>(null);

  // Pull once on sign-in
  useEffect(() => {
    if (!user) {
      hydratedRef.current = null;
      return;
    }
    if (hydratedRef.current === user.id) return;
    hydratedRef.current = user.id;

    (async () => {
      const cloud = await pullFromCloud(user.id);
      const state = usePlayer.getState();
      // Merge: cloud + local unique
      const mergedLiked = Array.from(new Set([...cloud.likedIds, ...state.likedIds]));
      const cloudIds = new Set(cloud.playlists.map((p) => p.id));
      const localOnly = state.playlists.filter((p) => p.id !== "__liked__" && !cloudIds.has(p.id));
      const mergedPlaylists = [...cloud.playlists, ...localOnly];
      const seen = new Set<string>();
      const mergedRecent = [...cloud.recentlyPlayed, ...state.recentlyPlayed].filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      }).slice(0, 40);

      usePlayer.setState({
        likedIds: mergedLiked,
        playlists: mergedPlaylists,
        recentlyPlayed: mergedRecent,
      });

      // Push merged snapshot back so cloud reflects merge
      const s = usePlayer.getState();
      void pushLiked(user.id, s.likedIds, s.playlists);
      void pushPlaylists(user.id, s.playlists);
      void pushRecent(user.id, s.recentlyPlayed);
    })().catch((e) => console.error("[cloud-sync] pull failed", e));
  }, [user]);

  // Push on changes
  useEffect(() => {
    if (!user) return;
    const uid = user.id;
    const pushLikedD = debounce((ids: string[], pls: Playlist[]) => void pushLiked(uid, ids, pls), 800);
    const pushPlaylistsD = debounce((pls: Playlist[]) => void pushPlaylists(uid, pls), 1200);
    const pushRecentD = debounce((r: Track[]) => void pushRecent(uid, r), 3000);

    const unsub = usePlayer.subscribe((s, prev) => {
      if (s.likedIds !== prev.likedIds) pushLikedD(s.likedIds, s.playlists);
      if (s.playlists !== prev.playlists) pushPlaylistsD(s.playlists);
      if (s.recentlyPlayed !== prev.recentlyPlayed) pushRecentD(s.recentlyPlayed);
    });
    return () => unsub();
  }, [user]);
}

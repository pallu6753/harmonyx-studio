// Public music API client. Uses iTunes Search API for track metadata and 30s previews.
// (User provided a Jamendo-style client ID `7086726703a34286b98c3e0b90aadcb3`, but Jamendo rejected it as invalid.
// iTunes Search is a fully public, CORS-friendly source that works without keys.)

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationMs: number;
  artwork: string;
  artworkLarge: string;
  previewUrl: string;
  genre: string;
  hue: number;
};

function msToTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function hueFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

type ItunesResult = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackTimeMillis: number;
  previewUrl?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
};

function normalize(r: ItunesResult): Track {
  const artwork = r.artworkUrl100 ?? "";
  return {
    id: String(r.trackId),
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    durationMs: r.trackTimeMillis ?? 0,
    duration: msToTime(r.trackTimeMillis ?? 0),
    artwork,
    artworkLarge: artwork.replace("100x100bb", "600x600bb"),
    previewUrl: r.previewUrl ?? "",
    genre: r.primaryGenreName ?? "Music",
    hue: hueFromString(r.artistName + r.trackName),
  };
}

async function itunes(params: Record<string, string | number>) {
  const qs = new URLSearchParams({ entity: "song", limit: "24", ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const res = await fetch(`https://itunes.apple.com/search?${qs.toString()}`);
  if (!res.ok) throw new Error("Music API failed");
  const json = (await res.json()) as { results: ItunesResult[] };
  return json.results.filter((r) => r.previewUrl && r.trackName).map(normalize);
}

export function searchTracks(query: string, limit = 24) {
  return itunes({ term: query || "top hits", limit });
}

export function tracksByGenre(genre: string, limit = 24) {
  return itunes({ term: genre, limit });
}

export const HOME_SECTIONS: { key: string; title: string; subtitle?: string; term: string }[] = [
  { key: "trending", title: "Trending now", subtitle: "What the world is playing", term: "top hits 2025" },
  { key: "focus", title: "Deep focus", subtitle: "Instrumentals for flow", term: "lofi study" },
  { key: "workout", title: "Workout pulse", subtitle: "High-BPM energy", term: "workout" },
  { key: "chill", title: "Chill vibes", subtitle: "Wind down", term: "chill acoustic" },
  { key: "hiphop", title: "Hip-hop essentials", term: "hip hop" },
  { key: "indie", title: "Indie discoveries", term: "indie rock" },
];

// Mock data for HarmonyX AI. Replace with real API calls in Part 2.
// Album art uses gradient placeholders rendered by the CoverArt component.

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  plays: string;
  hue: number; // for cover gradient
  aiGenerated?: boolean;
};

export type Artist = {
  id: string;
  name: string;
  followers: string;
  genre: string;
  verified: boolean;
  hue: number;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  tracks: number;
  curator: string;
  hue: number;
  mood?: string;
};

export const TRENDING_SONGS: Song[] = [
  { id: "1", title: "Neon Dreams", artist: "Aurora Wave", album: "Midnight Circuit", duration: "3:42", genre: "Synthwave", plays: "12.4M", hue: 280 },
  { id: "2", title: "Quantum Heart", artist: "Kira Solace", album: "Deep Signals", duration: "4:15", genre: "Electronic", plays: "8.7M", hue: 220 },
  { id: "3", title: "Kannada Sunrise", artist: "Meera Rao", album: "Bengaluru Nights", duration: "3:28", genre: "Indie", plays: "5.2M", hue: 30, aiGenerated: true },
  { id: "4", title: "Violet Storm", artist: "Kaz Nova", album: "Aurora", duration: "3:55", genre: "Alt Pop", plays: "15.1M", hue: 300 },
  { id: "5", title: "Silk Machine", artist: "Yuki & The Circuits", album: "Prism", duration: "4:02", genre: "Future Funk", plays: "6.9M", hue: 340 },
  { id: "6", title: "Orbit", artist: "Mono Signal", album: "Zero G", duration: "3:18", genre: "Ambient", plays: "3.4M", hue: 200 },
  { id: "7", title: "Fever Grid", artist: "PLSR", album: "Grid State", duration: "3:36", genre: "House", plays: "9.8M", hue: 260 },
  { id: "8", title: "Glass Sky", artist: "Nia Reyes", album: "Above", duration: "4:22", genre: "Dream Pop", plays: "4.1M", hue: 190 },
];

export const CONTINUE_LISTENING: Song[] = [
  { id: "c1", title: "Late Night Study", artist: "Lofi Circuit", album: "Focus", duration: "2:45", genre: "Lo-fi", plays: "22M", hue: 250 },
  { id: "c2", title: "Rain Interface", artist: "Aurora Wave", album: "Ambient EP", duration: "5:12", genre: "Ambient", plays: "1.8M", hue: 210 },
  { id: "c3", title: "Bengaluru Nights", artist: "Meera Rao", album: "Same", duration: "3:28", genre: "Indie", plays: "890K", hue: 15 },
  { id: "c4", title: "Prism Break", artist: "Kaz Nova", album: "Aurora", duration: "3:44", genre: "Alt Pop", plays: "11M", hue: 320 },
];

export const AI_PLAYLISTS: Playlist[] = [
  { id: "p1", title: "Your Aurora Mix", description: "Personalized by Harmony AI from your listening this week", tracks: 42, curator: "Harmony AI", hue: 285, mood: "Focused" },
  { id: "p2", title: "Deep Focus Circuit", description: "Instrumental synthwave for deep work sessions", tracks: 28, curator: "Harmony AI", hue: 235, mood: "Focus" },
  { id: "p3", title: "Late Night Kannada", description: "Regional gems recommended for your mood", tracks: 35, curator: "Harmony AI", hue: 340, mood: "Chill" },
  { id: "p4", title: "New Discoveries", description: "12 tracks you've never heard, matched to your taste", tracks: 12, curator: "Harmony AI", hue: 195, mood: "Discover" },
  { id: "p5", title: "Workout Pulse", description: "High-BPM tracks synced to your typical run", tracks: 24, curator: "Harmony AI", hue: 15, mood: "Energy" },
];

export const FEATURED_PLAYLISTS: Playlist[] = [
  { id: "f1", title: "Editor's Pick: Midnight", description: "Curated by HarmonyX Editorial", tracks: 50, curator: "Editorial", hue: 270 },
  { id: "f2", title: "Indie Rising", description: "Breakthrough artists this month", tracks: 40, curator: "Editorial", hue: 340 },
  { id: "f3", title: "Global South", description: "Sounds from Bengaluru, Lagos, São Paulo", tracks: 60, curator: "Editorial", hue: 30 },
  { id: "f4", title: "AI Composed", description: "The best AI-generated tracks this week", tracks: 25, curator: "Editorial", hue: 250 },
];

export const TRENDING_ARTISTS: Artist[] = [
  { id: "a1", name: "Aurora Wave", followers: "2.4M", genre: "Synthwave", verified: true, hue: 280 },
  { id: "a2", name: "Kira Solace", followers: "1.8M", genre: "Electronic", verified: true, hue: 220 },
  { id: "a3", name: "Meera Rao", followers: "890K", genre: "Indie", verified: true, hue: 30 },
  { id: "a4", name: "Kaz Nova", followers: "3.1M", genre: "Alt Pop", verified: true, hue: 300 },
  { id: "a5", name: "PLSR", followers: "1.2M", genre: "House", verified: false, hue: 260 },
  { id: "a6", name: "Nia Reyes", followers: "620K", genre: "Dream Pop", verified: false, hue: 190 },
];

export const REELS = [
  { id: "r1", user: "@aurora.wave", track: "Neon Dreams", likes: "48.2K", comments: "1.2K", caption: "Studio session vibes 🎹", hue: 280 },
  { id: "r2", user: "@meera.rao", track: "Kannada Sunrise", likes: "22.1K", comments: "890", caption: "First AI-assisted verse, what do you think?", hue: 30 },
  { id: "r3", user: "@kaz.nova", track: "Violet Storm", likes: "112K", comments: "4.3K", caption: "Behind the drop", hue: 300 },
];

export const AI_UNIVERSE_PROMPTS = [
  "Create a romantic Kannada song with violin and guitar",
  "Generate a sad piano melody at 72 BPM",
  "Make an energetic EDM beat with a tropical drop",
  "Build me an AI band for a lo-fi hip-hop project",
  "Remix Neon Dreams in a jazz style",
  "Design album art for a synthwave concept EP",
];

export const REWARDS = {
  coins: 2840,
  xp: 12450,
  level: 24,
  streak: 47,
  nextLevelXp: 15000,
  achievements: [
    { id: "1", title: "First Listen", description: "Play your first song", unlocked: true, icon: "🎵" },
    { id: "2", title: "Playlist Curator", description: "Create 5 playlists", unlocked: true, icon: "📀" },
    { id: "3", title: "AI Composer", description: "Generate a song with AI", unlocked: true, icon: "🤖" },
    { id: "4", title: "50-Day Streak", description: "Listen 50 days in a row", unlocked: false, icon: "🔥" },
    { id: "5", title: "Chart Topper", description: "Get 10K plays on a track", unlocked: false, icon: "👑" },
    { id: "6", title: "Band Leader", description: "Form your first AI band", unlocked: false, icon: "🎸" },
  ],
};

export const USER_PROFILE = {
  name: "Alex Rivera",
  handle: "@alex.rivera",
  bio: "Music explorer • AI composer • Building HarmonyX Universe",
  followers: 1284,
  following: 342,
  hue: 285,
  stats: {
    minutesListened: 18420,
    songsCreated: 12,
    playlists: 24,
    topGenre: "Synthwave",
  },
};

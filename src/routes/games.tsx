import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Gamepad2, Music, Puzzle, Zap, Brain, Trophy } from "lucide-react";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Games — HarmonyX AI" }] }),
  component: GamesPage,
});

const GAMES = [
  { title: "Guess the Song", desc: "Name the track in 5 seconds", icon: Music, hue: 285 },
  { title: "Piano Tiles", desc: "Tap the falling notes in rhythm", icon: Zap, hue: 220 },
  { title: "Lyric Challenge", desc: "Fill in the missing lyrics", icon: Brain, hue: 340 },
  { title: "Rhythm Battle", desc: "1v1 beat matching duels", icon: Gamepad2, hue: 260 },
  { title: "Album Puzzle", desc: "Rebuild scrambled cover art", icon: Puzzle, hue: 30 },
  { title: "Beat Tap", desc: "Tap to the BPM", icon: Trophy, hue: 195 },
];

function GamesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Games</h1>
          <p className="mt-1 text-muted-foreground">Play, earn XP, climb the leaderboards.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => (
            <button key={g.title} className="group glass relative overflow-hidden rounded-3xl p-6 text-left transition hover:bg-white/[0.08]">
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition group-hover:opacity-70"
                style={{ background: `oklch(0.6 0.24 ${g.hue})` }}
              />
              <div className="relative">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: `linear-gradient(135deg, oklch(0.6 0.24 ${g.hue}), oklch(0.4 0.22 ${g.hue + 40}))` }}
                >
                  <g.icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-display text-xl font-bold">{g.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{g.desc}</div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">Play →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

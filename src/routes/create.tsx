import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UniversePrompt } from "@/components/ai/UniversePrompt";
import {
  Music2, Mic2, Guitar, Piano, Drum, Radio, Wand2, Users2, Palette, Video, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "AI Music Universe — HarmonyX AI" }] }),
  component: CreatePage,
});

const STUDIOS = [
  { icon: Music2, title: "AI Song Studio", desc: "Full song from prompt: lyrics, melody, vocals, art", hue: 285 },
  { icon: Users2, title: "AI Band Builder", desc: "Assemble a virtual band with unique AI members", hue: 220 },
  { icon: Mic2, title: "AI Voice Studio", desc: "Generate vocals, harmonies, auto-tune, effects", hue: 340 },
  { icon: Guitar, title: "AI Chord Generator", desc: "Guitar, piano, ukulele diagrams and progressions", hue: 30 },
  { icon: Drum, title: "AI Beat Generator", desc: "Hip-hop, lo-fi, EDM, trap, cinematic beats", hue: 260 },
  { icon: Piano, title: "AI Melody Generator", desc: "Piano, strings, synth, orchestra melodies", hue: 195 },
  { icon: Wand2, title: "AI Lyrics Generator", desc: "Pop, rap, folk, devotional — with rhyme control", hue: 300 },
  { icon: Radio, title: "AI DJ", desc: "Continuous mix with mood detection and transitions", hue: 240 },
  { icon: Palette, title: "AI Album Designer", desc: "Covers, posters, thumbnails, social banners", hue: 15 },
  { icon: Video, title: "AI Music Video", desc: "Storyboard, scenes, animation style (demo)", hue: 190 },
];

function CreatePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <section className="space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3 w-3 text-accent" /> Music Universe
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
            One prompt. <span className="text-aurora">Infinite music.</span>
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Describe what you want to hear, learn, or create. Harmony AI orchestrates every studio
            from a single interface.
          </p>
          <UniversePrompt />
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold">Studios</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIOS.map((s) => (
              <button
                key={s.title}
                className="group glass relative overflow-hidden rounded-3xl p-5 text-left transition hover:bg-white/[0.08]"
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl transition group-hover:opacity-70"
                  style={{ background: `oklch(0.6 0.24 ${s.hue})` }}
                />
                <div className="relative">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `linear-gradient(135deg, oklch(0.6 0.24 ${s.hue}), oklch(0.4 0.22 ${s.hue + 40}))` }}
                  >
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-lg font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent">
                    Open →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="glass-strong rounded-3xl border border-white/10 p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3 w-3" /> Coming in Part 2
          </div>
          <div className="mt-2 font-display text-2xl font-bold">Creator Studio & AI Coach</div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Full DAW with multi-track editor, MIDI, mixing console, and mastering panel.
            Plus AI Music Coach with pitch/timing tracking and daily lessons.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

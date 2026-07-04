import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { GraduationCap, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/academy")({
  head: () => ({ meta: [{ title: "Academy — HarmonyX AI" }] }),
  component: AcademyPage,
});

const COURSES = [
  { title: "Guitar for Beginners", lessons: 24, level: "Beginner", hue: 30 },
  { title: "Piano Foundations", lessons: 32, level: "Beginner", hue: 220 },
  { title: "Vocal Technique", lessons: 18, level: "Intermediate", hue: 340 },
  { title: "Music Theory 101", lessons: 42, level: "Beginner", hue: 285 },
  { title: "Music Production", lessons: 36, level: "Advanced", hue: 260 },
  { title: "Tabla Basics", lessons: 20, level: "Beginner", hue: 15 },
  { title: "Songwriting", lessons: 28, level: "Intermediate", hue: 195 },
  { title: "Sound Design", lessons: 24, level: "Advanced", hue: 300 },
];

function AcademyPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aurora glow-primary">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Learning Academy</h1>
            <p className="mt-1 text-muted-foreground">AI-guided courses across every instrument.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((c) => (
            <button key={c.title} className="group glass overflow-hidden rounded-3xl text-left transition hover:bg-white/[0.08]">
              <div
                className="relative aspect-video w-full"
                style={{ background: `radial-gradient(circle at 30% 30%, oklch(0.6 0.24 ${c.hue}) 0%, oklch(0.2 0.1 ${c.hue}) 70%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <PlayCircle className="h-14 w-14 text-white" />
                </div>
                <div className="absolute bottom-2 left-2 glass rounded-full px-2 py-0.5 text-[10px] font-semibold">{c.level}</div>
              </div>
              <div className="p-4">
                <div className="font-semibold">{c.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.lessons} lessons</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

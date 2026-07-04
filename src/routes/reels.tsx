import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { REELS } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2, Music, Play } from "lucide-react";

export const Route = createFileRoute("/reels")({
  head: () => ({ meta: [{ title: "Reels — HarmonyX AI" }] }),
  component: ReelsPage,
});

function ReelsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="mb-4 font-display text-3xl font-bold">Reels</h1>
        <div className="space-y-6">
          {REELS.map((r) => (
            <article key={r.id} className="glass-strong overflow-hidden rounded-3xl border border-white/10">
              <div
                className="relative aspect-[9/14] w-full"
                style={{ background: `radial-gradient(circle at 50% 30%, oklch(0.6 0.24 ${r.hue}) 0%, oklch(0.15 0.05 ${r.hue}) 70%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full glass-strong">
                    <Play className="ml-1 h-6 w-6" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="text-sm font-semibold">{r.user}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{r.caption}</div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <Music className="h-3 w-3 text-accent" />
                    <span className="font-medium">{r.track}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4 text-white">
                  <button className="flex flex-col items-center gap-1">
                    <div className="glass flex h-11 w-11 items-center justify-center rounded-full">
                      <Heart className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold">{r.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="glass flex h-11 w-11 items-center justify-center rounded-full">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold">{r.comments}</span>
                  </button>
                  <button className="glass flex h-11 w-11 items-center justify-center rounded-full">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

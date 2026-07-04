import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CoverArt } from "@/components/brand/CoverArt";
import { TRENDING_ARTISTS } from "@/lib/mock-data";
import { Users, MessageCircle, Heart } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — HarmonyX AI" }] }),
  component: CommunityPage,
});

const POSTS = [
  { user: "Aurora Wave", handle: "@aurora.wave", hue: 280, text: "New EP dropping Friday. First single 'Neon Dreams' is out now — thank you for 12M plays 🌌", likes: "4.2K", comments: "312" },
  { user: "Meera Rao", handle: "@meera.rao", hue: 30, text: "AI-assisted composition changed how I write. Sharing my process in the next livestream.", likes: "1.8K", comments: "94" },
  { user: "Kaz Nova", handle: "@kaz.nova", hue: 300, text: "Anyone in Berlin next month? Small club show 👀", likes: "2.9K", comments: "441" },
];

function CommunityPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aurora glow-primary">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Community</h1>
            <p className="mt-1 text-muted-foreground">Follow artists, join fan clubs, jam live.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {POSTS.map((p, i) => (
              <article key={i} className="glass-strong rounded-3xl border border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <CoverArt hue={p.hue} size={44} rounded="rounded-full" showIcon={false} />
                  <div>
                    <div className="text-sm font-semibold">{p.user}</div>
                    <div className="text-xs text-muted-foreground">{p.handle} • 2h</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">{p.text}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1.5 hover:text-foreground"><Heart className="h-4 w-4" /> {p.likes}</button>
                  <button className="flex items-center gap-1.5 hover:text-foreground"><MessageCircle className="h-4 w-4" /> {p.comments}</button>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="text-sm font-semibold">Suggested for you</div>
              <div className="mt-3 space-y-3">
                {TRENDING_ARTISTS.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <CoverArt hue={a.hue} size={40} rounded="rounded-full" showIcon={false} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.followers}</div>
                    </div>
                    <button className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20">Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

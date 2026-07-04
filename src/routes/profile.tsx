import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CoverArt } from "@/components/brand/CoverArt";
import { USER_PROFILE, REWARDS, TRENDING_ARTISTS } from "@/lib/mock-data";
import { Edit3, Settings, Share2, Trophy, Flame, Music, Sparkles } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — HarmonyX AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const u = USER_PROFILE;
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Hero */}
        <section className="glass-strong relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: `radial-gradient(ellipse at 20% 0%, oklch(0.55 0.24 ${u.hue}) 0%, transparent 60%)` }}
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <CoverArt hue={u.hue} size={140} rounded="rounded-full" showIcon={false} />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent">Level {REWARDS.level} • Creator</div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{u.name}</h1>
              <div className="text-muted-foreground">{u.handle}</div>
              <p className="mt-2 max-w-xl text-sm">{u.bio}</p>
              <div className="mt-4 flex gap-6 text-sm">
                <div><span className="font-bold">{u.followers.toLocaleString()}</span> <span className="text-muted-foreground">followers</span></div>
                <div><span className="font-bold">{u.following.toLocaleString()}</span> <span className="text-muted-foreground">following</span></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-full bg-aurora px-4 py-2 text-sm font-semibold text-white glow-primary">
                <Edit3 className="h-4 w-4" /> Edit
              </button>
              <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Share2 className="h-4 w-4" /></button>
              <button className="glass flex h-10 w-10 items-center justify-center rounded-full"><Settings className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Minutes listened", value: u.stats.minutesListened.toLocaleString(), icon: Music, hue: 285 },
            { label: "Songs created", value: u.stats.songsCreated, icon: Sparkles, hue: 240 },
            { label: "Playlists", value: u.stats.playlists, icon: Music, hue: 200 },
            { label: "Day streak", value: REWARDS.streak, icon: Flame, hue: 30 },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `linear-gradient(135deg, oklch(0.55 0.24 ${s.hue}), oklch(0.35 0.2 ${s.hue + 40}))` }}
              >
                <s.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Level progress */}
        <div className="glass-strong rounded-3xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Trophy className="h-3 w-3" /> Level {REWARDS.level}
              </div>
              <div className="mt-1 font-display text-2xl font-bold">{REWARDS.xp.toLocaleString()} XP</div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {(REWARDS.nextLevelXp - REWARDS.xp).toLocaleString()} XP to Level {REWARDS.level + 1}
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-aurora" style={{ width: `${(REWARDS.xp / REWARDS.nextLevelXp) * 100}%` }} />
          </div>
        </div>

        {/* Top artists */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Your top artists this month</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TRENDING_ARTISTS.map((a) => (
              <div key={a.id} className="glass rounded-2xl p-3 text-center">
                <CoverArt hue={a.hue} size={100} rounded="rounded-full" showIcon={false} />
                <div className="mt-3 text-sm font-semibold">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.genre}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

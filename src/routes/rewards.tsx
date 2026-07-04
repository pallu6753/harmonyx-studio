import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { REWARDS } from "@/lib/mock-data";
import { Coins, Flame, Trophy, Zap, Gift, Lock } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards — HarmonyX AI" }] }),
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Rewards</h1>
          <p className="mt-1 text-muted-foreground">Earn coins, XP, and badges for every session.</p>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Coins", value: REWARDS.coins.toLocaleString(), icon: Coins, hue: 45 },
            { label: "XP", value: REWARDS.xp.toLocaleString(), icon: Zap, hue: 285 },
            { label: "Streak", value: `${REWARDS.streak} days`, icon: Flame, hue: 15 },
            { label: "Level", value: REWARDS.level, icon: Trophy, hue: 240 },
          ].map((s) => (
            <div key={s.label} className="glass-strong relative overflow-hidden rounded-3xl p-5">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
                style={{ background: `oklch(0.6 0.24 ${s.hue})` }}
              />
              <div className="relative">
                <s.icon className="h-6 w-6" style={{ color: `oklch(0.75 0.2 ${s.hue})` }} />
                <div className="mt-4 font-display text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily missions */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Daily missions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "Listen 30 minutes", progress: 22, target: 30, reward: "+50 XP" },
              { title: "Discover 3 new artists", progress: 2, target: 3, reward: "+30 coins" },
              { title: "Create a playlist", progress: 0, target: 1, reward: "+100 XP" },
            ].map((m) => (
              <div key={m.title} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{m.title}</div>
                  <div className="text-xs font-semibold text-accent">{m.reward}</div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-aurora" style={{ width: `${(m.progress / m.target) * 100}%` }} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.progress}/{m.target}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Achievements</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {REWARDS.achievements.map((a) => (
              <div
                key={a.id}
                className={`glass relative rounded-2xl p-4 text-center transition ${
                  a.unlocked ? "" : "opacity-50"
                }`}
              >
                <div className="mx-auto text-4xl">{a.icon}</div>
                <div className="mt-2 text-sm font-semibold">{a.title}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{a.description}</div>
                {!a.unlocked && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" /> Locked
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Redeem — demo */}
        <section className="glass-strong rounded-3xl border border-white/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aurora glow-primary">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">Redeem — Demo Mode</div>
              <div className="mt-1 font-display text-xl font-bold">Rewards marketplace</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Trade coins for premium themes, exclusive AI presets, artist merch, and concert tickets.
                Full marketplace ships in Part 3.
              </p>
            </div>
            <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Coming soon</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

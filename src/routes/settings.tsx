import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Bell, Palette, Download, Shield, Globe, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — HarmonyX AI" }] }),
  component: SettingsPage,
});

const GROUPS = [
  {
    label: "Preferences",
    items: [
      { icon: Palette, title: "Appearance", desc: "Theme, accent color" },
      { icon: Bell, title: "Notifications", desc: "Push, email, in-app" },
      { icon: Globe, title: "Language & region", desc: "English (US)" },
      { icon: Download, title: "Downloads", desc: "Quality, storage" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: Shield, title: "Privacy & security", desc: "Two-factor, sessions" },
      { icon: HelpCircle, title: "Help center", desc: "FAQ, contact support" },
      { icon: LogOut, title: "Sign out", desc: "" },
    ],
  },
];

function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">Settings</h1>

        {GROUPS.map((g) => (
          <section key={g.label} className="space-y-2">
            <div className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</div>
            <div className="glass-strong overflow-hidden rounded-2xl border border-white/10">
              {g.items.map((it, i) => (
                <button
                  key={it.title}
                  className={`flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/5 ${
                    i > 0 ? "border-t border-white/5" : ""
                  }`}
                >
                  <div className="glass flex h-10 w-10 items-center justify-center rounded-xl">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{it.title}</div>
                    {it.desc && <div className="text-xs text-muted-foreground">{it.desc}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center text-xs text-muted-foreground">
          HarmonyX AI • v1.0.0 (Foundation Preview)
        </div>
      </div>
    </AppShell>
  );
}

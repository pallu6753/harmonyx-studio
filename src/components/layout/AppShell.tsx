import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Search, Library, Sparkles, Film, Trophy, User, Settings, Gamepad2, GraduationCap, Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "../brand/Logo";
import { MiniPlayer } from "./MiniPlayer";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/create", label: "Create", icon: Sparkles },
  { to: "/reels", label: "Reels", icon: Film },
  { to: "/library", label: "Library", icon: Library },
];

const SECONDARY = [
  { to: "/academy", label: "Academy", icon: GraduationCap },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/community", label: "Community", icon: Users },
  { to: "/rewards", label: "Rewards", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen w-full">
        {/* Sidebar — desktop */}
        <aside className="glass-strong sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 border-r border-white/5 p-5 lg:flex">
          <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
            <Logo size={34} showText />
          </Link>

          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Discover
          </div>
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-aurora text-white glow-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}

          <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Your Universe
          </div>
          {SECONDARY.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className="h-[16px] w-[16px]" />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-auto">
            <div className="glass rounded-2xl p-4">
              <div className="text-xs font-semibold text-aurora">Premium</div>
              <div className="mt-1 text-sm font-medium">Unlock AI Studio</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Demo mode active</div>
              <button className="mt-3 w-full rounded-full bg-aurora py-2 text-xs font-semibold text-white glow-primary">
                Explore Plans
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-h-screen w-full flex-1 flex-col">
          {/* Mobile header */}
          <header className="glass-strong sticky top-0 z-30 flex items-center justify-between border-b border-white/5 px-4 py-3 lg:hidden">
            <Link to="/"><Logo size={30} showText /></Link>
            <Link to="/profile" className="glass flex h-9 w-9 items-center justify-center rounded-full">
              <User className="h-4 w-4" />
            </Link>
          </header>

          <div className="flex-1 pb-40 lg:pb-28">{children}</div>
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="glass-strong fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/5 py-2 lg:hidden">
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition ${
                active ? "text-aurora" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <MiniPlayer />
    </div>
  );
}

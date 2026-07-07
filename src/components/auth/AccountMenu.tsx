import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { LogOut, User as UserIcon, Settings, Sparkles, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (loading) {
    return <div className="glass h-9 w-9 animate-pulse rounded-full" />;
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className={`inline-flex items-center gap-2 rounded-full bg-aurora px-4 py-2 text-xs font-semibold text-white glow-primary transition hover:scale-105 ${compact ? "" : "sm:text-sm sm:px-5 sm:py-2.5"}`}
      >
        <Sparkles className="h-3.5 w-3.5" /> Sign in
      </Link>
    );
  }

  const name = profile?.display_name || user.email?.split("@")[0] || "User";
  const avatar = profile?.avatar_url;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="glass flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-white/10"
      >
        {avatar ? (
          <img src={avatar} alt={name} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-aurora text-xs font-bold text-white">{initial}</div>
        )}
        {!compact && <span className="hidden max-w-[120px] truncate text-xs font-semibold sm:block">{name}</span>}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <div className="glass-strong absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 p-2 shadow-2xl">
          <div className="px-3 py-2">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
          <div className="my-1 h-px bg-white/5" />
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5"
          >
            <UserIcon className="h-4 w-4" /> Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <div className="my-1 h-px bg-white/5" />
          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
              toast.success("Signed out");
              navigate({ to: "/", replace: true });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

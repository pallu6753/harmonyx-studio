import { Sparkles, Mic, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AI_UNIVERSE_PROMPTS } from "@/lib/mock-data";

export function UniversePrompt({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState("");

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="glass-strong group relative overflow-hidden rounded-3xl border border-white/10 p-1.5 transition focus-within:border-primary/50 focus-within:glow-primary">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-aurora animate-aurora" style={{ filter: "blur(60px)" }} />
        <div className="relative flex items-center gap-2 rounded-[calc(1.5rem-6px)] bg-background/60 px-4 py-3 backdrop-blur-xl">
          <Sparkles className="h-5 w-5 shrink-0 text-accent" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask Music Universe anything — create, remix, learn, produce…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
            <Mic className="h-4 w-4" />
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-full bg-aurora px-4 text-xs font-semibold text-white glow-primary transition hover:scale-105">
            Generate <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!compact && (
        <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
          {AI_UNIVERSE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setValue(p)}
              className="glass shrink-0 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

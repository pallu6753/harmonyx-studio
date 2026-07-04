// HarmonyX AI logomark: letter H merged with musical note, circuit accents, sound waves.
export function Logo({ size = 32, showText = false }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 48 48" width={size} height={size} className="drop-shadow-[0_0_12px_oklch(0.62_0.24_295/0.6)]">
          <defs>
            <linearGradient id="hxg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.62 0.24 295)" />
              <stop offset="100%" stopColor="oklch(0.72 0.18 235)" />
            </linearGradient>
          </defs>
          {/* Outer sound waves */}
          <circle cx="24" cy="24" r="22" fill="none" stroke="url(#hxg)" strokeWidth="1" opacity="0.25" />
          <circle cx="24" cy="24" r="18" fill="none" stroke="url(#hxg)" strokeWidth="1" opacity="0.4" />
          {/* H bars */}
          <rect x="9" y="10" width="4" height="28" rx="1.5" fill="url(#hxg)" />
          <rect x="27" y="10" width="4" height="28" rx="1.5" fill="url(#hxg)" />
          {/* Horizontal bar with circuit node */}
          <rect x="13" y="22" width="14" height="4" rx="1" fill="url(#hxg)" />
          <circle cx="20" cy="24" r="2.5" fill="oklch(0.13 0.02 285)" stroke="url(#hxg)" strokeWidth="1.5" />
          {/* Note stem + flag on right */}
          <rect x="31" y="12" width="2" height="18" rx="1" fill="url(#hxg)" />
          <ellipse cx="35" cy="30" rx="4.5" ry="3.5" fill="url(#hxg)" />
          <path d="M33 12 Q40 14 38 22" stroke="url(#hxg)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Harmony<span className="text-aurora">X</span>
        </span>
      )}
    </div>
  );
}

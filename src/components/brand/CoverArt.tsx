// Generative gradient album art — no images needed, unique per hue.
import { Music } from "lucide-react";

export function CoverArt({
  hue,
  size = 160,
  rounded = "rounded-2xl",
  showIcon = true,
}: {
  hue: number;
  size?: number;
  rounded?: string;
  showIcon?: boolean;
}) {
  const bg = `radial-gradient(circle at 30% 20%, oklch(0.72 0.22 ${hue}) 0%, oklch(0.45 0.24 ${hue + 40}) 55%, oklch(0.2 0.15 ${hue - 20}) 100%)`;
  return (
    <div
      className={`relative overflow-hidden ${rounded} shadow-[0_10px_40px_oklch(0_0_0/0.5)]`}
      style={{ width: size, height: size, background: bg }}
    >
      {/* mesh overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background: `conic-gradient(from ${hue}deg at 70% 80%, transparent, oklch(0.9 0.2 ${hue + 60}) 60%, transparent)`,
        }}
      />
      {/* subtle grain */}
      <div className="absolute inset-0 opacity-[0.15]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)",
        backgroundSize: "3px 3px",
      }} />
      {showIcon && (
        <div className="absolute bottom-2 right-2 opacity-70">
          <Music className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}

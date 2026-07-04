import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function CardRail({
  title,
  subtitle,
  seeAllHref,
  children,
}: {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {seeAllHref && (
          <Link to={seeAllHref} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
            See all
          </Link>
        )}
      </div>
      <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-2">
        {children}
      </div>
    </section>
  );
}

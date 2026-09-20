"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Measures the HUD and tells the content area how much room it may use.
 *
 * The bands used to be hardcoded rem values, which was a guess that broke as
 * soon as a route's objective text wrapped to a third line: on /about at 390px
 * the bottom cluster grew to 212px against a 200px reservation, and the
 * mini-map landed on top of the article.
 *
 * So nothing is assumed here. Every HUD corner carries `data-hud`, this
 * measures them, and writes the real insets to CSS variables that
 * `@utility hud-inset` consumes. Corners are sorted into top/bottom by where
 * they actually are, because the follower block moves from the top on desktop
 * to the bottom on a phone.
 */
const GAP = 8;

export default function HudInsets() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    const measure = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-hud]"),
      );
      let topEdge = 0;
      let bottomEdge = window.innerHeight;

      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue; // hidden at this breakpoint
        const mid = r.top + r.height / 2;
        if (mid < window.innerHeight / 2) {
          topEdge = Math.max(topEdge, r.bottom);
        } else {
          bottomEdge = Math.min(bottomEdge, r.top);
        }
      }

      root.style.setProperty("--hud-band-top", `${Math.round(topEdge + GAP)}px`);
      root.style.setProperty(
        "--hud-band-bottom",
        `${Math.round(window.innerHeight - bottomEdge + GAP)}px`,
      );
    };

    measure();

    // Text reflow inside a corner changes its height without any resize event.
    const ro = new ResizeObserver(measure);
    document.querySelectorAll("[data-hud]").forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // Re-measured per route: the objective line differs in length on each.
  }, [pathname]);

  return null;
}

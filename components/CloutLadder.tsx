"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CLOUT_TIERS,
  SOCIALS,
  cloutLevel,
  formatCount,
  milestone,
  type SocialId,
} from "@/lib/socials";

/**
 * The wanted level, spelled out.
 *
 * The HUD shows this as six stars with no explanation; here the whole ladder
 * is visible, so a viewer can see which tier is current and what the next one
 * costs. Both come from the same live counts as the HUD, so the two can never
 * disagree.
 */
export default function CloutLadder() {
  const [counts, setCounts] = useState<Record<SocialId, number> | null>(null);

  useEffect(() => {
    let alive = true;
    const fallbacks = () =>
      Object.fromEntries(SOCIALS.map((s) => [s.id, s.fallback])) as Record<
        SocialId,
        number
      >;
    fetch("/api/socials")
      .then((r) => r.json())
      .then((d) => alive && setCounts(d.counts))
      .catch(() => alive && setCounts(fallbacks()));
    return () => {
      alive = false;
    };
  }, []);

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const clout = cloutLevel(total);
  // A platform with no known number is left out rather than shown as zero.
  const tracked = counts ? SOCIALS.filter((s) => (counts[s.id] ?? 0) > 0) : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-gta text-sm text-mansourko-sand">إجمالي المتابعين</p>
        <p className="font-gta ltr-nums mt-1 text-5xl leading-none text-hud-white tabular-nums sm:text-6xl">
          {counts ? formatCount(total) : "—"}
        </p>
        <p className="mt-2 text-sm text-white/60">
          {counts ? `المستوى الحالي: ${clout.name}` : "جارٍ التحميل…"}
        </p>
      </div>

      {/* The ladder. Reached tiers keep their stars filled; the rest are the
          targets, with the number each one costs. */}
      <ol className="flex flex-col gap-1">
        {CLOUT_TIERS.map((tier, i) => {
          const reached = counts ? total >= tier.at : false;
          const isCurrent = counts ? clout.stars === i + 1 : false;
          return (
            <li
              key={tier.name}
              className={[
                "flex items-center gap-3 border-s-2 py-2 ps-3 transition-colors",
                isCurrent
                  ? "border-mansourko-gold bg-mansourko-gold/10"
                  : reached
                    ? "border-mansourko-sand/40"
                    : "border-white/10",
              ].join(" ")}
            >
              <Star
                size={20}
                strokeWidth={1.75}
                aria-hidden
                className={
                  reached
                    ? "shrink-0 fill-mansourko-sand/90 text-mansourko-sand drop-shadow-star-glow"
                    : "shrink-0 fill-transparent text-white/25"
                }
              />
              <span
                className={[
                  "font-gta flex-1 text-base sm:text-lg",
                  reached ? "text-hud-white" : "text-white/40",
                ].join(" ")}
              >
                {tier.name}
              </span>
              <span
                className={[
                  "ltr-nums text-sm tabular-nums",
                  reached ? "text-mansourko-sand" : "text-white/35",
                ].join(" ")}
              >
                {formatCount(tier.at)}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Per-platform progress toward the next round number. */}
      {tracked.length > 0 ? (
        <div>
          <p className="font-gta text-sm text-mansourko-sand">
            الهدف القادم لكل منصة
          </p>
          <ul className="mt-3 flex flex-col gap-4">
            {tracked.map((s) => {
              const n = counts?.[s.id] ?? 0;
              const goal = milestone(n);
              return (
                <li key={s.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-gta text-base text-hud-white">
                      {s.name}
                    </span>
                    {/* The whole fraction is ONE isolated run. Isolating each
                        number separately let bidi swap them, so 14K / 20K
                        rendered as "20K / 14K" — current and target reversed. */}
                    <span className="ltr-nums text-xs tabular-nums text-white/55">
                      {`${formatCount(n)} / ${formatCount(goal.to)}`}
                    </span>
                  </div>
                  <div
                    className="mt-1 h-2 w-full border border-mansourko-sand/40 bg-black/50 p-px"
                    role="progressbar"
                    aria-valuemin={goal.from}
                    aria-valuemax={goal.to}
                    aria-valuenow={n}
                    aria-label={`تقدّم ${s.name} نحو ${formatCount(goal.to)}`}
                  >
                    <motion.div
                      className="h-full bg-mansourko-sand/90"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress * 100}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND_ICONS } from "@/lib/brandIcons";
import {
  SOCIALS,
  cloutLevel,
  formatCount,
  milestone,
  type SocialId,
} from "@/lib/socials";
import { useAudio } from "@/lib/useAudio";

/**
 * The top-right HUD block, all three parts driven by one set of live numbers:
 *
 *   counter  rotating platform follower count, links out to that platform
 *   bar      progress toward that platform's next milestone (the health bar)
 *   stars    career tier from total reach across platforms (the wanted level)
 *
 * They share a single fetch, so the bar and stars always agree with the
 * number on screen.
 */

const ROTATE_MS = 4500;

export default function SocialStats() {
  const [counts, setCounts] = useState<Record<SocialId, number> | null>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { play } = useAudio();

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

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => v + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  // A platform with no known count (TikTok/Instagram until their fallbacks are
  // filled in) is skipped rather than shown as "0", which reads as broken.
  // Before the fetch lands the fallbacks decide, so a platform we already know
  // has no number never flashes up — Discord would otherwise appear for a beat
  // carrying an invite that is currently expired.
  const visible = counts
    ? SOCIALS.filter((s) => (counts[s.id] ?? 0) > 0)
    : SOCIALS.filter((s) => s.fallback > 0);
  const list = visible.length > 0 ? visible : SOCIALS;
  const social = list[i % list.length];
  const brand = BRAND_ICONS[social.id];
  const count = counts?.[social.id];

  const goal = count ? milestone(count) : null;
  const totalReach = counts
    ? Object.values(counts).reduce((a, b) => a + b, 0)
    : 0;
  const clout = cloutLevel(totalReach);

  return (
    <div
      className="flex flex-col items-end gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Counter + brand chip */}
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={social.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col items-end justify-center gap-1"
          >
            <span className="font-gta ltr-nums text-3xl leading-none tabular-nums lg:text-4xl 2xl:text-5xl text-mansourko-sand drop-shadow-hud-text">
              {count === undefined ? "—" : formatCount(count)}
            </span>
            <span className="font-gta text-xs leading-none text-mansourko-sand/70 lg:text-base">
              {social.metric} {social.name}
            </span>
          </motion.div>
        </AnimatePresence>

        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => play("click")}
          aria-label={`افتح منصور الدشاش على ${social.name} في تبويب جديد`}
          title={`افتح ${social.name}`}
          className="group relative grid h-11 w-11 shrink-0 place-items-center lg:h-14 lg:w-14 2xl:h-16.5 2xl:w-16.5 border-2 border-mansourko-sand/70 bg-black/40 transition-colors hover:border-transparent"
        >
          <span
            className="brand-fill absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ "--brand-color": brand.hex } as React.CSSProperties}
          />
          <AnimatePresence mode="wait">
            <motion.svg
              key={social.id}
              viewBox="0 0 24 24"
              width="24"
              height="24"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative fill-mansourko-sand transition-colors group-hover:fill-white"
              aria-hidden
            >
              <path d={brand.path} />
            </motion.svg>
          </AnimatePresence>

          {/* Rotation timer */}
          <span
            key={`${social.id}-bar`}
            className={[
              "absolute right-0 bottom-0 left-0 h-0.75 origin-right bg-mansourko-sand/80",
              paused ? "" : "rotation-timer",
            ].join(" ")}
            style={{ "--rotate-duration": `${ROTATE_MS}ms` } as React.CSSProperties}
          />
        </a>
      </div>

      {/* Milestone bar — the health bar, now measuring something */}
      <div className="flex w-40 flex-col items-end gap-1 lg:w-56 2xl:w-72">
        <div
          className="h-3 w-full border border-mansourko-sand/50 bg-black/50 p-0.5"
          role="progressbar"
          aria-valuemin={goal?.from ?? 0}
          aria-valuemax={goal?.to ?? 0}
          aria-valuenow={count ?? 0}
          aria-label={`تقدّم ${social.name} نحو ${goal ? formatCount(goal.to) : "الهدف التالي"}`}
        >
          <motion.div
            className="h-full bg-mansourko-sand/90"
            animate={{ width: `${(goal?.progress ?? 0) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span className="font-gta text-sm leading-none text-mansourko-sand/60">
          التالي: <span className="ltr-nums">{goal ? formatCount(goal.to) : "—"}</span>
        </span>
      </div>

      {/* Clout tier — the wanted level, now earned */}
      <div
        className="hidden flex-col items-end gap-1 lg:flex"
        title={`${clout.name} — ${formatCount(totalReach)} إجمالي المتابعين`}
      >
        <div
          className="flex gap-1.5"
          aria-label={`مستوى الشهرة ${clout.stars} من ${clout.max}: ${clout.name}`}
        >
          {Array.from({ length: clout.max }, (_, s) => (
            <Star
              key={s}
              size={28}
              strokeWidth={1.75}
              className={
                s < clout.stars
                  ? "fill-mansourko-sand/90 text-mansourko-sand drop-shadow-star-glow"
                  : "fill-transparent text-mansourko-sand/35"
              }
            />
          ))}
        </div>
        <span className="font-gta text-sm leading-none text-mansourko-sand/60">
          {clout.name}
        </span>
      </div>
    </div>
  );
}

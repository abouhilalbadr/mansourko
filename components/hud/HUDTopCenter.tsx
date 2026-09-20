"use client";

import { useEffect, useState } from "react";

import { breakdown, nextSession, pad } from "@/lib/schedule";
import { useAudio } from "@/lib/useAudio";
import { useLive } from "@/lib/useLive";

/** One countdown figure with its Arabic unit letter, isolated from its
 *  neighbours so the digits keep their own direction. */
function Unit({
  value,
  label,
  dim = false,
}: {
  value: string;
  label: string;
  dim?: boolean;
}) {
  return (
    <bdi className={dim ? "text-mansourko-sand/50" : undefined}>
      {value}
      <span className={dim ? undefined : "text-mansourko-sand"}> {label}</span>
    </bdi>
  );
}

export default function HUDTopCenter() {
  /**
   * "On air" is now what KICK says, not what the calendar says. The schedule
   * used to decide this on its own, so the HUD claimed he was live during any
   * booked slot — right four nights a week whether or not he actually went on.
   */
  const { live, url } = useLive();
  const { play } = useAudio();

  // null until mounted — the countdown is time-based, so it cannot be
  // server-rendered without a hydration mismatch.
  const [left, setLeft] = useState<ReturnType<typeof breakdown> | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLeft(breakdown(nextSession(now).start.getTime() - now.getTime()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div data-hud className="pointer-events-none fixed top-hud-bar left-1/2 z-40 flex w-full max-w-hud-bar-w -translate-x-1/2 flex-col items-center select-none lg:top-6 lg:w-auto lg:max-w-none">
      {live ? (
        /* On air, the readout IS the way in — the whole block opens the
           stream. pointer-events-auto because the HUD wrapper disables them,
           so the art underneath stays clickable everywhere else. */
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => play("click")}
          className="pointer-events-auto group flex flex-col items-center"
        >
          <p className="font-gta flex items-center gap-2 text-sm text-mansourko-sand/80 lg:text-lg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live-red" />
            </span>
            على الهواء
          </p>
          <p className="font-gta flex items-baseline gap-2 text-2xl text-hud-white drop-shadow-hud-text transition-colors group-hover:text-live-red lg:text-3xl 2xl:text-4xl">
            البثّ جارٍ الآن
            <span aria-hidden>↗</span>
          </p>
        </a>
      ) : (
        <div className="flex flex-col items-center">
          <p className="font-gta text-sm text-mansourko-sand/80 lg:text-lg">
            البث بعد
          </p>
          {/* No flex-row-reverse: the page is already RTL, so a plain row lays
              these out right to left. Reversing it flipped the countdown back
              to left-to-right and it read seconds-first. */}
          <p className="font-gta flex items-baseline gap-3 text-2xl tabular-nums text-hud-white drop-shadow-hud-text lg:text-3xl 2xl:text-4xl">
            {left ? (
              <>
                {/* Each figure and its unit letter is one isolated group: left
                    to the bidi algorithm, a bare run of digits and Arabic
                    letters gets reordered and the countdown reads backwards. */}
                <Unit value={pad(left.h)} label="س" />
                <Unit value={pad(left.m)} label="د" />
                <Unit value={pad(left.s)} label="ث" />
              </>
            ) : (
              <>
                <Unit value="--" label="س" dim />
                <Unit value="--" label="د" dim />
                <Unit value="--" label="ث" dim />
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

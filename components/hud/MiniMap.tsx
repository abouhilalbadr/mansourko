"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { getMapTarget, getRoute } from "@/lib/routes";

/**
 * GTA-style mini-map.
 *
 * Everything on it means something: the street grid is the coordinate space
 * for waypoints, the plotted line is a Manhattan route along those streets
 * from the player to the active section's waypoint, and the readout is that
 * section's distance. Navigating re-plots the route.
 */

const VIEW_W = 160;
const VIEW_H = 100;
const GRID = 20; // street pitch
const OFFSET = 10; // first street
/** Player's fixed position, on a street intersection. */
const PLAYER = { x: 30, y: 70 };

const STREETS_X = Array.from(
  { length: Math.floor((VIEW_W - OFFSET) / GRID) + 1 },
  (_, i) => OFFSET + i * GRID,
);
const STREETS_Y = Array.from(
  { length: Math.floor((VIEW_H - OFFSET) / GRID) + 1 },
  (_, i) => OFFSET + i * GRID,
);

/** Route that turns at most twice and only travels along streets. */
function plotRoute(to: { x: number; y: number }) {
  if (to.x === PLAYER.x && to.y === PLAYER.y) return "";
  return `M ${PLAYER.x} ${PLAYER.y} L ${to.x} ${PLAYER.y} L ${to.x} ${to.y}`;
}

export default function MiniMap() {
  const pathname = usePathname();
  const target = getMapTarget(pathname);
  const label = getRoute(pathname)?.label ?? "";
  const route = plotRoute(target);

  return (
    <div className="relative h-20 w-28 shrink-0 lg:h-32 lg:w-48 2xl:h-40 2xl:w-64 overflow-hidden rounded-md border border-mansourko-sand/50 bg-hud-plate shadow-hud-panel backdrop-blur-sm">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`الخريطة المصغّرة. الوجهة: ${label}، تبعد ${target.distance}.`}
      >
        {/* Water */}
        <path
          d="M0 100 L0 82 L30 88 L46 100 Z"
          fill="var(--color-map-water)"
          opacity="0.9"
        />

        {/* City blocks between the streets */}
        {STREETS_X.slice(0, -1).map((x) =>
          STREETS_Y.slice(0, -1).map((y) => (
            <rect
              key={`${x}-${y}`}
              x={x + 3}
              y={y + 3}
              width={GRID - 6}
              height={GRID - 6}
              fill="var(--color-mansourko-sand)"
              opacity="0.07"
            />
          )),
        )}

        {/* Street grid */}
        <g stroke="var(--color-mansourko-sand)" strokeOpacity="0.22" strokeWidth="1.5">
          {STREETS_X.map((x) => (
            <line key={`vx${x}`} x1={x} y1="0" x2={x} y2={VIEW_H} />
          ))}
          {STREETS_Y.map((y) => (
            <line key={`hy${y}`} x1="0" y1={y} x2={VIEW_W} y2={y} />
          ))}
        </g>

        {/* Freeway */}
        <line
          x1="0"
          y1="94"
          x2={VIEW_W}
          y2="34"
          stroke="var(--color-mansourko-sand)"
          strokeOpacity="0.4"
          strokeWidth="3.5"
        />

        {/* Plotted route — solid base with an animated dash crawling along it */}
        {route ? (
          <>
            <path
              d={route}
              fill="none"
              stroke="var(--color-mansourko-gold)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <motion.path
              d={route}
              fill="none"
              stroke="var(--color-mansourko-gold-light)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 10"
              animate={{ strokeDashoffset: [0, -36] }}
              transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
            />
          </>
        ) : null}

        {/* Waypoint */}
        <g>
          <circle
            cx={target.x}
            cy={target.y}
            r="6"
            fill="var(--color-mansourko-gold)"
            stroke="var(--color-hud-white)"
            strokeWidth="1.5"
          />
          <circle cx={target.x} cy={target.y} r="2" fill="var(--color-hud-white)" />
        </g>

        {/* Player — arrow pointing along the first leg of the route */}
        <g
          transform={`translate(${PLAYER.x} ${PLAYER.y}) rotate(${
            target.x >= PLAYER.x ? 90 : -90
          })`}
        >
          <path
            d="M0 -7 L5 6 L0 3 L-5 6 Z"
            fill="var(--color-hud-white)"
            stroke="var(--color-mansourko-gold)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Player ping, positioned over the SVG coordinate */}
      <span className="minimap-ping pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-mansourko-gold/50" />

      {/* Compass + distance readout */}
      <span className="absolute top-1 left-1.5 font-gta text-sm leading-none text-mansourko-sand">
        ش
      </span>
      <span className="absolute right-1.5 bottom-1 font-gta text-sm leading-none tabular-nums text-hud-cream">
        {target.distance}
      </span>
    </div>
  );
}

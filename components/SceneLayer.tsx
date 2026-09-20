"use client";

import Image from "next/image";
import type React from "react";

export type SceneLayerSpec = {
  src: string;
  /** Intrinsic pixel size of the cropped asset. */
  width: number;
  height: number;
  /**
   * Tailwind placement classes for the wrapper. Size layers by WIDTH
   * (e.g. `w-[56vw]`) — an abs-positioned wrapper with only a height gets
   * shrink-to-fit clamped at the viewport edge, which silently scales the
   * artwork down.
   */
  className: string;
  /** Strength of the gold cast, 0–1. Defaults to 0.55. */
  tint?: number;
  /**
   * Exposure for this layer, appended to the shared `--world-tone` in
   * globals.css. Only brightness/contrast belong here — the hue is the
   * scene's to decide, not the layer's, which is what keeps the cutouts and
   * the plate in one world.
   */
  exposure?: string;
};

/**
 * One composited cutout (person, car, prop) over the scene plate.
 *
 * The gold cast is a soft-light overlay masked by the asset's own alpha, so
 * the artwork keeps its native hues (skin, jacket) instead of being crushed to
 * monochrome, while still reading as part of the graded plate.
 */
export default function SceneLayer({
  src,
  width,
  height,
  className,
  tint = 0.55,
  exposure,
}: SceneLayerSpec) {
  return (
    <div className={`absolute ${className}`}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        priority
        className="mansourko-character h-auto w-full max-w-none"
        style={
          exposure
            ? ({ "--character-exposure": exposure } as React.CSSProperties)
            : undefined
        }
      />
      <div
        className="scene-cutout-tint pointer-events-none absolute inset-0 bg-mansourko-gold opacity-(--layer-tint) mix-blend-soft-light"
        style={
          {
            "--layer-mask": `url(${src})`,
            "--layer-tint": tint,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

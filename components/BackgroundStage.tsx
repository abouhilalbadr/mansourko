"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SceneLayer from "@/components/SceneLayer";
import { getScene } from "@/lib/routes";

/**
 * Persistent hero stage. Crossfades between per-route scenes without ever
 * unmounting the HUD above it.
 *
 * Fallback chain, so the UI can never break on a missing asset:
 *   route gradient (always present)
 *     -> route image  (plate in /public/assets/bg)
 *       -> route layers (transparent cutouts in /public/assets/ui, drawn in
 *          array order: back to front)
 */
export default function BackgroundStage() {
  const pathname = usePathname();
  const scene = getScene(pathname);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-hud-backdrop" aria-hidden>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="scene-plate absolute inset-0"
          style={{ "--scene-gradient": scene.gradient } as React.CSSProperties}
        >
          {scene.image ? (
            <Image
              src={scene.image}
              alt=""
              fill
              priority
              sizes="100vw"
              /**
               * Served as authored — no resize, no WebP re-encode. Next's
               * optimiser is lossy by definition, and on this plate's smooth
               * sunset gradient even quality 90 leaves banding the original
               * does not have. The cost is the full file on every load; see
               * the note in next.config.ts.
               */
              unoptimized
              className="mansourko-plate hero-crop object-cover"
            />
          ) : null}

          {scene.layers?.map((layer) => (
            <SceneLayer key={layer.src} {...layer} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* HUD readability, kept to the minimum the text actually needs.
          These sat over a flat placeholder plate; over finished art a full
          scrim plus a heavy vignette just greys the painting out, so the
          scrim is gone and the vignette only darkens where HUD text lands —
          the corners — leaving the middle of the plate untouched. */}
      <div className="hud-vignette absolute inset-0" />
      <div className="menu-scrim absolute inset-y-0 start-0 hidden w-menu-scrim lg:block" />
      <div className="hud-scanlines absolute inset-0" />
    </div>
  );
}

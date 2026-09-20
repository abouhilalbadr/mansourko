"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import MiniMap from "@/components/hud/MiniMap";
import { getObjective } from "@/lib/routes";

type Props = {
  /** Override the route-derived objective text. */
  objective?: string;
};

export default function HUDBottomLeft({ objective }: Props) {
  const pathname = usePathname();
  const text = objective ?? getObjective(pathname);

  // Phone stacks the map over the objective; there is no room for them side by
  // side once the stats share the same bottom line. Desktop keeps them in a row.
  return (
    <div data-hud className="pointer-events-none fixed start-4 bottom-4 z-40 flex max-w-objective-phone flex-col items-start gap-2 select-none lg:max-w-none lg:flex-row lg:items-center lg:gap-6 lg:bottom-11 lg:start-10">
      <div className="minimap-slot">
        <MiniMap />
      </div>

      {/* Objective */}
      <div className="min-w-0 flex-1 lg:max-w-lg lg:flex-none">
        <p className="font-gta text-xs text-mansourko-sand lg:text-xl">
          المهمة الحالية
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="font-gta line-clamp-2 text-xl leading-arabic-loose lg:text-3xl 2xl:text-4xl text-hud-cream drop-shadow-hud-text"
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

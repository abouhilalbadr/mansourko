"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BRAND_ICONS } from "@/lib/brandIcons";
import { SOCIALS } from "@/lib/socials";
import { getRoute } from "@/lib/routes";
import { useAudio } from "@/lib/useAudio";

/**
 * Placeholder for sections that aren't built yet.
 *
 * Reads its heading from the route table, so a page is a one-liner and the
 * title can never drift from the menu label.
 */
export default function ComingSoon() {
  const pathname = usePathname();
  const route = getRoute(pathname);
  const { play } = useAudio();

  return (
    <section className="w-full border-s-4 border-mansourko-gold bg-black/55 p-6 backdrop-blur-md sm:p-8">
      <div className="w-full">
        <h1 className="font-gta text-3xl leading-arabic text-hud-white sm:text-4xl xl:text-5xl">
          {route?.tag ?? "قريباً"}
        </h1>

        {/* Status line */}
        <div className="mt-6 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mansourko-gold opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-mansourko-gold-light" />
          </span>
          <p className="font-gta text-2xl leading-arabic text-hud-cream sm:text-3xl">
            قريباً
          </p>
        </div>

        {/* Indeterminate loading bar, GTA-style */}
        <div className="mt-4 h-2 w-full overflow-hidden border border-mansourko-sand/40 bg-black/50 p-0.5">
          <motion.div
            className="h-full w-1/3 bg-mansourko-sand/90"
            animate={{ x: ["-110%", "330%"] }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        <p className="mt-5 text-sm leading-loose text-white/70 sm:text-base">
          هذا القسم ما زال قيد الإنشاء. الموقع يُبنى قطعةً قطعة — عُد قريباً.
        </p>

        <p className="font-gta mt-6 text-sm text-mansourko-sand/70">
          في الأثناء، تابع منصور الدشاش هنا
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SOCIALS.map((social) => {
            const brand = BRAND_ICONS[social.id];
            return (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => play("click")}
                  aria-label={`افتح منصور الدشاش على ${social.name} في تبويب جديد`}
                  title={social.name}
                  className="group relative grid h-11 w-11 place-items-center border border-mansourko-sand/50 bg-black/40 transition-colors hover:border-transparent"
                >
                  <span
                    className="brand-fill absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={
                      { "--brand-color": brand.hex } as React.CSSProperties
                    }
                  />
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    className="relative fill-mansourko-sand transition-colors group-hover:fill-white"
                    aria-hidden
                  >
                    <path d={brand.path} />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

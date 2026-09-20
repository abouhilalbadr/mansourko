import type { Metadata } from "next";
import Image from "next/image";
import { ARCS } from "@/lib/arcs";
import { BRAND_ICONS } from "@/lib/brandIcons";
import { formatCount } from "@/lib/socials";
import { getRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "قصص الرول بلاي",
  description:
    "أرشيف قصص الدشاش على سيرفر كيان — الأحداث الكبرى مرتّبة من الأحدث إلى الأقدم، وفيديو كل حدث.",
};

export default function KayanPage() {
  return (
    <section className="w-full border-s-4 border-mansourko-gold bg-black/55 p-6 backdrop-blur-md sm:p-8">
      <h1 className="font-gta text-4xl leading-arabic text-hud-white sm:text-5xl">
        {getRoute("/kayan")?.tag}
      </h1>
      <p className="mt-4 text-base leading-loose text-hud-cream">
        الأحداث الكبرى على سيرفر كيان، من الأحدث إلى الأقدم — البثّ الكامل على
        كيك، والحلقة بعد المونتاج على يوتيوب.
      </p>

      {/* The rail runs down the reading edge; each arc hangs a marker on it. */}
      <ol className="mt-10 flex flex-col gap-10 border-s border-mansourko-sand/25 ps-6 sm:ps-8">
        {ARCS.map((arc) => (
          <li key={arc.id} className="relative">
            <span
              className="absolute top-2 h-3 w-3 -translate-y-1/2 rotate-45 border border-mansourko-gold bg-hud-plate -start-7 sm:-start-9"
              aria-hidden
            />

            <p className="font-gta text-sm text-mansourko-sand/80">
              {arc.period}
            </p>
            <h2 className="font-gta mt-1 text-2xl leading-arabic text-hud-white sm:text-3xl">
              {arc.title}
            </h2>

            {arc.summary ? (
              <p className="mt-3 text-sm leading-loose text-white/75 sm:text-base">
                {arc.summary}
              </p>
            ) : (
              /* No summary written yet. Saying so plainly beats filling the
                 space with a plot nobody confirmed. */
              <p className="mt-3 border border-dashed border-mansourko-sand/30 p-3 text-sm leading-loose text-white/40">
                الملخّص لم يُكتب بعد.
              </p>
            )}

            <ul className="mt-4 flex flex-col gap-2">
              {arc.entries.map((entry) => {
                const brand = BRAND_ICONS[entry.platform];
                return (
                  <li key={entry.url}>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 border border-transparent p-1 transition-colors hover:border-mansourko-gold/60 hover:bg-black/40"
                    >
                      <span className="relative block aspect-video w-24 shrink-0 overflow-hidden bg-hud-plate sm:w-28">
                        <Image
                          src={entry.thumbnail}
                          alt=""
                          fill
                          sizes="112px"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {/* Which platform, at a glance — the two read very
                            differently: a 4-hour stream vs a cut episode. */}
                        <span
                          className="absolute start-1 top-1 grid h-5 w-5 place-items-center bg-black/75"
                          title={entry.platform === "kick" ? "بثّ كامل على كيك" : "حلقة على يوتيوب"}
                        >
                          <svg viewBox="0 0 24 24" width="11" height="11" className="fill-mansourko-sand" aria-hidden>
                            <path d={brand.path} />
                          </svg>
                        </span>
                        {entry.minutes ? (
                          <span className="absolute end-1 bottom-1 bg-black/80 px-1 text-xs text-hud-white tabular-nums">
                            {Math.floor(entry.minutes / 60)}:{String(entry.minutes % 60).padStart(2, "0")}
                          </span>
                        ) : null}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm leading-relaxed text-hud-cream transition-colors group-hover:text-hud-white">
                          {entry.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-white/40">
                          {entry.approx ? "نحو " : null}
                          <span className="ltr-nums">{entry.date}</span>
                          {entry.views ? (
                            <>
                              {" · "}
                              <span className="ltr-nums">{formatCount(entry.views)}</span>
                              {" مشاهدة"}
                            </>
                          ) : null}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

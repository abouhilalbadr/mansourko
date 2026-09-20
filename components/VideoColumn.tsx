import Image from "next/image";
import { BRAND_ICONS } from "@/lib/brandIcons";
import { formatCount } from "@/lib/socials";
import type { VideoRef } from "@/lib/videos";

type Props = {
  /** Which platform this column belongs to; picks the brand glyph and colour. */
  platform: "kick" | "youtube";
  name: string;
  channelUrl: string;
  videos: VideoRef[];
};

/** "157" -> "2:37", because a runtime in raw minutes reads as a phone number. */
function runtime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${m} د`;
}

export default function VideoColumn({
  platform,
  name,
  channelUrl,
  videos,
}: Props) {
  const brand = BRAND_ICONS[platform];

  return (
    <section>
      <div className="flex items-center justify-between gap-3 border-b border-mansourko-sand/25 pb-3">
        <h2 className="flex items-center gap-2">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-sm"
            style={{ "--brand-color": brand.hex } as React.CSSProperties}
          >
            <span className="brand-fill absolute h-8 w-8 rounded-sm opacity-20" />
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="relative fill-mansourko-sand"
              aria-hidden
            >
              <path d={brand.path} />
            </svg>
          </span>
          <span className="font-gta text-xl text-hud-white sm:text-2xl">
            {name}
          </span>
        </h2>

        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-gta text-sm text-mansourko-sand transition-colors hover:text-hud-white"
        >
          كل الفيديوهات ↗
        </a>
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {videos.map((v) => (
          <li key={v.id}>
            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 border border-transparent p-1 transition-colors hover:border-mansourko-gold/60 hover:bg-black/40"
            >
              <span className="relative block aspect-video w-32 shrink-0 overflow-hidden bg-hud-plate sm:w-40">
                <Image
                  src={v.thumbnail}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {v.minutes ? (
                  <span className="absolute end-1 bottom-1 bg-black/80 px-1 text-xs text-hud-white tabular-nums">
                    {runtime(v.minutes)}
                  </span>
                ) : null}
              </span>

              <span className="min-w-0 flex-1 py-1">
                <span className="line-clamp-2 text-sm leading-relaxed text-hud-cream transition-colors group-hover:text-hud-white sm:text-base">
                  {v.title}
                </span>
                {v.views || v.date ? (
                  <span className="mt-1 block text-xs text-white/45">
                    {v.views ? (
                      <span className="ltr-nums">{formatCount(v.views)}</span>
                    ) : null}
                    {v.views ? " مشاهدة" : null}
                    {v.views && v.date ? " · " : null}
                    {v.date ? (
                      <time dateTime={v.date} className="ltr-nums">
                        {v.date}
                      </time>
                    ) : null}
                  </span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { Metadata } from "next";
import VideoColumn from "@/components/VideoColumn";
import { getRoute } from "@/lib/routes";
import { SOCIALS } from "@/lib/socials";
import { KICK_VIDEOS, YOUTUBE_VIDEOS } from "@/lib/videos";

export const metadata: Metadata = {
  title: "الفيديوهات",
  description:
    "بثوث منصور الدشاش على كيك وفيديوهاته على يوتيوب — تسجيلات كاملة ومقاطع من عالم الرول بلاي.",
};

const channel = (id: "kick" | "youtube") =>
  SOCIALS.find((s) => s.id === id)?.url ?? "#";

export default function StreamsPage() {
  return (
    <section className="w-full border-s-4 border-mansourko-gold bg-black/55 p-6 backdrop-blur-md sm:p-8">
      <h1 className="font-gta text-4xl leading-arabic text-hud-white sm:text-5xl">
        {getRoute("/streams")?.tag}
      </h1>
      <p className="mt-4 text-base leading-loose text-hud-cream">
        البثّ المباشر على كيك، والحلقات بعد المونتاج على يوتيوب.
      </p>

      {/* Two columns side by side on a wide screen, stacked on a phone — the
          split is the point of the page, but not at 390px. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <VideoColumn
          platform="kick"
          name="كيك"
          channelUrl={channel("kick")}
          videos={KICK_VIDEOS}
        />
        <VideoColumn
          platform="youtube"
          name="يوتيوب"
          channelUrl={channel("youtube")}
          videos={YOUTUBE_VIDEOS}
        />
      </div>
    </section>
  );
}

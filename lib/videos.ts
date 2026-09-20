/**
 * DEMO VIDEO LISTS.
 *
 * These are real videos pulled from the two channels on 2026-09-20, not
 * invented placeholders — so the page can be judged on how it actually looks
 * with his own titles, thumbnails and view counts.
 *
 * They are a hand-copied snapshot and WILL go stale. Replacing this file with
 * a live fetch is the intended next step; the shape below is what the page
 * renders, so a fetcher only has to produce `VideoRef[]`.
 *
 *   YouTube  the Data API (`playlistItems` on the uploads playlist) with
 *            YOUTUBE_API_KEY, the same key the socials route can use.
 *   Kick     kick.com/api/v2/channels/<handle>/videos — but note this returns
 *            403 to server-side fetches (see app/api/socials/route.ts), so it
 *            needs Kick's official OAuth API or a build-time refresh.
 */

export type VideoRef = {
  /** Stable id on the platform; also the React key. */
  id: string;
  title: string;
  /** Where the video opens. */
  url: string;
  thumbnail: string;
  /** Views at the time of the snapshot. */
  views?: number;
  /** Runtime in minutes, for the badge on the thumbnail. */
  minutes?: number;
  /** ISO date, used for the `datetime` attribute and the visible date. */
  date?: string;
};

const KICK_CHANNEL = "mansourko";

export const KICK_VIDEOS: VideoRef[] = [
  {
    id: "468711e6-0cf8-4cc7-9c90-02f1ff7835ce",
    title: "انا مبتخاذلش",
    url: `https://kick.com/${KICK_CHANNEL}/videos/468711e6-0cf8-4cc7-9c90-02f1ff7835ce`,
    thumbnail:
      "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/tKLibXC7t3gL/720.webp",
    views: 3613,
    minutes: 157,
    date: "2026-09-19",
  },
  {
    id: "0ac28361-8c54-477b-85eb-61c64fdf81f7",
    title: "انت فاهم حاجه ؟ | KYN",
    url: `https://kick.com/${KICK_CHANNEL}/videos/0ac28361-8c54-477b-85eb-61c64fdf81f7`,
    thumbnail:
      "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/zsVvqNRWhrSc/720.webp",
    views: 5321,
    minutes: 240,
    date: "2026-09-15",
  },
  {
    id: "1cb71912-aa90-4cfa-a3c8-6390f7052fc0",
    title: "الدشاش ؟ | KYN",
    url: `https://kick.com/${KICK_CHANNEL}/videos/1cb71912-aa90-4cfa-a3c8-6390f7052fc0`,
    thumbnail:
      "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/JYCRcrbi3U38/720.webp",
    views: 29699,
    minutes: 157,
    date: "2026-09-14",
  },
  {
    id: "fbd5c90d-2630-4103-b4ba-f8ca7babfc1e",
    title: "فقدان شغف | KYN",
    url: `https://kick.com/${KICK_CHANNEL}/videos/fbd5c90d-2630-4103-b4ba-f8ca7babfc1e`,
    thumbnail:
      "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/ml700ouGMT7n/720.webp",
    views: 23163,
    minutes: 149,
    date: "2026-09-13",
  },
];

const yt = (id: string): Pick<VideoRef, "url" | "thumbnail"> => ({
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
});

export const YOUTUBE_VIDEOS: VideoRef[] = [
  {
    id: "RSm4rHRwz24",
    title: "تبادل أجساد زين مع بولتكس!!!",
    ...yt("RSm4rHRwz24"),
  },
  {
    id: "AU3iv9MYeTY",
    title: "سر جزيرة الدشاش!؟؟ وما علاقة اخو بولتكس بالدشاش | جراند الحياة الواقعية",
    ...yt("AU3iv9MYeTY"),
  },
  {
    id: "3XTmpIc1N_8",
    title: "اختفاء الدشاش | وحدث الكوني!!!",
    ...yt("3XTmpIc1N_8"),
  },
  {
    id: "faB64PAekGw",
    title: "اعدام قياده شرطه من الدشاش | وإعدام سينس",
    ...yt("faB64PAekGw"),
  },
];

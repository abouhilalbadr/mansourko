/**
 * Roleplay story arcs on the كيان (KYN) server.
 *
 * WHAT IS REAL HERE AND WHAT IS NOT — read before editing.
 *
 * The entries are real: titles, ids, dates and view counts come from the two
 * channels themselves (snapshot 2026-09-20). Two things are my inference and
 * nothing more, because I was not told the storylines:
 *
 *   - the GROUPING of videos into arcs, read off their titles;
 *   - the placement of Kick VODs, which is by DATE ONLY. A stream from the
 *     same days as an arc's episodes is likely the session they were cut
 *     from, but nobody confirmed that.
 *
 * Every `summary` is therefore left empty rather than invented. The page
 * renders an empty summary as a visible "to be written" slot, so no made-up
 * plot can reach a reader by accident.
 *
 * Kick keeps only recent VODs — the oldest live one is 2026-08-27 — so the
 * older arcs have no Kick entries and never will.
 */

export type ArcEntry = {
  platform: "youtube" | "kick";
  title: string;
  url: string;
  thumbnail: string;
  /** Display date. */
  date: string;
  /**
   * True when `date` was derived from a relative label ("3 months ago"), which
   * is all the YouTube channel page exposes. Shown with a "نحو" so an
   * approximate date is never mistaken for a precise one.
   */
  approx?: boolean;
  views?: number;
  minutes?: number;
};

export type Arc = {
  id: string;
  /** Arc name. Mine are provisional, taken from the videos' own wording. */
  title: string;
  period: string;
  /** EMPTY MEANS UNWRITTEN. Never fill this with a guess. */
  summary: string;
  entries: ArcEntry[];
};

const yt = (id: string, title: string, date: string, approx = false): ArcEntry => ({
  platform: "youtube",
  title,
  date,
  approx,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
});

const kick = (
  uuid: string,
  title: string,
  date: string,
  thumb: string,
  views: number,
  minutes: number,
): ArcEntry => ({
  platform: "kick",
  title,
  date,
  views,
  minutes,
  url: `https://kick.com/mansourko/videos/${uuid}`,
  thumbnail: thumb,
});

/** Newest first, the way the page reads it. */
export const ARCS: Arc[] = [
  {
    id: "blood-oath",
    title: "عهد الدم واليتامى",
    period: "سبتمبر ٢٠٢٦",
    summary: "",
    entries: [
      kick(
        "468711e6-0cf8-4cc7-9c90-02f1ff7835ce",
        "انا مبتخاذلش",
        "2026-09-19",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/tKLibXC7t3gL/720.webp",
        3613,
        157,
      ),
      yt("RSm4rHRwz24", "تبادل أجساد زين مع بولتكس", "2026-09-19"),
      yt("X85cUR9cbh0", "عهد الدم || اليتامه || بولتكس ودريك وعزام؟", "2026-09-16"),
      kick(
        "0ac28361-8c54-477b-85eb-61c64fdf81f7",
        "انت فاهم حاجه ؟",
        "2026-09-15",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/zsVvqNRWhrSc/720.webp",
        5321,
        240,
      ),
    ],
  },
  {
    id: "island",
    title: "سرّ جزيرة الدشاش",
    period: "سبتمبر ٢٠٢٦",
    summary: "",
    entries: [
      yt("II_PYZd9SJo", "اللعبة بقت اكبر من المتوقع", "2026-09-14"),
      yt("M75pQDb41Fs", "لغز المدرسة المهجورة", "2026-09-14"),
      kick(
        "1cb71912-aa90-4cfa-a3c8-6390f7052fc0",
        "الدشاش ؟",
        "2026-09-14",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/JYCRcrbi3U38/720.webp",
        29699,
        157,
      ),
      yt("AU3iv9MYeTY", "سر جزيرة الدشاش!؟؟ وما علاقة اخو بولتكس بالدشاش", "2026-09-13"),
      kick(
        "fbd5c90d-2630-4103-b4ba-f8ca7babfc1e",
        "فقدان شغف",
        "2026-09-13",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/ml700ouGMT7n/720.webp",
        23163,
        149,
      ),
    ],
  },
  {
    id: "return",
    title: "العودة إلى كيان",
    period: "أوائل سبتمبر ٢٠٢٦",
    summary: "",
    entries: [
      kick(
        "cc844940-494b-48af-8065-7902455a5c5a",
        "ماليش نفس اكتب عنوان",
        "2026-09-12",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/hwB8DKhdN1Uh/720.webp",
        6255,
        304,
      ),
      kick(
        "85de61e3-ef90-4b01-b1b1-c58583da36cf",
        "العودة بعد غياب",
        "2026-09-11",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/0ujUPgUohgzW/720.webp",
        23872,
        250,
      ),
      kick(
        "b1bcdf39-d229-4a23-85c7-4dca3a2edc47",
        "اهلا بيك في عالم الدشاش",
        "2026-09-07",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/YZiMIb28OrsJ/720.webp",
        16766,
        182,
      ),
      kick(
        "e2c6f037-90ba-488d-9afc-87d840da2f72",
        "عودة زين",
        "2026-09-01",
        "https://images.kick.com/video_thumbnails/QN4O9yYzBcmy/AIgpPhaeUs6k/720.webp",
        8187,
        305,
      ),
    ],
  },
  {
    id: "werewolves",
    title: "المستذئبون وحقيقة الدشاش",
    period: "يوليو ٢٠٢٦",
    summary: "",
    entries: [
      yt("GICB67OBffU", "عمر والمستذئبين || ومقابلته مع ليل وظهور حقيقة الدشاش", "يوليو ٢٠٢٦", true),
      yt("3XTmpIc1N_8", "اختفاء الدشاش | وحدث الكوني", "يوليو ٢٠٢٦", true),
    ],
  },
  {
    id: "police-war",
    title: "الحرب مع الشرطة",
    period: "يونيو ٢٠٢٦",
    summary: "",
    entries: [
      yt("mlXD3VA80I8", "حرب الشرطة ضد المستذئبين || والتعاون مع الشرطة", "يونيو ٢٠٢٦", true),
      yt("DJHU8x3tgKg", "مذبحة شرطة | حبس دشاش | لكن العصابات ليها رأي تاني", "يونيو ٢٠٢٦", true),
      yt("faB64PAekGw", "اعدام قيادة شرطة من الدشاش | وإعدام سينس", "يونيو ٢٠٢٦", true),
      yt("IrnShTbYTsI", "فتح قضية اعدام برق | مقابلة رحالة | تحقيق ورا بولتكس", "يونيو ٢٠٢٦", true),
    ],
  },
];

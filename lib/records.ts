/**
 * Records — the numbers that do NOT move on their own.
 *
 * Snapshot taken 2026-09-20 from the two channels. Unlike the follower counts
 * on this page, nothing here refreshes: a new best stream means editing this
 * file. Each record carries the link it came from so any claim can be checked.
 *
 * Kick's figures are hand-copied because its API refuses server-side requests
 * (see app/api/socials/route.ts); YouTube's come from the public channel page.
 */

export type Record = {
  label: string;
  /** The headline figure. */
  value: string;
  /** What the figure belongs to — a stream or video title. */
  detail: string;
  url: string;
};

export const RECORDS: Record[] = [
  {
    label: "أعلى بثّ مشاهدةً",
    value: "29.7K",
    detail: "الدشاش ؟ | KYN",
    url: "https://kick.com/mansourko/videos/1cb71912-aa90-4cfa-a3c8-6390f7052fc0",
  },
  {
    label: "أعلى فيديو مشاهدةً",
    value: "18K",
    detail: "مذبحة شرطة | حبس دشاش",
    url: "https://www.youtube.com/watch?v=DJHU8x3tgKg",
  },
  {
    label: "أطول بثّ",
    value: "5:05",
    detail: "ماليش نفس اكتب عنوان | KYN",
    url: "https://kick.com/mansourko/videos/cc844940-494b-48af-8065-7902455a5c5a",
  },
  {
    label: "ليالي البثّ أسبوعياً",
    value: "4",
    detail: "الإثنين والأربعاء والجمعة والسبت، ٢١:٠٠",
    url: "https://kick.com/mansourko",
  },
];

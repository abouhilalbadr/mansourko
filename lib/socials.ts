export type SocialId =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "kick"
  | "discord";

export type Social = {
  id: SocialId;
  /** Shown under the counter */
  name: string;
  /** What the number counts */
  metric: string;
  /**
   * The account identifier on that platform, WITHOUT the @ or any URL around
   * it. Both the public link below and the live counter in
   * app/api/socials/route.ts are built from this one value — they used to be
   * typed separately, and had already drifted: the link pointed at
   * @mansourko74 while the fetcher was still polling @mansourko.
   */
  handle: string;
  url: string;
  /**
   * Shown when the live fetch is unavailable or fails. TikTok and Instagram
   * have no public count endpoint, so these are the ONLY source for them —
   * update by hand.
   */
  fallback: number;
};

export const SOCIALS: Social[] = [
  {
    id: "youtube",
    name: "يوتيوب",
    metric: "مشترك",
    handle: "mansourko74",
    url: "https://www.youtube.com/@mansourko74",
    fallback: 14_100, // only a floor — YouTube is read live
  },
  {
    id: "kick",
    name: "كيك",
    metric: "متابع",
    handle: "mansourko",
    url: "https://kick.com/mansourko",
    // Hand-maintained: Kick 403s server-side fetches (see the API route).
    // 55,834 as of 2026-09-20.
    fallback: 55_800,
  },
  {
    id: "tiktok",
    name: "تيك توك",
    metric: "متابع",
    handle: "mansourko.gaming",
    url: "https://www.tiktok.com/@mansourko.gaming",
    fallback: 0, // TikTok gives servers a JS shell — set this by hand
  },
  {
    id: "instagram",
    name: "إنستغرام",
    metric: "متابع",
    handle: "MANSOURKO74",
    url: "https://www.instagram.com/MANSOURKO74/",
    fallback: 0, // Instagram needs an authed Graph token — set this by hand
  },
  {
    id: "discord",
    name: "ديسكورد",
    metric: "عضو",
    handle: "8EEV7Jn6mC", // the invite code
    url: "https://discord.com/invite/8EEV7Jn6mC",
    // 0 on purpose: this invite currently returns "Invite is expired", so the
    // member count cannot be read AND the link is dead. A zero keeps the chip
    // out of the rotation entirely rather than showing a stale number next to
    // a broken link. Replace with a never-expiring invite and this starts
    // working on its own — the count is fetched live.
    fallback: 0,
  },
];

/** 2_090_000 -> "2.1M" */
export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}K`;
  }
  return n.toLocaleString("en-US");
}

/**
 * Next round-number milestone above `n`, with progress toward it.
 *
 * The step scales with magnitude so the bar always reads as a meaningful
 * stretch: 20K -> 30K for a Discord server, 2.0M -> 2.5M for a YouTube
 * channel. Without this a single fixed step would either never move or be
 * permanently full.
 */
export function milestone(n: number): {
  from: number;
  to: number;
  progress: number;
} {
  const step =
    n < 1_000 ? 100
    : n < 10_000 ? 1_000
    : n < 100_000 ? 10_000
    : n < 1_000_000 ? 100_000
    : 500_000;

  const from = Math.floor(n / step) * step;
  const to = from + step;
  return { from, to, progress: (n - from) / step };
}

/**
 * Wanted-level equivalent: career tier from total audience across platforms.
 * Six thresholds for six stars.
 */
export const CLOUT_TIERS: { at: number; name: string }[] = [
  { at: 10_000, name: "اسم محلي" },
  { at: 50_000, name: "معروف في المدينة" },
  { at: 250_000, name: "على مستوى الولاية" },
  { at: 1_000_000, name: "الأكثر طلباً" },
  { at: 2_500_000, name: "زعيم" },
  { at: 5_000_000, name: "أسطورة" },
];

export function cloutLevel(total: number) {
  const stars = CLOUT_TIERS.filter((t) => total >= t.at).length;
  return {
    stars,
    max: CLOUT_TIERS.length,
    name: stars > 0 ? CLOUT_TIERS[stars - 1].name : "مجهول",
    next: CLOUT_TIERS[stars] ?? null,
  };
}

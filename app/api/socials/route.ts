import { NextResponse } from "next/server";
import { SOCIALS, type SocialId } from "@/lib/socials";

/**
 * Live social counters.
 *
 * What can actually be read from a server, as measured rather than assumed:
 *
 *   YouTube  WORKS. Data API v3 when YOUTUBE_API_KEY is set, else the public
 *            channel page.
 *   Discord  WORKS, but only through a NEVER-EXPIRING invite. An expired one
 *            answers "Invite is expired" and the count goes dark.
 *   Kick     DOES NOT WORK. kick.com/api/v2 answers 403 "Request blocked by
 *            security policy" to Node's fetch while curl with identical
 *            headers gets 200 — it fingerprints the TLS handshake, so no
 *            header set fixes it. The call is kept because it costs one fast
 *            failure and self-heals if that policy ever relaxes, but the
 *            number on screen is the fallback. Making it live needs Kick's
 *            official OAuth API and app credentials.
 *   TikTok   DOES NOT WORK. Serves a JS shell to servers.
 *   Instagram DOES NOT WORK. Needs an authenticated Graph API token.
 *
 * So four of the five numbers are hand-maintained in lib/socials.ts. Every
 * fetch fails soft: one dead source never blanks the HUD.
 */

export const revalidate = 900; // 15 minutes

/**
 * Handles come from the route table, never from constants here. They were
 * duplicated in both places and had drifted: lib/socials.ts linked to
 * @mansourko74 while this file polled @mansourko, so the HUD showed a number
 * belonging to a different channel.
 */
const handleOf = (id: SocialId) =>
  SOCIALS.find((s) => s.id === id)?.handle ?? "";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

/** "2.09M" | "878 thousand" -> number */
function parseCompact(raw: string): number | null {
  const m = raw.match(/([\d.,]+)\s*(K|M|B|thousand|million|billion)?/i);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const unit = (m[2] ?? "").toLowerCase();
  if (unit === "k" || unit === "thousand") return Math.round(n * 1e3);
  if (unit === "m" || unit === "million") return Math.round(n * 1e6);
  if (unit === "b" || unit === "billion") return Math.round(n * 1e9);
  return Math.round(n);
}

async function get(url: string, headers: Record<string, string> = {}) {
  return fetch(url, {
    headers: { "user-agent": UA, ...headers },
    signal: AbortSignal.timeout(8000),
    next: { revalidate },
  });
}

async function youtube(): Promise<number | null> {
  const handle = handleOf("youtube");
  const key = process.env.YOUTUBE_API_KEY;
  if (key) {
    // forHandle, not id — the channel ID was hardcoded and pointed at someone
    // else's channel, which is unverifiable at a glance. The handle is the
    // same string the public link uses, so a wrong one is obvious.
    const res = await get(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${handle}&key=${key}`,
    );
    if (res.ok) {
      const json = await res.json();
      const n = Number(json?.items?.[0]?.statistics?.subscriberCount);
      if (Number.isFinite(n)) return n;
    }
  }

  // No key: read the channel page. Featured channels also carry counts, but
  // they use subscriberCountText.accessibility.label — only the page header
  // uses this "content" key, so the match is unambiguous.
  const res = await get(`https://www.youtube.com/@${handle}`, {
    "accept-language": "en-US,en;q=0.9",
  });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/"content":"([\d.,]+\s*[KMB]?)\s*subscribers?"/i);
  return m ? parseCompact(m[1]) : null;
}

async function kick(): Promise<number | null> {
  const res = await get(`https://kick.com/api/v2/channels/${handleOf("kick")}`, {
    accept: "application/json",
  });
  if (!res.ok) return null;
  const json = await res.json();
  const n = Number(json?.followers_count ?? json?.followersCount);
  return Number.isFinite(n) ? n : null;
}

async function discord(): Promise<number | null> {
  const res = await get(
    `https://discord.com/api/v10/invites/${handleOf("discord")}?with_counts=true`,
    { accept: "application/json" },
  );
  if (!res.ok) return null;
  const json = await res.json();
  const n = Number(json?.approximate_member_count);
  return Number.isFinite(n) ? n : null;
}

export async function GET() {
  const [yt, kk, dc] = await Promise.allSettled([youtube(), kick(), discord()]);
  const live: Partial<Record<SocialId, number>> = {};
  if (yt.status === "fulfilled" && yt.value) live.youtube = yt.value;
  if (kk.status === "fulfilled" && kk.value) live.kick = kk.value;
  if (dc.status === "fulfilled" && dc.value) live.discord = dc.value;

  const counts = Object.fromEntries(
    SOCIALS.map((s) => [s.id, live[s.id] ?? s.fallback]),
  ) as Record<SocialId, number>;

  return NextResponse.json(
    { counts, live: Object.keys(live), fetchedAt: Date.now() },
    {
      headers: {
        "cache-control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}

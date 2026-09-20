"use client";

import { useEffect, useState } from "react";
import { SOCIALS } from "@/lib/socials";

/**
 * Real live status, read from Kick BY THE BROWSER.
 *
 * This deliberately does not go through our own API route. Kick answers 403
 * "Request blocked by security policy" to server-side fetches — it fingerprints
 * the TLS handshake, so no header set gets a Node request through (the same
 * wall that keeps the follower counter on a hand-maintained number). A real
 * browser sails past it, and Kick sends permissive CORS headers, so asking
 * from the visitor's own browser is the one route that actually works.
 *
 * The trade-offs, stated plainly:
 *   - each visitor's browser talks to kick.com directly, so their IP is
 *     visible to Kick, as it would be if they opened the channel;
 *   - a blocked request, an outage or a future CORS change just means
 *     `live: false`, and the caller falls back to the schedule countdown.
 */

export type LiveState = {
  /** null while the first request is in flight — not the same as offline. */
  live: boolean | null;
  title?: string;
  viewers?: number;
  thumbnail?: string;
  /** Where the stream opens. */
  url: string;
  startedAt?: string;
};

const POLL_MS = 60_000;

export function useLive(): LiveState {
  const handle = SOCIALS.find((s) => s.id === "kick")?.handle ?? "mansourko";
  const url = `https://kick.com/${handle}`;
  const [state, setState] = useState<LiveState>({ live: null, url });

  useEffect(() => {
    let alive = true;

    const check = async () => {
      try {
        const res = await fetch(
          `https://kick.com/api/v2/channels/${handle}`,
          { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) },
        );
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const ls = json?.livestream;
        if (!alive) return;
        setState(
          ls
            ? {
                live: true,
                url,
                title: ls.session_title ?? undefined,
                viewers:
                  typeof ls.viewer_count === "number" ? ls.viewer_count : undefined,
                thumbnail: ls.thumbnail?.url ?? undefined,
                startedAt: ls.created_at ?? undefined,
              }
            : { live: false, url },
        );
      } catch {
        // Fail soft: treat an unreachable Kick as "not live" so the caller
        // shows the schedule instead of an error nobody can act on.
        if (alive) setState({ live: false, url });
      }
    };

    check();
    const id = setInterval(check, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [handle, url]);

  return state;
}

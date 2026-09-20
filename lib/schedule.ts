/**
 * Stream schedule, in the viewer's LOCAL time.
 *
 * Driven by a recurring weekly schedule rather than a fixed date, so the
 * countdown always points at the next real session and never expires. Edit
 * these three constants to match the actual stream nights.
 *
 * This is the FALLBACK answer to "when is he on?" — the authoritative answer
 * is whether Kick says he is live right now (see lib/useLive.ts). The schedule
 * only fills the gap between sessions.
 */
export const STREAM_DAYS = [1, 3, 5, 6]; // 0 = Sunday … 6 = Saturday
export const STREAM_START_HOUR = 21; // 21:00
export const STREAM_DURATION_HOURS = 4;

/** Next session start, and whether one is scheduled to be on air now. */
export function nextSession(now: Date) {
  const durationMs = STREAM_DURATION_HOURS * 3600_000;

  // Did today's (or yesterday's late-night) session already start and not end?
  for (const back of [0, 1]) {
    const start = new Date(now);
    start.setDate(start.getDate() - back);
    start.setHours(STREAM_START_HOUR, 0, 0, 0);
    if (
      STREAM_DAYS.includes(start.getDay()) &&
      now >= start &&
      now.getTime() - start.getTime() < durationMs
    ) {
      return { live: true, start };
    }
  }

  // Otherwise walk forward to the next scheduled start.
  for (let ahead = 0; ahead <= 7; ahead++) {
    const start = new Date(now);
    start.setDate(start.getDate() + ahead);
    start.setHours(STREAM_START_HOUR, 0, 0, 0);
    if (STREAM_DAYS.includes(start.getDay()) && start > now) {
      return { live: false, start };
    }
  }
  return { live: false, start: now };
}

/** Hours, minutes, seconds — no days, so a long wait reads as "36 س". */
export function breakdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export const pad = (n: number) => String(n).padStart(2, "0");

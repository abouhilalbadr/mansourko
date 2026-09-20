import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 *
 * Delivery is pluggable and, importantly, NOT faked: with no provider
 * configured this answers 503 `not_configured` rather than a cheerful success
 * the sender would believe. A contact form that silently drops messages is
 * worse than no contact form.
 *
 * To turn it on, set both:
 *   RESEND_API_KEY   an API key from resend.com
 *   CONTACT_TO       the inbox that should receive the messages
 *   CONTACT_FROM     optional; must be a domain verified with the provider
 */
export const runtime = "nodejs";

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 160 },
  subject: { max: 120 },
  message: { min: 10, max: 4000 },
};

/** Deliberately loose — the only real test of an address is sending to it. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * One burst of submissions per IP. In-memory, so it resets on deploy and does
 * not span instances — enough to blunt a casual flood, not a real defence.
 * Anything serious belongs in front of the app.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude ceiling on memory
  return recent.length > MAX_PER_WINDOW;
}

type Body = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot: a real person never sees this field, so a bot filling it tells on itself. */
  website?: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Bots that fill the hidden field get a 200 and nothing else happens. Telling
  // them they were caught only teaches the next attempt.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name);
  const email = str(body.email);
  const subject = str(body.subject);
  const message = str(body.message);

  const fields: Record<string, string> = {};
  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    fields.name = "الاسم مطلوب (من حرفين إلى ٨٠).";
  }
  if (!EMAIL.test(email) || email.length > LIMITS.email.max) {
    fields.email = "أدخل بريداً إلكترونياً صحيحاً.";
  }
  if (subject.length > LIMITS.subject.max) {
    fields.subject = "الموضوع طويل جداً.";
  }
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    fields.message = "الرسالة مطلوبة (١٠ أحرف على الأقل).";
  }
  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "invalid", fields }, { status: 422 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Contact <onboarding@resend.dev>",
      to: [to],
      // Replying goes to the sender, not to the form.
      reply_to: email,
      subject: subject || `رسالة جديدة من ${name}`,
      text: [`الاسم: ${name}`, `البريد: ${email}`, "", message].join("\n"),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    // The provider's reason is for the logs, never for the sender.
    console.error("contact: delivery failed", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

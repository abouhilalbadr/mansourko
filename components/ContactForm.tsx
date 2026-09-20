"use client";

import { useRef, useState } from "react";
import { useAudio } from "@/lib/useAudio";

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "error";

/** Errors the endpoint can return, in the sender's language. */
const MESSAGES: Record<string, string> = {
  rate_limited: "أرسلت رسائل كثيرة في وقت قصير. انتظر قليلاً ثم حاول مجدداً.",
  not_configured: "النموذج غير مفعّل بعد. جرّب التواصل عبر أيٍّ من الحسابات أدناه.",
  send_failed: "تعذّر إرسال الرسالة. حاول مرة أخرى بعد قليل.",
  bad_request: "حدث خطأ غير متوقّع. حاول مرة أخرى.",
};

const field =
  "w-full border border-mansourko-sand/40 bg-black/40 px-3 py-2 text-hud-white placeholder:text-white/35 transition-colors focus:border-mansourko-gold focus:outline-none";
const label = "font-gta mb-1 block text-sm text-mansourko-sand";

export default function ContactForm() {
  const { play } = useAudio();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setErrors({});
    setFormError("");
    play("click");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("sent");
        formRef.current?.reset();
        return;
      }
      // 422 comes back with per-field reasons; everything else is one message.
      if (json?.fields) setErrors(json.fields);
      setFormError(json?.fields ? "" : (MESSAGES[json?.error] ?? MESSAGES.bad_request));
      setStatus("error");
    } catch {
      setFormError("تعذّر الاتصال. تحقّق من الشبكة وحاول مجدداً.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-mansourko-gold/50 bg-black/40 p-6 text-center"
      >
        <p className="font-gta text-2xl text-hud-white">تم الإرسال</p>
        <p className="mt-2 text-sm leading-loose text-white/70">
          وصلت رسالتك. سيصلك الردّ على البريد الذي أدخلته.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            play("back");
          }}
          className="font-gta mt-4 border border-mansourko-sand/50 px-4 py-2 text-sm text-mansourko-sand transition-colors hover:border-transparent hover:bg-mansourko-gold hover:text-hud-plate"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot. Hidden from sight AND from screen readers, so only a bot
          filling every input it finds will touch it. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            الاسم
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={field}
            placeholder="اسمك"
          />
          {errors.name ? (
            <p id="name-error" className="mt-1 text-xs text-live-red">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className={label} htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            dir="ltr"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${field} text-end`}
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p id="email-error" className="mt-1 text-xs text-live-red">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className={label} htmlFor="subject">
          الموضوع <span className="text-white/40">(اختياري)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={120}
          className={field}
          placeholder="تعاون، رعاية، استفسار…"
        />
      </div>

      <div>
        <label className={label} htmlFor="message">
          الرسالة
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${field} resize-y`}
          placeholder="اكتب رسالتك هنا…"
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-xs text-live-red">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* One live region for the whole form, so a screen reader announces the
          outcome once instead of per field. */}
      <p aria-live="polite" className="min-h-5 text-sm text-live-red">
        {formError}
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="font-gta self-start border-2 border-mansourko-gold bg-mansourko-gold px-6 py-2 text-lg text-hud-plate transition-colors hover:bg-transparent hover:text-mansourko-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "جارٍ الإرسال…" : "إرسال"}
      </button>
    </form>
  );
}

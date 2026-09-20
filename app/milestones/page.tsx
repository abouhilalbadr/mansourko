import type { Metadata } from "next";
import CloutLadder from "@/components/CloutLadder";
import { RECORDS } from "@/lib/records";
import { getRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "الإنجازات",
  description:
    "إنجازات منصور الدشاش — مستوى الشهرة، الهدف القادم على كل منصة، وأرقامه القياسية في البثّ.",
};

export default function MilestonesPage() {
  return (
    <section className="w-full border-s-4 border-mansourko-gold bg-black/55 p-6 backdrop-blur-md sm:p-8">
      <h1 className="font-gta text-4xl leading-arabic text-hud-white sm:text-5xl">
        {getRoute("/milestones")?.tag}
      </h1>
      <p className="mt-4 text-base leading-loose text-hud-cream">
        مستوى الشهرة يرتفع مع إجمالي المتابعين عبر المنصّات، والأرقام تتحدّث
        بنفسها.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <CloutLadder />

        <div className="flex flex-col gap-8">
          <div>
            <p className="font-gta text-sm text-mansourko-sand">أرقام قياسية</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {RECORDS.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col justify-between border border-mansourko-sand/25 bg-black/40 p-3 transition-colors hover:border-mansourko-gold"
                  >
                    <span className="text-xs text-white/55">{r.label}</span>
                    <span className="font-gta ltr-nums mt-1 text-3xl leading-none text-hud-white tabular-nums">
                      {r.value}
                    </span>
                    <span className="mt-1 line-clamp-1 text-xs text-mansourko-sand/80 transition-colors group-hover:text-mansourko-sand">
                      {r.detail}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Career firsts cannot be derived from either platform's API — the
              dates he started, joined كيان, and so on. Left as a visible slot
              rather than filled with guesses. */}
          <div>
            <p className="font-gta text-sm text-mansourko-sand">محطات مهمة</p>
            <p className="mt-3 border border-dashed border-mansourko-sand/30 p-3 text-sm leading-loose text-white/40">
              لم تُضف بعد — بداية البثّ، الانضمام إلى كيان، وأبرز المحطات.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-10 border-t border-mansourko-sand/20 pt-4 text-xs leading-loose text-white/45">
        أعداد المتابعين تُحدَّث تلقائياً؛ الأرقام القياسية مُسجَّلة يدوياً بتاريخ
        ٢٠ سبتمبر ٢٠٢٦.
      </p>
    </section>
  );
}

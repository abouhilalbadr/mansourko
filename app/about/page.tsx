import type { Metadata } from "next";
import { getRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "عن منصور الدشاش",
  description:
    "ملف شخصية «الدشاش» — الشخصية التي يلعبها منصور الدشاش في عالم الرول بلاي: حضور مهيب، صلابة بلا مغفرة، ولاء مطلق داخل الطاقم، وطموح محسوب.",
};

/**
 * Character dossier.
 *
 * "الدشاش" is a roleplay persona, not the man — the page says so outright
 * rather than letting a reader take the traits below as a description of a
 * real person.
 */
const TRAITS = [
  {
    title: "حضورٌ مهيب",
    body: "يتحرّك في العالم السفليّ للسيرفر، بحضورٍ آمرٍ لا يمرّ عليه تجاوزٌ دون ردّ. لا يقبل الإهانة، ولا يترك موقفاً معلّقاً.",
  },
  {
    title: "صلابةٌ بلا مغفرة",
    body: "شخصيةٌ خشنةٌ جاهزةٌ للمواجهة في أيّ لحظة. كثيراً ما يبدأ الحروب ويقودها، ويدير العمليات التكتيكية ضدّ الفصائل المنافسة.",
  },
  {
    title: "وفاءٌ… وقسوة",
    body: "يطلب ولاءً مطلقاً من طاقمه، ويحمي دائرته المقرّبة بشراسة. أمّا الأعداء والخيانات فيتعامل معها ببرودٍ محسوب.",
  },
  {
    title: "طموحٌ محسوب",
    body: "ليس مثيرَ فوضى؛ خطواته مدروسة: بناء النفوذ، وإتمام عملياتٍ عالية المخاطر، والصعود في هرم السيرفر.",
  },
];

export default function AboutPage() {
  return (
    <article className="w-full border-s-4 border-mansourko-gold bg-black/55 p-6 backdrop-blur-md sm:p-8">
      <div className="w-full">
        <h1 className="font-gta text-4xl leading-arabic text-hud-white sm:text-5xl xl:text-6xl">
          {getRoute("/about")?.tag}
        </h1>

        <p className="mt-6 text-base leading-loose text-hud-cream sm:text-lg">
          «الدشاش» شخصيةٌ من عالم الرول بلاي في جي تي إيه 5، يلعبها منصور —
          وليست شخصاً حقيقياً. حين يرتدي منصور هذه الشخصية، يدخل دوراً له ملامحه
          الخاصة:
        </p>

        <ol className="mt-8 flex flex-col gap-6">
          {TRAITS.map((trait, i) => (
            <li key={trait.title} className="flex gap-4">
              <span
                className="font-gta shrink-0 text-2xl leading-none text-mansourko-gold/70 tabular-nums sm:text-3xl"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h2 className="font-gta text-xl leading-arabic text-mansourko-sand sm:text-2xl">
                  {trait.title}
                </h2>
                <p className="mt-1 text-sm leading-loose text-white/75 sm:text-base">
                  {trait.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t border-mansourko-sand/20 pt-4 text-xs leading-loose text-white/50 sm:text-sm">
          كل ما سبق يخصّ الشخصية داخل اللعبة فقط، ولا يعكس صاحبها خارجها.
        </p>
      </div>
    </article>
  );
}

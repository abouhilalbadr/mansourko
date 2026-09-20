import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { BRAND_ICONS } from "@/lib/brandIcons";
import { getRoute } from "@/lib/routes";
import { SOCIALS } from "@/lib/socials";

export const metadata: Metadata = {
  title: "تواصل",
  description:
    "تواصل مع منصور الدشاش — للتعاون والرعاية والاستفسارات، أو عبر حساباته على يوتيوب وكيك وتيك توك وإنستغرام وديسكورد.",
};

export default function ContactPage() {
  return (
    <section className="w-full border-s-4 border-mansourko-gold bg-black/55 p-6 backdrop-blur-md sm:p-8">
      <h1 className="font-gta text-4xl leading-arabic text-hud-white sm:text-5xl">
        {getRoute("/contact")?.tag}
      </h1>
      <p className="mt-4 text-base leading-loose text-hud-cream">
        للتعاون أو الرعاية أو أيّ استفسار، اكتب هنا وسيصلك الردّ على بريدك.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-10 border-t border-mansourko-sand/20 pt-6">
        <p className="font-gta text-sm text-mansourko-sand">
          أو تابعه مباشرةً هنا
        </p>

        <ul className="mt-4 flex flex-wrap gap-3">
          {SOCIALS.map((social) => {
            const brand = BRAND_ICONS[social.id];
            return (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* The name is no longer on screen, so it has to live in the
                     accessible name and the tooltip instead. */
                  aria-label={`افتح منصور الدشاش على ${social.name} في تبويب جديد`}
                  title={social.name}
                  className="group relative grid h-12 w-12 place-items-center border border-mansourko-sand/50 bg-black/40 transition-colors hover:border-transparent"
                >
                  <span
                    className="brand-fill absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ "--brand-color": brand.hex } as React.CSSProperties}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    className="relative fill-mansourko-sand transition-colors group-hover:fill-white"
                    aria-hidden
                  >
                    <path d={brand.path} />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Pull quote, on the far side of the HUD from the menu.
 *
 * Broken by sentence rather than left to wrap — the art breaks after the first
 * sentence, and free wrapping split the second clause across two lines.
 */
const QUOTE_LINES = ["أهلا بيك في عالم الدشاش"];
const ATTRIBUTION = "— منصور الدشاش";

export default function HUDBottomRight() {
  return (
    <figure data-hud className="pointer-events-none fixed end-10 bottom-11 z-40 hidden text-end select-none lg:block">
      <blockquote className="font-quote text-3xl leading-quote xl:text-4xl 2xl:text-5xl font-normal text-hud-cream drop-shadow-hud-text">
        {QUOTE_LINES.map((line, i) => (
          <span key={line} className="block whitespace-nowrap">
            {i === 0 ? "«" : null}
            {line}
            {i === QUOTE_LINES.length - 1 ? "»" : null}
          </span>
        ))}
      </blockquote>
      <figcaption className="font-quote mt-2 text-lg xl:text-xl 2xl:text-2xl font-normal text-mansourko-sand">
        {ATTRIBUTION}
      </figcaption>
    </figure>
  );
}

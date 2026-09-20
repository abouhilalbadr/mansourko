"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import MansourkoLogo from "@/components/MansourkoLogo";
import { ROUTES, isActive } from "@/lib/routes";
import { useAudio } from "@/lib/useAudio";

/**
 * Navigation.
 *
 * Desktop keeps the always-visible pause-menu column, anchored to the reading
 * edge (the right, since the site is RTL). On phones there is no room for nine
 * 48px items beside content, so the same list becomes a full-screen overlay
 * behind a bar — still the pause menu, just summoned.
 *
 * Driven like a console menu: Up/Down move a cursor, Enter selects. The
 * highlight bar follows the CURSOR rather than the route — that is what makes
 * the list feel navigable. The cursor re-seats on the current page after every
 * navigation, so a pointer-only visit looks exactly as it did before.
 */
export default function MainMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { play } = useAudio();
  const [open, setOpen] = useState(false);

  const activeIndex = Math.max(
    0,
    ROUTES.findIndex((r) => isActive(r.href, pathname)),
  );
  const [cursor, setCursor] = useState(activeIndex);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  /**
   * Once the cursor leaves the active route, the page you are actually on
   * needs its own marker. Pointer users never see it.
   */
  const [usingKeys, setUsingKeys] = useState(false);

  /**
   * Navigating away closes the overlay and re-seats the cursor. Adjusted
   * during render rather than in an effect — this is derived state, and an
   * effect would render one frame with a stale cursor first.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setCursor(activeIndex);
    setUsingKeys(false);
    setOpen(false);
  }

  // Don't let the page scroll behind the open overlay.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const moveTo = useCallback(
    (next: number) => {
      setUsingKeys(true);
      setCursor(next);
      itemRefs.current[next]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
      play("hover");
    },
    [play],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Never hijack typing, and never fight a control that handles its own
      // keys — a focused link pressing Enter would otherwise navigate twice,
      // to two different pages.
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        tag === "IFRAME" ||
        el?.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
        case "ArrowLeft":
          e.preventDefault();
          moveTo((cursor + 1) % ROUTES.length);
          break;
        case "ArrowUp":
        case "ArrowRight":
          e.preventDefault();
          moveTo((cursor - 1 + ROUTES.length) % ROUTES.length);
          break;
        case "Home":
          e.preventDefault();
          moveTo(0);
          break;
        case "End":
          e.preventDefault();
          moveTo(ROUTES.length - 1);
          break;
        case "Enter":
          if (tag === "A" || tag === "BUTTON") return; // let it activate itself
          e.preventDefault();
          play("click");
          router.push(ROUTES[cursor].href);
          break;
        case "Escape":
          if (open) {
            e.preventDefault();
            setOpen(false);
            play("back");
          }
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, moveTo, open, play, router]);

  const itemClass = (highlighted: boolean) =>
    [
      "flex items-center justify-between border-s-4 px-4 py-3.5 transition-colors duration-200 lg:py-menu-row",
      highlighted
        ? // Opaque gold gradient, light to dark across the bar, plus an edge glow.
          "border-mansourko-gold-light bg-[linear-gradient(270deg,#dcbb8a_0%,#bf9b6b_55%,#8a6438_100%)] text-[#1a1a1a] shadow-menu-active"
        : "border-transparent text-mansourko-sand hover:bg-[linear-gradient(270deg,rgba(201,164,114,0.55)_0%,rgba(166,124,69,0.42)_60%,rgba(111,78,47,0.35)_100%)] hover:text-hud-white",
    ].join(" ");

  /** Marks the page you are on once the cursor has moved elsewhere. */
  const currentDot = (show: boolean) =>
    show ? (
      <span
        className="me-2 inline-block h-2 w-2 shrink-0 rounded-full bg-mansourko-gold-light shadow-dot-glow"
        aria-hidden
      />
    ) : null;

  return (
    <>
      {/* ---------- Mobile: floating HUD, no app bar ----------
           A solid top bar reads as web chrome and breaks the pause-menu
           illusion. These float over the art like every desktop HUD corner. */}
      <Link
        href="/"
        aria-label="الصفحة الرئيسية"
        data-hud
        className="fixed top-4 start-4 z-50 w-16 lg:hidden"
      >
        <MansourkoLogo />
      </Link>

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          play("click");
        }}
        aria-label="افتح القائمة"
        aria-expanded={open}
        data-hud
        className="fixed top-4 end-4 z-50 grid h-12 w-12 place-items-center border-2 border-mansourko-sand/70 bg-black/45 text-mansourko-sand backdrop-blur-sm transition-colors active:bg-mansourko-gold/50 active:text-hud-white lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* ---------- Mobile overlay ---------- */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-lg lg:hidden"
          >
            <div className="flex items-center justify-between p-4">
              <div className="w-16">
                <MansourkoLogo />
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  play("back");
                }}
                aria-label="أغلق القائمة"
                className="grid h-12 w-12 place-items-center border-2 border-mansourko-sand/70 bg-black/45 text-mansourko-sand backdrop-blur-sm"
              >
                <X size={24} />
              </button>
            </div>

            <ul
              className="gta-scroll flex flex-1 flex-col gap-1 overflow-y-auto pt-2 pb-8"
              onMouseLeave={() => {
                if (!usingKeys) setCursor(activeIndex);
              }}
            >
              {ROUTES.map((route, i) => {
                const current = isActive(route.href, pathname);
                const highlighted = i === cursor;
                return (
                  <motion.li
                    key={route.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.25 }}
                  >
                    <Link
                      href={route.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => play("click")}
                      className={itemClass(highlighted)}
                    >
                      <span className="flex items-center">
                        {currentDot(current && !highlighted)}
                        <span className="font-gta text-4xl leading-none">
                          {route.label}
                        </span>
                      </span>
                      {highlighted ? (
                        <ChevronLeft size={26} strokeWidth={2.5} />
                      ) : null}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ---------- Desktop column ---------- */}
      <nav
        aria-label="القائمة الرئيسية"
        className="fixed top-hud-top start-8 z-40 hidden w-96 lg:block xl:start-10 xl:w-120"
      >
        {/* The emblem carries the name on its own — a wordmark under it only
            said "منصور الدشاش" twice. */}
        <div className="w-hud-logo">
          <MansourkoLogo />
        </div>

        <ul
          className="mt-hud-md flex flex-col gap-menu-gap"
          onMouseLeave={() => {
            // Keyboard driving owns the cursor; only undo a pointer hover.
            if (!usingKeys) setCursor(activeIndex);
          }}
        >
          {ROUTES.map((route, i) => {
            const current = isActive(route.href, pathname);
            const highlighted = i === cursor;
            return (
              <motion.li
                key={route.href}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={highlighted ? undefined : { x: -10 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <Link
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    href={route.href}
                    aria-current={current ? "page" : undefined}
                    onMouseEnter={() => {
                      setUsingKeys(false);
                      setCursor(i);
                      play("hover");
                    }}
                    onClick={() => play("click")}
                    className={itemClass(highlighted)}
                  >
                    <span className="flex items-center">
                      {currentDot(current && usingKeys && !highlighted)}
                      <span className="font-gta text-hud-menu leading-none drop-shadow-hud-item">
                        {route.label}
                      </span>
                    </span>
                    {highlighted ? (
                      <ChevronLeft size={28} strokeWidth={2.5} />
                    ) : null}
                  </Link>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>

        {/* Console-style key legend */}
        <p className="font-gta mt-hud-sm ps-4 text-hud-legend text-mansourko-sand/50">
          ↑ ↓ تنقّل &nbsp;·&nbsp; ⏎ اختيار
        </p>
      </nav>
    </>
  );
}

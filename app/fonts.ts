import { Cairo, Changa, Rakkas } from "next/font/google";

/**
 * Arabic typography.
 *
 * The site is Arabic-only and RTL, so every face here ships the `arabic`
 * subset and Latin is only a fallback for the handful of Latin brand names
 * (YouTube, Kick, TikTok) that stay untranslated.
 *
 *   Changa  display / headers   — the heavy, slightly condensed face that
 *                                 carries the GTA "Pricedown" weight in Arabic
 *   Cairo   menus, stats, body  — the neutral UI face
 *   Rakkas  pull quote          — decorative display. Amiri was here first
 *                                 and read weak: it is a book face, cut for
 *                                 long passages at text size, and a pull
 *                                 quote is headline work.
 *
 * These are exposed to Tailwind as `font-gta`, `font-menu` and `font-quote` in
 * app/globals.css, so swapping in a licensed local Arabic face later is a
 * change to THIS FILE ONLY:
 *
 *   import localFont from "next/font/local";
 *   export const displayFont = localFont({
 *     src: "../public/fonts/display-ar.woff2",
 *     variable: "--font-display",
 *     display: "swap",
 *   });
 */
export const displayFont = Changa({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const uiFont = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

/** Decorative display face for the pull quote. Ships one weight only, so the
 *  quote must not ask for a bold — the browser would synthesise it and smear
 *  the letterforms. */
export const quoteFont = Rakkas({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-quote-face",
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${uiFont.variable} ${quoteFont.variable}`;

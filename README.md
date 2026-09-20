# منصور الدشاش — Portfolio

An Arabic, right-to-left portfolio for GTA V roleplay streamer **منصور الدشاش** (Mansourko), built
to look and behave like a Grand Theft Auto Online pause menu.

The background, HUD and navigation mount once in the root layout and never remount. Routing only
swaps `{children}`, so the interface never blinks and the illusion of a game menu holds.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide

Tailwind v4 is CSS-first — there is **no `tailwind.config.ts`**. Design tokens live in an `@theme`
block in [`app/globals.css`](app/globals.css) and generate the utilities (`bg-mansourko-gold`,
`text-hud-cream`, `font-gta`, `font-menu`, `font-quote`, `drop-shadow-hud-text`…).

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

### Environment

Nothing is required to run the site. Each variable turns on one feature; without it that feature
degrades honestly rather than faking success.

| Variable | Turns on | Without it |
| --- | --- | --- |
| `YOUTUBE_API_KEY` | Subscriber count via the Data API (`forHandle`) | Falls back to scraping the channel page — works today, breaks whenever YouTube changes its markup |
| `RESEND_API_KEY` + `CONTACT_TO` | Contact form delivery | The endpoint answers `503 not_configured` and the form tells the sender to use the social links instead |
| `CONTACT_FROM` | Custom sender address (must be a verified domain) | Uses Resend's shared onboarding sender |

Put them in `.env.local` (git-ignored).

## Arabic and RTL

The site is Arabic-only: `<html lang="ar" dir="rtl">`. Three rules earned the hard way:

- **No letter-spacing.** Arabic joins its letters, so `tracking-*` prises the glyphs apart. Every
  tracking utility was removed; the `.tracked` class exists for the Latin-only runs.
- **No `uppercase`, no italics.** Arabic has no case, and naskh has no true italic.
- **Isolate mixed runs.** A bare sequence of digits and Arabic letters gets reordered by the bidi
  algorithm. The countdown wraps each figure in `<bdi>`; Latin-digit runs use `.ltr-nums`.
  `flex-row-reverse` inside an RTL container flips *back* to left-to-right — a plain row is already
  RTL.

Faces are wired in [`app/fonts.ts`](app/fonts.ts) only: **Changa** (display), **Cairo** (UI),
**Rakkas** (pull quote). No component names a family directly.

## Architecture

`app/layout.tsx` holds the persistent game environment. Only `<PageTransition>{children}</PageTransition>`
changes on navigation.

```
BackgroundStage   the composited hero plate, crossfading per route
MainMenu          desktop column / mobile overlay, keyboard-driven
HUDTopCenter      live status, else the countdown to the next stream
HUDTopRight       rotating follower counter, milestone bar, clout stars
HUDBottomLeft     mini-map + current objective
HUDBottomRight    pull quote (desktop only)
HudInsets         measures the HUD, tells the content area its bounds
main              route content, pinned between the HUD bands
```

### `lib/routes.ts` is the single source of truth

One entry per route carries its menu label, page heading, HUD objective and mini-map waypoint. Add a
route there and the menu, objective box and mini-map all follow.

`label` and `tag` are kept **identical** so the menu and the page heading can never disagree — they
drifted once already. Pages read their heading with `getRoute(pathname)?.tag`.

### The content area is measured, not guessed

`main` is pinned between the HUD bands so content never scrolls underneath the HUD. Padding cannot
do this: it reserves room after the *last* line, while mid-scroll everything above still slides
under. The band sizes come from [`components/HudInsets.tsx`](components/HudInsets.tsx), which
measures every `[data-hud]` corner with a `ResizeObserver` — a hardcoded value broke as soon as one
route's objective wrapped to a third line.

### Keyboard navigation

**↑ ↓** move a cursor, **Enter** selects, **Home/End** jump, **Esc** closes the mobile overlay. In
RTL, **←** advances and **→** goes back. The highlight follows the *cursor*, not the route; the
active route keeps a dot once the cursor moves away.

## Data sources — what is live and what is not

Measured, not assumed:

| Source | Status | Notes |
| --- | --- | --- |
| YouTube subscribers | ✅ live | Data API with a key, else channel-page scrape |
| Discord members | ⚠️ needs a valid invite | The current invite is **expired**, so the count is 0 and the chip is hidden |
| Kick followers | ❌ manual | `kick.com/api/v2` answers **403** to server-side fetches — it fingerprints the TLS handshake, so no header set gets through. Hand-maintained in `lib/socials.ts` |
| Kick live status | ✅ live, client-side | The one thing that *does* work: the visitor's own browser can reach Kick, and CORS is permissive. See [`lib/useLive.ts`](lib/useLive.ts) |
| TikTok / Instagram | ❌ manual | JS shell / authed Graph token |
| Video lists, arcs, records | ❌ snapshot | Hand-copied 2026-09-20; each file says so at the top |

Making Kick's numbers live needs its official OAuth API and app credentials.

## Design-system lint

[`@shadcn/lint`](https://github.com/shadcn-ui/lint) runs with **all six rules** on, and the project
is clean. It exists because colours drifted: shadows and glows were hand-copied hex of tokens that
nothing kept in sync, which is why re-theming once meant editing ten files.

Consequently: no raw colours, no arbitrary values, no inline styles. Brand glows are built with
`color-mix()` **from** the colour tokens, so changing a colour moves its glow. Genuinely dynamic
values (a route's gradient, a platform's brand colour) pass through CSS custom properties, which the
rule accepts.

## Assets

```
public/assets/bg/    hero plate — one composited image, no baked-in UI
public/assets/ui/    logo
public/audio/        UI sound effects
```

The hero is **imported**, not referenced by path:

```ts
import heroPlate from "@/public/assets/bg/bg-hero.jpeg";
```

A string path is stable across edits, so replacing the file leaves every cached optimisation
pointing at the old bytes. An import is fingerprinted from the file's *content* — drop a new file on
top and it just appears. It is also served `unoptimized`: the sunset sky is a wide smooth gradient,
the worst case for a lossy encoder, and even quality 90 left visible banding.

## Still to fill in

- [ ] Arc summaries in `lib/arcs.ts` — every one is empty on purpose; the page shows a visible
      "لم يُكتب بعد" slot rather than an invented plot. The arc *groupings* are inferred from video
      titles and want confirming too.
- [ ] Career firsts on the milestones page (`محطات مهمة`)
- [ ] A working, never-expiring Discord invite
- [ ] TikTok + Instagram counts in `lib/socials.ts`
- [ ] A contact-form destination (Resend, or a Supabase table)
- [ ] `metadataBase` in `app/layout.tsx` — currently a guessed domain, affects share-card URLs
- [ ] A portrait hero plate for phones: the 16:9 plate loses ~75% of its width to the crop there
- [ ] Per-section background plates (every route shares the hero scene today)

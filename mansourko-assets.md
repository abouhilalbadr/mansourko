# ASSET MANAGEMENT & PLACEHOLDERS

All static assets must be organized within the Next.js `/public` directory. Since the final custom AI-generated artwork and custom fonts will be injected later, you must build a robust fallback system that prevents the UI from breaking.

## Directory Structure

Establish the following structure inside `/public`:

- `/public/assets/bg/` (For full-screen background images)
- `/public/assets/ui/` (For custom icons, map textures, weapon wheel items)
- `/public/fonts/` (For local GTA fonts)
- `/public/audio/` (For UI interaction sounds)

## 1. Background Art (The Hero Scenes)

- **Implementation:** The layout must support dynamic background swapping. When a user clicks a menu item, the background image should ideally crossfade to match the page context (e.g., `/kayan` shows a heist scene, `/setup` shows the PC rig).
- **Placeholder Protocol:** Until the final images are provided, use CSS linear gradients or high-quality Unsplash gaming/neon placeholders via Next.js `<Image src="https://source.unsplash.com/..." />`. Maintain a strict `16:9` aspect ratio container with `object-cover`.

## 2. Typography (The GTA Look)

- **Implementation:** The GTA aesthetic relies heavily on typography. The primary display font is a 'Pricedown' equivalent, and the secondary menu font is a clean, condensed sans-serif (like 'Chalet').
- **Placeholder Protocol:**
  - Configure `next/font/google` in `layout.tsx` to load **'Anton'** or **'Bebas Neue'** as the temporary primary display font (for "MANSOURKO" and large headers).
  - Load **'Inter'** or **'Roboto Condensed'** for the UI menus, stats, and body text.
  - Ensure the Tailwind configuration defines these as `font-gta` and `font-menu` so swapping to local files later requires zero component changes.

## 3. UI Icons & The Mini-Map

- **Implementation:** The HUD requires a circular mini-map (bottom left), weapon/gear icons (for `/setup`), and custom platform icons (Kick, YouTube, Discord).
- **Placeholder Protocol:**
  - Use **Lucide React** icons extensively for all UI elements (e.g., `<Crosshair />` for aim stats, `<Monitor />` for PC setup, `<Map />` for the mini-map).
  - Build the circular mini-map container with a solid border and a translucent dark background, placing a simple blinking dot (using Tailwind `animate-ping`) in the center to simulate player location.

## 4. Audio Cues (Optional but Recommended)

- **Implementation:** The portfolio should feel like a game menu.
- **Placeholder Protocol:** Build a utility function (e.g., `useAudio.ts`) that plays a short UI "click" or "hover" sound on interaction. Wrap the audio trigger in a conditional check to respect browser autoplay policies, and include a global "Mute" toggle in the `HUDTopRight` component. Leave the actual MP3 file paths pointing to empty strings or generic beep files until the final GTA sound effects are provided.

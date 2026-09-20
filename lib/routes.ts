import type { SceneLayerSpec } from "@/components/SceneLayer";
import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
/**
 * Scene art is IMPORTED, not referenced by path.
 *
 * A string path is stable across edits, so replacing the file leaves every
 * cached optimisation — the dev server's in-memory one especially — pointing
 * at the old bytes, and the site keeps serving art you already replaced. An
 * import is fingerprinted from the file's CONTENT, so new bytes mean a new
 * URL and the stale copy is unreachable by construction. Drop a new image on
 * top of this one and it just appears.
 */
import heroPlate from "@/public/assets/bg/bg-hero.jpeg";
import {
  Crosshair,
  Gamepad2,
  Radio,
  Trophy,
  User,
  Video,
} from "lucide-react";

export type AppRoute = {
  /** next/link href */
  href: string;
  /** Menu label. Kept identical to `tag` so the menu and the page
   *  heading can never disagree; only the hub differs, having no heading. */
  label: string;
  /** Short subtitle used as the page kicker */
  tag: string;
  /** Text piped into the HUDBottomLeft objective box for this route */
  objective: string;
  icon: LucideIcon;
  /**
   * Where this section sits on the mini-map. Coordinates are in the map's
   * 160x100 viewBox and snap to the street grid (multiples of 20, offset 10)
   * so the plotted route follows roads instead of cutting through blocks.
   */
  map: { x: number; y: number; distance: string };
  /**
   * Hero scene for this route. `gradient` is the always-available placeholder;
   * `image` is the plate in /public/assets/bg; `layers` are transparent
   * cutouts drawn over it, back to front.
   */
  scene: {
    gradient: string;
    image?: StaticImageData;
    layers?: SceneLayerSpec[];
  };
};

/**
 * The hero scene, shared by every route until each section gets its own plate.
 * Swap an individual route's `scene` for a bespoke one whenever the art lands.
 */
const HERO_SCENE: AppRoute["scene"] = {
  // One composited plate: the car and the character are painted into the art,
  // so there are no cutout layers to stack, light or align. The gradient below
  // is only the fallback the plate paints over, and follows its dusk-sky to
  // lit-horizon to dark-promenade fall.
  gradient:
    "linear-gradient(180deg,#2b2740 0%,#5b4258 34%,#c9743c 58%,#e2913f 66%,#3a2a2c 82%,#1b1518 100%)",
  image: heroPlate,
};

export const ROUTES: AppRoute[] = [
  {
    href: "/",
    label: "ابدأ البث",
    tag: "مركز منصور الدشاش",
    objective: "القصة بدأت للتو...",
    icon: Gamepad2,
    map: { x: 130, y: 30, distance: "1.2 كم" },
    scene: HERO_SCENE,
  },
  {
    href: "/about",
    label: "ملف الشخصية",
    tag: "ملف الشخصية",
    objective: "اطّلع على ملف الشخصية.",
    icon: User,
    map: { x: 110, y: 30, distance: "0.9 كم" },
    scene: HERO_SCENE,
  },
  {
    href: "/streams",
    label: "الفيديوهات",
    tag: "الفيديوهات",
    objective: "افتح الفيديوهات واختر تسجيلاً.",
    icon: Video,
    map: { x: 90, y: 10, distance: "1.7 كم" },
    scene: HERO_SCENE,
  },
  {
    href: "/kayan",
    label: "أرشيف كيان",
    tag: "أرشيف كيان",
    objective: "راجع القصص السابقة.",
    icon: Crosshair,
    map: { x: 150, y: 50, distance: "3.1 كم" },
    scene: HERO_SCENE,
  },
  {
    href: "/milestones",
    label: "الإنجازات",
    tag: "الإنجازات",
    objective: "تصفّح الإنجازات المفتوحة.",
    icon: Trophy,
    map: { x: 110, y: 70, distance: "0.6 كم" },
    scene: HERO_SCENE,
  },
  {
    href: "/contact",
    label: "اتصال آمن",
    tag: "اتصال آمن",
    objective: "افتح خطاً آمناً على الدارك شات.",
    icon: Radio,
    map: { x: 130, y: 90, distance: "1.4 كم" },
    scene: HERO_SCENE,
  },
];

const DEFAULT_OBJECTIVE = "تجوّل حر. لا توجد مهمة نشطة.";

const FALLBACK_MAP: AppRoute["map"] = { x: 130, y: 30, distance: "-- كم" };

export function getMapTarget(pathname: string): AppRoute["map"] {
  return getRoute(pathname)?.map ?? FALLBACK_MAP;
}

const FALLBACK_SCENE: AppRoute["scene"] = {
  gradient: "linear-gradient(180deg,#2b2740 0%,#a85f3e 58%,#1b1518 100%)",
};

/** Resolve the route entry for a pathname (longest matching prefix wins). */
export function getRoute(pathname: string): AppRoute | undefined {
  return (
    ROUTES.find((r) => r.href === pathname) ??
    ROUTES.filter((r) => r.href !== "/")
      .sort((a, b) => b.href.length - a.href.length)
      .find((r) => pathname.startsWith(`${r.href}/`))
  );
}

export function getObjective(pathname: string): string {
  return getRoute(pathname)?.objective ?? DEFAULT_OBJECTIVE;
}

export function getScene(pathname: string): AppRoute["scene"] {
  return getRoute(pathname)?.scene ?? FALLBACK_SCENE;
}

/** True when `href` is the active route for `pathname`. */
export function isActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

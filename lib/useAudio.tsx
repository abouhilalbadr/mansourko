"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * UI sound effects.
 *
 * Clips are peak-normalised to about -1 dBFS, so the mix is set here rather
 * than baked into the files — easier to retune. Hover fires on every menu item
 * you sweep past, so it sits well under the others on purpose.
 *
 * An empty `src` makes `play()` a no-op, so a missing clip is never an error.
 */
export const SOUNDS = {
  hover: { src: "/audio/hover.mp3", volume: 0.22 },
  click: { src: "/audio/click.mp3", volume: 0.5 },
  back: { src: "/audio/back.mp3", volume: 0.4 },
} as const;

export type SoundName = keyof typeof SOUNDS;

const STORAGE_KEY = "mansourko:muted";
/** Fired on ourselves after a write, since `storage` only reaches OTHER tabs. */
const MUTE_EVENT = "mansourko:muted-changed";

/**
 * The mute flag lives in localStorage, which makes it external state rather
 * than React state — so it is read through useSyncExternalStore instead of
 * being copied into a useState inside an effect. That copy was the bug: it
 * rendered once unmuted, then re-rendered, and the speaker icon visibly
 * flipped on load. Subscribing also keeps two open tabs in agreement.
 */
function subscribeMuted(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(MUTE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(MUTE_EVENT, onChange);
  };
}

/** Stands in for storage when it throws, so muting still works in a private
 *  window — it just will not survive a reload. */
let mutedFallback = false;

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return mutedFallback;
  }
}

/** The server cannot know, and React uses this for the hydrating render. */
const readMutedOnServer = () => false;

type AudioApi = {
  muted: boolean;
  toggleMute: () => void;
  play: (name: SoundName) => void;
};

const AudioContext = createContext<AudioApi | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const muted = useSyncExternalStore(
    subscribeMuted,
    readMuted,
    readMutedOnServer,
  );
  // Browsers block audio until the user has interacted with the document.
  const unlocked = useRef(false);
  const cache = useRef(new Map<SoundName, HTMLAudioElement>());

  useEffect(() => {
    const unlock = () => {
      unlocked.current = true;
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const next = !readMuted();
    mutedFallback = next;
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Non-fatal: the fallback above carries the toggle for this session.
    }
    window.dispatchEvent(new Event(MUTE_EVENT));
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      const { src, volume } = SOUNDS[name];
      if (!src || muted || !unlocked.current) return;

      let el = cache.current.get(name);
      if (!el) {
        el = new Audio(src);
        el.volume = volume;
        cache.current.set(name, el);
      }
      el.currentTime = 0;
      // Autoplay rejection is expected and harmless — swallow it.
      void el.play().catch(() => {});
    },
    [muted],
  );

  const value = useMemo(
    () => ({ muted, toggleMute, play }),
    [muted, toggleMute, play],
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio(): AudioApi {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

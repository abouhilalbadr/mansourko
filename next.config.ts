import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * The hero plate bypasses this entirely (`unoptimized` in
     * BackgroundStage) and ships as authored: its sunset sky is a wide smooth
     * gradient, the worst case for a lossy encoder, and even quality 90 left
     * banding across it. That costs the full 2.4 MB on first load — a real
     * price, paid deliberately for the one image the whole page is.
     *
     * Everything else still goes through the optimiser. 90 stays allowed for
     * any future art that needs it without going all the way to unoptimised.
     */
    qualities: [75, 90],
    /* Video thumbnails come from the platforms themselves. */
    remotePatterns: [
      { protocol: "https", hostname: "images.kick.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;

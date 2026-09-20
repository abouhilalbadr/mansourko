"use client";

import SocialStats from "@/components/hud/SocialStats";

export default function HUDTopRight() {
  return (
    <div data-hud className="fixed end-4 bottom-4 z-40 select-none lg:top-6 lg:end-8 lg:bottom-auto">
      <SocialStats />
    </div>
  );
}

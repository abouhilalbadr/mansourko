import type { Metadata } from "next";
import BackgroundStage from "@/components/BackgroundStage";
import MainMenu from "@/components/MainMenu";
import PageTransition from "@/components/PageTransition";
import HUDBottomLeft from "@/components/hud/HUDBottomLeft";
import HUDBottomRight from "@/components/hud/HUDBottomRight";
import HUDTopCenter from "@/components/hud/HUDTopCenter";
import HUDTopRight from "@/components/hud/HUDTopRight";
import HudInsets from "@/components/HudInsets";
import { AudioProvider } from "@/lib/useAudio";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mansourko.com"),
  title: {
    default: "منصور الدشاش",
    // Interior pages set their own title and inherit the name.
    template: "%s — منصور الدشاش",
  },
  description:
    "الموقع الرسمي لمنصور الدشاش — صانع محتوى وستريمر. قصص الرول بلاي والبثوث والإنجازات وأماكن متابعته، معروضة كقائمة إيقاف مؤقت.",
  keywords: [
    "منصور الدشاش",
    // The handle he is known by on every platform — still what people type.
    "منصوركو",
    "Mansourko",
    "صانع محتوى",
    "ستريمر",
    "رول بلاي",
    "جي تي إيه",
    "كيك",
    "يوتيوب",
  ],
  authors: [{ name: "منصور الدشاش" }],
  creator: "منصور الدشاش",
  openGraph: {
    type: "profile",
    locale: "ar",
    title: "منصور الدشاش — صانع محتوى وستريمر ولاعب رول بلاي",
    description: "قصص الرول بلاي والبثوث والإنجازات وأماكن متابعته.",
    siteName: "منصور الدشاش",
    images: [{ url: "/assets/bg/hub.jpg", width: 2560, height: 1440 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصور الدشاش — صانع محتوى وستريمر ولاعب رول بلاي",
    description: "قصص الرول بلاي والبثوث والإنجازات وأماكن متابعته.",
    images: ["/assets/bg/hub.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body className="antialiased">
        <AudioProvider>
          {/* Persistent game environment — never remounts on navigation */}
          <BackgroundStage />

          {/* Measures the HUD so the content area knows where it may live. */}
          <HudInsets />

          {/* Persistent HUD */}
          <MainMenu />
          <HUDTopCenter />
          <HUDTopRight />
          <HUDBottomLeft />
          <HUDBottomRight />

          {/* Route content — the only thing that changes */}
          {/* The scroll area is pinned BETWEEN the HUD bands at every size, so
              content never passes under the HUD — it simply ends where the HUD
              begins. Padding alone could not do this: it reserves room after
              the LAST line, while mid-scroll the text still slid underneath. */}
          <main className="hud-inset fixed inset-x-0 z-30 overflow-y-auto gta-scroll px-4 py-2 lg:px-0 lg:pe-10 lg:ps-menu-gutter xl:ps-136">
            <PageTransition>{children}</PageTransition>
          </main>
        </AudioProvider>
      </body>
    </html>
  );
}

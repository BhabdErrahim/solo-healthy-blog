// client/src/app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SEO AUDIT FIXES:
//  ① metadataBase — makes all relative OG/Twitter image URLs absolute
//  ② Extended robots directives — max-snippet, max-image-preview for Google
//  ③ Global OpenGraph + Twitter defaults — any page without its own inherits
//  ④ Preconnect + DNS-prefetch for Cloudinary / Unsplash performance
//  ⑤ manifest + theme-color for PWA/mobile
//  ⑥ Verification placeholders (Google / Bing)
// ─────────────────────────────────────────────────────────────────────────────
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

import { SITE_URL } from "@/lib/config";
export const SITE_NAME = "SoloLife";
const OG_IMAGE = `${SITE_URL}/og-default.jpg`; // 1200×630 fallback

export const metadata: Metadata = {
  // ── 1. metadataBase is REQUIRED so relative URLs become absolute ──────────
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SoloLife | The Ultimate Guide to Solo Living, Travel & Wellness",
    template: "%s | SoloLife",
  },
  description:
    "Master the art of independent living with SoloLife. Discover expert advice on solo travel, cooking for one, home organization, and building healthy habits alone.",
  alternates: { canonical: SITE_URL },
  keywords: [
    "solo living",
    "independent lifestyle",
    "living alone tips",
    "cooking for one",
    "solo travel destinations",
    "healthy habits for singles",
    "solo wellness",
  ],
  authors: [{ name: "SoloLife Editorial", url: SITE_URL }],
  creator: "SoloLife",
  publisher: "SoloLife",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SoloLife | The Ultimate Guide to Solo Living",
    description:
      "Master the art of independent living. Expert advice on solo travel, cooking for one, and building healthy habits.",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "SoloLife Platform" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SoloLifeOS",
    title: "SoloLife | The Ultimate Guide to Solo Living",
    description:
      "Master the art of independent living. Expert advice on solo travel, cooking for one, and building healthy habits.",
    images: [OG_IMAGE],
  },

  // ── 11. PWA manifest ──────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── 12. Verification (replace values with real codes) ────────────────────
  verification: {
    google: "REPLACE_WITH_GOOGLE_VERIFICATION_CODE",
    // bing: "REPLACE_WITH_BING_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Performance: preconnect to image CDNs used across the site */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Theme colour for mobile browser chrome */}
        <meta name="theme-color" content="#114AB1" />
      </head>
      <body className="flex flex-col min-h-screen">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

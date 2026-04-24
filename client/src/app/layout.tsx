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

import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

export const SITE_URL = "https://sololife-six.vercel.app";
export const SITE_NAME = "SoloLife";
const OG_IMAGE = `${SITE_URL}/og-default.jpg`; // 1200×630 fallback

export const metadata: Metadata = {
  // ── 1. metadataBase is REQUIRED so relative URLs become absolute ──────────
  metadataBase: new URL(SITE_URL),

  // ── 2. Title template so every page auto-appends brand ────────────────────
  title: {
    default: "SoloLife | The Modern Solo-Living Platform",
    template: "%s | SoloLife",
  },

  // ── 3. Description — 150-160 chars, keyword-rich ──────────────────────────
  description:
    "Master the art of solo living. Expert guides on healthy habits, solo travel, gourmet recipes for one, fitness, and home organisation for independent people.",

  // ── 4. Canonical + alternates ─────────────────────────────────────────────
  alternates: { canonical: SITE_URL },

  // ── 5. Keywords (used by Bing; ignored by Google but harmless) ────────────
  keywords: [
    "solo living",
    "healthy habits",
    "solo travel",
    "recipes for one",
    "solo fitness",
    "independent lifestyle",
    "living alone tips",
  ],

  // ── 6. Authorship ─────────────────────────────────────────────────────────
  authors: [{ name: "SoloLife Editorial", url: SITE_URL }],
  creator: "SoloLife",
  publisher: "SoloLife",

  // ── 7. Robots — tell Google to index everything and show rich snippets ────
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

  // ── 8. Open Graph defaults ────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SoloLife | The Modern Solo-Living Platform",
    description:
      "Master the art of solo living. Expert guides on healthy habits, solo travel, gourmet recipes, and fitness for independent people.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "SoloLife Platform" }],
  },

  // ── 9. Twitter Card defaults ──────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@SoloLifeOS",
    creator: "@SoloLifeOS",
    title: "SoloLife | The Modern Solo-Living Platform",
    description:
      "Master the art of solo living. Expert guides on healthy habits, solo travel, gourmet recipes, and fitness.",
    images: [OG_IMAGE],
  },

  // ── 10. Icons ─────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  // ── 11. PWA manifest ──────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── 12. Verification (replace values with real codes) ────────────────────
  verification: {
    google: "REPLACE_WITH_GOOGLE_VERIFICATION_CODE",
    // bing: "REPLACE_WITH_BING_VERIFICATION_CODE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
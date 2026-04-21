// ✅ FIX: Root layout must be a Server Component (no "use client").
// "use client" here causes Next.js App Router to lose proper Server Component
// rendering for child pages, breaking async data fetching in dynamic routes.
// The pathname-based conditional is moved to <LayoutWrapper> (a Client Component).

import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SoloLife OS | The Modern Solo-Living Platform",
    template: "%s | SoloLife",
  },
  description:"Master the art of solo living through healthy habits, mindful travel, and curated recipes for one.",
  icons: {
    icon: '/favicon.ico', // Standard
    apple: '/apple-touch-icon.png', // For iPhone bookmarks
  },

  };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
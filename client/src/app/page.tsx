// client/src/app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SEO AUDIT FIXES (Home Page):
//  ① Exported `metadata` with canonical, OG type=website, itemList keywords
//  ② WebSite JSON-LD schema with SearchAction (enables Google Sitelinks Search)
//  ③ Organization JSON-LD schema (Knowledge Panel eligibility)
//  ④ ItemList JSON-LD of recent articles (rich results in Google Discover)
//  ⑤ ISR revalidation so sitemap stays fresh
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import HomeHero from "@/components/HomeHero";
import RecentArticles from "@/components/RecentArticles";
import PopularArticles from "@/components/PopularArticles";
import DiscoveryGrid from "@/components/DiscoveryGrid";
import { getArticles } from "@/lib/api";
import { getFullImageUrl } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ── ISR: rebuild this page every 60 s in the background ──────────────────────
export const revalidate = 60;

const SITE_URL = "https://sololife-six.vercel.app";

// ── Page-level metadata (merges with / overrides layout.tsx defaults) ─────────
export const metadata: Metadata = {
  // Explicit canonical for home page
  alternates: { canonical: SITE_URL },

  // Reinforce title without template suffix for home
  title: "SoloLife | Independent Living Guides — Habits, Travel, Food & Fitness",

  description:
    "SoloLife is the #1 platform for independent living. Discover expert guides on healthy habits, solo travel, gourmet recipes for one, and solo fitness — built for people who live life on their own terms.",

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "SoloLife | Independent Living Guides — Habits, Travel, Food & Fitness",
    description:
      "Expert guides on healthy habits, solo travel, gourmet recipes for one, and solo fitness for independent people.",
  },

  twitter: {
    title: "SoloLife | Independent Living Guides",
    description:
      "Expert guides on healthy habits, solo travel, gourmet recipes for one, and solo fitness.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "SoloLife",
    url: SITE_URL,
    description:
      "Expert guides on healthy habits, solo travel, gourmet recipes for one, and solo fitness for independent people.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    // SearchAction enables the Google Sitelinks Search Box in SERPs
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "SoloLife",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      // Add your real social profile URLs here
      "https://twitter.com/SoloLifeOS",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@sololife.com",
    },
  };
}

function buildItemListSchema(articles: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Solo-Living Guides",
    url: SITE_URL,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/article/${article.slug}`,
      name: article.title,
      image: getFullImageUrl(article.thumbnail) || undefined,
      description: article.excerpt,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default async function Home() {
  const allArticles = await getArticles();

  if (!allArticles || allArticles.length === 0) {
    return (
      <main className="bg-white min-h-screen">
        <HomeHero />
        <div className="py-40 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-black text-brand-deep uppercase tracking-widest opacity-30">
            SoloLife OS Initializing...
          </h2>
          <p className="text-brand-muted mt-2">
            Deploy your first cornerstone in the dashboard to go live.
          </p>
        </div>
      </main>
    );
  }

  const recent = allArticles.slice(0, 3);
  const recentIds = recent.map((a: any) => a.id);

  let popular = allArticles.filter(
    (a: any) => a.featured && !recentIds.includes(a.id)
  );
  if (popular.length === 0) {
    popular = allArticles
      .filter((a: any) => !recentIds.includes(a.id))
      .slice(0, 4);
  } else {
    popular = popular.slice(0, 4);
  }
  const popularIds = popular.map((a: any) => a.id);

  let mixed = allArticles.filter(
    (a: any) => !recentIds.includes(a.id) && !popularIds.includes(a.id)
  );
  if (mixed.length < 5) {
    mixed = [...allArticles].sort(() => 0.5 - Math.random()).slice(0, 5);
  } else {
    mixed = mixed.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  // ── JSON-LD schemas ────────────────────────────────────────────────────────
  const websiteSchema = buildWebSiteSchema();
  const orgSchema = buildOrganizationSchema();
  const itemListSchema = buildItemListSchema(recent);

  return (
    <>
      {/* ── Inject all three schemas in one <script> block ───────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, orgSchema, itemListSchema]),
        }}
      />

      <main className="bg-white min-h-screen">
        <HomeHero />

        {/* TRANSITION NAV BAR */}
        <nav aria-label="Content categories" className="border-y border-gray-100 bg-gray-50/50 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
            <div className="flex gap-10">
              {[
                { label: "Healthy", slug: "healthy" },
                { label: "Traveling", slug: "traveling" },
                { label: "Solo-Living", slug: "solo-living" },
                { label: "Sport", slug: "sport" },
                { label: "Recipes", slug: "food-recipes" },
              ].map(({ label, slug }) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted hover:text-brand-orange transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-brand-deep font-bold text-sm">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              Sovereign Strategies for the Independent Life
            </div>
          </div>
        </nav>

        {/* RECENT SECTION */}
        <section aria-label="Recent articles" className="relative py-24 overflow-hidden">
          <div className="absolute top-10 left-0 text-[15rem] font-black text-gray-50 select-none -z-10 leading-none">
            NEW
          </div>
          <RecentArticles articles={recent} />
        </section>

        {/* POPULAR SECTION */}
        {popular.length > 0 && (
          <section aria-label="Popular articles" className="px-0 md:px-6">
            <div className="rounded-none md:rounded-[5rem] overflow-hidden shadow-2xl">
              <PopularArticles articles={popular} />
            </div>
          </section>
        )}

        {/* DISCOVERY SECTION */}
        <section aria-label="Discover more" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-black text-brand-deep leading-tight">
                  Curated for <br />
                  <span className="text-brand-orange">Independent Minds</span>
                </h2>
              </div>
            </div>

            <DiscoveryGrid articles={mixed} />

            {/* Newsletter Footer Teaser */}
            <div className="mt-32 p-12 md:p-20 bg-gray-50 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-md">
                <h3 className="text-3xl font-black text-brand-deep mb-4">
                  The Solo Edit
                </h3>
                <p className="text-brand-muted">
                  Get a weekly curation of the 5 most important strategies for
                  solo living.
                </p>
              </div>
              <div className="flex w-full md:w-auto gap-4">
                <input
                  type="email"
                  placeholder="email@example.com"
                  aria-label="Email address for newsletter"
                  className="flex-grow md:w-80 p-5 rounded-2xl border border-gray-200"
                />
                <button className="bg-brand-deep text-white px-8 py-5 rounded-2xl font-bold hover:bg-brand-orange transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="pb-20" />
      </main>
    </>
  );
}
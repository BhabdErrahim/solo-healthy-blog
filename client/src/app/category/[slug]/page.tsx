// client/src/app/category/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SEO AUDIT FIXES (Category Page) — was ZERO metadata, now fully optimised:
//  ① generateStaticParams — pre-render all 5 category pages at build time
//  ② revalidate = 60 — ISR so new articles appear within 60 s
//  ③ generateMetadata — unique title, description, canonical, OG for each cat
//  ④ JSON-LD CollectionPage — signals to Google this is a topic hub
//  ⑤ JSON-LD BreadcrumbList — breadcrumb rich result in SERPs
//  ⑥ JSON-LD ItemList — article list rich result in Google Discover
//  ⑦ Semantic <header>, <nav>, <main>, <section>, <article> structure
//  ⑧ Visible breadcrumb trail for both users and crawlers
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { getArticles, getCategories } from "@/lib/api";
import { getFullImageUrl } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { Heart, Globe, Home, Activity, Utensils } from "lucide-react";

// ─── ISR ─────────────────────────────────────────────────────────────────────
export const revalidate = 60;
export const dynamicParams = true;

const SITE_URL = "https://sololife-six.vercel.app";

// ─── Static generation: pre-build all known category slugs ───────────────────
export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat: { slug: string }) => ({ slug: cat.slug }));
  } catch {
    // Fallback to known slugs if API is unreachable during build
    return [
      { slug: "healthy" },
      { slug: "traveling" },
      { slug: "solo-living" },
      { slug: "sport" },
      { slug: "food-recipes" },
    ];
  }
}

// ─── Per-category style and copy map ─────────────────────────────────────────
interface CategoryStyle {
  title: string;
  h1: string;
  subtitle: string;
  description: string; // for meta description (150-160 chars)
  keywords: string[];
  bgColor: string;
  accentColor: string;
  icon: React.ReactNode;
  heroImage: string;
  ogImage?: string;
}

const categoryStyles: Record<string, CategoryStyle> = {
  healthy: {
    title: "Healthy Habits for Solo Living",
    h1: "Healthy Habits",
    subtitle:
      "Neuroscience-backed routines and longevity strategies designed for the independent lifestyle.",
    description:
      "Discover expert healthy habit guides for solo living. Neuroscience-backed routines, morning rituals, and longevity strategies tailored for independent people.",
    keywords: ["healthy habits", "solo wellness", "longevity", "morning routine", "independent health"],
    bgColor: "bg-emerald-50",
    accentColor: "text-emerald-600",
    icon: <Heart className="w-12 h-12 text-emerald-500" aria-hidden="true" />,
    heroImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200",
  },
  traveling: {
    title: "Solo Travel Guides & Tips",
    h1: "Solo Traveling",
    subtitle:
      "Tactical logistics, safety protocols, and destination playbooks for the world-class solo explorer.",
    description:
      "Expert solo travel guides covering safety, packing, budgeting, and the best destinations for independent travellers. Plan your next solo adventure today.",
    keywords: ["solo travel", "solo trip planning", "travel safety", "one-bag travel", "solo destinations"],
    bgColor: "bg-blue-50",
    accentColor: "text-brand-deep",
    icon: <Globe className="w-12 h-12 text-brand-deep" aria-hidden="true" />,
    heroImage:
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=1200",
  },
  "solo-living": {
    title: "Solo Living Tips — Home & Independence",
    h1: "Solo Living",
    subtitle:
      "Home engineering, financial mastery, and organisation systems for the single-person household.",
    description:
      "Master solo living with expert guides on home organisation, financial independence, minimalism, and building a life that works perfectly for one person.",
    keywords: ["solo living tips", "living alone", "home organisation", "financial independence", "minimalism"],
    bgColor: "bg-orange-50",
    accentColor: "text-brand-orange",
    icon: <Home className="w-12 h-12 text-brand-orange" aria-hidden="true" />,
    heroImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
  },
  sport: {
    title: "Solo Fitness & Sport Guides",
    h1: "Sport & Fitness",
    subtitle:
      "Autonomous motivation systems, training plans, and performance frameworks for the independent athlete.",
    description:
      "Solo fitness guides covering home workouts, running plans, strength training, and motivation systems for independent athletes who train without a gym buddy.",
    keywords: ["solo fitness", "home workout", "independent training", "running solo", "strength training alone"],
    bgColor: "bg-slate-100",
    accentColor: "text-brand-deep",
    icon: <Activity className="w-12 h-12 text-brand-orange" aria-hidden="true" />,
    heroImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200",
  },
  "food-recipes": {
    title: "Recipes for One — Gourmet Solo Cooking",
    h1: "Food for One",
    subtitle:
      "Zero-waste culinary engineering and gourmet meal ideas designed specifically for the solo table.",
    description:
      "Discover gourmet recipes for one person. Zero-waste cooking guides, meal prep strategies, and chef-quality meals designed specifically for the solo kitchen.",
    keywords: ["recipes for one", "cooking for one", "solo meal prep", "gourmet single serving", "single person cooking"],
    bgColor: "bg-amber-50",
    accentColor: "text-orange-800",
    icon: <Utensils className="w-12 h-12 text-orange-600" aria-hidden="true" />,
    heroImage:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200",
  },
};

// Generic fallback for unknown category slugs
function buildFallbackStyle(slug: string): CategoryStyle {
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} — SoloLife`,
    h1: title,
    subtitle: `Expert guides on ${title.toLowerCase()} for independent people.`,
    description: `Explore SoloLife's expert collection on ${title.toLowerCase()} — practical strategies for the independent lifestyle.`,
    keywords: [title.toLowerCase(), "solo living", "independent lifestyle"],
    bgColor: "bg-gray-50",
    accentColor: "text-brand-deep",
    icon: <Heart className="w-12 h-12 text-brand-orange" aria-hidden="true" />,
    heroImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80",
  };
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const style = categoryStyles[slug] ?? buildFallbackStyle(slug);
  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  return {
    title: style.title,
    description: style.description,
    keywords: style.keywords,

    alternates: { canonical: canonicalUrl },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: style.title,
      description: style.description,
      siteName: "SoloLife",
      locale: "en_US",
      images: style.heroImage
        ? [
            {
              url: style.heroImage,
              width: 1200,
              height: 630,
              alt: style.title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      site: "@SoloLifeOS",
      title: style.title,
      description: style.description,
      images: style.heroImage ? [style.heroImage] : [],
    },
  };
}

// ─── Page component ───────────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const style = categoryStyles[slug] ?? buildFallbackStyle(slug);
  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  // Filter articles safely
  const filteredArticles = articles.filter((a: any) => {
    const articleSlug = a?.category?.slug;
    if (!articleSlug) return false;
    const urlSlug = slug.toLowerCase();
    const dbSlug = articleSlug.toLowerCase();
    return dbSlug === urlSlug || dbSlug.includes(urlSlug) || urlSlug.includes(dbSlug);
  });

  // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: style.h1, item: canonicalUrl },
    ],
  };

  // ── JSON-LD: CollectionPage (topic hub) ───────────────────────────────────
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonicalUrl,
    name: style.title,
    description: style.description,
    url: canonicalUrl,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "SoloLife",
    },
    image: style.heroImage
      ? { "@type": "ImageObject", url: style.heroImage }
      : undefined,
    // List all articles as hasPart
    hasPart: filteredArticles.map((a: any) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/article/${a.slug}`,
      image: getFullImageUrl(a.thumbnail) || undefined,
      datePublished: a.created_at,
      description: a.excerpt,
    })),
  };

  // ── JSON-LD: ItemList (for Google Discover cards) ─────────────────────────
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: style.title,
    url: canonicalUrl,
    numberOfItems: filteredArticles.length,
    itemListElement: filteredArticles.slice(0, 10).map((a: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/article/${a.slug}`,
      name: a.title,
      image: getFullImageUrl(a.thumbnail) || undefined,
    })),
  };

  return (
    <>
      {/* ── Structured data ──────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema,
            collectionPageSchema,
            itemListSchema,
          ]),
        }}
      />

      <main className="min-h-screen bg-white">
        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <header className={`${style.bgColor} py-20 px-6 overflow-hidden relative`}>
          {/* Visible breadcrumb (also parsed by crawlers) */}
          <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto mb-10">
            <ol className="flex items-center gap-2 text-sm text-brand-muted">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li className="text-brand-deep font-semibold">{style.h1}</li>
            </ol>
          </nav>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1">
              <div className="mb-4">{style.icon}</div>
              <h1
                className={`text-6xl font-black ${style.accentColor} mb-6 leading-tight`}
              >
                {style.h1}
              </h1>
              <p className="text-xl text-brand-muted max-w-lg leading-relaxed mb-4">
                {style.subtitle}
              </p>
              <p className="text-brand-muted text-sm font-bold uppercase tracking-widest">
                {filteredArticles.length}{" "}
                {filteredArticles.length === 1 ? "Guide" : "Guides"} published
              </p>
            </div>

            {/* Hero image with explicit dims to prevent CLS */}
            <div className="flex-1 w-full h-[400px]">
              <img
                src={style.heroImage}
                className="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                alt={`${style.h1} — SoloLife`}
                width={600}
                height={400}
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </div>
        </header>

        {/* ── ARTICLE GRID SECTION ─────────────────────────────────────────── */}
        <section
          aria-label={`${style.h1} articles`}
          className="max-w-7xl mx-auto py-24 px-6"
        >
          {/* Section heading for crawlers */}
          <h2 className="sr-only">All {style.h1} Articles</h2>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredArticles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[4rem] bg-gray-50/50">
              <h2 className="text-3xl font-black text-brand-deep opacity-20">
                Coming Soon
              </h2>
              <p className="text-brand-muted mt-2">
                We are currently drafting new strategies for this category.
              </p>
              <Link
                href="/"
                className="mt-8 inline-block bg-brand-orange text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-deep transition"
              >
                Explore Other Guides
              </Link>
            </div>
          )}
        </section>

        {/* ── INTERNAL LINKS to other categories (helps crawlers discover all) */}
        <aside
          aria-label="Browse other categories"
          className="bg-gray-50 py-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-brand-deep mb-8 text-center">
              Explore Other Pillars
            </h2>
            <nav className="flex flex-wrap justify-center gap-4">
              {Object.entries(categoryStyles)
                .filter(([s]) => s !== slug)
                .map(([s, cat]) => (
                  <Link
                    key={s}
                    href={`/category/${s}`}
                    className="px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm font-bold text-brand-deep hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all text-sm"
                  >
                    {cat.h1}
                  </Link>
                ))}
            </nav>
          </div>
        </aside>
      </main>
    </>
  );
}
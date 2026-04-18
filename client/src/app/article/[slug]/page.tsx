// client/src/app/article/[slug]/page.tsx
//
// ✅ FIX 1 – generateStaticParams
//   Without this, Next.js renders every article page DYNAMICALLY (on each request).
//   If the backend API is unreachable at request time → getArticleBySlug returns null
//   → "Article not found", even though the home page shows cards from the build cache.
//
//   generateStaticParams tells Next.js to PRE-RENDER all known articles at build time.
//   dynamicParams = true means unknown slugs (new articles added after deploy) still
//   work — they just get rendered on first request and cached afterward.
//
// ✅ FIX 2 – revalidate = 60
//   ISR (Incremental Static Regeneration): cached pages are rebuilt every 60 s in the
//   background. Visitors always get a fast cached response.

import { getArticleBySlug, getArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Clock, User, Calendar, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/utils";

// ─── Static generation ────────────────────────────────────────────────────────

export const revalidate = 60; // Rebuild cached pages every 60 s (ISR)
export const dynamicParams = true; // Allow slugs not in generateStaticParams

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article: { slug: string }) => ({ slug: article.slug }));
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found | SoloLife" };

  return {
    title: `${article.title} | SoloLife`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: getFullImageUrl(article.thumbnail) ?? "",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.created_at,
      authors: [article.author?.username ?? "SoloLife"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [getFullImageUrl(article.thumbnail) ?? ""],
    },
    alternates: {
      canonical: `https://sololife-six.vercel.app/article/${slug}`,
    },
  };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-4xl font-black text-brand-deep">Article Not Found</h1>
        <p className="text-brand-muted max-w-md">
          This article doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="mt-4 bg-brand-orange text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-deep transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sololife-six.vercel.app/article/${article.slug}`,
    },
    headline: article.title,
    description: article.excerpt,
    image: getFullImageUrl(article.thumbnail),
    author: { "@type": "Person", name: article.author?.username ?? "SoloLife" },
    publisher: {
      "@type": "Organization",
      name: "SoloLife",
      logo: {
        "@type": "ImageObject",
        url: "https://sololife-six.vercel.app/logo.png",
      },
    },
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
  };

  const safeHtml = article.content.trim().replace(/\n{3,}/g, "\n\n");
  const thumbnailUrl = getFullImageUrl(article.thumbnail) ?? "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white pb-20">
        <header className="pt-16 pb-8 px-6 max-w-4xl mx-auto text-center">
          <Link
            href={`/category/${article.category.slug}`}
            className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 inline-block hover:underline"
          >
            {article.category.name}
          </Link>

          <h1 className="text-4xl md:text-6xl font-black text-brand-deep mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-brand-muted text-sm border-y border-gray-100 py-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-brand-orange" />
              <span className="font-semibold text-brand-deep">
                {article.author?.username ?? "SoloLife"}
              </span>
            </div>
            <div className="flex items-center gap-2" suppressHydrationWarning>
              <Calendar size={16} />
              <span suppressHydrationWarning>
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>8 min read</span>
            </div>
          </div>
        </header>

        {thumbnailUrl && (
          <div className="max-w-6xl mx-auto px-6 mb-16">
            <img
              src={thumbnailUrl}
              alt={article.title}
              className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <article className="lg:col-span-8" suppressHydrationWarning>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
              <span className="font-bold text-brand-deep">Share this insight:</span>
              <button
                className="p-3 bg-gray-50 rounded-full hover:bg-brand-orange hover:text-white transition"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
              <button
                className="p-3 bg-gray-50 rounded-full hover:bg-brand-deep hover:text-white transition"
                aria-label="Bookmark"
              >
                <Bookmark size={20} />
              </button>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-28">
              <div className="bg-brand-deep rounded-[2.5rem] p-8 text-white mb-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4">The Solo Journey Map</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Explore connections between{" "}
                  <strong>{article.category.name}</strong> and your lifestyle.
                </p>
                <div className="space-y-4">
                  {article.related_articles?.map((rel: any) => {
                    const relThumb = getFullImageUrl(rel.thumbnail) ?? "";
                    return (
                      <Link
                        key={rel.id}
                        href={`/article/${rel.slug}`}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/5"
                      >
                        {relThumb && (
                          <img
                            src={relThumb}
                            className="w-16 h-16 rounded-xl object-cover"
                            alt={rel.title}
                          />
                        )}
                        <div>
                          <h4 className="text-sm font-bold leading-tight line-clamp-2">
                            {rel.title}
                          </h4>
                          <span className="text-[10px] text-brand-orange uppercase font-bold tracking-widest">
                            {rel.category?.name}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 text-center">
                <h4 className="text-xl font-bold text-brand-deep mb-2">
                  Weekly Solo-Tips
                </h4>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-4 rounded-2xl mb-4 border border-orange-200 outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <button className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-brand-deep transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
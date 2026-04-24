// client/src/app/article/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SEO AUDIT FIXES (Article Detail):
//  ① generateMetadata — added articleSection, keywords, reading time estimate
//  ② JSON-LD BlogPosting — added wordCount estimate, articleSection, inLanguage,
//     speakable, copyrightYear
//  ③ JSON-LD BreadcrumbList — enables Google breadcrumb display in SERPs
//  ④ Canonical URL always set explicitly in generateMetadata
//  ⑤ noindex guard for draft articles (prevents duplicate/thin content penalty)
//  ⑥ Semantic HTML: <article>, <header>, <aside>, <nav> for crawlers
//  ⑦ Image with explicit width/height to eliminate CLS (Core Web Vitals)
// ─────────────────────────────────────────────────────────────────────────────

import { getArticleBySlug, getArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Clock, User, Calendar, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/utils";
import type { Metadata } from "next";

// ─── Static generation ────────────────────────────────────────────────────────
export const revalidate = 60;
export const dynamicParams = true;

const SITE_URL = "https://sololife-six.vercel.app";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article: { slug: string }) => ({ slug: article.slug }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Rough word count from HTML → reading time in minutes */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Strip HTML for description / speakable */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${SITE_URL}/article/${slug}`;
  const thumbnailUrl = getFullImageUrl(article.thumbnail) ?? "";
  const categoryName: string = article.category?.name ?? "SoloLife";
  const authorName: string = article.author?.username ?? "SoloLife";
  const readingTime = estimateReadingTime(article.content ?? "");

  // Draft articles should NOT be indexed
  const isDraft = article.status === "draft";

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [categoryName, "solo living", "independent lifestyle", article.title],

    alternates: { canonical: canonicalUrl },

    // Block drafts from appearing in Google
    robots: isDraft
      ? { index: false, follow: false }
      : {
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
      type: "article",
      url: canonicalUrl,
      title: article.title,
      description: article.excerpt,
      siteName: "SoloLife",
      locale: "en_US",
      publishedTime: article.created_at,
      modifiedTime: article.updated_at ?? article.created_at,
      authors: [`${SITE_URL}/about`],
      section: categoryName,
      tags: [categoryName, "solo living"],
      images: thumbnailUrl
        ? [{ url: thumbnailUrl, width: 1200, height: 630, alt: article.title }]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      site: "@SoloLifeOS",
      creator: "@SoloLifeOS",
      title: article.title,
      description: article.excerpt,
      images: thumbnailUrl ? [thumbnailUrl] : [],
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

  const canonicalUrl = `${SITE_URL}/article/${slug}`;
  const thumbnailUrl = getFullImageUrl(article.thumbnail) ?? "";
  const categoryName: string = article.category?.name ?? "SoloLife";
  const categorySlug: string = article.category?.slug ?? "category";
  const authorName: string = article.author?.username ?? "SoloLife";
  const readingTime = estimateReadingTime(article.content ?? "");
  const plainText = stripHtml(article.content ?? "").slice(0, 300);

  // ── JSON-LD: BlogPosting ───────────────────────────────────────────────────
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: article.title,
    description: article.excerpt,
    image: thumbnailUrl
      ? { "@type": "ImageObject", url: thumbnailUrl, width: 1200, height: 630 }
      : undefined,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "SoloLife",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: article.created_at,
    dateModified: article.updated_at ?? article.created_at,
    articleSection: categoryName,
    inLanguage: "en-US",
    // wordCount: rough estimate from content length
    wordCount: Math.round((article.content ?? "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length),
    timeRequired: `PT${readingTime}M`,
    copyrightYear: new Date(article.created_at).getFullYear(),
    copyrightHolder: { "@id": `${SITE_URL}/#organization` },
    // speakable helps Google Assistant read relevant sections
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", ".article-excerpt"],
    },
  };

  // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${SITE_URL}/category/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const safeHtml = (article.content ?? "").trim().replace(/\n{3,}/g, "\n\n");

  return (
    <>
      {/* ── Structured data ──────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingSchema, breadcrumbSchema]),
        }}
      />

      <main className="min-h-screen bg-white pb-20">
        {/* ── Semantic breadcrumb nav (visible + crawlable) ──────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="pt-8 px-6 max-w-4xl mx-auto"
        >
          <ol className="flex items-center gap-2 text-sm text-brand-muted">
            <li>
              <Link href="/" className="hover:text-brand-orange transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">
              /
            </li>
            <li>
              <Link
                href={`/category/${categorySlug}`}
                className="hover:text-brand-orange transition-colors"
              >
                {categoryName}
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">
              /
            </li>
            <li className="text-brand-deep font-semibold truncate max-w-[200px]">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* ── Article header ─────────────────────────────────────────────── */}
        <header className="pt-10 pb-8 px-6 max-w-4xl mx-auto text-center">
          <Link
            href={`/category/${categorySlug}`}
            className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 inline-block hover:underline"
          >
            {categoryName}
          </Link>

          {/* h1 is the primary ranking signal — keep it keyword-rich and unique */}
          <h1 className="text-4xl md:text-6xl font-black text-brand-deep mb-8 leading-tight">
            {article.title}
          </h1>

          {/* Article excerpt for speakable + summary */}
          <p className="article-excerpt text-lg text-brand-muted max-w-2xl mx-auto mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-center gap-6 text-brand-muted text-sm border-y border-gray-100 py-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-brand-orange" />
              <span className="font-semibold text-brand-deep">{authorName}</span>
            </div>
            <div className="flex items-center gap-2" suppressHydrationWarning>
              <Calendar size={16} />
              <time
                dateTime={article.created_at}
                suppressHydrationWarning
              >
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* ── Hero image with explicit dimensions to prevent CLS ─────────── */}
        {thumbnailUrl && (
          <div className="max-w-6xl mx-auto px-6 mb-16">
            <img
              src={thumbnailUrl}
              alt={article.title}
              width={1200}
              height={630}
              className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl"
              fetchPriority="high"
              loading="eager"
            />
          </div>
        )}

        {/* ── Content + Sidebar ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main article body */}
          <article className="lg:col-span-8" suppressHydrationWarning>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
              <span className="font-bold text-brand-deep">Share this insight:</span>
              <button
                className="p-3 bg-gray-50 rounded-full hover:bg-brand-orange hover:text-white transition"
                aria-label="Share article"
              >
                <Share2 size={20} />
              </button>
              <button
                className="p-3 bg-gray-50 rounded-full hover:bg-brand-deep hover:text-white transition"
                aria-label="Bookmark article"
              >
                <Bookmark size={20} />
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10" aria-label="Related content">
            <div className="sticky top-28">
              <div className="bg-brand-deep rounded-[2.5rem] p-8 text-white mb-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
                <p className="text-blue-100 text-sm mb-6">
                  More from <strong>{categoryName}</strong>
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
                            width={64}
                            height={64}
                            loading="lazy"
                          />
                        )}
                        <div>
                          <h3 className="text-sm font-bold leading-tight line-clamp-2">
                            {rel.title}
                          </h3>
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
                <h3 className="text-xl font-bold text-brand-deep mb-2">
                  Weekly Solo-Tips
                </h3>
                <input
                  type="email"
                  placeholder="Email address"
                  aria-label="Email for newsletter"
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
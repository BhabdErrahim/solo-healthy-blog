// client/src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getArticles, getCategories } from "@/lib/api";

const SITE_URL = "https://sololife-six.vercel.app";

export const revalidate = 3600; // Rebuild sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── 1. Static pages ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact/`, // Added Contact Page
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ── 2. Category pages ──────────────────────────────────────────────────────
  const knownCategorySlugs = [
    "healthy",
    "traveling",
    "solo-living",
    "sport",
    "food-recipes",
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    const slugs =
      categories.length > 0
        ? categories.map((c: { slug: string }) => c.slug)
        : knownCategorySlugs;

    categoryRoutes = slugs.map((slug: string) => ({
      url: `${SITE_URL}/category/${slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    categoryRoutes = knownCategorySlugs.map((slug) => ({
      url: `${SITE_URL}/category/${slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  // ── 3. Article pages ───────────────────────────────────────────────────────
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticles();
    articleRoutes = articles
      // FIX: Corrected "pulished" to "published"
      .filter((a: any) => a?.slug && a.status === "published") 
      .map((article: any) => ({
        url: `${SITE_URL}/article/${article.slug}/`,
        lastModified: new Date(article.updated_at ?? article.created_at ?? now),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    console.warn("sitemap: could not fetch articles from API");
  }

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
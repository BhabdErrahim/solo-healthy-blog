// ✅ FIX: Replaced axios with native fetch for all SERVER-SIDE data-fetching
// functions. Next.js App Router extends fetch with built-in caching/deduplication.
// axios bypasses that, making every request a cold hit.  When a dynamic route
// (e.g. /article/[slug]) is rendered at REQUEST TIME, a cold axios call to an
// unreachable API returns null → "Article not found".  fetch + revalidate lets
// Next.js serve stale data while revalidating in the background.
//
// axios is intentionally KEPT for the admin write-operations (POST/PATCH/DELETE)
// because those need auth headers and multipart support which adminApi already
// handles perfectly.

import axios from "axios";

const isServer = typeof window === "undefined";

// ✅ FIX: API_BASE construction.
// NEXT_PUBLIC_ vars are inlined at build time AND available at runtime.
// Priority: explicit env var → Vercel deployment URL → local dev fallback.
export const API_BASE = (() => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  // On Vercel, VERCEL_URL is the deployment URL (no protocol prefix).
  // This is a server-only env var, available inside Next.js server code at runtime.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://127.0.0.1:8000";
})();

const API_URL = `${API_BASE}/api`;

// ─── Admin axios instance (auth + multipart) ─────────────────────────────────
const adminApi = axios.create({ baseURL: API_URL });

adminApi.interceptors.request.use((config) => {
  if (!isServer) {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Public read APIs (use fetch so Next.js can cache + revalidate) ───────────

/**
 * Returns all articles for public pages.
 * Revalidates every 60 s so the home page stays fresh without blocking requests.
 */
export const getArticles = async () => {
  try {
    const res = await fetch(`${API_URL}/articles/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API Error (getArticles):", err);
    return [];
  }
};

/**
 * ✅ FIX: was axios → now fetch.
 * Dynamic article pages (/article/[slug]) render at REQUEST TIME.
 * With axios a failed network call returns null immediately.
 * With fetch + revalidate: 60 Next.js returns cached HTML if the API is
 * momentarily unreachable, preventing the "Article not found" flash.
 */
export const getArticleBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(
        `API Error (getArticleBySlug): HTTP ${res.status} for slug "${slug}"`
      );
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error (getArticleBySlug): ${slug}`, err);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
};

// ─── Admin write APIs (keep axios for auth + multipart) ───────────────────────

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/token/`, credentials);
  if (response.data.access && !isServer) {
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
  }
  return response.data;
};

export const getAdminArticles = async () => {
  const response = await adminApi.get("/articles/");
  return response.data;
};

export const getAdminArticleBySlug = async (slug: string) => {
  const response = await adminApi.get(`/articles/${slug}/`);
  return response.data;
};

export const createArticle = async (formData: FormData) => {
  const response = await adminApi.post("/articles/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateArticle = async (slug: string, formData: FormData) => {
  const response = await adminApi.patch(`/articles/${slug}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteArticle = async (slug: string) => {
  return await adminApi.delete(`/articles/${slug}/`);
};
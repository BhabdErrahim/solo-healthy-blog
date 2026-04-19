import axios from "axios";

const isServer = typeof window === "undefined";

// 1. DYNAMIC BASE URL CONSTRUCTION
// This logic handles Localhost (Port 8000) and Vercel (Production URL)
export const API_BASE = (() => {
  // If we have an explicit environment variable (Set in Vercel or .env)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  // If on Vercel but variable is missing (fallback)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local Development: MUST point to Django port 8000
  return "http://127.0.0.1:8000";
})();

// We force the use of the absolute URL even in the browser to avoid 
// conflicts with Next.js's own internal routing/middleware.
const API_URL = `${API_BASE}/api`;

// ─── Admin axios instance ──────────────────────────────────────────────────
const adminApi = axios.create({ 
    baseURL: API_URL,
    // Add timeout to prevent hanging requests
    timeout: 15000 
});

adminApi.interceptors.request.use((config) => {
  if (!isServer) {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Public read APIs (Fetch + ISR Caching) ────────────────────────────────

export const getArticles = async () => {
  try {
    // We use the absolute URL to ensure the build server and browser hit the same target
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

export const getArticleBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
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

// ─── Admin write APIs (Axios for Auth/Multipart) ───────────────────────────

export const login = async (credentials: { username: string; password: string }) => {
  // Always use the absolute path for login to ensure the token comes from the right origin
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
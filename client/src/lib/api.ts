import axios from "axios";

const isServer = typeof window === "undefined";

// 1. DYNAMIC BASE URL CONSTRUCTION
export const API_BASE = (() => {
  // If we have an explicit environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    let url = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    // Force HTTPS in production to prevent "http -> https" redirect loops
    if (!isServer && window.location.protocol === 'https:' && url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
    }
    return url;
  }
  
  // Fallback for local development
  return isServer ? "http://127.0.0.1:8000" : "http://localhost:8000";
})();

const API_URL = `${API_BASE}/api`;

// ─── Admin axios instance ──────────────────────────────────────────────────
const adminApi = axios.create({ 
    baseURL: API_URL,
    timeout: 20000 
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
    // Added trailing slash / and cache control
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

// ─── Admin write APIs (Axios) ──────────────────────────────────────────────

export const login = async (credentials: { username: string; password: string }) => {
  // Ensure the trailing slash is here for Django
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

export const createCategory = async (data: any) => {
    const response = await adminApi.post('/categories/', data);
    return response.data;
};

export const updateCategory = async (id: number, data: any) => {
    const response = await adminApi.patch(`/categories/${id}/`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    return await adminApi.delete(`/categories/${id}/`);
};

export const getAdminCategoryById = async (id: string) => {
    const response = await adminApi.get(`/categories/${id}/`);
    return response.data;
};
import axios from 'axios';

const isServer = typeof window === 'undefined';

// 1. Define the Base URL strictly
export const API_BASE = (() => {
  // Production (Vercel)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  // Local Development
  return 'http://127.0.0.1:8000'; 
})();

const API_URL = `${API_BASE}/api`;

// Create an axios instance
const adminApi = axios.create({
  baseURL: API_URL,
});

// Interceptor to add token (Client Only)
adminApi.interceptors.request.use((config) => {
  if (!isServer) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─────────────────────────────────────────────────────────────────────────────
// Public APIs - Using FULL URLS at all times
// ─────────────────────────────────────────────────────────────────────────────
export const getArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles/`);
    return response.data;
  } catch (err) {
    console.error('API Error (getArticles):', err);
    return [];
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    // FIX: Always use the absolute API_URL here
    const response = await axios.get(`${API_URL}/articles/${slug}/`);
    return response.data;
  } catch (err) {
    console.error(`API Error (getArticleBySlug): ${slug}`, err);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
  } catch (err) {
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin APIs
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/token/`, credentials);
  if (response.data.access && !isServer) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

export const getAdminArticles = async () => {
    const response = await adminApi.get('/articles/');
    return response.data;
};

export const getAdminArticleBySlug = async (slug: string) => {
    const response = await adminApi.get(`/articles/${slug}/`);
    return response.data;
};

export const createArticle = async (formData: FormData) => {
    const response = await adminApi.post('/articles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateArticle = async (slug: string, formData: FormData) => {
    const response = await adminApi.patch(`/articles/${slug}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteArticle = async (slug: string) => {
    return await adminApi.delete(`/articles/${slug}/`);
};
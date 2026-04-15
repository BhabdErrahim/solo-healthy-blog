import axios from 'axios';

const isServer = typeof window === 'undefined';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  return isServer ? 'http://127.0.0.1:8000' : '';
};

const API_BASE = getBaseUrl();
const API_URL = `${API_BASE}/api`;

const adminApi = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use((config) => {
  if (!isServer) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !isServer) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // No trailing slash — matches Django URL + vercel.json route
          const response = await axios.post(`${API_BASE}/api/token/refresh`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return adminApi(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (credentials: { username: string; password: string }) => {
  // No trailing slash — matches /api/token in vercel.json and urls.py
  const response = await axios.post(`${API_BASE}/api/token`, credentials);
  if (response.data.access && !isServer) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Public APIs
// ─────────────────────────────────────────────────────────────────────────────
export const getArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    return response.data;
  } catch (err) {
    console.error('API Error (getArticles):', err);
    return [];
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${API_URL}/articles/${slug}`);
    return response.data;
  } catch (err) {
    console.error(`API Error (getArticleBySlug): ${slug}`, err);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (err) {
    console.error('API Error (getCategories):', err);
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin APIs
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminArticles = async () => {
  const response = await adminApi.get('/articles');
  return response.data;
};

export const getAdminArticleBySlug = async (slug: string) => {
  const response = await adminApi.get(`/articles/${slug}`);
  return response.data;
};

export const deleteArticle = async (slug: string) => {
  return await adminApi.delete(`/articles/${slug}`);
};

export const createArticle = async (formData: FormData) => {
  const response = await adminApi.post('/articles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateArticle = async (slug: string, formData: FormData) => {
  const response = await adminApi.patch(`/articles/${slug}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
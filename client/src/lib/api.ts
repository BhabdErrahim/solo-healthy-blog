import axios from 'axios';

const isServer = typeof window === 'undefined';

// 2. Build the Base URL
// In Vercel production, we need the full URL for server-side fetching
// In local dev, we use localhost:8000
const getBaseUrl = () => {
  if (!isServer) return ''; // Browser can use relative paths
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return 'http://127.0.0.1:8000'; // Fallback for local build
};

const API_BASE = getBaseUrl();
const API_URL = `${API_BASE}/api`;

// Create an axios instance for Admin tasks (it will auto-attach the token)
const adminApi = axios.create({
  baseURL: API_URL,
});

// Interceptor to add token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
adminApi.interceptors.response.use(
  (response) => response, // If request is successful, do nothing
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Ask Django for a new access token using the refresh token
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return adminApi(originalRequest);
        } catch (refreshError) {
          // If refresh token is also expired, kick user to login
          localStorage.clear();
          window.location.href = '/admin/login';
        }
      } else {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
// 1. Auth API
export const login = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/token/`, credentials);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

// 2. Public APIs
export const getArticles = async () => {
  // Use absolute URL if on server, relative if on client
  const url = isServer ? `${API_URL}/articles/` : `/api/articles/`;
  const response = await axios.get(url);
  return response.data;
};

export const getArticleBySlug = async (slug: string) => {
  const url = isServer ? `${API_URL}/articles/${slug}/` : `/api/articles/${slug}/`;
  const response = await axios.get(url);
  return response.data;
};

// 3. Admin APIs (CRUD)
export const getAdminArticles = async () => {
    const response = await adminApi.get('/articles/');
    return response.data;
};

export const deleteArticle = async (slug: string) => {
    return await adminApi.delete(`/articles/${slug}/`);
};

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
};

// Add these to your existing api.ts

export const createArticle = async (formData: FormData) => {
    const response = await adminApi.post('/articles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
// Add to your existing api.ts

export const getAdminArticleBySlug = async (slug: string) => {
    const response = await adminApi.get(`/articles/${slug}/`);
    return response.data;
};
export const updateArticle = async (slug: string, formData: FormData) => {
    const response = await adminApi.patch(`/articles/${slug}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};



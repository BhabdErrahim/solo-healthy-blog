import { API_BASE } from "./api";

export const getFullImageUrl = (url: string | null | undefined) => {
  // FIX: Return null instead of "" to satisfy React's performance requirements
  if (!url) return null; 
  
  if (url.startsWith('http')) return url;
  
  const base = API_BASE.replace(/\/$/, "");
  const path = url.startsWith('/') ? url : `/${url}`;
  
  return `${base}${path}`;
};
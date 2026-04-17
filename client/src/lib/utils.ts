import { API_BASE } from "./api";

export const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return "";
  
  // 1. If it's already a full URL (Unsplash), return it
  if (url.startsWith('http')) return url;
  
  // 2. Clean the base and the path to avoid double slashes
  const base = API_BASE.replace(/\/$/, ""); // Remove trailing slash
  
  // Django usually returns paths starting with /media/ or blog_thumbnails/
  // We ensure the path starts with a single /
  const path = url.startsWith('/') ? url : `/${url}`;
  
  // 3. Construct final URL
  const finalUrl = `${base}${path}`;
  
  console.log("Image Debug:", finalUrl); // This will show in your browser console
  return finalUrl;
};
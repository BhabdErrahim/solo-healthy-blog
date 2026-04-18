// client/src/lib/utils.ts
//
// ✅ FIX: getFullImageUrl now returns "" instead of null when the URL is empty.
//
// Previously it returned null, and components rendered <img src={null}>.
// React converts null to the string "null", which is an invalid URL → broken image.
// Returning "" causes the img not to render (when guarded with {url && <img ...>}).

import { API_BASE } from "./api";

/**
 * Converts a thumbnail URL to a fully-qualified URL.
 *
 * Handles three cases:
 *  1. Already absolute (http/https) → returned as-is (Cloudinary, external CDN)
 *  2. Relative path (/media/...) → prepended with API_BASE (local dev Django)
 *  3. Null / undefined / empty → returns "" (callers should guard: {url && <img>})
 */
export const getFullImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // Already a full URL (Cloudinary, S3, etc.)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Relative path from Django local storage
  const base = API_BASE.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
};
// client/src/lib/config.ts

// Fallback to localhost if the environment variable is missing (e.g. during local dev)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
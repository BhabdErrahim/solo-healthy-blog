import type { NextConfig } from "next";

// Extract just the hostname (e.g., 'www.sololife.xyz' from 'https://www.sololife.xyz')
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteHostname = new URL(siteUrl).hostname;

const nextConfig: NextConfig = {
  trailingSlash: true, 
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: siteHostname }, // <--- Dynamic Domain
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
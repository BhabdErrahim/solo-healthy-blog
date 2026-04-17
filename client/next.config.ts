import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this line
  trailingSlash: false, 
  
   images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.vercel.app' }, // Your vercel domain
      { protocol: 'http', hostname: '127.0.0.1' },    // Local dev
    ],
  },
};

export default nextConfig;
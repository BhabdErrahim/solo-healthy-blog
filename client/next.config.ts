import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this line
  trailingSlash: false, 
  
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
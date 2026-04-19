import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIX: Set to true to match Django's requirements
  trailingSlash: true, 

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'sololife-six.vercel.app' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
};

export default nextConfig;
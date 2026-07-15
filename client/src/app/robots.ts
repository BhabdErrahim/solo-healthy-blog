// client/src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use the env var we set in Vercel
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.sololife.xyz';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/sys-admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
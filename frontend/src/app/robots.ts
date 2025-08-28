import { MetadataRoute } from 'next'

export const dynamic = "force-static";
export const revalidate = 0;
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://recapflow.ashwithrai.me/sitemap.xml',
  }
}

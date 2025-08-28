import { MetadataRoute } from 'next'

export const dynamic = "force-static";
export const revalidate = 0;
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://recapflow.ashwithrai.me'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/flow`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}

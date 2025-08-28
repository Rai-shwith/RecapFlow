import { MetadataRoute } from 'next'

export const dynamic = "force-static";
export const revalidate = 0;
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RecapFlow - AI Meeting Summarization',
    short_name: 'RecapFlow',
    description: 'Transform meeting transcripts into professional summaries using AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
    ],
    categories: ['productivity', 'business', 'utilities'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
  }
}

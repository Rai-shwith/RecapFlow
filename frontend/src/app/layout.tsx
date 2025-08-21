import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import "../styles/markdown.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://recapflow.ashwithrai.me'),
  title: {
    default: "RecapFlow - AI-Powered Meeting Summarization & Email Sharing",
    template: "%s | RecapFlow"
  },
  description: "Transform lengthy meeting transcripts into concise, professional summaries using AI. Upload files, generate intelligent summaries with custom prompts, and share via email with beautiful formatting. Powered by Google Gemini AI.",
  keywords: [
    "meeting summarization", 
    "AI transcript analysis", 
    "meeting notes", 
    "professional email sharing",
    "Google Gemini AI",
    "transcript to summary",
    "business productivity",
    "meeting insights",
    "automated summarization",
    "meeting management",
    "AI-powered workflows",
    "document processing"
  ],
  authors: [{ name: "Ashwith Rai", url: "https://ashwithrai.me" }],
  creator: "Ashwith Rai",
  publisher: "Ashwith Rai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/logo.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recapflow.ashwithrai.me",
    siteName: "RecapFlow",
    title: "RecapFlow - AI-Powered Meeting Summarization & Email Sharing",
    description: "Transform lengthy meeting transcripts into concise, professional summaries using AI. Upload files, generate intelligent summaries with custom prompts, and share via email with beautiful formatting.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RecapFlow - AI Meeting Summarization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ashwithrai",
    creator: "@ashwithrai",
    title: "RecapFlow - AI-Powered Meeting Summarization",
    description: "Transform meetings into insights in minutes with AI-powered transcript summarization and professional email sharing.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://recapflow.ashwithrai.me",
  },
  category: "Productivity",
  classification: "Business Software",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  other: {
    'application-name': 'RecapFlow',
    'apple-mobile-web-app-title': 'RecapFlow',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#4F46E5',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RecapFlow",
    description: "AI-powered meeting transcript summarization and email sharing platform",
    url: "https://recapflow.ashwithrai.me",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    creator: {
      "@type": "Person",
      name: "Ashwith Rai",
      url: "https://ashwithrai.me"
    },
    featureList: [
      "AI-powered transcript summarization",
      "Custom prompt support",
      "Professional email sharing",
      "Multiple file format support",
      "Real-time editing",
      "Responsive design"
    ],
    screenshot: "https://recapflow.ashwithrai.me/og-image.png",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

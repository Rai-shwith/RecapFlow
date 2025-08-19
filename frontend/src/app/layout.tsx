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
  title: "RecapFlow - AI Meeting Summarization",
  description: "Transform meetings into insights in minutes with AI-powered transcript summarization and professional email sharing.",
  keywords: ["meeting", "summarization", "AI", "transcript", "email", "productivity"],
  authors: [{ name: "Ashwith Rai", url: "https://github.com/Ashwith Rai" }],
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
    title: "RecapFlow - AI Meeting Summarization",
    description: "Transform meetings into insights in minutes with AI-powered transcript summarization and professional email sharing.",
    type: "website",
    url: "https://ashwithrai.me.github.io/RecapFlow/",
    siteName: "RecapFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecapFlow - AI Meeting Summarization",
    description: "Transform meetings into insights in minutes with AI-powered transcript summarization and professional email sharing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

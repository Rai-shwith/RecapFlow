import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

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
  authors: [{ name: "Rai-shwith", url: "https://github.com/Rai-shwith" }],
  openGraph: {
    title: "RecapFlow - AI Meeting Summarization",
    description: "Transform meetings into insights in minutes with AI-powered transcript summarization and professional email sharing.",
    type: "website",
    url: "https://rai-shwith.github.io/RecapFlow/",
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

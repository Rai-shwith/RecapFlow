import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create AI Summary | RecapFlow Workflow",
  description: "Step-by-step workflow to upload meeting transcripts, generate AI-powered summaries, edit content, and share via email. Transform your meeting notes into professional summaries in 4 easy steps.",
  keywords: [
    "meeting transcript upload",
    "AI summary workflow",
    "meeting notes processing",
    "transcript summarization steps",
    "automated meeting insights",
    "professional email sharing",
    "meeting productivity workflow",
    "AI-powered document analysis"
  ],
  openGraph: {
    title: "Create AI Summary | RecapFlow Workflow",
    description: "Step-by-step workflow to transform meeting transcripts into professional summaries and share via email.",
    type: "website",
    url: "https://recapflow.ashwithrai.me/flow",
  },
  twitter: {
    title: "Create AI Summary | RecapFlow Workflow",
    description: "Transform meeting transcripts into professional summaries in 4 easy steps.",
  },
  alternates: {
    canonical: "https://recapflow.ashwithrai.me/flow",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "RecapFlow Workflow",
    description: "Step-by-step workflow to upload meeting transcripts, generate AI summaries, and share via email",
    url: "https://recapflow.ashwithrai.me/flow",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "RecapFlow",
      applicationCategory: "BusinessApplication"
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://recapflow.ashwithrai.me"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Create Summary",
          item: "https://recapflow.ashwithrai.me/flow"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}

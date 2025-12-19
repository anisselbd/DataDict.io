import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://datadico.com'),
  title: {
    default: "DataDict.io | Dictionnaires de données simplifiés",
    template: "%s | DataDict.io"
  },
  description: "Créez, documentez et partagez vos schémas de base de données facilement. Export PDF/Markdown, collaboration et schémas visuels.",
  keywords: ["data dictionary", "database schema", "documentation", "sql", "modeling", "saas", "developer tool"],
  authors: [{ name: "Anisselbd" }],
  creator: "Anisselbd",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://datadico.com",
    title: "DataDict.io | Dictionnaires de données simplifiés",
    description: "Créez, documentez et partagez vos schémas de base de données facilement.",
    siteName: "DataDict.io",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DataDict.io - Dictionnaires de données simplifiés",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataDict.io | Dictionnaires de données simplifiés",
    description: "Créez, documentez et partagez vos schémas de base de données facilement.",
    creator: "@anisselbd",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://datadico.com/#organization",
        "name": "DataDict.io",
        "url": "https://datadico.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://datadico.com/og-image.png"
        },
        "sameAs": [
          "https://twitter.com/anisselbd"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://datadico.com/#website",
        "url": "https://datadico.com",
        "name": "DataDict.io",
        "description": "Créez, documentez et partagez vos schémas de base de données facilement.",
        "publisher": {
          "@id": "https://datadico.com/#organization"
        },
        "inLanguage": "fr-FR"
      },
      {
        "@type": "SoftwareApplication",
        "name": "DataDict.io",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "url": "https://datadico.com",
        "description": "Créez, documentez et partagez vos schémas de base de données facilement. Export PDF/Markdown, collaboration et schémas visuels.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "24"
        }
      }
    ]
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}

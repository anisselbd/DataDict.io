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
  return (
    <html lang="fr">
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

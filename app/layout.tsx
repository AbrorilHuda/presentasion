import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";
const urlSite = "https://slide.dcnunira.dev"

export const metadata: Metadata = {
  title: "Slide Presentation - Custom Web Presentation Tool",
  description: "Create beautiful, interactive slide presentations directly in your browser. Built by abrordc modern web technologies.",

  keywords: [
    "slide presentation",
    "web presentation",
    "online slides",
    "presentation maker",
    "slide deck",
    "abrordc",
    "next.js presentation",
    "interactive slides"
  ],

  authors: [
    {
      name: "abrordc",
      url: "https://github.com/abrorilhuda"
    }
  ],

  creator: "abrorilhuda",
  publisher: "abrorilhuda",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: urlSite,
    title: "Slide Presentation - Custom Web Presentation Tool",
    description: "Create beautiful, interactive slide presentations directly in your browser. Built by abrordc.",
    siteName: "Slide Presentation",
    images: [
      {
        url: `${urlSite}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Slide Presentation Preview",
      },
    ],
  },


  twitter: {
    card: "summary_large_image",
    title: "Slide Presentation - Custom Web Presentation Tool",
    description: "Create beautiful, interactive slide presentations directly in your browser.",
    creator: "@abror_dc",
    images: [`${urlSite}/og-image.png`],
  },

  category: "technology",

  alternates: {
    canonical: urlSite,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster position="top-right" />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}

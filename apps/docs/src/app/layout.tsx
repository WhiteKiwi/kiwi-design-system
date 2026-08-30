// biome-ignore-all lint/security/noDangerouslySetInnerHtml: static JSON-LD is escaped per Next.js guidance
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PIP — WhiteKiwi Design System",
  alternateName: "PIP",
  url: "https://design.whitekiwi.link/",
  description:
    "WhiteKiwi foundations, components, patterns, and adoption contracts.",
  inLanguage: ["ko", "en"],
  publisher: {
    "@type": "Organization",
    name: "WhiteKiwi",
    url: "https://whitekiwi.link/",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://design.whitekiwi.link"),
  title: "PIP — WhiteKiwi Design System",
  description:
    "WhiteKiwi foundations, components, patterns, and adoption contracts.",
  alternates: { canonical: "/" },
  applicationName: "PIP",
  authors: [{ name: "WhiteKiwi", url: "https://whitekiwi.link/" }],
  creator: "WhiteKiwi",
  keywords: [
    "WhiteKiwi",
    "PIP",
    "design system",
    "design tokens",
    "React components",
  ],
  openGraph: {
    title: "PIP — WhiteKiwi Design System",
    description:
      "WhiteKiwi foundations, components, patterns, and adoption contracts.",
    siteName: "PIP",
    type: "website",
    url: "/",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "qmYTEDrOz1_XUxaQ2AvsqF69zS06FT9acIOBN3lb17w",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIP — WhiteKiwi Design System",
    description:
      "WhiteKiwi foundations, components, patterns, and adoption contracts.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="/llms.txt" rel="describedby" type="text/markdown" />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-BD6TDB13LR" />
    </html>
  );
}

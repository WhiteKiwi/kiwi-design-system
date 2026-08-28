import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://design.whitekiwi.link"),
  title: "PIP — WhiteKiwi Design System",
  description: "WhiteKiwi brand, tokens, components and interaction contracts.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PIP — WhiteKiwi Design System",
    description:
      "WhiteKiwi brand, tokens, components and interaction contracts.",
    siteName: "PIP",
    type: "website",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

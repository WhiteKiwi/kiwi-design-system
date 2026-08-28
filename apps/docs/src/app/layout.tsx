import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiwi Design System",
  description: "WhiteKiwi brand, tokens, components and interaction contracts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

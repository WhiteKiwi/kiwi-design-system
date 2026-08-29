import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PIP — WhiteKiwi Design System",
    short_name: "PIP",
    description:
      "WhiteKiwi foundations, components, patterns, and adoption contracts.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F5EF",
    theme_color: "#C6FF4A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

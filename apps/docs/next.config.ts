import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@whitekiwi/ui"],
};

export default nextConfig;

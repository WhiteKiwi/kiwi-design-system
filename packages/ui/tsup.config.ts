import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
  banner: { js: '"use client";' },
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    theme: "src/theme.ts",
  },
  format: ["esm"],
  splitting: false,
  onSuccess: async () => {
    const path = "dist/theme.js";
    const source = readFileSync(path, "utf8");
    writeFileSync(path, source.replace(/^["']use client["'];\n?/, ""));
  },
});

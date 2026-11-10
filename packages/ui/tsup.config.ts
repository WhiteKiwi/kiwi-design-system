import { readdirSync, readFileSync, writeFileSync } from "node:fs";
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
  splitting: true,
  onSuccess: async () => {
    for (const file of readdirSync("dist")) {
      if (!file.endsWith(".js") || file === "index.js") continue;
      const path = `dist/${file}`;
      const source = readFileSync(path, "utf8");
      writeFileSync(path, source.replace(/^["']use client["'];\n?/, ""));
    }
  },
});

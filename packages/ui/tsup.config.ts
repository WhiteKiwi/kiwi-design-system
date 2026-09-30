import { defineConfig } from "tsup";

export default defineConfig({
  banner: { js: '"use client";' },
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm"],
});

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = new URL("../out/", import.meta.url);

function htmlFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory.pathname ?? directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(path));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const scriptPattern = /<script id="pip-theme-bootstrap">[\s\S]*?<\/script>/;
const metaPattern = /<meta name="theme-color" content="#[\da-fA-F]{6}"\s*\/?>/;

for (const file of htmlFiles(out)) {
  const html = readFileSync(file, "utf8");
  const script = html.match(scriptPattern);
  if (!script) continue;
  const meta = html.match(metaPattern);
  if (!meta) throw new Error(`${file} is missing theme-color`);
  const styleAt = html.indexOf('<link rel="stylesheet"');
  if (styleAt === -1) throw new Error(`${file} is missing its stylesheet`);
  const without = html.replace(script[0], "").replace(meta[0], "");
  const insertAt = without.indexOf('<link rel="stylesheet"');
  const next = `${without.slice(0, insertAt)}${meta[0]}${script[0]}${without.slice(insertAt)}`;
  if (next.indexOf(script[0]) > next.indexOf('<link rel="stylesheet"')) {
    throw new Error(`${file} did not move the theme bootstrap before CSS`);
  }
  writeFileSync(file, next);
}

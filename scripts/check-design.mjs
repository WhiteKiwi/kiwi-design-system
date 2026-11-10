import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const css = read("packages/tokens/src/theme.css");
const blocks = [...css.matchAll(/:root[^{}]*\{([^}]+)\}/g)].map((match) =>
  Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((entry) => [
      entry[1],
      entry[2].trim().replace(/\s+/g, " "),
    ]),
  ),
);
assert.equal(blocks.length, 3, "light, explicit dark, and automatic dark maps");
assert.deepEqual(
  blocks[1],
  blocks[2],
  "explicit and automatic dark must agree",
);
function resolve(value, theme) {
  if (value.startsWith("var("))
    return resolve(theme[value.slice(4, -1)], theme);
  const mix =
    /^color-mix\(\s*in srgb, (var\(--[\w-]+\)) (\d+)%, (var\(--[\w-]+\))\s*\)$/.exec(
      value,
    );
  if (mix) {
    const first = resolve(mix[1], theme);
    const second = resolve(mix[3], theme);
    const weight = Number(mix[2]) / 100;
    return first.map((v, i) => v * weight + second[i] * (1 - weight));
  }
  assert.match(
    value,
    /^#[\da-f]{6}$/i,
    `Unsupported color in contrast gate: ${value}`,
  );
  return [1, 3, 5].map(
    (at) => Number.parseInt(value.slice(at, at + 2), 16) / 255,
  );
}
function luminance(rgb) {
  return rgb
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce(
      (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
      0,
    );
}
const styles = read("packages/ui/src/styles.css");
assert.match(
  styles,
  /input\.kiwi-field__input\[type="date"\],\s*input\.kiwi-field__input\[type="time"\],\s*input\.kiwi-field__input\[type="datetime-local"\]\s*\{[^}]*appearance:\s*none;[^}]*-webkit-appearance:\s*none;[^}]*min-width:\s*0;[^}]*width:\s*100%;[^}]*max-width:\s*100%;/,
  "date and time inputs must shrink to the field on iOS Safari",
);
assert.doesNotMatch(
  styles.split(".kiwi-field {")[1]?.split("}")[0] ?? "",
  /overflow\s*:\s*hidden/,
  "the field itself must not clip the focus ring",
);
function declarations(selector) {
  const body = styles.split(`${selector} {`)[1]?.split("}")[0];
  assert.ok(body, `Missing component selector ${selector}`);
  return Object.fromEntries(
    [...body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );
}
let pairs = 0;
for (const [name, theme] of [
  ["light", blocks[0]],
  ["dark", { ...blocks[0], ...blocks[1] }],
]) {
  const gate = (fg, bg, minimum) => {
    const a = luminance(resolve(theme[`--kiwi-color-${fg}`], theme));
    const b = luminance(resolve(theme[`--kiwi-color-${bg}`], theme));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    assert.ok(ratio >= minimum, `${name}: ${fg}/${bg} = ${ratio} < ${minimum}`);
    pairs += 1;
  };
  for (const surface of ["canvas", "surface", "surface-raised"]) {
    for (const text of ["text", "text-muted", "interactive"])
      gate(text, surface, 4.5);
    gate("control-border", surface, 3);
    gate("focus", surface, 3);
  }
  for (const state of [
    "brand-field",
    "brand-field-hover",
    "brand-field-active",
  ]) {
    gate("on-brand", state, 4.5);
  }
  for (const state of ["control-hover", "control-active"]) {
    gate("text", state, 4.5);
  }
  gate("canvas", "text", 4.5);
  for (const status of ["error", "success", "warning", "info"]) {
    gate(status, `${status}-soft`, 4.5);
  }
  for (const state of ["error", "error-hover", "error-active"]) {
    gate("surface-raised", state, 4.5);
  }
  for (const tone of ["neutral", "raised", "brand", "inverse"]) {
    for (const state of ["rest", "hover", "active"]) {
      const style = {
        ...declarations(".kiwi-card"),
        ...declarations(`.kiwi-card--${tone}`),
        ...declarations(".kiwi-card-link"),
        ...(state === "rest" ? {} : declarations(`.kiwi-card-link:${state}`)),
      };
      const a = luminance(resolve(style.color, theme));
      const b = luminance(resolve(style.background, theme));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      assert.ok(ratio >= 4.5, `${name} linked ${tone}/${state}: ${ratio}`);
      assert.equal(
        declarations(".kiwi-card-link__arrow").color,
        "currentColor",
      );
      pairs += 1;
    }
  }
}

const require = createRequire(new URL("apps/docs/package.json", root));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const {
  Button,
  TextField,
  Select,
  SegmentedControl,
  EmptyState,
  ThemeControl,
} = await import(new URL("packages/ui/dist/index.js", root));
const {
  canvasColor,
  pipThemeBootstrap,
  pipThemeControlScript,
  readStoredTheme,
  themeCanvas,
  themeControlMarkup,
  writeStoredTheme,
} = await import(new URL("packages/ui/dist/theme.js", root));
const render = (component, props) =>
  renderToStaticMarkup(React.createElement(component, props));
assert.match(render(Button, { children: "Save" }), /type="button"/);
assert.match(
  render(Button, { children: "Submit", type: "submit" }),
  /type="submit"/,
);
const fields = renderToStaticMarkup(
  React.createElement(
    React.Fragment,
    null,
    React.createElement(TextField, {
      label: "First",
      name: "shared",
      hint: "Help",
    }),
    React.createElement(TextField, {
      label: "Second",
      name: "shared",
      hint: "Help",
    }),
  ),
);
const ids = [...fields.matchAll(/<input[^>]+id="([^"]+)"/g)].map(
  (match) => match[1],
);
assert.equal(
  new Set(ids).size,
  2,
  "same-name inputs need unique generated IDs",
);
for (const id of ids) {
  assert.ok(fields.includes(`aria-describedby="${id}-description"`));
  assert.ok(fields.includes(`id="${id}-description"`));
  assert.ok(fields.includes(`for="${id}"`));
}
const custom = render(TextField, {
  label: "Email",
  id: "email",
  hint: "Hint",
  error: "Invalid",
  "aria-describedby": "external-help",
});
assert.match(custom, /aria-describedby="external-help email-description"/);
assert.match(custom, /aria-invalid="true"/);
assert.match(custom, />Invalid<\/span>/);
assert.match(
  render(TextField, { label: "External validation", "aria-invalid": true }),
  /aria-invalid="true"/,
);
// These contracts protect labels and values consumed by assistive tech and forms.
const select = render(Select, {
  label: "Cycle",
  id: "cycle",
  name: "cycle",
  hint: "Hint",
  error: "Choose a cycle",
  "aria-describedby": "external",
  disabled: true,
  children: React.createElement("option", { value: "monthly" }, "Monthly"),
});
assert.match(select, /<label[^>]*for="cycle"/);
assert.match(
  select,
  /<select[^>]*aria-describedby="external cycle-description"/,
);
assert.match(select, /aria-invalid="true"/);
assert.match(select, /<select[^>]*disabled=""/);
assert.match(select, />Choose a cycle<\/span>/);
assert.match(
  render(Select, { label: "External", "aria-invalid": true }),
  /aria-invalid="true"/,
);
const selects = renderToStaticMarkup(
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Select, { label: "First", name: "shared" }),
    React.createElement(Select, { label: "Second", name: "shared" }),
  ),
);
assert.equal(
  new Set([...selects.matchAll(/<select[^>]+id="([^"]+)"/g)].map((m) => m[1]))
    .size,
  2,
);
const options = [
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly", disabled: true },
];
const segments = render(SegmentedControl, {
  label: "Period",
  name: "period",
  form: "external-form",
  defaultValue: "month",
  options,
});
assert.match(segments, /<legend[^>]*>Period<\/legend>/);
assert.equal([...segments.matchAll(/type="radio"/g)].length, 2);
assert.equal([...segments.matchAll(/name="period"/g)].length, 2);
assert.equal(
  [...segments.matchAll(/<input[^>]*form="external-form"/g)].length,
  2,
);
assert.match(segments, /<input(?=[^>]*checked="")(?=[^>]*value="month")[^>]*>/);
assert.match(segments, /<input(?=[^>]*disabled="")(?=[^>]*value="year")[^>]*>/);
const groups = renderToStaticMarkup(
  React.createElement(
    React.Fragment,
    null,
    React.createElement(SegmentedControl, { label: "One", options }),
    React.createElement(SegmentedControl, { label: "Two", options }),
  ),
);
assert.equal(
  new Set([...groups.matchAll(/<input[^>]*name="([^"]+)"/g)].map((m) => m[1]))
    .size,
  2,
);
const empty = render(EmptyState, {
  title: "No records",
  description: "Change period",
  children: React.createElement(Button, null, "Reset"),
});
assert.match(empty, /<h3[^>]*>No records<\/h3>/);
assert.match(empty, /Change period/);
assert.match(empty, /<button/);
assert.doesNotMatch(empty, /role="(?:alert|status)"/);
const theme = render(ThemeControl, {
  storageKey: "pip-theme",
  label: "화면 테마",
});
assert.match(theme, /class="kiwi-segmented kiwi-theme"/);
assert.match(theme, /<legend[^>]*>화면 테마<\/legend>/);
for (const label of ["자동", "밝게", "어둡게"])
  assert.match(theme, new RegExp(`>${label}<`));
for (const value of ["auto", "light", "dark"]) {
  assert.match(theme, new RegExp(`value="${value}"`));
}
assert.equal([...theme.matchAll(/type="radio"/g)].length, 3);
assert.match(theme, /<input(?=[^>]*checked="")(?=[^>]*value="auto")[^>]*>/);
assert.doesNotMatch(theme, /system|data-theme="auto"|data-theme="system"/);
const hiddenTheme = render(ThemeControl, {
  storageKey: "pip-theme",
  hideLabel: true,
});
assert.match(hiddenTheme, /<legend class="kiwi-sr-only">화면 테마<\/legend>/);
const themeGroups = renderToStaticMarkup(
  React.createElement(
    React.Fragment,
    null,
    React.createElement(ThemeControl, { storageKey: "pip-theme" }),
    React.createElement(ThemeControl, { storageKey: "pip-theme" }),
  ),
);
assert.equal(
  new Set(
    [...themeGroups.matchAll(/<input[^>]*name="([^"]+)"/g)].map(
      (match) => match[1],
    ),
  ).size,
  2,
);
assert.throws(() => render(ThemeControl, { storageKey: "bad key" }));
assert.equal(themeCanvas.light, "#f4f5ef");
assert.equal(themeCanvas.dark, "#0e0e0e");
assert.equal(themeCanvas.light, blocks[0]["--kiwi-paper"]);
assert.equal(themeCanvas.dark, blocks[0]["--kiwi-carbon"]);
assert.equal(canvasColor("light", true), themeCanvas.light);
assert.equal(canvasColor("dark", false), themeCanvas.dark);
assert.equal(canvasColor("auto", true), themeCanvas.dark);
assert.equal(canvasColor("auto", false), themeCanvas.light);
const memory = new Map();
const storage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => memory.set(key, value),
  removeItem: (key) => memory.delete(key),
};
writeStoredTheme(storage, "app-theme", "light");
assert.equal(readStoredTheme(storage, "app-theme"), "light");
writeStoredTheme(storage, "app-theme", "dark");
assert.equal(readStoredTheme(storage, "app-theme"), "dark");
writeStoredTheme(storage, "app-theme", "auto");
assert.equal(storage.getItem("app-theme"), null);
assert.equal(readStoredTheme(storage, "app-theme"), "auto");
for (const stray of ["auto", "system", ""]) {
  memory.set("app-theme", stray);
  assert.equal(readStoredTheme(storage, "app-theme"), "auto");
}
assert.deepEqual(
  [...memory.values()].filter((value) => value === "auto"),
  [],
);
const nativePatterns = read("docs/native-patterns.md");
const bootstrap = pipThemeBootstrap("app-theme");
const helper = pipThemeControlScript("app-theme");
assert.ok(nativePatterns.includes(themeControlMarkup()));
assert.ok(nativePatterns.includes(bootstrap));
assert.ok(nativePatterns.includes(helper));
for (const source of [bootstrap, helper, themeControlMarkup()]) {
  assert.doesNotMatch(source, /system|data-theme="auto"|data-theme="system"/);
  assert.doesNotMatch(source, /setItem\([^)]*auto/);
}
assert.throws(() => pipThemeBootstrap(""));
function runThemeScript(source, { saved = null, prefersDark = false } = {}) {
  const attributes = new Map();
  const meta = {
    name: "theme-color",
    content: "#f4f5ef",
    setAttribute(name, value) {
      this[name] = value;
    },
  };
  const radios = ["auto", "light", "dark"].map((value) => ({
    type: "radio",
    value,
    checked: value === "auto",
    closest(selector) {
      return selector === ".kiwi-theme" ? radios : null;
    },
  }));
  const map = new Map(saved === null ? [] : [["app-theme", saved]]);
  let wrote = false;
  const localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      wrote = true;
      map.set(key, value);
    },
    removeItem: (key) => map.delete(key),
  };
  const listeners = {};
  const document = {
    documentElement: {
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: (name) => attributes.delete(name),
    },
    head: { appendChild() {} },
    querySelector: (selector) =>
      selector === 'meta[name="theme-color"]' ? meta : null,
    querySelectorAll: (selector) =>
      selector === ".kiwi-theme input[type='radio']" ? radios : [],
    createElement: () => ({
      setAttribute(name, value) {
        this[name] = value;
      },
    }),
    addEventListener: (type, listener) => {
      listeners[type] = listener;
    },
  };
  const mediaListeners = [];
  const context = vm.createContext({
    document,
    localStorage,
    window: {
      localStorage,
      matchMedia: () => ({
        matches: prefersDark,
        addEventListener: (_type, listener) => mediaListeners.push(listener),
      }),
      addEventListener: (type, listener) => {
        listeners[type] = listener;
      },
    },
  });
  vm.runInContext(source, context);
  return { attributes, meta, radios, map, wrote, listeners, mediaListeners };
}
const darkBoot = runThemeScript(bootstrap, { saved: "dark" });
assert.equal(darkBoot.attributes.get("data-theme"), "dark");
assert.equal(darkBoot.meta.content, "#0e0e0e");
assert.equal(darkBoot.wrote, false);
const lightBoot = runThemeScript(bootstrap, {
  saved: "light",
  prefersDark: true,
});
assert.equal(lightBoot.attributes.get("data-theme"), "light");
assert.equal(lightBoot.meta.content, "#f4f5ef");
const autoBoot = runThemeScript(bootstrap, { prefersDark: true });
assert.equal(autoBoot.attributes.has("data-theme"), false);
assert.equal(autoBoot.meta.content, "#0e0e0e");
const strayBoot = runThemeScript(bootstrap, {
  saved: "auto",
  prefersDark: false,
});
assert.equal(strayBoot.attributes.has("data-theme"), false);
assert.equal(strayBoot.meta.content, "#f4f5ef");
assert.equal(strayBoot.map.get("app-theme"), "auto");
const bound = runThemeScript(helper, { saved: "auto", prefersDark: true });
assert.equal(bound.map.has("app-theme"), false);
assert.equal(bound.attributes.has("data-theme"), false);
assert.equal(bound.meta.content, "#0e0e0e");
assert.equal(bound.radios.find((radio) => radio.checked)?.value, "auto");
bound.listeners.change({ target: bound.radios[2] });
assert.equal(bound.map.get("app-theme"), "dark");
assert.equal(bound.attributes.get("data-theme"), "dark");
assert.equal(bound.meta.content, "#0e0e0e");
assert.equal(bound.radios.find((radio) => radio.checked)?.value, "dark");
bound.listeners.change({ target: bound.radios[0] });
assert.equal(bound.map.has("app-theme"), false);
assert.equal(bound.attributes.has("data-theme"), false);
assert.equal([...bound.map.values()].includes("auto"), false);
const themeRules = [...styles.matchAll(/\.kiwi-theme[^{]*\{[^}]*\}/g)].map(
  (match) => match[0],
);
assert.ok(themeRules.length >= 4, "theme track rules missing");
for (const rule of themeRules) {
  assert.doesNotMatch(rule, /#[\da-f]{3,8}/i);
  assert.doesNotMatch(rule, /system/);
}
assert.match(
  styles,
  /\.kiwi-theme \.kiwi-segmented__options\s*\{[^}]*gap:\s*0;[^}]*height:\s*2\.75rem;/,
);
assert.match(
  styles,
  /\.kiwi-theme \.kiwi-segmented__label\s*\{[^}]*min-width:\s*2\.75rem;[^}]*min-height:\s*2\.75rem;/,
);
const themeFocus = styles
  .split("}")
  .find(
    (block) =>
      block.includes(".kiwi-theme") &&
      block.includes("input:focus-visible") &&
      block.includes("outline:"),
  );
assert.ok(themeFocus, "theme focus-visible rule missing");
assert.match(themeFocus, /outline:\s*2px solid var\(--kiwi-color-focus\)/);
assert.doesNotMatch(themeFocus, /#[\da-f]{3,8}/i);
assert.match(
  read("apps/docs/src/app/globals.css"),
  /\.docs-hero h1,[\s\S]*word-break:\s*keep-all;[\s\S]*text-wrap:\s*balance;/,
);
const themeEntry = read("packages/ui/dist/theme.js");
assert.doesNotMatch(themeEntry, /^["']use client["']/);
assert.doesNotMatch(themeEntry, /from ["']react["']/);
assert.ok(
  read("packages/ui/dist/index.js").startsWith('"use client";'),
  "preserve the React client boundary in the shipped bundle",
);
const homepage = read("apps/docs/out/index.html");
assert.ok(homepage.includes('id="pip-theme-bootstrap"'));
assert.ok(homepage.includes(pipThemeBootstrap("pip-theme")));
for (const label of ["자동", "밝게", "어둡게", "화면 테마"]) {
  assert.ok(homepage.includes(label), `catalog is missing ${label}`);
}
assert.doesNotMatch(homepage, /data-theme="auto"|data-theme="system"/);
const bootstrapAt = homepage.indexOf('id="pip-theme-bootstrap"');
const cssAt = homepage.search(/rel="stylesheet"|<style[\s>]/);
assert.ok(
  cssAt === -1 || bootstrapAt < cssAt,
  "pip-theme-bootstrap must run before CSS",
);
for (const rel of ["icon", "apple-touch-icon"]) {
  const link = [...homepage.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) =>
      Object.fromEntries(
        [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
      ),
    )
    .find((attrs) => attrs.rel === rel && attrs.type === "image/png");
  assert.ok(link, `${rel} needs an exported PNG link`);
  assert.equal(link.sizes, "180x180");
  const url = new URL(link.href, "https://design.whitekiwi.link");
  assert.equal(url.origin, "https://design.whitekiwi.link");
  assert.ok(url.pathname.endsWith(".png"));
  const png = readFileSync(new URL(`apps/docs/out${url.pathname}`, root));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 180);
  assert.equal(png.readUInt32BE(20), 180);
}
for (const kind of ["og", "twitter"]) {
  const match = homepage.match(
    new RegExp(`<meta (?:property|name)="${kind}:image" content="([^"]+)"`),
  );
  assert.ok(match, `${kind} image must be present in the exported HTML`);
  const image = new URL(match[1]);
  assert.equal(image.origin, "https://design.whitekiwi.link");
  assert.ok(
    image.pathname.endsWith(".png"),
    "static hosts need a PNG filename",
  );
  const png = readFileSync(new URL(`apps/docs/out${image.pathname}`, root));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
}
console.log(
  `${pairs} semantic contrast pairs and rendered component contracts passed (${fileURLToPath(root)})`,
);

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

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
const { Button, TextField } = await import(
  new URL("packages/ui/dist/index.js", root)
);
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
assert.ok(
  read("packages/ui/dist/index.js").startsWith('"use client";'),
  "preserve the React client boundary in the shipped bundle",
);
console.log(
  `${pairs} semantic contrast pairs and rendered component contracts passed (${fileURLToPath(root)})`,
);

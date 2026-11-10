import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { Window } from "happy-dom";

const require = createRequire(
  new URL("../apps/docs/package.json", import.meta.url),
);
const React = require("react");
const { createRoot, hydrateRoot } = require("react-dom/client");
const { renderToString } = require("react-dom/server");
const { act } = React;
const window = new Window();
for (const key of [
  "window",
  "document",
  "Element",
  "HTMLElement",
  "HTMLInputElement",
]) {
  globalThis[key] = key === "window" ? window : window[key];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let dark = false;
const mediaListeners = new Set();
window.matchMedia = () => ({
  get matches() {
    return dark;
  },
  addEventListener: (_type, listener) => mediaListeners.add(listener),
});
let frames = new Map();
let frameId = 0;
window.requestAnimationFrame = (callback) => {
  frames.set(++frameId, callback);
  return frameId;
};
window.cancelAnimationFrame = (id) => frames.delete(id);
async function frame() {
  const pending = frames;
  frames = new Map();
  await act(() => {
    for (const callback of pending.values()) callback();
  });
}
async function system(value) {
  dark = value;
  await act(() => {
    for (const listener of mediaListeners) listener();
  });
}
const { ThemeControl } = await import("../packages/ui/dist/index.js");
const { commitThemePreference } = await import("../packages/ui/dist/theme.js");
for (const mode of ["all-throw", "write-throw", "unavailable"]) {
  const key = `react-${mode}`;
  const saved = new Map();
  const calls = new Set();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() {
      if (mode === "unavailable") throw new Error("storage unavailable");
      return {
        getItem(name) {
          calls.add("get");
          if (mode === "all-throw") throw new Error("get");
          return saved.get(name) ?? null;
        },
        setItem() {
          calls.add("set");
          throw new Error("set");
        },
        removeItem() {
          calls.add("remove");
          throw new Error("remove");
        },
      };
    },
  });
  await system(true);
  const container = document.createElement("div");
  document.body.append(container);
  const element = React.createElement(ThemeControl, { storageKey: key });
  // Hydration must settle SSR's default light icon to system dark without readiness.
  container.innerHTML = renderToString(element);
  assert.equal(
    container.querySelector("button").classList.contains("kiwi-theme--motion"),
    false,
  );
  let root;
  await act(() => {
    root = hydrateRoot(container, element);
  });
  const button = container.querySelector("button");
  function expect(theme, explicit) {
    assert.equal(document.documentElement.getAttribute("data-theme"), explicit);
    assert.equal(
      document.querySelector('meta[name="theme-color"]').content,
      theme === "dark" ? "#0e0e0e" : "#f4f5ef",
    );
    assert.equal(button.dataset.resolvedTheme, theme);
    assert.equal(
      button.getAttribute("aria-label"),
      theme === "dark" ? "밝게 전환" : "어둡게 전환",
    );
    assert.equal(button.title, button.getAttribute("aria-label"));
  }
  expect("dark", null);
  assert.equal(button.classList.contains("kiwi-theme--motion"), false);
  await frame();
  assert.equal(button.classList.contains("kiwi-theme--motion"), false);
  await frame();
  assert.equal(button.classList.contains("kiwi-theme--motion"), true);
  await act(() => button.click());
  expect("light", "light");
  await system(false);
  await system(true);
  expect("light", "light");
  // An unreadable storage event must not erase an effective click.
  if (mode !== "write-throw") {
    await act(() =>
      window.dispatchEvent(new window.StorageEvent("storage", { key })),
    );
    expect("light", "light");
  }
  await act(() => button.click());
  expect("dark", "dark");
  // The public imperative entry and React must share the same effective store.
  await act(() => commitThemePreference(key, "auto"));
  expect("dark", null);
  await system(false);
  expect("light", null);
  if (mode === "write-throw") {
    saved.set(key, "dark");
    await act(() =>
      window.dispatchEvent(new window.StorageEvent("storage", { key })),
    );
    expect("dark", "dark");
    saved.clear();
    await act(() =>
      window.dispatchEvent(new window.StorageEvent("storage", { key: null })),
    );
    expect("light", null);
  }
  // Mounting another subscriber must preserve memory even when reads still work.
  await act(() => button.click());
  expect("dark", "dark");
  const sibling = document.createElement("div");
  document.body.append(sibling);
  const siblingRoot = createRoot(sibling);
  await act(() => siblingRoot.render(element));
  assert.equal(sibling.querySelector("button").dataset.resolvedTheme, "dark");
  await act(() => {
    root.unmount();
    siblingRoot.unmount();
  });
  assert.equal(frames.size, 0, "unmount cancels readiness frames");
  container.remove();
  sibling.remove();
  if (mode !== "unavailable")
    assert.deepEqual([...calls].sort(), ["get", "remove", "set"]);
}
// A successful initial read still takes precedence over the system and existing DOM.
Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: { getItem: () => "light", setItem() {}, removeItem() {} },
});
await system(true);
const storedContainer = document.createElement("div");
document.body.append(storedContainer);
const storedRoot = createRoot(storedContainer);
await act(() =>
  storedRoot.render(
    React.createElement(ThemeControl, { storageKey: "react-stored-initial" }),
  ),
);
assert.equal(
  storedContainer.querySelector("button").dataset.resolvedTheme,
  "light",
);
assert.equal(
  storedContainer.querySelector("button").getAttribute("aria-label"),
  "어둡게 전환",
);
assert.equal(document.documentElement.dataset.theme, "light");
await act(() => storedRoot.unmount());
assert.equal(frames.size, 0);
storedContainer.remove();
await window.happyDOM.close();
console.log(
  "React ThemeControl: throwing/unavailable storage, clicks, reset, media, cross-tab and hydration readiness passed.",
);

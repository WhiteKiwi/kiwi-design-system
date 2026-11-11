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
const {
  bindThemeControl,
  themeControlMarkup,
  commitThemePreference,
  effectiveThemePreference,
  subscribeThemePreference,
} = await import("../packages/ui/dist/theme.js");
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
  const changes = [];
  const element = React.createElement(ThemeControl, {
    storageKey: key,
    "aria-pressed": true,
    onPreferenceChange: (preference) => changes.push(preference),
  });
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
  assert.equal(button.hasAttribute("aria-pressed"), false);
  assert.equal(container.querySelector("fieldset, input, legend"), null);
  assert.equal(button.type, "button");
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
  assert.deepEqual(changes, ["light", "dark"]);
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
// Refresh remembered keys after their last subscriber leaves, without applying DOM.
const saved = new Map();
let unreadable = false;
Object.defineProperty(window, "localStorage", {
  configurable: true,
  get() {
    if (unreadable === "unavailable") throw new Error("storage unavailable");
    return {
      getItem(key) {
        if (unreadable) throw new Error("get");
        return saved.get(key) ?? null;
      },
      setItem(key, value) {
        saved.set(key, value);
      },
      removeItem(key) {
        saved.delete(key);
      },
    };
  },
});
let notifications = 0;
const onChange = () => {
  notifications += 1;
};
for (const eventKey of ["unmounted-stored", null]) {
  const key = eventKey ?? "unmounted-clear";
  saved.set(key, "light");
  const stop = subscribeThemePreference(key, onChange);
  assert.equal(effectiveThemePreference(key), "light");
  stop();
  const domBefore = document.documentElement.outerHTML;
  if (eventKey === null) saved.clear();
  else saved.set(key, "dark");
  window.dispatchEvent(new window.StorageEvent("storage", { key: eventKey }));
  assert.equal(document.documentElement.outerHTML, domBefore);
  const stopAgain = subscribeThemePreference(key, onChange);
  assert.equal(
    effectiveThemePreference(key),
    eventKey === null ? "auto" : "dark",
  );
  stopAgain();
  if (eventKey === null) {
    assert.equal(effectiveThemePreference("unmounted-stored"), "auto");
  }
}
for (const failure of [true, "unavailable"]) {
  const key = `unmounted-unreadable-${failure}`;
  const stop = subscribeThemePreference(key, onChange);
  commitThemePreference(key, "dark");
  stop();
  unreadable = failure;
  saved.clear();
  const domBefore = document.documentElement.outerHTML;
  for (const eventKey of [key, null]) {
    window.dispatchEvent(new window.StorageEvent("storage", { key: eventKey }));
    assert.equal(effectiveThemePreference(key), "dark");
    assert.equal(document.documentElement.outerHTML, domBefore);
  }
  const stopAgain = subscribeThemePreference(key, onChange);
  assert.equal(effectiveThemePreference(key), "dark");
  stopAgain();
  unreadable = false;
}
assert.equal(notifications, 2, "only subscribed commits notify listeners");
// The icon itself may be the binding scope, including sync and motion cleanup.
const scopedKey = "native-icon-scope";
saved.set(scopedKey, "light");
const scopedContainer = document.createElement("div");
// Stale dark markup proves initial binding synchronizes the scope element.
scopedContainer.innerHTML = themeControlMarkup({ theme: "dark" });
document.body.append(scopedContainer);
const scopedButton = scopedContainer.querySelector("button");
const unbind = bindThemeControl(scopedKey, scopedButton);
function expectScopedTheme(theme) {
  assert.equal(document.documentElement.dataset.theme, theme);
  assert.equal(
    document.querySelector('meta[name="theme-color"]').content,
    theme === "dark" ? "#0e0e0e" : "#f4f5ef",
  );
  assert.equal(scopedButton.dataset.resolvedTheme, theme);
  assert.equal(
    scopedButton.getAttribute("aria-label"),
    theme === "dark" ? "밝게 전환" : "어둡게 전환",
  );
  assert.equal(scopedButton.title, scopedButton.getAttribute("aria-label"));
  assert.equal(saved.get(scopedKey), theme);
}
expectScopedTheme("light");
scopedButton.click();
expectScopedTheme("dark");
scopedButton.click();
expectScopedTheme("light");
assert.equal(scopedButton.classList.contains("kiwi-theme--motion"), false);
await frame();
assert.equal(scopedButton.classList.contains("kiwi-theme--motion"), false);
await frame();
assert.equal(scopedButton.classList.contains("kiwi-theme--motion"), true);
// Cross-tab sync must also include the scope element.
saved.set(scopedKey, "dark");
window.dispatchEvent(new window.StorageEvent("storage", { key: scopedKey }));
expectScopedTheme("dark");
unbind();
assert.equal(scopedButton.classList.contains("kiwi-theme--motion"), false);
assert.equal(frames.size, 0);
scopedButton.click();
expectScopedTheme("dark");
// Unbinding also stops storage-driven attribute updates.
saved.set(scopedKey, "light");
window.dispatchEvent(new window.StorageEvent("storage", { key: scopedKey }));
assert.equal(scopedButton.dataset.resolvedTheme, "dark");
assert.equal(document.documentElement.dataset.theme, "dark");
scopedContainer.remove();
// Container scopes synchronize every descendant icon, ignore unrelated controls,
// and respect native disabled behavior.
const group = document.createElement("div");
group.innerHTML =
  themeControlMarkup() +
  themeControlMarkup({ theme: "dark" }) +
  '<input type="radio" value="auto">';
document.body.append(group);
const groupKey = "native-descendant-scope";
saved.set(groupKey, "light");
const stopGroup = bindThemeControl(groupKey, group);
const buttons = [...group.querySelectorAll("button")];
assert.ok(buttons.every((button) => button.dataset.resolvedTheme === "light"));
buttons[0].disabled = true;
buttons[0].click();
assert.equal(saved.get(groupKey), "light");
buttons[1]
  .querySelector("svg")
  .dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
assert.ok(buttons.every((button) => button.dataset.resolvedTheme === "dark"));
group
  .querySelector("input")
  .dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(saved.get(groupKey), "dark");
commitThemePreference(groupKey, "auto");
assert.equal(saved.has(groupKey), false);
assert.equal(document.documentElement.hasAttribute("data-theme"), false);
stopGroup();
assert.equal(frames.size, 0);
group.remove();
await window.happyDOM.close();
console.log(
  "ThemeControl: storage, clicks, reset, media, cross-tab, hydration readiness and native icon scope passed.",
);

import { themeGlyphMarkup } from "./theme-glyphs";

export const themeCanvas = {
  light: "#f4f5ef",
  dark: "#0e0e0e",
} as const;

export type ThemePreference = "auto" | "light" | "dark";

export type ThemeStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const storageKeyPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/;

export function assertThemeStorageKey(storageKey: string): void {
  if (!storageKeyPattern.test(storageKey)) {
    throw new Error(
      "Theme storage key must be 1-64 letters, numbers, or . _ : - characters.",
    );
  }
}

export function isThemePreference(value: string): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}

export function readStoredTheme(
  storage: ThemeStorage | null,
  storageKey: string,
): ThemePreference {
  try {
    const saved = storage?.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage can throw in private mode. Follow the device preference.
  }
  return "auto";
}

export function writeStoredTheme(
  storage: ThemeStorage | null,
  storageKey: string,
  preference: ThemePreference,
): void {
  if (!storage) return;
  try {
    if (preference === "light" || preference === "dark") {
      storage.setItem(storageKey, preference);
      return;
    }
    storage.removeItem(storageKey);
  } catch {
    // Ignore unavailable storage. The document attribute still updates.
  }
}

/** Drop stored values other than light or dark, including a legacy auto value. */
export function normalizeStoredTheme(
  storage: ThemeStorage | null,
  storageKey: string,
): ThemePreference {
  let saved: string | null = null;
  try {
    saved = storage?.getItem(storageKey) ?? null;
  } catch {
    return "auto";
  }
  if (saved === "light" || saved === "dark") return saved;
  if (saved !== null) writeStoredTheme(storage, storageKey, "auto");
  return "auto";
}

export function resolvedTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): "light" | "dark" {
  return preference === "auto" ? (prefersDark ? "dark" : "light") : preference;
}

export function themeToggleLabel(theme: "light" | "dark"): string {
  return theme === "light" ? "어둡게 전환" : "밝게 전환";
}

export function canvasColor(
  preference: ThemePreference,
  prefersDark: boolean,
): string {
  return themeCanvas[resolvedTheme(preference, prefersDark)];
}

export function browserStorage(): ThemeStorage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function applyThemeDom(preference: ThemePreference): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (preference === "light" || preference === "dark") {
    root.setAttribute("data-theme", preference);
  } else root.removeAttribute("data-theme");
  const existing = document.querySelector('meta[name="theme-color"]');
  const meta = existing ?? document.createElement("meta");
  if (!existing) {
    meta.setAttribute("name", "theme-color");
    (document.head ?? root).appendChild(meta);
  }
  meta.setAttribute("content", canvasColor(preference, prefersDark()));
}

// Persistence initializes the preference once; failed reads/writes never erase it.
const effectivePreferences = new Map<string, ThemePreference>();

export function effectiveThemePreference(storageKey: string): ThemePreference {
  if (!effectivePreferences.has(storageKey)) {
    effectivePreferences.set(
      storageKey,
      normalizeStoredTheme(browserStorage(), storageKey),
    );
  }
  return effectivePreferences.get(storageKey) ?? "auto";
}

function refreshThemePreference(storageKey: string): ThemePreference {
  try {
    const storage = browserStorage();
    if (storage) {
      const saved = storage.getItem(storageKey);
      effectivePreferences.set(
        storageKey,
        saved === "light" || saved === "dark" ? saved : "auto",
      );
    }
  } catch {
    // Keep the effective preference when persistence is unreadable.
  }
  return effectiveThemePreference(storageKey);
}

const listeners = new Map<string, Set<() => void>>();
let watching = false;

function emit(storageKey: string) {
  for (const listener of listeners.get(storageKey) ?? []) listener();
}

function ensureEnvironmentWatch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", (event) => {
    for (const storageKey of listeners.keys()) {
      if (event.key !== null && event.key !== storageKey) continue;
      applyThemeDom(refreshThemePreference(storageKey));
      emit(storageKey);
    }
  });
  media.addEventListener("change", () => {
    for (const storageKey of listeners.keys()) {
      if (effectiveThemePreference(storageKey) === "auto") {
        applyThemeDom("auto");
      }
      emit(storageKey);
    }
  });
}

export function subscribeThemePreference(
  storageKey: string,
  onChange: () => void,
): () => void {
  assertThemeStorageKey(storageKey);
  effectiveThemePreference(storageKey);
  ensureEnvironmentWatch();
  const group = listeners.get(storageKey) ?? new Set<() => void>();
  group.add(onChange);
  listeners.set(storageKey, group);
  return () => {
    group.delete(onChange);
    if (group.size === 0) listeners.delete(storageKey);
  };
}

export function commitThemePreference(
  storageKey: string,
  preference: ThemePreference,
): void {
  assertThemeStorageKey(storageKey);
  effectivePreferences.set(storageKey, preference);
  writeStoredTheme(browserStorage(), storageKey, preference);
  applyThemeDom(preference);
  emit(storageKey);
}

function withStorageKey(source: string, storageKey: string): string {
  assertThemeStorageKey(storageKey);
  return source.replaceAll("__KEY__", JSON.stringify(storageKey));
}

/** Inline script for the document head. Run it before any stylesheet. */
export function pipThemeBootstrap(storageKey: string): string {
  return withStorageKey(
    `(function () {
  try {
    var key = __KEY__;
    var saved = null;
    try {
      saved = localStorage.getItem(key);
    } catch (error) {}
    var theme = saved === "light" || saved === "dark" ? saved : "";
    var root = document.documentElement;
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
    var dark =
      theme === "dark" ||
      (theme === "" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    var color = dark ? "${themeCanvas.dark}" : "${themeCanvas.light}";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      (document.head || root).appendChild(meta);
    }
    meta.setAttribute("content", color);
  } catch (error) {}
})();`,
    storageKey,
  );
}

/** Inline script for non-React pages. Place it after the theme markup. */
export function pipThemeControlScript(storageKey: string): string {
  return withStorageKey(
    `(function () {
  try {
    var key = __KEY__;
    var root = document.documentElement;
    function store() {
      try {
        return window.localStorage;
      } catch (error) {
        return null;
      }
    }
    var effective = "auto";
    function read() {
      var storage = store();
      if (!storage) return effective;
      var saved = null;
      try {
        saved = storage.getItem(key);
      } catch (error) { return effective; }
      if (saved === "light" || saved === "dark") return (effective = saved);
      if (saved !== null && storage) {
        try {
          storage.removeItem(key);
        } catch (error) {}
      }
      return (effective = "auto");
    }
    function resolve(preference) {
      return preference === "auto"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : preference;
    }
    function colorFor(preference) {
      return resolve(preference) === "dark" ? "${themeCanvas.dark}" : "${themeCanvas.light}";
    }
    function apply(preference) {
      if (preference === "light" || preference === "dark") {
        root.setAttribute("data-theme", preference);
      } else root.removeAttribute("data-theme");
      var meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        (document.head || root).appendChild(meta);
      }
      meta.setAttribute("content", colorFor(preference));
    }
    function write(preference) {
      effective = preference;
      var storage = store();
      if (!storage) return;
      try {
        if (preference === "light" || preference === "dark") {
          storage.setItem(key, preference);
        } else storage.removeItem(key);
      } catch (error) {}
    }
    function sync(preference) {
      var theme = resolve(preference);
      var buttons = document.querySelectorAll("button.kiwi-theme--icon");
      for (var index = 0; index < buttons.length; index += 1) {
        var label = theme === "light" ? "어둡게 전환" : "밝게 전환";
        buttons[index].setAttribute("data-resolved-theme", theme);
        buttons[index].setAttribute("aria-label", label);
        buttons[index].setAttribute("title", label);
      }
      var inputs = document.querySelectorAll(".kiwi-theme input[type='radio']");
      for (var index = 0; index < inputs.length; index += 1) {
        inputs[index].checked = inputs[index].value === preference;
      }
    }
    document.addEventListener("click", function (event) {
      var target = event.target;
      var button = target && target.closest && target.closest("button.kiwi-theme--icon");
      if (!button || button.disabled) return;
      var value = button.getAttribute("data-resolved-theme") === "dark" ? "light" : "dark";
      write(value);
      apply(value);
      sync(value);
    });
    document.addEventListener("change", function (event) {
      var input = event.target;
      if (!input || !input.closest || !input.closest(".kiwi-theme")) return;
      if (input.type !== "radio") return;
      var value = input.value;
      if (value !== "auto" && value !== "light" && value !== "dark") return;
      write(value);
      apply(value);
      sync(value);
    });
    window.addEventListener("storage", function (event) {
      if (event.key !== null && event.key !== key) return;
      var preference = read();
      apply(preference);
      sync(preference);
    });
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        var preference = effective;
        if (preference === "auto") apply(preference);
        sync(preference);
      });
    var initial = read();
    apply(initial);
    sync(initial);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        var buttons = document.querySelectorAll("button.kiwi-theme--icon");
        for (var index = 0; index < buttons.length; index += 1) {
          buttons[index].classList.add("kiwi-theme--motion");
        }
      });
    });
  } catch (error) {}
})();`,
    storageKey,
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

let markupId = 0;

export function themeControlMarkup({
  variant = "icon",
  name = "theme",
  legend = "화면 테마",
  hideLegend = true,
  id,
  theme = "light",
}: {
  variant?: "icon" | "segmented";
  name?: string;
  legend?: string;
  hideLegend?: boolean;
  id?: string;
  theme?: "light" | "dark";
} = {}): string {
  if (!storageKeyPattern.test(name)) {
    throw new Error("Theme radio name must be a short unquoted token.");
  }
  if (variant === "icon") {
    const glyphId = id ?? `kiwi-theme-${++markupId}`;
    const label = themeToggleLabel(theme);
    return `<button type="button" class="kiwi-theme kiwi-theme--icon" data-resolved-theme="${theme}" aria-label="${label}" title="${label}">
${themeGlyphMarkup(glyphId)}
</button>`;
  }
  const legendClass = hideLegend ? "kiwi-sr-only" : "kiwi-field__label";
  const option = (value: ThemePreference, label: string, checked = false) =>
    `    <label class="kiwi-segmented__option"><input class="kiwi-sr-only" type="radio" name="${name}" value="${value}"${checked ? " checked" : ""}><span class="kiwi-segmented__label">${label}</span></label>`;
  return `<fieldset class="kiwi-segmented kiwi-theme">
  <legend class="${legendClass}">${escapeHtml(legend)}</legend>
  <div class="kiwi-segmented__options">
${option("auto", "자동", true)}
${option("light", "밝게")}
${option("dark", "어둡게")}
  </div>
</fieldset>`;
}

export function bindThemeControl(
  storageKey: string,
  scope: ParentNode = document,
): () => void {
  assertThemeStorageKey(storageKey);
  const sync = (preference: ThemePreference) => {
    const theme = resolvedTheme(preference, prefersDark());
    for (const button of scope.querySelectorAll<HTMLButtonElement>(
      "button.kiwi-theme--icon",
    )) {
      button.setAttribute("data-resolved-theme", theme);
      button.setAttribute("aria-label", themeToggleLabel(theme));
      button.setAttribute("title", themeToggleLabel(theme));
    }
    for (const input of scope.querySelectorAll<HTMLInputElement>(
      ".kiwi-theme input[type='radio']",
    )) {
      input.checked = input.value === preference;
    }
  };
  const onChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== "radio" || !target.closest(".kiwi-theme")) return;
    if (!scope.contains(target) || !isThemePreference(target.value)) return;
    commitThemePreference(storageKey, target.value);
    sync(target.value);
  };
  const onClick = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>(
      "button.kiwi-theme--icon",
    );
    if (!button || button.disabled || !scope.contains(button)) return;
    const theme = button.getAttribute("data-resolved-theme");
    commitThemePreference(storageKey, theme === "dark" ? "light" : "dark");
  };
  scope.addEventListener("click", onClick);
  scope.addEventListener("change", onChange);
  const stop = subscribeThemePreference(storageKey, () => {
    sync(effectiveThemePreference(storageKey));
  });
  const initial = effectiveThemePreference(storageKey);
  applyThemeDom(initial);
  sync(initial);
  let frame = window.requestAnimationFrame(() => {
    frame = window.requestAnimationFrame(() => {
      for (const button of scope.querySelectorAll("button.kiwi-theme--icon")) {
        button.classList.add("kiwi-theme--motion");
      }
    });
  });
  return () => {
    window.cancelAnimationFrame(frame);
    for (const button of scope.querySelectorAll("button.kiwi-theme--icon")) {
      button.classList.remove("kiwi-theme--motion");
    }
    scope.removeEventListener("click", onClick);
    scope.removeEventListener("change", onChange);
    stop();
  };
}

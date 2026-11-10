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

export function canvasColor(
  preference: ThemePreference,
  prefersDark: boolean,
): string {
  if (preference === "dark") return themeCanvas.dark;
  if (preference === "light") return themeCanvas.light;
  return prefersDark ? themeCanvas.dark : themeCanvas.light;
}

export function browserStorage(): ThemeStorage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function prefersDark(): boolean {
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
    if (!event.key || !listeners.has(event.key)) return;
    applyThemeDom(readStoredTheme(browserStorage(), event.key));
    emit(event.key);
  });
  media.addEventListener("change", () => {
    for (const storageKey of listeners.keys()) {
      if (readStoredTheme(browserStorage(), storageKey) === "auto") {
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
  normalizeStoredTheme(browserStorage(), storageKey);
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
    function read() {
      var storage = store();
      var saved = null;
      try {
        saved = storage ? storage.getItem(key) : null;
      } catch (error) {}
      if (saved === "light" || saved === "dark") return saved;
      if (saved !== null && storage) {
        try {
          storage.removeItem(key);
        } catch (error) {}
      }
      return "auto";
    }
    function colorFor(preference) {
      var dark =
        preference === "dark" ||
        (preference === "auto" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      return dark ? "${themeCanvas.dark}" : "${themeCanvas.light}";
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
      var storage = store();
      if (!storage) return;
      try {
        if (preference === "light" || preference === "dark") {
          storage.setItem(key, preference);
        } else storage.removeItem(key);
      } catch (error) {}
    }
    function sync(preference) {
      var inputs = document.querySelectorAll(".kiwi-theme input[type='radio']");
      for (var index = 0; index < inputs.length; index += 1) {
        inputs[index].checked = inputs[index].value === preference;
      }
    }
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
      if (event.key !== key) return;
      var preference = read();
      apply(preference);
      sync(preference);
    });
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (read() === "auto") apply("auto");
      });
    var initial = read();
    apply(initial);
    sync(initial);
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

export function themeControlMarkup({
  name = "theme",
  legend = "화면 테마",
  hideLegend = true,
}: {
  name?: string;
  legend?: string;
  hideLegend?: boolean;
} = {}): string {
  if (!storageKeyPattern.test(name)) {
    throw new Error("Theme radio name must be a short unquoted token.");
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
  scope.addEventListener("change", onChange);
  const stop = subscribeThemePreference(storageKey, () => {
    sync(readStoredTheme(browserStorage(), storageKey));
  });
  const initial = normalizeStoredTheme(browserStorage(), storageKey);
  applyThemeDom(initial);
  sync(initial);
  return () => {
    scope.removeEventListener("change", onChange);
    stop();
  };
}

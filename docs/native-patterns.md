# Native HTML patterns

PIP tokens and `@whitekiwi/ui/styles.css` can style native HTML without importing
its React JavaScript entry. Use the same package versions and load tokens, UI CSS,
then product CSS. A package manager may install React peers at build time; they
are not required in the browser for these patterns. Copy the exported CSS during
the existing build, or vendor it unchanged with the source version and MIT license.
Do not invent a CDN URL or copy only selected rules that lose state updates.

These documented classes and DOM relationships are the supported native surface.
Other component internals are not an override API. Keep IDs and radio names unique
per independent group, preserve labels, and verify the actual product in both themes.
The native HTML variant shares styles and contracts; it does not load React behavior.

## Labeled select

```html
<div class="kiwi-field">
  <label class="kiwi-field__label" for="cycle">Billing cycle</label>
  <select class="kiwi-field__input" id="cycle" name="cycle" aria-describedby="cycle-help">
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
  <span class="kiwi-field__description" id="cycle-help">Choose a period.</span>
</div>
```

For invalid input, set `aria-invalid="true"` and use `kiwi-field__error` on the
linked error description. Append other description IDs rather than replacing them.
Use native `disabled` / `required`; validation and submitting data belong to the app.

## Single choice

```html
<fieldset class="kiwi-segmented">
  <legend class="kiwi-sr-only">Card side</legend>
  <div class="kiwi-segmented__options">
    <label class="kiwi-segmented__option">
      <input class="kiwi-sr-only" type="radio" name="side" value="front" checked>
      <span class="kiwi-segmented__label">Front</span>
    </label>
    <label class="kiwi-segmented__option">
      <input class="kiwi-sr-only" type="radio" name="side" value="back">
      <span class="kiwi-segmented__label">Back</span>
    </label>
  </div>
</fieldset>
```

Listen for `change` on the radios. When another action changes the value, update
`checked` to match. Browser radio behavior provides arrow-key selection, one tab
stop for the selected group, and form submission/reset. Native disabled options
are skipped. Keep the input before its label span for checked/focus styles. Never
hide it with `display:none`. Use a visible `kiwi-field__label` legend when needed.
This is not a tablist: route changes and panel focus belong to the consumer.

## Screen theme

Use the default icon button in product headers: a 44×44 ghost target with a
resolved sun/moon and Korean action name/title. Click fixes the opposite theme.
The helper below synchronizes the initial light markup before interaction.
It follows system changes live until an explicit preference is stored.

```html
<button type="button" class="kiwi-theme kiwi-theme--icon" data-resolved-theme="light" aria-label="어둡게 전환" title="어둡게 전환">
<svg class="kiwi-theme__glyph" aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24">
        <mask class="moon" id="kiwi-theme-example-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle class="sun" cx="12" cy="12" r="6" mask="url(#kiwi-theme-example-mask)" fill="currentColor" />
        <g class="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
         </g>
      </svg>
</button>
```

IDs are unique per `themeControlMarkup()` call. When copying this example more
than once, replace every `kiwi-theme-example` suffix consistently per instance.
The 22px glyph ports the original 24×24 GUI Challenges / Adam Argyle theme-switch
SVG and picked motion A. See [UI attribution and timings](../packages/ui/README.md#screen-theme).
Bindings enable transitions after initial sync has painted (two animation frames);
first paint, hydration and reduced motion stay instant. Failed or unavailable
storage retains the effective preference in memory, including after reset to auto.
Readable storage events refresh it; system changes follow only effective auto.

ThemeControl's `variant="segmented"` was removed in 0.2.5; the control is
icon-only. `themeControlMarkup()` accepts only `id` and `theme` options.
The standalone SegmentedControl pattern above is unchanged.

`pip-theme-bootstrap` must be the first blocking script in `<head>`, before
stylesheets. Replace `app-theme` with the app's storage key. The script reads
only `light` or `dark`. Any other stored value, including a missing key, leaves
`data-theme` unset. It sets `theme-color` to `#0e0e0e` or `#f4f5ef`, matching
`--kiwi-carbon` and `--kiwi-paper`.

```html
<meta name="theme-color" content="#f4f5ef">
<script id="pip-theme-bootstrap">
(function () {
  try {
    var key = "app-theme";
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
    var color = dark ? "#0e0e0e" : "#f4f5ef";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      (document.head || root).appendChild(meta);
    }
    meta.setAttribute("content", color);
  } catch (error) {}
})();
</script>
```

After the markup, run the helper once. It checks the saved option, writes only
`light` or `dark`, deletes the key for 자동, and keeps `theme-color` in sync
when the device preference changes. React apps call `ThemeControl` and
`pipThemeBootstrap` instead of copying this helper.

```html
<script>
(function () {
  try {
    var key = "app-theme";
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
      return resolve(preference) === "dark" ? "#0e0e0e" : "#f4f5ef";
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
})();
</script>
```

`@whitekiwi/ui/theme` exports `themeControlMarkup`, `pipThemeBootstrap`, and
`pipThemeControlScript` for the same text. `bindThemeControl(storageKey)` is
the module form of the helper. Bind either once per page; both support icon
buttons. `commitThemePreference(storageKey, "auto")` clears the
key and root attribute; the icon has no reset UI.

## Empty content

```html
<div class="kiwi-empty-state">
  <h3 class="kiwi-empty-state__title">No matching records</h3>
  <div class="kiwi-empty-state__description">Try another period.</div>
</div>
```

Use the heading level appropriate to the page. Add a `kiwi-empty-state__actions`
container for real actions. Do not imply zero records when collection is missing
or failed. The app owns loading/error distinctions and live-region announcements.

## Why these patterns

Finance had a local labeled Select and Empty component; Finance filters, Namecard's
side/theme choices and the PIP catalog's ThemeToggle independently implemented
single selection. Screen theme now uses the shared icon-only `ThemeControl` above. These are small reusable contracts without product data.
Finance's calculations/calendar, Workspace's host actions, and Ticketman's booking
workflow remain product-owned. Existing native dialogs/toasts have different
lifecycle and announcement requirements; this release does not replace them with
an unverified shared abstraction.

Check keyboard behavior, native form values/reset, disabled states, long labels,
320px/390px/desktop, light/dark and forced-colors when changing this surface.
[Native select](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select)
and [radio groups](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)
provide the underlying semantics.

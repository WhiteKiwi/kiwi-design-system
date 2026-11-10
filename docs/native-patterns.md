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

Use the same connected track as `ThemeControl`. Visible labels are 자동, 밝게,
and 어둡게. Values are `auto`, `light`, and `dark`. Give each group a unique
radio `name`. The legend is `화면 테마`; keep `kiwi-sr-only` in a header, or
use `kiwi-field__label` when the legend should be visible.

```html
<fieldset class="kiwi-segmented kiwi-theme">
  <legend class="kiwi-sr-only">화면 테마</legend>
  <div class="kiwi-segmented__options">
    <label class="kiwi-segmented__option"><input class="kiwi-sr-only" type="radio" name="theme" value="auto" checked><span class="kiwi-segmented__label">자동</span></label>
    <label class="kiwi-segmented__option"><input class="kiwi-sr-only" type="radio" name="theme" value="light"><span class="kiwi-segmented__label">밝게</span></label>
    <label class="kiwi-segmented__option"><input class="kiwi-sr-only" type="radio" name="theme" value="dark"><span class="kiwi-segmented__label">어둡게</span></label>
  </div>
</fieldset>
```

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
      return dark ? "#0e0e0e" : "#f4f5ef";
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
})();
</script>
```

`@whitekiwi/ui/theme` exports `themeControlMarkup`, `pipThemeBootstrap`, and
`pipThemeControlScript` for the same text. `bindThemeControl(storageKey)` is
the module form of the helper.

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
single selection. Screen theme now uses the shared `ThemeControl` track above. These are small reusable contracts without product data.
Finance's calculations/calendar, Workspace's host actions, and Ticketman's booking
workflow remain product-owned. Existing native dialogs/toasts have different
lifecycle and announcement requirements; this release does not replace them with
an unverified shared abstraction.

Check keyboard behavior, native form values/reset, disabled states, long labels,
320px/390px/desktop, light/dark and forced-colors when changing this surface.
[Native select](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select)
and [radio groups](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)
provide the underlying semantics.

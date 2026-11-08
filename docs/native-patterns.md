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
single selection. These are small reusable contracts without product data.
Finance's calculations/calendar, Workspace's host actions, and Ticketman's booking
workflow remain product-owned. Existing native dialogs/toasts have different
lifecycle and announcement requirements; this release does not replace them with
an unverified shared abstraction.

Check keyboard behavior, native form values/reset, disabled states, long labels,
320px/390px/desktop, light/dark and forced-colors when changing this surface.
[Native select](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select)
and [radio groups](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)
provide the underlying semantics.

# 0.2.4

Both `@whitekiwi/tokens` and `@whitekiwi/ui` move to 0.2.4 together. Token values
remain 0.2.3-compatible; shared motion tokens are unchanged.

- `ThemeControl` and `themeControlMarkup()` now default to `variant="icon"`:
  a 44×44 ghost button showing the resolved sun or moon, with a Korean action
  name/title. Clicking stores the opposite of the currently shown theme.
- `variant="segmented"` preserves 자동 / 밝게 / 어둡게 for settings and catalogs
  only. Do not use it in product headers. Existing calls without `variant`
  intentionally change appearance; `label` / `hideLabel` still work in segmented.
- Bootstrap, storage key validation, canvas colors, and auto storage rules are
  unchanged. Auto omits `data-theme`, stores nothing, and follows system changes
  live for both the icon and `theme-color`. `commitThemePreference(key, "auto")`
  clears a fixed choice; the icon has no reset UI.
- Picked motion A ports the official GUI Challenges / Adam Argyle
  [theme-switch](https://github.com/argyleink/gui-challenges/tree/82317d0d04c4f38ddf781439e282aa67ecb5b7f6/theme-switch),
  commit `82317d0d04c4f38ddf781439e282aa67ecb5b7f6`. Original 24×24 geometry is
  displayed at 22px; sun, eight rays and crescent mask use the official elastic
  motion (250ms sun, 150ms rays, 500ms mask after 250ms delay to dark;
  500ms sun/rays and 250ms mask to light). First paint, hydration and reduced
  motion are instant; transitions wait until initial sync has painted.
  Repository LICENSE is Apache-2.0, while theme-switch/package.json declares ISC
  (inconsistent upstream metadata). The package includes a
  [notice](../packages/ui/THIRD_PARTY.md) and Apache-2.0 text; WhiteKiwi stays MIT.
- React and vanilla retain the effective preference in memory when storage
  get/set/remove throws or storage is unavailable. Both clicks and reset keep
  the document, theme-color, glyph and action label in sync. Readable cross-tab
  events refresh memory; media changes follow only while preference is auto.
- React and native bindings support both variants; `@whitekiwi/ui/theme` stays
  React-free. The catalog header adopts the icon and specimens show both themes.

No npm publication is performed in this PR. Merge, catalog deployment, npm
publication, and consumer adoption remain separate outcomes.

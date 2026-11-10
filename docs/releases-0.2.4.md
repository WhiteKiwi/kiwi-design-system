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
- Inline glyph geometry adapts Phosphor Regular sun/moon 2.1.1, MIT,
  [copyright Phosphor Icons](https://unpkg.com/@phosphor-icons/core@2.1.1/LICENSE),
  as a placeholder without a runtime dependency. One SVG morphs with a sliding
  crescent mask rather than crossfading icons. Glyph and component-scoped 380ms
  ease-out motion are pending the designer's final pick. Reduced motion is instant.
- React and native bindings support both variants; `@whitekiwi/ui/theme` stays
  React-free. The catalog header adopts the icon and specimens show both themes.

No npm publication is performed in this PR. Merge, catalog deployment, npm
publication, and consumer adoption remain separate outcomes.

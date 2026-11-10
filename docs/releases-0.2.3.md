# 0.2.3

Both `@whitekiwi/tokens` and `@whitekiwi/ui` release together. Token values are
unchanged.

- Add `ThemeControl`, a connected header track labeled 자동 / 밝게 / 어둡게
  (`auto` / `light` / `dark`).
- `light` and `dark` set `<html data-theme>`. `auto` removes that attribute and
  deletes the app's localStorage key. Only `light` or `dark` is stored.
- Document `pip-theme-bootstrap`, an inline script that runs before CSS and sets
  `theme-color` to `#0e0e0e` or `#f4f5ef`.
- Share the same markup and CSS with non-React pages, plus
  `pipThemeControlScript` / `bindThemeControl`.
- Keep catalog headlines from breaking one Korean syllable onto its own line.

The app chooses the storage key. React products use `ThemeControl`; other
products use the documented markup, bootstrap, and helper.

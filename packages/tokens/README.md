![PIP — A shared visual language. CSS tokens for any framework.](https://raw.githubusercontent.com/WhiteKiwi/kiwi-design-system/main/assets/npm-tokens.svg)

# @whitekiwi/tokens

**One visual language. Your framework.**

PIP's semantic CSS tokens for warm neutral surfaces, clear typography, and a single
kiwi accent. Use them on their own or as the foundation for `@whitekiwi/ui`.

[Explore PIP](https://design.whitekiwi.link/) · [Source](https://github.com/WhiteKiwi/kiwi-design-system/tree/main/packages/tokens) · [Release guide](https://github.com/WhiteKiwi/kiwi-design-system/blob/main/docs/npm-release.md)

## Choose your starting point

| Package | What it owns | Use it when |
| --- | --- | --- |
| **@whitekiwi/tokens** | Palette, semantic colors, spacing, radii, font stacks, themes | You write the UI in CSS, React, Vue, Svelte, or plain HTML |
| [@whitekiwi/ui](https://github.com/WhiteKiwi/kiwi-design-system/tree/main/packages/ui) | React components and their interaction styles | You want ready-made PIP building blocks |

This package has no JavaScript runtime or React dependency. Tailwind is optional.

## Start with a surface

Once the package is published to your registry:

```sh
npm install @whitekiwi/tokens
```

Import at the top of your global stylesheet with a package-aware bundler:

```css
@import "@whitekiwi/tokens/theme.css";

body {
  margin: 0;
  color: var(--kiwi-color-text);
  background: var(--kiwi-color-canvas);
  font-family: var(--kiwi-font-sans);
}

.panel {
  padding: var(--kiwi-space-6);
  background: var(--kiwi-color-surface);
  border: 1px solid var(--kiwi-color-border);
  border-radius: var(--kiwi-radius-md);
}
```

For an unbundled page, copy the exported CSS to your public assets and load it
with a stylesheet link. Browsers do not resolve npm package names themselves.

## Light, dark, or the system

Set the theme on the root `<html>` element:

| Preference | Root markup |
| --- | --- |
| Light | `<html data-theme="light">` |
| Dark | `<html data-theme="dark">` |
| System | `<html>` with no `data-theme` attribute |

For system mode, remove the attribute; `data-theme="auto"` does **not** enable
system detection. Theme colors follow `prefers-color-scheme` only when the
attribute is absent. Apply a saved explicit preference before first paint to
avoid a light/dark flash. Theme storage and switching belong to your app.

## Use roles, not raw colors

| Need | Token |
| --- | --- |
| Page / readable text | `--kiwi-color-canvas` / `--kiwi-color-text` |
| Secondary copy | `--kiwi-color-text-muted` |
| Decorative divider | `--kiwi-color-border` |
| Form-control boundary | `--kiwi-color-control-border` |
| Brand surface / its text | `--kiwi-color-brand-field` / `--kiwi-color-on-brand` |
| Interactive text / focus | `--kiwi-color-interactive` / `--kiwi-color-focus` |

Keep foreground/background pairs together when overriding colors. Fonts are
stack names, not bundled font files. Load your fonts separately or use the
system fallbacks. Tokens do not apply a reset, component styles, or a page layout.

The stylesheet includes an optional Tailwind CSS v4 `@theme inline` bridge for
utilities and breakpoints. Plain CSS consumers use the `--kiwi-*` custom
properties; browsers ignore that Tailwind-only at-rule. Use a toolchain/browser
that supports CSS custom properties and `color-mix()`.

## Public surface

- `@whitekiwi/tokens/theme.css` is the only export
- No root JavaScript import, theme-switching script, or JSON token API
- Install matching token/UI versions when using both packages
- Package contents: CSS, this README, package metadata, and MIT license

The repository checks defined theme contrast pairs. Custom colors, opacity,
backgrounds, and application composition still need accessibility review.

## License

[MIT](https://github.com/WhiteKiwi/kiwi-design-system/blob/main/packages/tokens/LICENSE), copyright WhiteKiwi.
Third-party dependencies and separately licensed material retain their own licenses.

# @whitekiwi/tokens

PIP's light/dark semantic design tokens: color, spacing, type, radius, motion,
breakpoints, and interaction state contracts.

## Use

After the first public release:

```sh
npm install @whitekiwi/tokens
```

Import the CSS once at your application's global entry point:

```css
@import "@whitekiwi/tokens/theme.css";

.example {
  color: var(--kiwi-color-text);
  background: var(--kiwi-color-canvas);
  padding: var(--kiwi-space-4);
}
```

Set `data-theme="dark"` on the document root to opt into the dark theme. Components
should consume semantic roles rather than primitive palette values.

This is a CSS-only package. Its public export is `@whitekiwi/tokens/theme.css`;
there is no JavaScript default export and no Tailwind runtime dependency.

[Documentation](https://design.whitekiwi.link/) ·
[Source and release guide](https://github.com/WhiteKiwi/kiwi-design-system)

## License status

No distribution license has been selected yet. This package is currently marked
`UNLICENSED`, and the release workflow blocks publication until an approved
license identifier and `LICENSE` file have been added. A package preview is not
a public release.

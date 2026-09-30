# @whitekiwi/ui

PIP's React controls, feedback, editorial surfaces, and Radix-backed disclosure.

## Use

After the first public release:

```sh
npm install @whitekiwi/ui @whitekiwi/tokens react react-dom
```

React and React DOM 19 or newer are peer dependencies. Use the matching PIP token
release. Import both CSS entry points once in your application's global entry:

```tsx
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";
import { Button, Disclosure, TextField } from "@whitekiwi/ui";
```

The package ships ESM JavaScript, TypeScript declarations, and CSS. Its JavaScript
entry preserves the `"use client"` directive for React Server Component-aware
frameworks. Components include `Button`, `TextField`, `TextLink`, `Badge`,
`Callout`, `StaticCard`, `LinkedCard`, `SectionHeading`, `CollectionHeading`,
`Disclosure`, and the `cn` class-name helper.

Tokens set the visual roles; the UI stylesheet implements component states. The
application remains responsible for its content, page layout, and font loading.

[Documentation](https://design.whitekiwi.link/) ·
[Source and release guide](https://github.com/WhiteKiwi/kiwi-design-system)

## License status

No distribution license has been selected yet. This package is currently marked
`UNLICENSED`, and the release workflow blocks publication until an approved
license identifier and `LICENSE` file have been added. A package preview is not
a public release.

![PIP — Small parts. Clear interfaces. React components built on tokens.](https://raw.githubusercontent.com/WhiteKiwi/kiwi-design-system/main/assets/npm-ui.svg)

# @whitekiwi/ui

**Quiet structure. Clear interaction.**

PIP's React building blocks: controls, feedback, editorial surfaces, and disclosure.
Semantic HTML carries the structure; `@whitekiwi/tokens` carries the visual language.

[Explore components](https://design.whitekiwi.link/#components) · [Source](https://github.com/WhiteKiwi/kiwi-design-system/tree/main/packages/ui) · [Release guide](https://github.com/WhiteKiwi/kiwi-design-system/blob/main/docs/npm-release.md)

## Two packages, one system

| Package | Responsibility |
| --- | --- |
| [@whitekiwi/tokens](https://github.com/WhiteKiwi/kiwi-design-system/tree/main/packages/tokens) | Framework-independent CSS values and light/dark themes |
| **@whitekiwi/ui** | React components, component CSS, and interaction states |

Tokens can stand alone. UI requires tokens as a peer dependency; install matching
PIP versions. React and React DOM are peers, so your application owns their runtime.

## Build your first screen

Once the packages are published to your registry:

```sh
npm install @whitekiwi/ui @whitekiwi/tokens react react-dom
```

React and React DOM **19 or newer** satisfy the peer range. Validation currently
uses React 19; newer major versions still need your application-level checks.
The package is ESM-only and includes TypeScript declarations.

Load global CSS once, tokens first, UI second, then your application overrides:

```tsx
// Your application entry point (or framework's global CSS entry).
import "@whitekiwi/tokens/theme.css";
import "@whitekiwi/ui/styles.css";
import "./app.css";
```

```tsx
import { Button, Disclosure, StaticCard, TextField } from "@whitekiwi/ui";

export function ProfileForm() {
  return (
    <StaticCard tone="neutral" padding="spacious">
      <form action="/profile" method="post">
        <TextField
          label="Display name"
          name="displayName"
          autoComplete="nickname"
          hint="The name people will see."
          required
        />
        <Disclosure label="How is this used?">
          <p>Your display name appears on your profile.</p>
        </Disclosure>
        <Button type="submit">Save profile</Button>
      </form>
    </StaticCard>
  );
}
```

The form action is illustrative: provide your own `/profile` handler. The package
does not store data or implement form submission. Use your CSS for page layout
and spacing between components. Load fonts separately; system fallbacks work too.

## Pick the right building block

| Job | Exports | Important behavior |
| --- | --- | --- |
| Actions and navigation | `Button`, `TextLink` | Button defaults to `type="button"`; set `submit` explicitly for forms |
| Labeled input | `TextField` | Required `label`; optional `hint` / `error`; generated ID and linked description |
| Status and guidance | `Badge`, `Callout` | Visual tone is not an automatic live announcement |
| Content surfaces | `StaticCard`, `LinkedCard` | Article versus anchor; use an `href` for linked cards and avoid nested controls |
| Editorial structure | `SectionHeading`, `CollectionHeading` | SectionHeading renders an `h2`; keep the surrounding heading hierarchy logical |
| Progressive disclosure | `Disclosure` | Radix-backed trigger/content; `defaultOpen` sets initial state |
| Class composition | `cn` | Combines conditional classes and Tailwind class merging |

`Button` supports primary, secondary, ghost, and danger variants, with normal or
compact sizing. Cards support neutral, raised, brand, and inverse tones, with
compact, normal, or spacious padding. `TextField` forwards native input props;
its `className` styles the wrapper, not the input. An `error` takes precedence over
`hint` and marks the input invalid, but does not perform validation for you.

## Themes and server rendering

Set `data-theme="light"` or `data-theme="dark"` on `<html>`. For system mode,
remove the attribute entirely. The [token package](https://github.com/WhiteKiwi/kiwi-design-system/tree/main/packages/tokens)
describes theme setup and semantic overrides.

The JavaScript entry preserves `"use client"` for React Server Component-aware
frameworks, including the `cn` helper. Call `cn` only from a client module in those
frameworks. Components can be server-rendered as client components, then hydrated;
they are not a server-only component API. Keep event handlers in your app's client
components, and import global CSS in the location supported by your framework.
Keep the server and client tree consistent for React's generated field IDs.

## Public surface and limits

- `@whitekiwi/ui`: components, `cn`, and the named types `ButtonProps`,
  `TextFieldProps`, `BadgeProps`, and `CalloutProps`
- `@whitekiwi/ui/styles.css`: component styles, imported separately
- `@whitekiwi/tokens/theme.css`: required token stylesheet from its own package
- No CommonJS build, global reset, router, font download, or theme persistence

Native semantics, focus styles, reduced-motion rules, and defined contrast pairs
are part of the implementation. They do not certify an entire application.
Provide meaningful labels and links; verify keyboard flow, announcements, custom
styles, and mobile layout in the actual product. Do not use color alone for status.

## License

[MIT](https://github.com/WhiteKiwi/kiwi-design-system/blob/main/packages/ui/LICENSE), copyright WhiteKiwi.
Third-party dependencies retain their own licenses.

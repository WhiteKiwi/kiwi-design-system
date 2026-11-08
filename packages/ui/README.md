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

Install the packages into your React application:

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
| Labeled input | `TextField`, `Select` | Required `label`; optional `hint` / `error`; generated ID and linked description |
| Single selection | `SegmentedControl` | Native radio group; supports form submission/reset and disabled choices |
| Empty content | `EmptyState` | Title, optional description/actions; no automatic live announcement |
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

## Selection and empty results

`Select` forwards native select props, including `value`, `defaultValue`, `onChange`,
`required`, `multiple`, `name`, `form`, and React 19 `ref`. Supply native `option` /
`optgroup` children. Its wrapper `className`, label, generated ID, `hint`, `error`,
and external `aria-describedby` follow TextField. The native picker owns keyboard
and mobile interaction; this is not a searchable combobox.

```tsx
<Select label="Billing cycle" name="cycle" defaultValue="monthly" hint="Choose a period.">
  <option value="monthly">Monthly</option>
  <option value="yearly">Yearly</option>
</Select>
```

`SegmentedControl` takes a required `label` and `options` (`value`, `label`, optional
`disabled`). Use `value` with `onValueChange` for controlled state, or `defaultValue`
for native uncontrolled selection. Give choices unique values. `name` is generated
when omitted, keeping separate groups independent. An explicit `name` controls
form submission; `form` associates each radio with an external form. `required`
and group/option `disabled` preserve native validation and submission behavior.
`hideLabel` visually hides the legend without removing the accessible name.

```tsx
<SegmentedControl label="Period" name="period" defaultValue="month"
  options={[{ value: "month", label: "This month" }, { value: "year", label: "This year" }]} />
<EmptyState title="No matching records" description="Try a wider date range.">
  <Button onClick={clearFilters}>Clear filters</Button>
</EmptyState>
```

Import these exports and provide the app's `clearFilters` handler in a client
module. Radio keys and form reset work natively in uncontrolled mode. A controlled
form owns resetting its React state. Do not use this component for navigation or
ARIA tabs. EmptyState renders an `h3`, description and optional action area;
place it under an appropriate heading. The app distinguishes empty, unknown,
loading, and failed results and owns live announcements.

Non-React consumers can load only the stylesheet and use the documented
[native patterns](../../docs/native-patterns.md), with no React browser runtime.

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
  `TextFieldProps`, `SelectProps`, `SegmentedControlProps`, `SegmentedControlOption`,
  `EmptyStateProps`, `BadgeProps`, and `CalloutProps`
- `@whitekiwi/ui/styles.css`: component styles, imported separately
- `@whitekiwi/tokens/theme.css`: required token stylesheet from its own package
- No CommonJS build, global reset, router, font download, or theme persistence

Native semantics, focus styles, reduced-motion rules, and defined contrast pairs
are part of the implementation. They do not certify an entire application.
Provide meaningful labels and links; verify keyboard flow, announcements, custom
styles, and mobile layout in the actual product. Do not use color alone for status.

## Improve PIP through use

Found a missing state, useful composition, or interaction problem? Bring the real
use case back to [PIP](https://github.com/WhiteKiwi/kiwi-design-system/issues/new?template=improvement.yml).
One product example is enough. The [contribution guide](https://github.com/WhiteKiwi/kiwi-design-system/blob/main/CONTRIBUTING.md)
explains how to turn it into a focused issue or PR and verify it in your product.

## License

[MIT](https://github.com/WhiteKiwi/kiwi-design-system/blob/main/packages/ui/LICENSE), copyright WhiteKiwi.
Third-party dependencies retain their own licenses.

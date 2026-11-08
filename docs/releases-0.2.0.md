# 0.2.0

Both `@whitekiwi/tokens` and `@whitekiwi/ui` release together. Token values and
existing component APIs are unchanged.

- Add native `Select` with TextField-compatible labeling, hint/error descriptions,
  disabled states, standard select props and generated IDs.
- Add native-radio `SegmentedControl` for single-choice filters and settings,
  including disabled options, form values/reset and controlled/uncontrolled use.
- Add `EmptyState` for an explanation and optional next action.
- Keep fields inside narrow layouts, including long select option labels.
- Publish supported native markup/CSS patterns for non-React consumers.
- Use the shared choice component in the catalog theme picker and add interactive
  selection/form/empty specimens. Require consumer disposition and adoption in
  the contribution workflow rather than leaving untracked local proposals.

Consumer origins: Finance's local Select/Empty and filters, Namecard's theme/side
choices, and the catalog's ThemeToggle. Financial logic and application routing
remain outside the shared API. Native-picker appearance follows the platform.

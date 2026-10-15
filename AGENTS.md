# AGENTS.md

## Design-system work

- Read `DESIGN.md` for design contracts and `CONTRIBUTING.md` for change ownership, implementation, verification, and delivery.
- Use `docs/usage.md` for consumer integration and its agent setup snippet. Keep shared fixes and reusable component improvements in this repository; keep product data, business logic, and page composition in the consumer.
- Require a second real consumer only when promoting product-specific patterns. Bug fixes, accessibility improvements, and general-purpose components with a concrete use case do not need a second consumer.
- Keep behavior changes, documentation, catalog examples, and relevant tests together. Split larger work by independently verifiable responsibility; keep detailed procedures in their owning guide and link from entry points.
- Run the checks in `CONTRIBUTING.md` and report consumer verification and release/adoption work separately. Do not treat a merge as an npm release or a completed consumer rollout.

## Git

- Commit messages must use `{type}: {message}`.
- Keep the `type` lowercase and concise.
- Write the `message` as an imperative, specific summary.


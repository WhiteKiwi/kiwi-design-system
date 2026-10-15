# AGENTS.md

## Design-system work

- Read `DESIGN.md` for design contracts and `CONTRIBUTING.md` for change ownership, implementation, verification, and delivery.
- Use `docs/usage.md` for consumer integration and its agent setup snippet. Keep shared fixes and reusable component improvements in this repository; keep product data and business logic in the consumer, and share only the agreed parts of page composition.
- Do not require a minimum number of consumers. When product work reveals a useful shared improvement, briefly propose the need, shared benefit, and smallest scope to the user. Get agreement for newly discovered scope; do not ask again for work already requested or approved.
- Implement agreed shared improvements in this design-system repository first, with docs and verification, then adopt them in the consumer. Track release/adoption work that remains.
- Keep behavior changes, documentation, catalog examples, and relevant tests together. Split larger work by independently verifiable responsibility; keep detailed procedures in their owning guide and link from entry points.
- Run the checks in `CONTRIBUTING.md` and report consumer verification and release/adoption work separately. Do not treat a merge as an npm release or a completed consumer rollout.

## Git

- Commit messages must use `{type}: {message}`.
- Keep the `type` lowercase and concise.
- Write the `message` as an imperative, specific summary.


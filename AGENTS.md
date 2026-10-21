# AGENTS.md

## Start here

- Read [DESIGN.md](DESIGN.md) for principles and ownership boundaries. Use the task table in [docs/README.md](docs/README.md#작업별-읽기-경로) to select only the relevant contracts and source files.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md) for setup, change requirements, and validation. Inspect the applicable nested `AGENTS.md` before editing a subtree; catalog work also follows [apps/docs/AGENTS.md](apps/docs/AGENTS.md).
- The portable integration and shared-contribution workflow lives in the [kiwi-design-system skill](https://github.com/WhiteKiwi/skills/tree/main/skills/kiwi-design-system). Read its source when integrating PIP into a product or contributing a shared improvement; installation is not required. Keep consumer execution and rollout procedures in the skill.

## Change the system coherently

- Inspect current implementation, exports, and package versions before editing. The repository, npm packages, and public catalog can be at different revisions; do not infer publication or consumer adoption from `main`.
- Reuse existing semantic tokens and components. Keep product data, business logic, and product-only composition in the consumer. Follow the design contracts for native semantics, external primitive adoption, and interaction states.
- Return useful gaps found during product work to this repository through the [contribution loop](CONTRIBUTING.md#사용에서-개선으로): a focused PR when the change is clear, an issue when design or implementation remains open, or a concrete proposal when work cannot proceed. One real use case is enough. Reuse the user's existing authorization and record any remaining scope decision.
- Keep a behavior or API change, its relevant contract, package documentation, catalog specimen/inventory, and meaningful verification in the same change. Preserve the use case and rationale so later work can reuse the decision.
- Keep the README focused on purpose, package choice, and first use. Follow [documentation ownership](docs/README.md#문서의-소유-위치): update facts at their source and link to them. Preserve useful rationale and requirements when consolidating text.
- Record routine decisions and verification in the PR. Add a separate document only when a reusable contract or explanation has a distinct owner and reader; do not create a worklog for every task.

## Verify and finish

- Run the checks for the changed scope in [CONTRIBUTING.md](CONTRIBUTING.md#검증). Check Markdown links and examples; inspect artwork or changed catalog pages at the documented sizes and themes.
- Report the checked source revision, commands and results, compatibility impact, and unperformed checks. Static contrast/rendering checks do not establish complete browser or consumer accessibility.
- Follow [npm-release.md](docs/npm-release.md) for release work. A new `v*` tag triggers npm publication; use preview/pack checks for verification. Merge, catalog deployment, npm publication, and consumer adoption are separate outcomes.

## Git

- Commit messages must use `{type}: {message}`.
- Keep the `type` lowercase and concise.
- Write the `message` as an imperative, specific summary.

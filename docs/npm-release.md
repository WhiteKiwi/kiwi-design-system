# npm library releases

The `npm release` workflow is manual-only. Pushing to `main`, publishing the
documentation, and creating a GitHub Release do not publish npm packages.
`publish` defaults to `false`; that mode builds and inspects downloadable tarballs
without requesting npm credentials or writing to the registry.

## Packages and version policy

- `@whitekiwi/tokens`: CSS semantic tokens, exported as `./theme.css`
- `@whitekiwi/ui`: ESM React components, declaration files, and `./styles.css`
- Repository root and every `apps/*` package remain `private: true`
- All non-private `packages/*` libraries join the release automatically, subject
  to scope, metadata, export, license, and dependency checks

Public libraries use one lockstep SemVer version. The current starting version
is `0.1.0`. Bump all libraries together with `pnpm release:version 0.1.1`, add
release notes describing consumer-visible changes, and review the diff. The
command does not commit, tag, push, publish, or modify private app versions.
Workspace references remain `workspace:^` or `workspace:*` in source; pinned
pnpm rewrites them into registry-compatible ranges while packing. Internal
dependencies and peers determine release order, so tokens publish before UI.

Stable releases default to `latest`. Prereleases such as `0.2.0-beta.1` use `next`
and cannot overwrite `latest`. Build metadata is intentionally unsupported.

## License

The owner selected MIT. The repository and both public libraries declare `MIT`,
and each library includes its full `LICENSE` in the inspected tarball. Third-party
dependencies and separately licensed material retain their own licenses. License
readiness does not authorize or confirm an npm publication.

## Current blockers before publication

1. The npm account `whitekiwi` must own the `@whitekiwi` scope and have publication
   rights. First publication/bootstrap, sign-in, 2FA, and trust creation are
   separate owner actions. This configuration does not perform any of them.
2. Before enabling real releases, create the GitHub environment `npm`, configure
   required reviewers and release-tag protection, and configure each package's
   npm trusted publisher as described below. The YAML cannot create reviewer
   rules; an environment name alone does not imply approval protection.

## Preview and inspect

Use Node 24+ and exactly the repository's pinned pnpm 10.33.0:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:release
pnpm release:check
pnpm release:pack
```

`release:pack` first runs a pack dry-run, then packs each library. It verifies the
actual tarball's manifest, export files, README, file allowlist, converted workspace
dependencies, and UI client directive. The artifacts and SHA-512 integrity values
are saved to ignored `dist/npm/`, together with `release-plan.json`.

For a hosted preview, run **Actions → npm release → Run workflow** at the reviewed
branch or tag, enter its exact package version, choose `latest` or `next`, and leave
`publish` unchecked. Download the artifacts from that run and inspect the package
contents. This does not verify owner permissions or OIDC configuration.

## Owner bootstrap and trusted publishing

According to npm's current [trust command prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/),
a package must already exist before its trusted publisher can be configured.
Therefore this workflow deliberately refuses an absent registry package rather
than pretending OIDC alone can create it.

The owner can sign in on their own computer and make the
first publication of the reviewed tarballs using npm's interactive authentication
and 2FA, in dependency order. Do not paste credentials into this repository or
add an npm token to GitHub. An alternative is npm's
[staged publication](https://docs.npmjs.com/staged-publishing/) flow (npm 11.15+),
but staging a new package itself creates a publicly visible `0.0.0-stage`
placeholder; it is a registry write and requires explicit owner approval too.
Only the later staged version waits for the owner's 2FA approval.

For each existing package, configure the [trusted publisher](https://docs.npmjs.com/trusted-publishers/)
on npm with these exact, case-sensitive settings:

| Setting | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `WhiteKiwi` |
| Repository | `kiwi-design-system` |
| Workflow filename | `npm-release.yml` |
| Environment | `npm` |
| Allowed action | Direct `npm publish` |

New npm trust configurations default to staged publishing. This workflow uses
direct `npm publish` behind a manual dispatch and GitHub environment approval,
so enabling only `npm stage publish` is insufficient. Trust creation expands
persistent access; it must be approved and performed separately. No trust setup
command or credential is embedded in the workflow.

The workflow uses GitHub-hosted runners and verifies npm >=11.5.1 for OIDC.
The publish job receives only `contents: read` and `id-token: write`, installs no
project dependencies, runs no package lifecycle scripts, and consumes the exact
verified preview artifacts. No `NPM_TOKEN` or `NODE_AUTH_TOKEN` is used. The
repository must remain public for the required provenance attestation.

## Release an approved version

1. Review the version, changes, license, and tarball preview. Commit the release
   changes and create the immutable Git tag `v<version>` at that reviewed commit.
   Push the commit and tag only when authorized.
2. Run `npm release` on that exact tag with its version, correct dist-tag, and
   `publish=true`. A branch ref is rejected. The preview repeats all checks.
   For example, after explicit release approval, a GitHub CLI dispatch is:

   ```sh
   gh workflow run npm-release.yml --ref v0.1.1 \
     -f version=0.1.1 -f tag=latest -F publish=true
   ```

3. The `npm` environment reviewer examines the artifacts and approves the publish
   job. Every package is checked against the registry before the first publish;
   version collisions and backwards `latest` moves fail closed.
4. The workflow publishes in dependency order, then compares registry tarball
   integrity before moving to the dependent library. Review the run and package
   pages to confirm completion and provenance.

A partially successful release is not atomic. Retry the same tag/artifacts after
diagnosing a failure: an already-published version is skipped only if its SHA-512
integrity matches exactly. A different tarball at the same version is rejected;
make a new version instead. Registry propagation can delay verification; inspect
the existing release before retrying. A missing/failed registry read never means
permission to overwrite. npm also reserves versions already staged; the registry
will reject a conflict, which the owner must resolve before another release.

No unpublish, rollback, dist-tag mutation, token creation, or bootstrap operation
is automated. Release preparation is separate from authority to publish.

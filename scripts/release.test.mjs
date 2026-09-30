import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  compareVersions,
  discoverPackages,
  orderPackages,
  parseVersion,
  registryDecision,
  releaseTag,
  repository,
  validatePackages,
  validatePackedManifest,
} from "./release.mjs";

const pkg = (name, extra = {}) => ({
  dir: `/repo/packages/${name}`,
  manifest: { name: `@whitekiwi/${name}`, version: "0.1.0", ...extra },
});

test("strict SemVer and release ordering", () => {
  for (const invalid of [
    "v1.0.0",
    "01.0.0",
    "1.0",
    "1.0.0-01",
    "1.0.0+build",
    "1.0.0;echo bad",
  ]) {
    assert.throws(() => parseVersion(invalid));
  }
  const ordered = [
    "0.1.0-alpha",
    "0.1.0-alpha.1",
    "0.1.0-alpha.2",
    "0.1.0-alpha.10",
    "0.1.0-beta",
    "0.1.0",
    "0.2.0",
    "1.0.0",
  ];
  for (let index = 1; index < ordered.length; index++) {
    assert.equal(compareVersions(ordered[index - 1], ordered[index]), -1);
    assert.equal(compareVersions(ordered[index], ordered[index - 1]), 1);
  }
  assert.equal(compareVersions("0.1.0", "0.1.0"), 0);
});

test("prereleases default to next and cannot overwrite latest", () => {
  assert.equal(releaseTag("0.1.0"), "latest");
  assert.equal(releaseTag("0.1.0-beta.1"), "next");
  assert.throws(() => releaseTag("0.1.0-beta.1", "latest"));
  assert.throws(() => releaseTag("0.1.0", "--access"));
});

test("publish order follows internal runtime and peer dependencies", () => {
  const ui = pkg("ui", {
    peerDependencies: { "@whitekiwi/tokens": "workspace:^" },
  });
  assert.deepEqual(
    orderPackages([ui, pkg("tokens")]).map((item) => item.manifest.name),
    ["@whitekiwi/tokens", "@whitekiwi/ui"],
  );
  assert.throws(
    () =>
      orderPackages([
        ui,
        pkg("tokens", { dependencies: { "@whitekiwi/ui": "workspace:*" } }),
      ]),
    /Circular/,
  );
});

test("root and apps never join release discovery", () => {
  const root = mkdtempSync(join(tmpdir(), "kiwi-release-test-"));
  const json = (path, data) => {
    mkdirSync(join(root, path), { recursive: true });
    writeFileSync(join(root, path, "package.json"), JSON.stringify(data));
  };
  try {
    json(".", { private: true });
    json("apps/docs", { private: true });
    json("packages/internal", { private: true });
    json("packages/tokens", pkg("tokens").manifest);
    assert.deepEqual(
      discoverPackages(root).map((item) => item.manifest.name),
      ["@whitekiwi/tokens"],
    );
    json("apps/docs", { private: false });
    assert.throws(() => discoverPackages(root), /must stay private/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("license guard blocks publication but permits a metadata preview", () => {
  const token = pkg("tokens", {
    description: "Tokens",
    homepage: "https://design.whitekiwi.link/",
    license: "UNLICENSED",
    files: ["src/theme.css"],
    exports: { "./theme.css": "./src/theme.css" },
    repository: {
      url: `git+https://github.com/${repository}.git`,
      directory: "packages/tokens",
    },
    publishConfig: {
      access: "public",
      registry: "https://registry.npmjs.org/",
    },
  });
  assert.equal(validatePackages([token], { files: false }), "0.1.0");
  assert.throws(
    () => validatePackages([token], { publish: true, files: false }),
    /choose and approve a license/,
  );
  assert.throws(
    () =>
      validatePackages(
        [
          token,
          { ...token, manifest: { ...token.manifest, version: "0.2.0" } },
        ],
        { files: false },
      ),
    /lockstep/,
  );
});

test("packed workspace ranges must be transformed by pnpm", () => {
  const source = pkg("ui", {
    exports: { ".": "./dist/index.js" },
    dependencies: { "@whitekiwi/tokens": "workspace:^" },
    devDependencies: { "@whitekiwi/tokens": "workspace:*" },
  }).manifest;
  const packed = {
    ...source,
    dependencies: { "@whitekiwi/tokens": "^0.1.0" },
    devDependencies: { "@whitekiwi/tokens": "0.1.0" },
  };
  validatePackedManifest(source, packed);
  assert.throws(() => validatePackedManifest(source, source), /Unresolved/);
  assert.throws(
    () =>
      validatePackedManifest(source, {
        ...packed,
        dependencies: { "@whitekiwi/tokens": "^0.0.9" },
      }),
    /Incorrect/,
  );
});

test("registry preflight supports safe retries and rejects collisions or regression", () => {
  const artifact = {
    name: "@whitekiwi/tokens",
    version: "0.1.0",
    integrity: "sha512-matching",
  };
  const metadata = {
    versions: { "0.1.0": { dist: { integrity: "sha512-matching" } } },
  };
  assert.equal(registryDecision(artifact, metadata, "latest"), "skip");
  assert.throws(
    () =>
      registryDecision(
        { ...artifact, integrity: "sha512-different" },
        metadata,
        "latest",
      ),
    /different content/,
  );
  assert.throws(
    () => registryDecision(artifact, null, "latest"),
    /bootstrapped/,
  );
  assert.throws(
    () => registryDecision(artifact, { versions: { "0.2.0": {} } }, "latest"),
    /backwards/,
  );
  assert.equal(
    registryDecision({ ...artifact, version: "0.3.0" }, metadata, "latest"),
    "publish",
  );
});

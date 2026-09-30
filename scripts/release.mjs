import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const repository = "WhiteKiwi/kiwi-design-system";
const registry = "https://registry.npmjs.org/";
const sections = ["dependencies", "optionalDependencies", "peerDependencies"];
const allSections = [...sections, "devDependencies"];
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const saveJson = (path, data) =>
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
const run = (command, args, cwd = root) =>
  execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, npm_config_ignore_scripts: "true" },
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();

export function parseVersion(version) {
  const match =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?$/.exec(
      version,
    );
  assert(match, `Expected SemVer without build metadata, received ${version}`);
  const prerelease = match[4]?.split(".") ?? [];
  assert(
    prerelease.every((part) => !/^0\d+$/.test(part)),
    `Invalid numeric prerelease identifier: ${version}`,
  );
  return [...match.slice(1, 4).map(BigInt), prerelease];
}

export function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  for (let index = 0; index < 3; index++) {
    if (left[index] !== right[index])
      return left[index] > right[index] ? 1 : -1;
  }
  const x = left[3];
  const y = right[3];
  if (!x.length || !y.length) return Math.sign(y.length) - Math.sign(x.length);
  for (let index = 0; index < Math.max(x.length, y.length); index++) {
    if (x[index] === y[index]) continue;
    if (x[index] === undefined) return -1;
    if (y[index] === undefined) return 1;
    const xn = /^\d+$/.test(x[index]);
    const yn = /^\d+$/.test(y[index]);
    if (xn && yn) return BigInt(x[index]) > BigInt(y[index]) ? 1 : -1;
    if (xn !== yn) return xn ? -1 : 1;
    return x[index] > y[index] ? 1 : -1;
  }
  return 0;
}

export function releaseTag(version, tag) {
  const prerelease = parseVersion(version)[3].length > 0;
  const result = tag || (prerelease ? "next" : "latest");
  assert(/^[a-z][a-z0-9-]*$/.test(result), `Invalid npm dist-tag: ${result}`);
  assert(!(prerelease && result === "latest"), "Prereleases cannot use latest");
  return result;
}

export function orderPackages(packages) {
  const byName = new Map(packages.map((pkg) => [pkg.manifest.name, pkg]));
  assert(byName.size === packages.length, "Duplicate package names");
  const visited = new Set();
  const visiting = new Set();
  const result = [];
  function visit(pkg) {
    const name = pkg.manifest.name;
    assert(!visiting.has(name), `Circular release dependency at ${name}`);
    if (visited.has(name)) return;
    visiting.add(name);
    for (const section of sections) {
      for (const dependency of Object.keys(pkg.manifest[section] ?? {})) {
        if (byName.has(dependency)) visit(byName.get(dependency));
      }
    }
    visiting.delete(name);
    visited.add(name);
    result.push(pkg);
  }
  for (const pkg of packages) visit(pkg);
  return result;
}

export function discoverPackages(base = root) {
  assert(
    readJson(join(base, "package.json")).private === true,
    "Root must stay private",
  );
  for (const name of readdirSync(join(base, "apps"))) {
    const path = join(base, "apps", name, "package.json");
    if (existsSync(path))
      assert(readJson(path).private === true, `App ${name} must stay private`);
  }
  const packages = readdirSync(join(base, "packages")).flatMap((name) => {
    const dir = join(base, "packages", name);
    if (!existsSync(join(dir, "package.json"))) return [];
    const manifest = readJson(join(dir, "package.json"));
    return manifest.private === true ? [] : [{ dir, manifest }];
  });
  assert(packages.length, "No publishable libraries found");
  return orderPackages(packages);
}

export function exportTargets(value) {
  if (typeof value === "string") return [value];
  assert(
    value && typeof value === "object",
    "Exports must have concrete targets",
  );
  return Object.values(value).flatMap(exportTargets);
}

export function validatePackages(
  packages,
  { publish = false, files = true } = {},
) {
  const version = packages[0].manifest.version;
  parseVersion(version);
  const names = new Set(packages.map((pkg) => pkg.manifest.name));
  for (const { dir, manifest: pkg } of packages) {
    assert(
      /^@whitekiwi\/[a-z0-9-]+$/.test(pkg.name),
      `Unexpected public scope: ${pkg.name}`,
    );
    assert(
      pkg.version === version,
      "Public libraries must use one lockstep version",
    );
    assert(pkg.private !== true, `${pkg.name} is private`);
    assert(
      pkg.description && pkg.homepage,
      `${pkg.name} needs public metadata`,
    );
    assert(
      pkg.repository?.url === `git+https://github.com/${repository}.git`,
      "Repository URL must match OIDC source",
    );
    assert(
      pkg.repository.directory === `packages/${dir.split(/[\\/]/).at(-1)}`,
      "Repository directory mismatch",
    );
    assert(
      pkg.publishConfig?.access === "public" &&
        pkg.publishConfig.registry === registry,
      "Public registry configuration required",
    );
    assert(!pkg.publishConfig.directory, "Pack only the package root");
    assert(
      Array.isArray(pkg.files) && pkg.files.length,
      "An explicit files allowlist is required",
    );
    assert(pkg.license, `${pkg.name} must state its license status`);
    if (publish) {
      assert(
        pkg.license !== "UNLICENSED",
        `${pkg.name}: choose and approve a license before publishing`,
      );
      assert(
        existsSync(join(dir, "LICENSE")),
        `${pkg.name}: add the approved LICENSE text`,
      );
    }
    if (files) {
      assert(
        existsSync(join(dir, "README.md")),
        `${pkg.name}: README is missing`,
      );
      for (const target of exportTargets(pkg.exports)) {
        assert(
          target.startsWith("./") &&
            !target.slice(2).split("/").includes("..") &&
            !target.includes("*"),
          `Unsafe or unsupported export: ${target}`,
        );
        assert(
          existsSync(join(dir, target)),
          `${pkg.name}: build or add export ${target}`,
        );
      }
    }
    for (const section of sections) {
      for (const [name, range] of Object.entries(pkg[section] ?? {})) {
        if (name.startsWith("@whitekiwi/")) {
          assert(
            names.has(name),
            `${pkg.name} depends on a non-publishable internal package: ${name}`,
          );
          assert(
            ["workspace:*", "workspace:^", "workspace:~"].includes(range),
            `${name} must use a lockstep workspace range`,
          );
        } else {
          assert(
            !/^(workspace:|file:|link:)/.test(range),
            `Non-registry dependency: ${name}`,
          );
        }
      }
    }
  }
  return version;
}

export function validatePackedManifest(source, packed) {
  assert(
    packed.name === source.name && packed.version === source.version,
    "Packed identity mismatch",
  );
  assert(packed.private !== true, "Packed library is private");
  for (const field of [
    "exports",
    "files",
    "license",
    "repository",
    "publishConfig",
  ]) {
    assert.deepEqual(packed[field], source[field], `Packed ${field} changed`);
  }
  for (const section of allSections) {
    for (const [name, range] of Object.entries(packed[section] ?? {})) {
      assert(
        !/^(workspace:|file:|link:)/.test(range),
        `Unresolved packed dependency: ${name} ${range}`,
      );
    }
    for (const [name, range] of Object.entries(source[section] ?? {})) {
      const expected = range.startsWith("workspace:")
        ? `${range.slice(10) === "*" ? "" : range.slice(10)}${source.version}`
        : range;
      assert(
        packed[section]?.[name] === expected,
        `Incorrect packed dependency ${name}: expected ${expected}`,
      );
    }
  }
}

function inspectTarball(path, source) {
  const files = run("tar", ["-tzf", path])
    .split("\n")
    .filter((entry) => !entry.endsWith("/"));
  assert(
    files.every(
      (entry) =>
        entry.startsWith("package/") && !entry.split("/").includes(".."),
    ),
    "Unsafe tarball paths",
  );
  const manifest = JSON.parse(
    run("tar", ["-xOf", path, "package/package.json"]),
  );
  validatePackedManifest(source, manifest);
  const allowed = ["package.json", "README.md", "LICENSE", ...source.files];
  for (const path of files) {
    const name = path.slice(8);
    assert(
      allowed.some((entry) => name === entry || name.startsWith(`${entry}/`)),
      `Unexpected packed file: ${path}`,
    );
    assert(
      !/(^|\/)(\.env(?:\.|$)|\.npmrc$|node_modules\/)/.test(name),
      `Unsafe packed file: ${path}`,
    );
  }
  for (const target of [...exportTargets(source.exports), "./README.md"]) {
    assert(
      files.includes(`package/${target.slice(2)}`),
      `Missing packed export: ${target}`,
    );
  }
  if (source.license !== "UNLICENSED")
    assert(files.includes("package/LICENSE"), "Missing packed LICENSE");
  if (source.name === "@whitekiwi/ui") {
    assert(
      /^['"]use client['"];/.test(
        run("tar", ["-xOf", path, "package/dist/index.js"]),
      ),
      "UI bundle lost its use client directive",
    );
  }
  return {
    files,
    integrity: `sha512-${createHash("sha512").update(readFileSync(path)).digest("base64")}`,
  };
}

export function registryDecision(pkg, metadata, tag) {
  assert(
    metadata,
    `${pkg.name} must be bootstrapped by its npm owner before OIDC publishing; see docs/npm-release.md`,
  );
  const existing = metadata.versions?.[pkg.version];
  if (existing) {
    assert(
      existing.dist?.integrity === pkg.integrity,
      `${pkg.name}@${pkg.version} already exists with different content; bump the version`,
    );
    return "skip";
  }
  if (tag === "latest") {
    const stable = Object.keys(metadata.versions ?? {}).filter((version) => {
      try {
        return !parseVersion(version)[3].length;
      } catch {
        return false;
      }
    });
    assert(
      stable.every((version) => compareVersions(pkg.version, version) > 0),
      `${pkg.name}: latest would move backwards`,
    );
  }
  return "publish";
}

async function registryMetadata(name) {
  const response = await fetch(`${registry}${encodeURIComponent(name)}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (response.status === 404) return null;
  assert(
    response.ok,
    `Registry read for ${name} failed: ${response.status}; refusing to publish`,
  );
  return response.json();
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const packages = discoverPackages();
  if (command === "version") {
    const next = args[0];
    parseVersion(next);
    for (const { manifest } of packages)
      assert(
        compareVersions(next, manifest.version) > 0,
        "New version must increase every public library",
      );
    for (const { dir, manifest } of packages)
      saveJson(join(dir, "package.json"), { ...manifest, version: next });
    console.log(
      `Set all public libraries to ${next}; review changes and add release notes before tagging v${next}`,
    );
    return;
  }
  const publish = args.includes("--publish");
  const version = validatePackages(packages, {
    publish,
    files: command !== "publish",
  });
  if (process.env.RELEASE_VERSION)
    assert(
      version === process.env.RELEASE_VERSION,
      "Requested version does not match package versions",
    );
  const tag = releaseTag(version, process.env.RELEASE_TAG);
  if (command === "check") {
    console.log(
      `Release ${version}: ${packages.map((pkg) => pkg.manifest.name).join(" → ")}`,
    );
    if (
      !publish &&
      packages.some((pkg) => pkg.manifest.license === "UNLICENSED")
    )
      console.warn(
        "Preview only: publication is blocked until a license is approved and added.",
      );
    return;
  }
  const output = join(root, "dist", "npm");
  if (command === "pack") {
    const pnpm = process.env.PNPM_BIN || "pnpm";
    const expected = readJson(
      join(root, "package.json"),
    ).packageManager.replace("pnpm@", "");
    assert(
      run(pnpm, ["--version"]) === expected,
      `Use pinned pnpm ${expected} to pack workspace dependencies`,
    );
    rmSync(output, { recursive: true, force: true });
    mkdirSync(output, { recursive: true });
    const plan = {
      version,
      tag,
      commit: process.env.GITHUB_SHA || null,
      packages: [],
    };
    for (const { dir, manifest } of packages) {
      console.log(run(pnpm, ["pack", "--dry-run", "--json"], dir));
      console.log(
        run(pnpm, ["pack", "--pack-destination", output, "--json"], dir),
      );
      const filename = `${manifest.name.slice(1).replace("/", "-")}-${version}.tgz`;
      const detail = inspectTarball(join(output, filename), manifest);
      plan.packages.push({ name: manifest.name, version, filename, ...detail });
    }
    saveJson(join(output, "release-plan.json"), plan);
    console.log(
      `Verified ${plan.packages.length} tarballs in dist/npm; no registry write performed`,
    );
    return;
  }
  if (command === "publish") {
    assert(publish, "Publishing requires explicit --publish");
    assert(
      process.env.GITHUB_ACTIONS === "true" &&
        process.env.GITHUB_REPOSITORY === repository,
      "Use the authorized GitHub release workflow",
    );
    assert(
      process.env.GITHUB_REF === `refs/tags/v${version}`,
      "Publishing requires the exact version tag",
    );
    assert(
      process.env.ACTIONS_ID_TOKEN_REQUEST_URL &&
        process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,
      "OIDC is required; no token fallback supported",
    );
    assert(
      !process.env.NODE_AUTH_TOKEN && !process.env.NPM_TOKEN,
      "Do not supply long-lived npm tokens",
    );
    const plan = readJson(join(output, "release-plan.json"));
    assert(
      plan.version === version &&
        plan.tag === tag &&
        plan.commit === process.env.GITHUB_SHA,
      "Artifact does not match this version, tag, and commit",
    );
    assert.deepEqual(
      plan.packages.map((pkg) => pkg.name),
      packages.map((pkg) => pkg.manifest.name),
      "Release package list or order changed",
    );
    // Validate every artifact and registry target before the first registry write.
    const decisions = [];
    for (const [index, pkg] of plan.packages.entries()) {
      assert(
        pkg.filename ===
          `${pkg.name.slice(1).replace("/", "-")}-${version}.tgz`,
        "Unexpected artifact filename",
      );
      const detail = inspectTarball(
        join(output, pkg.filename),
        packages[index].manifest,
      );
      assert(detail.integrity === pkg.integrity, "Artifact integrity mismatch");
      decisions.push(
        registryDecision(pkg, await registryMetadata(pkg.name), tag),
      );
    }
    for (const [index, pkg] of plan.packages.entries()) {
      if (decisions[index] === "skip") {
        console.log(
          `Already published, identical integrity: ${pkg.name}@${version}`,
        );
        continue;
      }
      console.log(
        run("npm", [
          "publish",
          join(output, pkg.filename),
          "--access",
          "public",
          "--tag",
          tag,
          "--provenance",
          "--ignore-scripts",
          "--registry",
          registry,
        ]),
      );
      let verified = false;
      for (let attempt = 0; attempt < 12; attempt++) {
        const metadata = await registryMetadata(pkg.name);
        if (metadata?.versions?.[version]?.dist?.integrity === pkg.integrity) {
          verified = true;
          break;
        }
        await new Promise((done) => setTimeout(done, 5000));
      }
      assert(
        verified,
        `${pkg.name}: registry verification pending; inspect the registry before rerunning this exact tag`,
      );
      console.log(`Registry integrity verified: ${pkg.name}@${version}`);
    }
    return;
  }
  throw new Error(
    "Use check [--publish], pack, version <semver>, or publish --publish",
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

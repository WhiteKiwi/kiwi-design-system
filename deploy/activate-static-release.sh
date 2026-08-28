#!/usr/bin/env bash
set -euo pipefail

release_id="${1:-}"
release_root="${KIWI_DESIGN_RELEASE_ROOT:-/Users/whitekiwi/Services/kiwi-design-system}"
site_source="${KIWI_DESIGN_SITE_SOURCE:-apps/docs/out}"

if [[ ! "$release_id" =~ ^[0-9a-f]{40}$ ]]; then
  echo "A full lowercase Git commit SHA is required." >&2
  exit 1
fi

for required_path in "$site_source/index.html" "$site_source/_next"; do
  if [[ ! -e "$required_path" ]]; then
    echo "Static export is incomplete: $required_path" >&2
    exit 1
  fi
done

mkdir -p "$release_root/releases"
staging="$release_root/releases/.staging-$release_id"
target="$release_root/releases/$release_id"

if [[ -e "$target" ]]; then
  echo "Release already exists: $target"
else
  trap 'rm -rf "$staging"' EXIT
  rm -rf "$staging"
  mkdir -p "$staging/site"
  cp -R "$site_source"/. "$staging/site/"
  printf '%s\n' "$release_id" > "$staging/REVISION"
  mv "$staging" "$target"
  trap - EXIT
fi

ln -sfn "releases/$release_id" "$release_root/current"

resolved_current="$(readlink "$release_root/current")"
if [[ "$resolved_current" != "releases/$release_id" ]]; then
  echo "Active release verification failed: $resolved_current" >&2
  exit 1
fi

echo "PIP release activated: $release_id"

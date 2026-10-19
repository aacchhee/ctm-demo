#!/usr/bin/env bash
# Temporary JSXGraph reproduction, published at <site>/jsxgraph-repro/.
# Run after `quarto render`. Builds _jsxgraph-repro/ on its own, with old code
# fetched by commit (nothing old is kept in this repository):
#   library/jsxgraph-<version>.html  plain HTML, one page per JSXGraph version
#   extension-<commit>/index.html    Quarto pages, one per jsxgraph-quarto commit
#   index.html                       overview and measurements
# Remove together with _jsxgraph-repro/, its workflow step and .gitignore lines.
set -euo pipefail
cd "$(dirname "$0")/.."
root=$PWD
src=$root/_jsxgraph-repro
out=$src/_site
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

LIBRARY_VERSIONS="1.12.2 1.13.3 1.14.0"
# jsxgraph-quarto: before PR #1, upstream main (PR #1), the fork's PR #2.
EXTENSIONS="
jsxgraph/jsxgraph-quarto a26aea8|jsxgraph/jsxgraph-quarto a26aea8 (before PR #1)
jsxgraph/jsxgraph-quarto 59d549c|jsxgraph/jsxgraph-quarto 59d549c (main, with PR #1)
aacchhee/jsxgraph-quarto 17de83e|aacchhee/jsxgraph-quarto 17de83e (the fork's PR #2)
"

clone() {  # clone <owner/repo> <dir>: history without file contents
  git clone --quiet --filter=blob:none --no-checkout "https://github.com/$1.git" "$2"
}
block() {  # block <commit> <file> <n>: the n-th jsxgraph code block, with fences
  git -C "$tmp/ctm-demo" show "$1:$2" | awk -v n="$3" '
    /^```\{\.jsxgraph/ { k++; on = (k == n) }
    on { print }
    on && /^```$/ { on = 0 }'
}
plain() {  # drop the figure's own resize code (the lines 4ea3ac5 removed)
  grep -v -e fitBoard -e graphBox
}

# Applets from old ctm-demo commits.
clone aacchhee/ctm-demo "$tmp/ctm-demo"
applets=$tmp/applets
mkdir -p "$applets"
block 3d7c60f _includes/physics/prove1-2024.md 1 > "$applets/rt-original.md"
block 3d7c60f _includes/physics/prove1-2024.md 2 > "$applets/ep-original.md"
block 3d7c60f _includes/physics/prove1-2025.md 1 > "$applets/pendulum-original.md"
block 3d7c60f _includes/physics/prove3-2025.md 1 > "$applets/bfield-original.md"
block 60b1cb0 _includes/physics/prove4-2025.md 1 > "$applets/solenoid-original.md"
block 5edafe5 _includes/physics/prove4-2025.md 1 > "$applets/solenoid-deferred.md"
for name in rt ep pendulum bfield solenoid; do
  plain < "$applets/$name-original.md" > "$applets/$name-plain.md"
done
for file in "$applets"/*.md; do
  [ "$(wc -l < "$file")" -gt 3 ] || { echo "empty applet: $file" >&2; exit 1; }
done

# Overview page first: rendering it starts _site/ afresh.
rm -rf "$out"
(cd "$src" && quarto render --quiet)
mkdir -p "$out/library"

# Library only: plain HTML with two of the figures (code without the fences).
for version in $LIBRARY_VERSIONS; do
  python3 - "$src/library/template.html" "$applets" "$version" \
    "$out/library/jsxgraph-$version.html" <<'PY'
import sys
template, applets, version, target = sys.argv[1:]
code = lambda name: ''.join(open(f'{applets}/{name}-plain.md', encoding='utf-8').readlines()[1:-1]).rstrip()
page = open(template, encoding='utf-8').read()
page = page.replace('@SOLENOID@', code('solenoid')).replace('@PENDULUM@', code('pendulum'))
open(target, 'w', encoding='utf-8').write(page.replace('@VERSION@', version))
PY
done

# Extension: the same Quarto page rendered with each extension commit.
echo "$EXTENSIONS" | while IFS='|' read -r spec label; do
  [ -n "$spec" ] || continue
  read -r repo commit <<< "$spec"
  dir=$tmp/extension-$commit
  [ -d "$tmp/${repo%%/*}" ] || clone "$repo" "$tmp/${repo%%/*}"
  cp -r "$src/extension" "$dir"
  cp -r "$applets" "$dir/_applets"
  git -C "$tmp/${repo%%/*}" archive "$commit" _extensions/jsxgraph | tar -x -C "$dir"
  (cd "$dir" && quarto render --quiet -M "ext_commit:$commit" -M "ext_label:$label")
  cp -r "$dir/_site" "$out/extension-$commit"
done

rm -rf "$root/_site/jsxgraph-repro"
mkdir -p "$root/_site"
cp -r "$out" "$root/_site/jsxgraph-repro"
echo "JSXGraph reproduction: $root/_site/jsxgraph-repro"

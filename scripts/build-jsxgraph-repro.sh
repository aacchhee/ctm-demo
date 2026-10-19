#!/usr/bin/env bash
# Temporary: builds _jsxgraph-repro/ with the old JSXGraph extension and puts
# it into _site/jsxgraph-repro/. Run after `quarto render`.
set -euo pipefail
cd "$(dirname "$0")/.."
EXTENSION_REPO=https://github.com/Erasmus-CTM/math-exercise.git
EXTENSION_COMMIT=dad1ddd1fffb95e66387dd88a38d2568fac900db
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git clone --quiet --filter=blob:none --no-checkout "$EXTENSION_REPO" "$tmp/math-exercise"
rm -rf _jsxgraph-repro/_extensions
mkdir -p _jsxgraph-repro
git -C "$tmp/math-exercise" archive "$EXTENSION_COMMIT" _extensions/jsxgraph | tar -x -C _jsxgraph-repro
(cd _jsxgraph-repro && quarto render)
rm -rf _site/jsxgraph-repro
cp -r _jsxgraph-repro/_site _site/jsxgraph-repro

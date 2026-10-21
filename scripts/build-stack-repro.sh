#!/usr/bin/env bash
# STACK reproduction, published at <site>/stack-repro/. Run after `quarto render`.
# Builds _stack-repro/ on its own: index.html (the report) with the question
# files (questions/), the oracle output (evidence/) and the scripts (oracle/).
# The questions and evidence are kept in this repository; to re-check them
# against a STACK checkout, see "How we checked" on the page.
# Remove together with _stack-repro/, its workflow step and .gitignore lines.
# SPDX-License-Identifier: AGPL-3.0-or-later
set -euo pipefail
cd "$(dirname "$0")/.."
root=$PWD
src=$root/_stack-repro

# The question files must be the ones repro.py writes.
check=$(mktemp -d)
trap 'rm -rf "$check"' EXIT
cp -r "$src/oracle" "$check/oracle"
mkdir -p "$check/questions"
(cd "$check/oracle" && python3 repro.py write > /dev/null)
diff -r "$check/questions" "$src/questions"

rm -rf "$src/_site"
(cd "$src" && quarto render --quiet)
rm -rf "$root/_site/stack-repro"
mkdir -p "$root/_site"
cp -r "$src/_site" "$root/_site/stack-repro"
echo "STACK reproduction: $root/_site/stack-repro"

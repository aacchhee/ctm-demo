# Similar problems guide

The merged testbox is now a three-page guide for colleagues:

- `pages/similar-problems.qmd`: three interactive examples and their exact QMD.
- `pages/similar-problems-authoring.qmd`: opt-in, shared YAML, exercise addons,
  original grading rules and trusted checker constraints.
- `pages/similar-problems-workflow.qmd`: component ownership, policy resolution,
  prompts, API calls, local admission/checking, storage and the planned R1/R2 RAG
  services. Phase 2 is documented only; it is not enabled.

The examples retain their original labels and questions so saved work remains
associated with the same exercises. The exact reviewed package pin remains in
`quarto-extensions.yml`. `python scripts/setup.py` installs it normally, with no
review overrides. `python scripts/build-similar-problems.py` renders all three
pages and writes source/component provenance to `_site/similar-problems-build.json`.
Its `similar-problems` Quarto profile limits the standalone sidebar to these three
pages and provides a working guide home link. The normal course sidebar is retained
for full-site builds.

`.github/workflows/similar-problems-preview.yml` rebuilds all three pages on every
pull request (including forks), without path/branch filters. Its PR jobs have
read-only permissions and upload `similar-problems-guide` as an Actions artifact.
The action does not use `pull_request_target` or publish PR code with a write token.

Pushes to `main` publish the dedicated guide at:
https://aacchhee.github.io/ctm-demo/similar-problems/pages/similar-problems.html

To publish a branch before merge, manually run **Build Similar problems guide**
on that branch. The shared manual preview is:
https://aacchhee.github.io/ctm-demo/similar-problems-preview/pages/similar-problems.html

The full-site action also renders these pages and records provenance. Both
publishing jobs share the existing Pages concurrency group and preserve other
course content. The old `/similar-problems-pr-28/` address was refreshed by hand on
31 October 2026 with the guide from main `92e9b8c`; no workflow updates it, so it
can fall behind. Use `/similar-problems/` or `/similar-problems-preview/` instead.
The original PR 28 snapshot remains in `gh-pages` history (`1e21e99`). No
workflow merges or tags.

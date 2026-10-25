# Similar problems phase-1 testbox

The course page is `pages/similar-problems.qmd`, linked from the sidebar.
It covers a symbolic derivative, a fixed 2-by-2 matrix inverse, and a trusted
linear-independence checker with a hard five-coordinate limit.

25 October 2026: installed through the normal ctm-assessment installer, without
source or review overrides, from package head
`49e7c57d6ad9536ea8c0f8fea02d0173a9d44f55`.
Component pins: ctm-libs `06a44d9`, math-exercise `b9e4547`, ctm-checkers `d3b1f5b`.

The page rendered with Quarto 1.8.27. Its explicit optional-variant setting permits
the authored matrix test fixture; production approval defaults remain unchanged.
Four mocked-provider Playwright checks passed against the actual course HTML:

- computed-key generation, Check, score isolation, copy, and reload restoration;
- fixed matrix component recipes;
- rejection of six-coordinate givens by the original authored checker;
- real browser Pyodide key computation and grading.

The checks use the pinned math-exercise `tests/browser/similar-problems.spec.mjs`
with `CTM_SIMILAR_PAGE=/pages/similar-problems.html`, a server rooted at this
course's `_site`, and a filter selecting the four cases above. The provider is
mocked; the fourth case runs production Python/WASM and the packaged checker.
The complete 21-case suite and exact package hashes are recorded by the
ctm-assessment Similar problems pinned-stack workflow.

For manual use, select Direct API in Feedback settings and configure a reasoning
generation model plus an everyday feedback model. Try Harder, Easier and Another
one like this; check an answer, reload, copy/export, and flag a key. Flags remain
local. No merge, tag, deployment or central collection was performed.

The final parity-manifest update changes no packaged extension bytes: the normal
installer verified identical extension SHA-256 maps before and after the re-pin.

The generation model now has the same fetched-model dropdown as feedback.
One Fetch models request populates both lists; selections are saved independently.

After the implementation review, AC explicitly requested an openly published
GitHub Actions preview. `Publish Similar problems preview` builds this page from
the feature branch's exact package pin and publishes only the
`similar-problems-pr-28` subtree, preserving the existing course site. The preview
includes `similar-problems-build.json` with its source head and component pins.
No feature branch is merged and no tag is created by this workflow.

The format-repair update accepts JSON fences, numeric answers and variable arrays,
provides explicit scalar/matrix schemas and returns precise format failures for
repair. Final rejection reasons appear under Details. The mathematical checks
remain required. The original 21 browser cases plus five format cases passed
locally (24-case run, then five final targeted cases after the shared JSON parser
was applied to independent solving).

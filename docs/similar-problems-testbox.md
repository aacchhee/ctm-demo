# Similar problems phase-1 testbox

The course page is `pages/similar-problems.qmd`, linked from the sidebar.
It covers a symbolic derivative, a fixed 2-by-2 matrix inverse, and a trusted
linear-independence checker with a hard five-coordinate limit.

25 October 2026: installed through the normal ctm-assessment installer, without
source or review overrides, from package head
`fabcf5846b729f33b041447ca8061566daddc74b`.
Component pins: ctm-libs `055b597`, math-exercise `57c7dc9`, ctm-checkers `d3b1f5b`.

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

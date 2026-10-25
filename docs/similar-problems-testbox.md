# Similar problems phase-1 testbox

The course page is `pages/similar-problems.qmd`, linked from the sidebar.
It covers a symbolic derivative, a fixed 2-by-2 matrix inverse, and a trusted
linear-independence checker with a hard five-coordinate limit.

25 October 2026: installed through the normal ctm-assessment installer, without
source or review overrides, from package head
`6e6bcfdf2e3342271066a5772db352a0148a093d`.
Component pins: ctm-libs `4e58599`, math-exercise `a98100d`, ctm-checkers `16de388`.

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

Generated learner checks now use ordinary exercise notation (including `21x`,
`3x^2`, implicit function application and factorial notation), while model keys
and recipes remain strictly admitted. Grading mode and authored restrictions
come from the original problem. Native notation/grading parity and hostile-input
cases pass (96 checks); real browser Pyodide confirms wrong and correct implicit
answers and feedback without a spurious invalid saved status.

The compact UI uses one Similar problem disclosure, quiet help/copy utilities,
and More on generated cards. Reporting says “I think the expected answer is wrong”.
All 30 focused browser cases pass, including keyboard/mobile disclosure behavior
and real Pyodide. Compatibility with ctm-libs PR48 head 53579c8 is documented and
tested on a combined snapshot; the public preview uses the normal pinned G2 head
and its standalone Settings fallback until PR48 is merged and re-baselined.

# Combined demo acceptance — primary CI pending, course/static HOLD

The candidate combines saving, quiz progress, navigation and the reviewed component tuple in the demo testbox. It is **not ready for merge or deployment yet**. AC alone merges. Ingmat live/main stays stable; isolated preparation is allowed, and starting its migration requires AC after the coherent demo passes and its components are merged.

## Candidate and provenance

The frozen five-page course is `aacchhee/ctm-demo` at `f33150e2da944bf202d187cf384031ef362fd0fb`, rendered with Quarto **1.8.27**. Its resolved record binds **107 installed extension files** across seven repositories. The responsive site archive SHA-256 is `59348168f08dcd98a3ec945f4b7f28b57fd436624189c83c0614cb3d9e890926`; `pages/step4-ui.html` is `e22988069c141f414b63f5e3493e2903c49f707ff3e28b9972dc5490afbb1869`.

The final workflow selects activation `87c3398d293f81b1eec28aedbc933986ac9bb2e0`. Its tree is identical to installed activation `95b6a6a5c16b0f96c1dc0e13dd1e3af308475e31`; the difference is reviewed ancestry, not installed source.

| Component | Exact reviewed commit |
| --- | --- |
| ctm-libs | `3277d66b7c1c108f6b073a75b38d669d17b73283` |
| py-exercise | `fda82aa916b2abb564b909ec3021b6cad59fd49f` |
| pyodide-interaktiv | `035e7307f53207d8f4b90c6692ec926ee802ab38` |
| math-exercise, preserved | `b282111da4bb208effd8bad8d7e6df7020d0db0a` |
| ctm-checkers, preserved | `a1637dc95b9e11d8a0c838c801cd53e20997eceb` |
| upstream jsxgraph-quarto | `e4ad81d82e1b56f86765026a3dd26f6975d29d57` |

The dedicated activation registers the canonical preloader through the existing absent-only metadata default. Asset pins and unrelated component pins stay unchanged. The fixture adds an ordinary Python IDE for real Run/restore evidence and gives its authored board a responsive phone width; neither change alters a grader or runtime.

Review threads: [activation #55](https://github.com/Erasmus-CTM/ctm-assessment/pull/55), [upstream pin #52](https://github.com/Erasmus-CTM/ctm-assessment/pull/52), [library composition #41](https://github.com/Erasmus-CTM/ctm-libs/pull/41), [Python consumer #12](https://github.com/Erasmus-CTM/py-exercise/pull/12), [IDE consumer #10](https://github.com/Erasmus-CTM/pyodide-interaktiv/pull/10), [demo #19](https://github.com/aacchhee/ctm-demo/pull/19).

## Evidence so far

- **Real grading, quiz and accessible board:** all three browsers at 1280 and 390 passed on the frozen responsive artifact. Each case used real Check/Run controls, quiz links, opaque SVG labels, speech and Braille; raw error categories and pending requests were zero. Phone board width was 302px, inside the viewport.
- **Navigation and languages:** six selected cases cover 186 navigation/history records and 18 nb/nn/de cases, including all 20 authored links, nested reveals/tabs, quiz Back/Forward, mode persistence, keyboard summaries and reversible print lifecycle. Five cases use the responsive artifact; Chromium1280 uses the preceding `75e96` artifact. Final CI must run all six on one current artifact. The local summary preserves this distinction.
- **Saved answers:** WebKit and Chromium passed real Check and IDE Run, historical restoration without learner execution/check requests, reset/reload, independent math state, actual Markdown/HTML export and the cross-tab pending-write races. Passive native Worker RPC traces include real positive controls before and after restoration. Firefox also passed the full case after the reviewed foreground/active-textarea keyboard correction. All three local cases passed with zero raw failures. WebKit/Chromium used harness `5a1ee9df…`; Firefox used final `b74c7d2b…`. Final CI selects `b74c7d2b…` for all three; these mixed local driver versions are not an exact-final-harness CI claim.
- **Static first visit: all three diagnostics FAILED.** Real IDE output `42` and the opaque accessible board worked in Chromium, Firefox and WebKit, but `passed`, `functionalBaselinePassed` and `rawPassed` are false in every case. Chromium retains one setup-phase aborted Matplotlib request and two unresolved initial-document font requests whose frames were **not detached**; they are not retired requests or proven transfers. Firefox/WebKit retain request failures plus uncaught errors/rejections whose old-document provenance was independently verified. Those raw events still keep the first-visit baselines failed; no error category is waived. First-visit hardening is separate ongoing work, and **course/static acceptance remains HOLD** even if the headered primary workflow passes.

## Test-driver corrections and limits

Earlier failed reports remain retained. Monaco's public scoped selection API selects existing text; actual keyboard events perform every content edit, with empty/exact-model assertions. Firefox now explicitly foregrounds the target tab, verifies the actual scoped active textarea and full model selection before Backspace, and falls back to native textarea focus when required. Its final passing case recorded 12 valid focus preconditions and one native-focus fallback; the earlier wrong-editor keypress report remains retained. The deterministic 250ms race phase preserves the original native UserTiming methods because Playwright's empty entry-query implementation conflicts with Monaco's latency measurement; real runtime evidence runs before fake timers, and the 249+1ms boundaries remain asserted.

The initial navigation harness demanded non-BODY focus at every sample. Step4 §6.3, the canonical comparator and the existing asynchronous WebKit fragment-focus recovery instead require correct landing focus, target stability and recovered final focus. Final harness `3129db81f0277226c3d4c4b0b576807b5f49e379aafcd59ef69e3293eb86f198` atomically records landing focus, retains all eight geometry/open/hash/header samples and complete focus transients, and checks visible related focus after at least2.1s. The original strict WebKit failure is preserved; only the affected mobile case was rerun. No production focus or timing policy changed.

Headered require-corp evidence proves actual isolation in all three browsers. It does not establish offline operation or universal static-host SharedArrayBuffer/input/Stop support. Existing WebKit static-host unavailable behavior is an explicit supported fallback. Print proof uses lifecycle events and print-media emulation, not an OS print dialog. No deployed Pages, full input/Stop, assistive-technology session or pixel-comparison claim follows from these checks.

## Final acceptance and AC decision

The one combined workflow is artifact-only: it starts on a change to its workflow file on the isolated candidate branch, or manual dispatch with the exact phrase `broad testing campaign`. It has read-only repository permission, no deployment, and does not start broad campaigns on main or ordinary product-only edits. The reviewed source gate remains separate. All assertions and raw failures remain effective.

Pending final record:

- Coherent final course head/tree: **PENDING**
- Combined workflow run ID / URL: **PENDING**
- Rendered artifact ID / SHA-256 and resolved-record hash: **PENDING**
- Three-browser grading, saved-answer and navigation job results: **PENDING**
- First-visit raw/active-network baseline: **FAILED in all three; course/static HOLD**
- Bounded first-visit hardening and fresh independent clearance: **PENDING**
- Final independent review and AC merge decision: **PENDING**

Component merge-readiness requires the exact-head scoped primary CI and independent review; complete those primary fields before describing the components as merge-ready. That decision is separate from course/static go-ahead: the first-visit baselines remain FAILED and course/static acceptance stays HOLD until the bounded hardening receives fresh independent clearance. A green headered primary run does not grant a broad demo PASS or course/static go-ahead. Passing tests do not merge or deploy anything; AC owns that decision.


## Published drivers and compact local evidence

The primary workflow uses `scripts/acceptance/test-demo-grading.mjs` (`cb81bd46…`),
`test-demo-store.mjs` (`b74c7d2b…`) and `test-demo-navigation.mjs` (`3129db81…`).
It renders all five pages once with Quarto1.8.27, fails on a render error or any
warning, retains the raw render log/resolved record/source hashes, and runs the
three browser jobs against that one newly built artifact. Repository permission
is read-only; no main/deployment changes are part of this workflow.

The compact records in [evidence/2026-10](evidence/2026-10) preserve report hashes,
local source/artifact differences and failed first-visit counts. The raw local
reports, screenshots, exports and failed attempts remain retained separately;
these summaries contain no full response dumps and are not replacement results.

The first-visit diagnostic is not a primary gate: the preserved first-visit driver is
`scripts/diagnostics/test-demo-first-visit.mjs` (`9ac83804…`). It is an explicitly
invoked diagnostic, independent of the small automatic fixture source contracts:

```sh
CTM_PLAYWRIGHT_MODULE=file:///absolute/path/to/playwright/index.mjs \
node scripts/diagnostics/test-demo-first-visit.mjs --browser chromium \
  --site _saving-quiz-site --output diagnostics/first-visit-chromium.json
```

It serves the rendered bytes without isolation headers and retains the actual
service-worker reload/fallback and request lifecycle failures. It is deliberately
not invoked automatically by the headered primary workflow. Its current failures
remain blockers to course/static clearance; this separation does not waive them.

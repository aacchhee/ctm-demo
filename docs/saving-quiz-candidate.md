# Saving and quiz integration candidate

Prepared from ctm-demo main `d65eea624e96bbfc7b65ebb78b7d3a43ebdb3458` on
`consolidation/2026-10-saving-quiz-candidate`. This is the no-user demo testbox,
not an ingmat3a rollout. The ordinary main/deployment configuration and the
STACK-only `review` profile are not the candidate acceptance path.

The `saving-quiz` profile renders the existing step-4 UI, links, nb, nn and de
pages into `_saving-quiz-site`. It adds one shared mixed quiz on the English UI
page, using the approved `quiz=` heading and ordinary labelled mathematics and
Python blocks. The original autosave labels remain stable. No generated variants
or variant-approval feature is introduced. One fixed candidate course key keeps
the answers together while navigating these pages.
One real JSXGraph board sits in its own reading step **after** the quiz section,
so the quiz still has two members. Its `x^2+1` MathJax label and original native
load/startup update are copied from the
[canonical upstream hook fixture](https://github.com/jsxgraph/jsxgraph-quarto/blob/e4ad81d82e1b56f86765026a3dd26f6975d29d57/tests/mathjax-preload.browser.test.mjs#L68).
It uses the frozen umbrella's board/hook configuration without a local loader or
pre-loader override.
The board uses the extension's percentage sizing with a 480 px maximum and the
original 12:7 aspect ratio, so it also fits a 390 px viewport. A fixed 480 px
width overflowed the phone viewport in the first Chromium and WebKit checks;
the authored JavaScript and runtime assets stay unchanged.
An ordinary labelled `pyodide-python` IDE also sits in its own reading step outside
the quiz. It saves edited code with `save: true` and explicitly disables autorun;
real Run, edit, save and passive reopen checks cover the IDE consumer separately
from the Python quiz grader.
Profile arrays merge with the base, so explicit negative render patterns remove
all eight other base targets. This profile also turns off the inherited sidebar,
whose links advertise those unrendered pages. Its header links only to the five
fixture pages, with the default index/title link disabled; the fixture's own
cross-page links remain
([Quarto profile merging](https://quarto.org/docs/projects/profiles.html)).

The candidate PR runs only the small source contracts. It skips the old automatic
all-site build, STACK audit/review and variant statistics; that existing workflow
remains manually available. The candidate's own manual workflow creates artifacts
only. Root must replace both `PENDING_ROOT_FINAL_TUPLE` values with a reviewed
40-character umbrella commit and explicit component-ref JSON (possibly `{}` when
the umbrella already pins the entire tuple). Until then it fails before setup or
downloads. Setup uses the existing canonical installer, and the artifact retains
the resolved dependency record and its hash. A render artifact is not acceptance.
The workflow's first cheap PR source run registers it; GitHub documents API/CLI
dispatch against another branch after a workflow has run once. The manual UI
requires the file on the default branch, so do not change main just to show that
button ([GitHub dispatch behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch)).

Focused browser checks after that tuple is ready should use the actual controls:

1. Change both existing autosave answers; leave/reopen and reload. Restore must
   not run Python or Check. A saved result is historical until checked again.
2. In the mixed quiz, check `7` and run `quiz_sum` returning `a + b`. Both tiles
   and the total should reflect the real results. Wrong answers must also change
   the status; do not seed results or replace the runtime.
3. Use the tiles and links from the other page to reach the hidden reading-step
   mathematics and Python tab. Check Back/Forward and keyboard focus.
4. Reset Python and reload: its starter returns and its record is gone, while the
   mathematics answer remains independent. Clear page answers and verify the
   affected tiles, then verify saving-off/re-enable behavior.
5. Retain the existing nb/nn/de reveal-title checks; the new quiz is not translated
   into additional authored exercise languages in this candidate.
6. Open the board's reading step at desktop and 390px in each browser. Retain
   actual SVG, expression speech/Braille, hidden-to-visible geometry and original
   native load evidence under the real isolated opaque-frame path. Require zero
   raw errors and failed requests; visible SVG alone is not acceptance.
7. Open the ordinary Python editor and Run `print(6 * 7)` to obtain `42`. Edit it,
   save and reopen; the code must restore without automatically running. Check
   Run again through the real IDE control and reset without affecting the quiz.

Small focused checks during wiring are allowed. One full final acceptance pass
for the coherent demo candidate is already authorized. Freeze source, component,
tooling and course refs; retain raw errors, failures, exact run/job IDs and artifact
hashes. Repeated broad campaigns need AC's explicit request. Only after that pass
is clean and AC has merged all components, ask AC to start ingmat3a. Preparation
and tests on special ingmat3a branches are allowed; its main and deployment stay
protected. Source-only checks here do not establish rendered or browser behavior.

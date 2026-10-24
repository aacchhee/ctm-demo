# Native STACK authoring migration — HOLD

Base: ctm-demo `5bd385fbafbb6002216eb4c979426d3883358980` (testbox PR19).
This isolated branch grants no approvals, student clearance or deployment.

Four question sources preserve the original formulae, variable domains,
constraints, field labels and tolerances. Python/SymPy variables replace the
legacy parameters/derived/constraints DSL. Solutions are body sections. Duplicate
model-answer and uniform +1 test tables are removed: mandatory native teacher
validation now performs that model-answer check.

The initial focused source exercise produced 99 distinct undecided proposals:

| Question | Candidates | Teacher vectors | Teacher fields | Authored cases | Approved |
| --- | ---: | ---: | ---: | ---: | ---: |
| triangles | 24 (finite space exhausted) | 24 | 24 | 0 | 0 |
| values | 25 | 25 | 200 | 0 | 0 |
| angle | 25 | 25 | 25 | 0 | 0 |
| tangent | 25 | 25 | 100 | 0 | 0 |

Every teacher vector passed. Values deliberately retain the original significant
figure teacher expressions and numeric tolerance 0.02; solution readouts use two
decimal places. This migration does not silently change that authored grading.

Initial provenance limitation: math was immutable commit
`9f80a119473869d63f7fe54e8db3eae04ae1bd1c`, but the native producer ran from the
concurrently advancing checker working tree. The installed native manifest SHA256
was `fae7d9d325e7744d3944bdf02d3b8c9ad62d50b14e271139fbd23900a600ae2b`
(20 listed files). Core generation/orchestration/validation/history/model and
placeholder modules, and the wheel, matched checker
`f5c4e63b42d4eff2eabcb0e7e2ddb946cdeb2010`; UI/artifact modules did not constitute
one published commit. These observations are provisional, not an exact final
installed-tuple claim. Original native bytes and raw receipts are retained for
closure; a final canonical installation and read-only render validation are
required before publication of the migration.

The generic figure adapter independently passes focused source controls:
wrong sender, wrong label and old protocol cannot update the figure; matching
public values update it; repeating the same identity or a layout request does
not discard the learner's figure interaction. Generated figure blocks come only
from the maintained generator and sources.

The artifact workflow is restricted to this authoring PR branch and has read-only
repository permissions. Both pre-existing deploy jobs explicitly exclude its
head branch while retaining their main/audit-branch predicates. Default student
builds are excluded on this branch: zero approved candidates must refuse required
student mode. An explicit review render is not a green student build.

At that initial checkpoint, canonical tuple closure, rendered-demo browser
checks and safe removal of superseded page glue remained pending. The later
closure below supersedes the initial native provenance limitation for the
student page; browser evidence and its explicit limits remain separate.

## Canonical student-base closure

The initial provenance gap is closed for the migrated student page against this
fixed published component set (later authoring-only changes are outside this
proof):

- CTM Assessment `9504873c236e838f644c1a2807720ad419734554`
- math-exercise `d0dfc46dcb24725051104eb9380d2c5ac352d898`
- ctm-libs `5a067c93870a3719bc97a5f6198bb7cd21de138e`
- ctm-checkers `38332f9289ddb9415a703dd884e5ce42c5c97477`

The immutable canonical package was copied from the independent installed-consumer
fixture, verified against its complete hash receipt, then installed using the
published Assessment installer replacement/verification phase. Every installed
file matched the package record. The main checker wheel SHA256 was
`2c9935c6aa60041bbcb13d751db98c613feb69fd7077ebd3d4d296f8ac376f54`;
the native inventory contained 21 recorded files.

The explicit review render passed in 256.14 seconds. Native read-only resolution
replayed and validated all 99 proposals against current source and real teacher
grading. Structured output checks found the exact 24/25/25/25 distinct undecided
records, four generic live question contexts and four configured board iframes.
All four manifest byte hashes stayed unchanged. There was no regeneration.

Scope mistake recorded: the initial `quarto render --profile variants-review`
command merged Quarto's project/profile render arrays and rendered 13 site pages,
rather than only the intended STACK page. This is not claimed as a bounded
single-page command. Future documentation and workflows explicitly select
`pages/stack-oppgaver.qmd`; the unnecessary profile render array was removed.
No further generation or broad render was run to correct the command example.

The required-mode command explicitly selected the STACK page. It refused in
40.64 seconds with `required variants publishing needs at least one current
approved variant`. Manifest hashes again stayed unchanged. This expected refusal
proves the zero-approval boundary; it does not grant student clearance.

Browser structure checks confirmed all 99 candidates, four question IDs/context
classes, descriptive board titles and absence of the old page script dependency.
Raw Chromium rejected remote KaTeX/MathJax TLS and some remote fonts. TLS checking
was not disabled. Bounded local exact-asset/UI transport checks and their explicit
grader-stub limits are recorded separately when complete; no live CDN grading
acceptance is claimed.

The review dependency selector now accepts the known `ctm-checkers` component
with the same full-commit validation as the other components. The final review
commit trailer pins the entire seven-component student-base set; subsequent
authoring or payload-serialization fixes remain separate, unclaimed deltas.

## Tangent solution-target correction

Controlled browser checking found that targeting the entire tangent figure
callout caused native solution insertion to replace its contents and delete the
iframe. The source now targets a dedicated inner `stack-tangent-solution`
container after the board, preserving outer callout `stack-tangent-figure`.
The existing accepted-change handler closes that outer callout; no new API or
math/grading change was needed.

An affected-only canonical Quarto render copied the exact edited tangent source,
maintained figure block and unchanged 25-proposal manifest. It extracted the
actual tangent section into a standalone engineering page and selected only that
page in the project render list. The frozen extension package was installed with
unchanged hashes. The single-question render passed, preserved the manifest,
and emitted all three required IDs and the dedicated inner solution target.
The copied website sidebar points at deliberately omitted pages and therefore
emitted expected unresolved-link warnings. No 99-candidate regeneration or
repeat site render was performed. The resulting HTML SHA256 is
`188e8defe85a759e87647b7b910721afc3a2b1c33234a5a6e598eb84773c6dfc`.
The affected browser check remains separate from this source/render result.

## Bounded browser replacement closure

Independent controlled Chromium checking passed the three unchanged figures and
the affected-only tangent render. Real pinned JSXGraph constructed all four
boards and received the native public values. The tangent iframe remained intact
with its descriptive title and live question context. Cancel preserved selection,
AI response/feedback and the open figure; accepting another variant cleared the
matching AI response/feedback and closed the figure callout. Reopening produced a
functional real board with the selected values. Optional board attachment failure
left ordinary Check transport usable. Grading in these browser cases was an
explicit stub: real grading is established by the separate native teacher checks,
not by this UI transport test. Raw CDN TLS/data-URL policy blocks remain recorded;
there is no live-CDN or broad student/course clearance claim.

After that source/render/browser proof, the inert old `assets/stack/page.js`,
its `stack-content.lua` dependency filter and its project filter registration
were removed. No remaining product source references their custom protocol,
`stackTypeset` utility or old variant-change event. The generic component owns
question context IDs, board transport/titles/layout resend, solution insertion
and accepted-change collapse; plain AI feedback owns accepted-change reset.
The dedicated tangent solution slot preserves the board within its figure
callout. No native generation or 99-candidate render was repeated for cleanup.

Independent browser receipt: `demo-browser-tangent-controlled.json` (two cases),
combined with the prior three-board controlled receipt and raw trust-policy
failures. The fixed student-base refs remain unchanged; later authoring and
payload-serialization fixes are separate deltas, not silently folded into this
proof.

## Durable evidence archive

[Download the scoped raw receipts, drivers, exact controlled assets and rendered
artifacts](evidence/native-authoring-student-base.zip.README.md). The archive preserves
initial failures and provisional native bytes alongside canonical closure and
affected-only tangent proof. It is evidence, not an installable package.

Archive SHA256: `bcf9c313f6adf2578d34c15e4c4e53e90fb397f30b7916e3294473ee917978eb` (1167192 bytes, 68 entries).
Its internal `SHA256SUMS` covers each retained input/receipt. Browser engines and
original remote/data-URL acceptance remain explicitly outside the controlled
proof. The only post-render intro wording change replaces the obsolete reload
icon description with a generic variant-button instruction; mathematical
sources and native payloads are unaffected.

The exact evidence ZIP is stored in five small parts with per-part SHA256 and
reconstruction instructions because the connector stalled on its single large
blob. Reconstructing restores the original archive checksum above; no proof
bytes or runtime source changed.

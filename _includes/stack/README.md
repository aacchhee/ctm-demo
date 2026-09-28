# STACK conversion

`pages/stack-oppgaver.qmd` converts the four user-supplied Moodle XML questions
into native math-exercise pools and JSXGraph figures. It needs no Moodle server.

| Original question | Pool | Checking |
|---|---:|---|
| vinkler formlike trekanter a) | All 24 side-length pairs | Standard numeric, 3 decimal places; exact expressions accepted |
| Trigonometriske verdier i enhetssirkelen | 71 valid combinations covering the original angle grid | Standard numeric, original absolute tolerance 0.02 |
| Vinkel i enhetssirkelen | All 71 angles, 5°–355° | Standard numeric, original relative tolerance 1% |
| Derivasjon og tangent rasjonal funksjon | All 159 valid parameter triples | Standard algebraic equivalence |

STACK's LMS-specific partial-credit trees are replaced by ordinary field feedback
(and averaging for multi-field exercises). In particular, the original secondary
"approximately correct" tolerances and unequal derivative weights are not copied.
The page states the acceptance precision. The inverse-angle question asks for
three decimal places so the original 1% tolerance also works near zero. The
trigonometric reading keys preserve STACK's two-significant-figure rounding.

The native ↻ button selects a generated stable variant ID. `assets/stack/page.js`
uses `cell.mathExercise.getVariant()` and `math-exercise:variant-change` to send
that record's parameters to the corresponding iframe. The extension renders the
matching Markdown solution and context. Pool changes close solutions and reset
figures; ordinary resizing does not reset figures.

Circle points are actual gliders. Angle readouts use atan2 normalized to [0,2π).
Figures wait for visible dimensions, preserve equal scales in geometric diagrams, and respond
to nested tabs and collapsed solutions. The rational graph is split at its pole;
the tangent slider stays in the connected domain containing the given point.

## Compact authoring and optional review

Edit `triangles.qmd`, `values.qmd`, `angle.qmd` or `tangent.qmd` in this folder.
Each contains one parameter definition, question and Markdown solution. Quarto
expands these at build time; no pool-generation command or variant catalogue is
needed. Run `quarto render pages/stack-oppgaver.qmd` as usual.

For optional review run `quarto render pages/stack-review.qmd`. This author page
is intentionally outside the site's normal render list. Inspect candidates in
the same interactive figures and use **Copy selection**. Replace the selection
options in the corresponding QMD file, then render the student page normally.
There is no separate selection file or student-side parameter generation.

Figure source remains in `scripts/generate-stack-figures.py`; run that script
only when editing the figures. Solutions remain native collapsed Quarto callouts.

Each topic uses a native `.ai-feedback` fenced Div for an ungraded explanation,
with Markdown prompts and hidden `.feedback-criteria`. The math-exercise shared
feedback integration and ai-feedback use one settings dialog. Existing legacy
math-exercise settings can be imported explicitly in that dialog.

The page assigns an explicit context ID to the active question element. The
shared extractor reads its visible prose and mathematical notation, excluding
input values, answer keys and worked solutions. Topic
context and conventions are explicitly referenced as well. Changing variants
clears the explanation and feedback and closes the solution. Editing clears old
feedback; the shared client's snapshot check rejects replies for changed input
or context. API calls and prompt-copy mode are provided by the shared extension.

The extension manifest uses math-exercise's `feature/build-time-variants` branch
for both math-exercise and JSXGraph, and ai-feedback from `main`. Other assessment
consumers remain on their shared-feedback integration branches.

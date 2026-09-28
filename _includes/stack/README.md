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

The native ↻ button chooses another pool variant. `assets/stack/page.js` observes
the selected variant marker, updates the collapsed solution, and sends the same
parameters to the corresponding iframe. The AI gets the selected question and
explicit mathematical context, never the worked-solution block. Pool changes
close solutions and reset figures; ordinary resizing does not reset figures.

Circle points are actual gliders. Angle readouts use atan2 normalized to [0,2π).
Figures wait for visible dimensions, preserve equal scales in geometric diagrams, and respond
to nested tabs and collapsed solutions. The rational graph is split at its pole;
the tangent slider stays in the connected domain containing the given point.

To change the pools or figures, edit their source and regenerate:

```sh
python scripts/generate-stack-pools.py
python scripts/generate-stack-figures.py
quarto render pages/stack-oppgaver.qmd
```

Commit both the generator/source changes and the generated includes/assets.

Solutions are authored as Markdown in `scripts/generate-stack-pools.py` and
stored in `assets/stack/variants.json`. `_filters/stack-content.lua` renders them
with Pandoc during the Quarto build, including tables and MathJax notation.
The same filter compiles the pool Markdown before math-exercise consumes it,
protecting answer markers and preserving mathematical source for AI context.
The page uses native collapsed Quarto callouts, and queues dynamic typesetting
until MathJax is ready. No authored HTML forms or solution containers are needed.

Each topic uses a native `.ai-feedback` fenced Div for an ungraded explanation,
with Markdown prompts and hidden `.feedback-criteria`. The math-exercise shared
feedback integration and ai-feedback use one settings dialog. Existing legacy
math-exercise settings can be imported explicitly in that dialog.

The page assigns an explicit context ID to the active question element. The
shared extractor reads its visible prose and mathematical notation, excluding
input values, hidden variant markers, answer keys and worked solutions. Topic
context and conventions are explicitly referenced as well. Changing variants
clears the explanation and feedback and closes the solution. Editing clears old
feedback; the shared client's snapshot check rejects replies for changed input
or context. API calls and prompt-copy mode are provided by the shared extension.

The extension manifest currently uses math-exercise's
`feature/shared-feedback-integration` branch, which requires ai-feedback 0.6.0+.
Once that integration is merged, its manifest entry can return to `main`.

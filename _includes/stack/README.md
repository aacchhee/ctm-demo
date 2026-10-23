# Native variants authoring fixture

The four questions use Python/SymPy `variables`, `pick`/`require`, display
placeholders, named answer fields, and body `#| solution` sections. They keep
the original mathematics and explicit numeric tolerances. Mandatory teacher
checks replace the old duplicate model-answer test tables.

The checked-in `_variants/stack-*.yml` files contain 99 tested proposals:
24 triangles (the full finite space), and 25 each for values, angle and tangent.
**None is approved.** Stable positive numbers are assigned only by an explicit
review decision. This branch is an authoring fixture, not a cleared student site.

With the reviewed CTM installation, inspect the current candidates:

```sh
python _extensions/math-exercise/question-variants.py --project . \
  --file _includes/stack/triangles.qmd --label stack-triangles \
  review --html work/stack-triangles.html
```

Use the corresponding file and label for the other three exercises. Generate
another tested batch only when wanted, using `generate25more` instead of `review`.
This CLI HTML export is the disconnected review route. For the installed rendered
student preview and immediate native decision saving, use the local helper:

```sh
python _extensions/math-exercise/variants-review.py --project . \
  --file _includes/stack/triangles.qmd --label stack-triangles
```

The helper serves a random-token loopback URL; save source edits before rebuilding
its view and stop it with Ctrl-C. This authoring preview is not student publishing
clearance. The disconnected export's downloaded decision request can still be
applied with the same trusted
source selection and `apply work/downloaded-request.json`. The CLI rebuilds
current source and checks the saved manifest lease and exact candidate hashes.
No approval is performed by the build or the scripts in this fixture.

For a nonstudent page preview:

```sh
CTM_VARIANTS=review quarto render pages/stack-oppgaver.qmd --profile variants-review
```

Required student mode intentionally refuses these unapproved proposals. Explicit
`CTM_VARIANTS=optional` is OPEN and emits a warning; it is not approval. Ordinary
preview command behavior must not be inferred from the authoring profile. The
single-page command above is exercised by native-authoring CI. Normal main setup
ignores review trailers and uses the upstream default pack: before activating
student publishing, deliberately select the reviewed native pack through explicit
course publishing configuration or later approved package activation; teachers
must explicitly approve current candidates and the ordinary required-mode build
must pass. Parent PR19 and existing courses retain legacy-compatible defaults.
The current legacy route fails native verification before artifact upload; this
zero-approval authoring fixture grants no deployment authorization.

Each question declares its board iframe and title. The maintained figure sources
consume the generic `ctm-variant` public `values` projection. Regenerate embedded
blocks after figure changes with `python scripts/generate-stack-figures.py`.
AI explanations reference `<label>-question` and clear on the generic accepted
variant event through `reset-on-variant`. Figure/AI failures must not disable
ordinary Check; missing speech and Maxima readiness remain independent.

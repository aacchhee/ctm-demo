# Package and public-page audit — 16 October 2026

Scope: `aacchhee/ctm-demo` and the six Erasmus-CTM component repositories
`ctm-assessment`, `stack-sympy`, `ai-feedback`, `math-exercise`, `py-exercise`
and `pyodide-interaktiv`. JSXGraph is distributed by math-exercise. Other CTM
course repositories are outside this follow-up audit.

## Findings and changes

- No pre-existing open PRs were returned for the seven repositories at the
  beginning of this audit. The correction PRs listed below are new and await
  AC's review; this report does not claim an empty PR queue after creating them.
- The old demo installation requested the deleted math-exercise
  `feature/build-time-variants` branch. It now uses audited full commit IDs.
  Fresh and repeated setup both fetch those commits; JSXGraph shares the exact
  mathematics checkout. Resolved source receipts remain in
  `.private-extensions/resolved-repos.json`.
- AI Feedback did not recognize Markdown ATX headings. A model response such as
  `## Next step ##` therefore displayed literal hashes. The shared 0.6.1 fix
  recognizes levels 1–6, removes optional closing hashes, and preserves TeX,
  code and HTML escaping. The regression supplies deterministic response text;
  no external AI provider was called.
- Source/download/help links in AI Feedback, mathematics and assessment pointed
  to deleted feature branches. Those links now target merged `main` files.
- The combined assessment manifest used old audit/development branches for
  mathematics and Python exercises. It now uses their merged revisions and the
  heading fix. The shared-feedback Pyodide branch remains intentional: its
  integration is not on Pyodide main. It has passing standalone and adapter
  workflows; it does not have a separate public example site.

## Dependency revisions

The install manifest is `quarto-extensions.yml`; its full commit IDs are the
source of truth. At this audit the adopted functional revisions were:

| Component | Version | Audited revision |
| --- | --- | --- |
| AI Feedback | 0.6.1 | `bda67fbe515a3e5e2a2fa4b827c1bd918552fbac` |
| math-exercise | 0.7.0 | `c708e5e2a3a35829af229d2e28b5470bac5c31b7` |
| JSXGraph bridge | 1.1.0 | Same math-exercise revision |
| py-exercise | 0.2.1 | `db4db7705de424a0aface078204904f40f5ee22f` |
| pyodide-interaktiv | 1.6.0 | `f68af42714609451beb304ecc74da4df125ca4cf` |
| CTM Assessment wrapper | 0.1.0 | `a416b2f1ca64875c1ccc6642cbe20b12fa85fcfa`; wrapper code unchanged |
| STACK SymPy (separate site) | 0.1.9 | `213ef2b66b5c2f544565ff86c44b22081488b33c` |

This is an update of CTM components, not a wholesale upgrade of third-party
browser runtimes. The existing Pyodide, Monaco, KaTeX and MathJax versions remain
those used by the tested component revisions.

## Public deployment evidence

All six public sites were opened in the browser. Every source-declared current
Quarto page and each linked AI Feedback documentation page was inspected:

| Site | Browser pages | Result |
| --- | ---: | --- |
| ctm-demo | 8 | No leaked heading/fence markers or math error elements |
| ctm-assessment | 3 | Same; all five example tabs present |
| stack-sympy | 5 | Same; includes the separately assembled compliance report |
| math-exercise | 12 | Same; includes the unlinked generated-variants page |
| py-exercise | 4 | Same |
| ai-feedback documentation | 8 | Same; activities link to the combined assessment site |

These 40 page observations establish page availability and the checked DOM
properties, not exhaustive exercise interaction coverage. The assessment
`examples.html` alias and mathematics `generated-variants.html` were checked
explicitly against the source render lists.

The actual published `gh-pages` trees were also extracted and scanned, including
retained STACK report/preview pages:

| Repository | Deployment commit | HTML files | Same-site assets | Static findings |
| --- | --- | ---: | ---: | ---: |
| ctm-demo | `b7211b3` (deploys `4f5f3be`) | 8 | 26 | 0 |
| math-exercise | `b1f3b7f` (deploys `8764e93`) | 12 | 22 | 0 |
| stack-sympy | `a24b004` (deploys `213ef2b`) | 18 | 42 | 0 |

Static checks inspect markup leakage, existing math error nodes, same-site
script/style/image references and HTML fragments. They exclude code/source
panels and do not execute scripts. The existing main publishing workflows were
successful at the audited heads. The demo's old deployment was from 28 September;
the fresh local build uses the new pins.

## Recomputed validation

- AI Feedback: all 54 JavaScript tests; standalone Quarto example render.
- Mathematics: all 95 JavaScript tests, 14 Python variant tests, authored checker
  suites exercised by those tests, and the full 12-page Quarto build.
- Pyodide integration: all 19 JavaScript tests and standalone example render.
- Python exercises: authored greeting regression and all three standalone
  examples; the publishing builder also creates the landing page.
- Combined assessment: unit/package checks, complete three-page render, and all
  ten integration scenarios, using the local component checkouts. The build
  records source commits, dirty-file lists and extension-file hashes in its
  generated `resolved-repos.json` receipt.
- STACK: 107 tests and 144 subtests passed, one existing skip. Its current
  [publishing run](https://github.com/Erasmus-CTM/stack-sympy/actions/runs/38879445184)
  also passed native compliance, native Maxima comparison and browser checks.
  Those CI checks are evidence from CI, not local recomputations.
- Demo: all eight pages and the review profile render; the existing variant
  checker verifies four exercises, all 325 candidates, authored tests and the
  student/review selection boundary.

Commands, from each relevant repository:

```sh
npm test
python -m pytest -q tests  # STACK: PYTHONPATH=_extensions/stack-sympy
quarto render
quarto render --profile review  # demo
python scripts/check-stack-variants.py  # demo
python scripts/setup-feedback-integration.py --test \
  --source ai-feedback=../ai-feedback --source math-exercise=../math-exercise \
  --source py-exercise=../py-exercise --source pyodide-interaktiv=../pyodide-interaktiv
```

The reusable static checker can audit a built directory or crawl a public site:

```sh
python scripts/audit-rendered.py --directory _site --output render-audit.json
python scripts/audit-rendered.py --site https://aacchhee.github.io/ctm-demo/ --output public-audit.json
```

Local renders used Quarto 1.8.27, Python 3.12, SymPy 1.14.0, NetworkX 3.4.2 and
PyYAML 6.0.2. The sandbox cannot start Quarto's bundled Dart VM, so local theme
compilation used Quarto's supported `QUARTO_DART_SASS` override with the official
npm Sass implementation. Native Quarto rendering is also checked by GitHub CI.
Local Chromium installation/launch was unavailable. The cloud browser could
inspect the sites, but blocked some interactive iframe resources. Direct HTTP
asset crawling also encountered network-policy failures. These limitations are
not classified as site defects and do not establish full browser/Pyodide parity.
No live AI-provider call, native Maxima rerun or compliance rerun is claimed.

## Correction PRs and publication

Merge the shared heading fix, mathematics source links, assessment pin update,
and finally the demo refresh. Their commit pins make the builds reproducible;
the PR descriptions identify their dependencies. Publishing happens through the
existing main workflows after AC merges them. This audit does not merge PRs or
claim the new fix is already live.

Agent: Codex. Model: gpt-6.1-sol.

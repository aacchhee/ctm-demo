# CTM demo

A minimal, independent English Quarto website demonstrating JSXGraph,
browser-based Python, and automatically checked mathematics problems.

- **Interactive mathematics:** a vector applet, the power method through the
  Rayleigh quotient, and two mathematics problems.
- **Your experiments here:** a clean page for new content.
- **Help:** ingredients, a GitHub-adapter workflow diagram, VS Code setup,
  publishing, and troubleshooting.

## Run locally

Install Git, Python 3.12, and Quarto 1.8.27. Open this folder in VS Code.

```bash
python -m venv .venv
# Activate .venv for your shell.
python -m pip install -r requirements.txt
python scripts/setup.py
quarto preview
```

For a static build, run `quarto render`. Full instructions, including Windows
activation, are in [pages/help.qmd](pages/help.qmd).

## GitHub Pages

Pushes to `main` install extensions, render, and publish to `gh-pages`.
Pull requests build without publishing. After the first successful build,
select **Settings → Pages → Deploy from a branch → gh-pages / (root)**.

Expected URL: <https://aacchhee.github.io/ctm-demo/>.

## Structure

Content lives in `.qmd` wrappers and `_includes/*.md`; `_quarto.yml` configures
the site. `quarto-extensions.yml` names only `ctm-assessment` at immutable
commit `503c8688eaf556ff23af0fc629ca60f71833ea73`.
`scripts/setup.py` is shared by local development and GitHub Actions. It fetches
that umbrella source, runs its builder, and installs the assembled distribution.
The full suite is enabled through the `ctm-assessment` filter. Component sources
are selected only by CTM Assessment's manifest, which pins every component,
including the upstream JSXGraph extension, by commit. The demo has no separate
component refs.
Setup verifies installed files against the umbrella's hashes and copies its
revision record to `.private-extensions/resolved-repos.json`.
To update, re-run setup and render both student and review profiles before publishing.
No external course checkout or course-site link is required.

Mathematics fields start blank by default. Use `initial-values` only for an
exceptional activity that needs a particular starting draft. Linked JSXGraph
images and current board state can be explicitly included as feedback context
without replacing the learner's typed answer.

See [pages/help.qmd](pages/help.qmd) for the ingredient list and authoring workflow.

The four STACK definitions live in `_includes/stack/*.qmd`. With the reviewed
native pack, render their nonstudent authoring preview explicitly:

```sh
CTM_VARIANTS=review quarto render pages/stack-oppgaver.qmd --profile variants-review
```

This optional local preview grants no approvals. Main retains all 99 proposals
and 25 explicit teaching approvals: seven triangles and six each for values,
angle and tangent. Its ordinary required-mode build succeeds with those approved
candidates; the remaining proposals require further explicit decisions. Reviewers
use the bot's browser review links, without a CLI requirement. Hosted student
previews now publish in the live acceptance flow. Its bot post-commit head-readiness
correction must land in trusted default-branch tooling before the complete
browser-only approval flow is accepted. Main ignores
review trailers. See [_includes/stack/README.md](_includes/stack/README.md) for the
authoring sources.

## Coordinated dependency reviews

The trusted variants package is a native review tool, separately inventoried in
`.github/variants-tooling/package.json`. Its `sources` always retain the seven
frozen student-package commits. Version 1 contains that canonical package;
version 2 may replace only `math-exercise/variants-review.py` for a reviewed
native exporter correction. Version 3 retains that exporter correction and adds
only `ctm-checkers/native-authoring/ctm_variants/github_bot.py` for the bot's
post-commit head-readiness check, plus the mechanically derived `native.json`
inventory entry for that file. `nativeReviewOverrides` records each immutable
upstream commit, Git blob, source path, canonical base commit/digest and replacement
digest. The bot override also records its canonical base byte length. The
bootstrap reconstructs the original native inventory using the base length and
digest, checks its hash against the canonical receipt, and verifies the complete
native source closure before installation. The embedded resolved record
describes the canonical **base**, with the
explicit native overrides recorded separately; it does not describe a full
component upgrade. Runtime files, wheels and ordinary site pins stay unchanged.

Rebuilding version 2 requires `build-variants-tooling.py --package BASE_PACKAGE
--native-review-source MATH_GIT_CHECKOUT --native-review-commit FULL_REVIEWED_SHA`.
Version 3 additionally requires `--native-bot-source CHECKERS_GIT_CHECKOUT
--native-bot-commit FULL_REVIEWED_SHA`. The builder verifies the complete base
before reading the exact upstream commits; the bootstrap verifies the complete
final inventory and exactly the allowlisted overrides before writing any file.
Merge the reviewed course change before running the default-branch trusted
producer. Do not load tooling from an authored PR, edit
saved proposals/history, or treat generated review output as teaching approval.
The trusted default-branch producer fingerprint is the security anchor: archive
schema checks reject inconsistent metadata, rather than authenticating arbitrary
replacement manifests supplied by an attacker.

24 October: native tooling retains the exporter correction from
[math-exercise PR35](https://github.com/Erasmus-CTM/math-exercise/pull/35), immutable
commit `c2ad38ea9fd26e03dc21c57f9f56a1a9305b9466`, and adds the post-commit readiness
correction from [ctm-checkers PR33](https://github.com/Erasmus-CTM/ctm-checkers/pull/33),
immutable commit `efab7ad96bedb405ed3a71862018b0bc9cda628f`. The bot retries only a
brief stale PR-head projection after its atomic commit, then requires the exact
new branch ref before dispatching validation. Relative to the exporter-only
package, exactly two of the 112 archived files change: the bot and its derived
native inventory. The other 110 files,
all seven base pins and saved course records remain unchanged. These native-tool
corrections do not upgrade student package `503c868` or grant teaching approvals.

Normal builds use the component commits pinned in the manifest of
`ctm-assessment` at `main`. A non-main review commit can declare exact dependency
SHAs in a `CTM-Review-Refs: {"ai-feedback":"<40-character SHA>"}` commit trailer.
The visibly named workflow step prints those refs; the umbrella records them in
`resolved-repos.json`. Main ignores review trailers. Merge upstream changes
first, then rerun consumers with default dependencies before merging them.

## Public STACK question audit

Maintainer report: <https://aacchhee.github.io/ctm-demo/stack-audit/>.
The standalone project in `_stack-audit/` records mathematics and PRT findings,
counterexamples, proposed repairs and regression cases against a pinned upstream
commit. Downloads include a reproducible question inventory and source hashes.
An early statistics overview counts record verdicts by pack, error classes and
PRT failure mechanisms. `_stack-audit/classifications.json` explicitly maps each
finding to affected records; unflagged records remain undecided, not certified
correct. Class counts overlap, while question counts are deduplicated.
The node-count comparison uses individual named PRTs, separating direct defects
from missing cross-PRT consistency checks. Explicit attribution is maintained in
`_stack-audit/prt-attribution.json`; the build verifies names and node counts
against the pinned XML and publishes a per-tree ledger.

Install the plot dependency with `python -m pip install -r _stack-audit/requirements.txt`,
then run `python scripts/build-stack-audit.py` after rendering the main site.
It uses Quarto, Matplotlib and Python's standard library, fetches the pinned public upstream
archive, verifies inventory totals and selected witnesses, and copies the report
to `_site/stack-audit/`. It does not execute STACK/Maxima grading.

The audit branch also has a scoped preview workflow that publishes only this
report, preserving the other CTM demo pages. Main's normal build preserves the
report through the same build script after this change is merged.



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
the site. `quarto-extensions.yml` names only `ctm-assessment` at `main`.
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

The four STACK definitions live in `_includes/stack/*.qmd`. Optional review:
`quarto render --profile review`. See
[_includes/stack/README.md](_includes/stack/README.md) for the selection workflow.

## Coordinated dependency reviews

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

Run `python scripts/build-stack-audit.py` after rendering the main site.
It uses Quarto and Python's standard library, fetches the pinned public upstream
archive, verifies inventory totals and selected witnesses, and copies the report
to `_site/stack-audit/`. It does not execute STACK/Maxima grading.

The audit branch also has a scoped preview workflow that publishes only this
report, preserving the other CTM demo pages. Main's normal build preserves the
report through the same build script after this change is merged.


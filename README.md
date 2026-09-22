# CTM demo

A minimal, independent English Quarto website demonstrating JSXGraph,
browser-based Python, and automatically checked mathematics problems.

- **Interactive mathematics:** a vector applet, the power method through the
  Rayleigh quotient, and two mathematics problems.
- **Your experiments here:** a clean page for new content.
- **Help:** ingredients, a GitHub-adapter workflow diagram, VS Code setup,
  publishing, and troubleshooting.

## Run locally

Install Git, Python 3.12, and the Quarto CLI. Open this folder in VS Code.

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
the site. `quarto-extensions.yml` lists the Erasmus-CTM extension sources.
`scripts/setup.py` is shared by local development and GitHub Actions.
Extension refs follow upstream branches and can change between setup runs.
No external course checkout or course-site link is required.

See [pages/help.qmd](pages/help.qmd) for the ingredient list and authoring workflow.

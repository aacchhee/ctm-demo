"""Render the public guide and record its exact installed component sources."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parents[1]
PAGES = (
    "pages/similar-problems.qmd",
    "pages/similar-problems-authoring.qmd",
    "pages/similar-problems-workflow.qmd",
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--record-only", action="store_true",
                        help="Record provenance after an existing full-site build")
    args = parser.parse_args()
    if not args.record_only:
        for page in PAGES:
            subprocess.run(["quarto", "render", page], cwd=ROOT, check=True)
    for page in PAGES:
        rendered = ROOT / "_site" / Path(page).with_suffix(".html")
        if not rendered.is_file():
            raise SystemExit(f"Missing rendered guide page: {rendered}")
    record = json.loads((ROOT / ".private-extensions/resolved-repos.json").read_text())
    record["previewSourceHead"] = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=ROOT, text=True
    ).strip()
    record["guidePages"] = list(PAGES)
    (ROOT / "_site/similar-problems-build.json").write_text(
        json.dumps(record, indent=2) + "\n"
    )


if __name__ == "__main__":
    main()

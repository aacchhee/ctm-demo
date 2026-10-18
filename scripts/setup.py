from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

import yaml


CONFIG_FILE = "quarto-extensions.yml"


def run(*args: str, cwd: Path | None = None) -> None:
    print(f"> {' '.join(args)}")
    subprocess.run(args, cwd=cwd, check=True)


def require_command(name: str) -> None:
    if shutil.which(name) is None:
        sys.exit(
            f"\nERROR: '{name}' was not found on PATH.\n"
            f"Install {name} and run this setup script again.\n"
        )


def load_plugins(config_path: Path) -> list[dict[str, str]]:
    if not config_path.exists():
        sys.exit(
            f"\nERROR: configuration file not found:\n"
            f"  {config_path}\n"
        )

    with config_path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    if not data or "plugins" not in data:
        sys.exit(
            f"\nERROR: '{CONFIG_FILE}' must contain a 'plugins:' list.\n"
        )

    plugins = data["plugins"]

    if not isinstance(plugins, list):
        sys.exit(
            f"\nERROR: 'plugins' in '{CONFIG_FILE}' must be a list.\n"
        )

    normalized: list[dict[str, str]] = []

    for i, plugin in enumerate(plugins, start=1):
        if not isinstance(plugin, dict):
            sys.exit(
                f"\nERROR: plugin entry #{i} must be a mapping.\n"
            )

        name = plugin.get("name")
        repo = plugin.get("repo")
        path = plugin.get("path")
        ref = plugin.get("ref", "main")

        if not name or not repo or not path:
            sys.exit(
                f"\nERROR: plugin entry #{i} must contain:\n"
                "  name:\n"
                "  repo:\n"
                "  path:\n"
            )

        normalized.append(
            {
                "name": str(name),
                "repo": str(repo),
                "ref": str(ref),
                "path": str(path),
            }
        )

    return normalized


def clone_or_update_plugin(
    plugin: dict[str, str],
    private_root: Path,
) -> Path:
    name = plugin["name"]
    repo = plugin["repo"]
    ref = plugin["ref"]

    plugin_repo = private_root / name

    # Fetch accepts both branch names and full commit IDs. Keeping the checkout
    # detached records the resolved branch tip without creating a local branch.
    try:
        if not plugin_repo.exists():
            print(f"\nDownloading plugin: {name}")
            run("git", "init", str(plugin_repo))
            run("git", "-C", str(plugin_repo), "remote", "add", "origin", repo)
        else:
            print(f"\nUpdating plugin: {name}")
        run("git", "-C", str(plugin_repo), "fetch", "--depth", "1", "origin", ref)
        run("git", "-C", str(plugin_repo), "checkout", "--detach", "--force", "FETCH_HEAD")
    except subprocess.CalledProcessError:
        sys.exit(f"\nERROR: could not fetch plugin '{name}' at {ref} from {repo}.\n")

    return plugin_repo


def install_umbrella(assessment_repo: Path, project_root: Path, review_refs: dict[str,str]) -> None:
    """Build and install the package with CTM Assessment's own installer."""
    run(
        sys.executable,
        str(assessment_repo / "scripts" / "install-project.py"),
        "--project", str(project_root),
        "--review-refs", json.dumps(review_refs),
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-refs", default="{}", help="Coordinated review component commits (full SHAs) as JSON or NAME=SHA[,NAME=SHA]; production defaults stay main")
    raw = parser.parse_args().review_refs.strip()
    try:
        # JSON, or NAME=SHA[,NAME=SHA] (PowerShell 5.1 strips JSON's inner quotes).
        review_refs = json.loads(raw) if raw.startswith("{") else dict(pair.split("=", 1) for pair in raw.split(",") if pair.strip())
    except (ValueError, json.JSONDecodeError):
        sys.exit("ERROR: --review-refs must be JSON or NAME=SHA[,NAME=SHA]")
    if not isinstance(review_refs, dict):
        sys.exit("ERROR: review refs must be a mapping")
    review_refs = {str(k).strip(): str(v).strip() for k, v in review_refs.items()}
    project_root = Path(__file__).resolve().parent.parent
    config_path = project_root / CONFIG_FILE
    private_root = project_root / ".private-extensions"

    print("Project:")
    print(f"  {project_root}")

    print("\nChecking required tools...")
    require_command("git")
    require_command("quarto")

    print("\nReading extension configuration:")
    print(f"  {config_path}")

    plugins = load_plugins(config_path)

    if not plugins:
        print("\nNo extensions configured.")
        return

    private_root.mkdir(exist_ok=True)

    print(f"\nConfigured plugins: {len(plugins)}")

    for plugin in plugins:
        print(
            f"  - {plugin['name']} "
            f"({plugin['path']}, ref: {plugin['ref']})"
        )

    if len(plugins) != 1 or plugins[0]["name"] != "ctm-assessment" or plugins[0]["ref"] != "main":
        sys.exit("ERROR: configure only ctm-assessment at main; its manifest owns the component sources.")
    assessment_ref = review_refs.pop("ctm-assessment", "main")
    if review_refs or assessment_ref != "main":
        print("Explicit review dependencies:", assessment_ref, review_refs)
    assessment_repo = clone_or_update_plugin({**plugins[0], "ref": assessment_ref}, private_root)
    install_umbrella(assessment_repo, project_root, review_refs)

    print("\nInstalled Quarto extensions:")
    run(
        "quarto",
        "list",
        "extensions",
        cwd=project_root,
    )

    print("\nSetup complete.")
    print("\nYou can now run:")
    print("  quarto preview")


if __name__ == "__main__":
    main()


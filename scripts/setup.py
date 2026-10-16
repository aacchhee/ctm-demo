from __future__ import annotations

import hashlib
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


def install_umbrella(assessment_repo: Path, project_root: Path) -> None:
    """Use CTM Assessment's builder and manifest, then install its distribution."""
    workspace = project_root / ".private-extensions" / "ctm-assessment-build"
    run(
        sys.executable,
        str(assessment_repo / "scripts" / "setup-feedback-integration.py"),
        "--workspace", str(workspace),
    )
    distribution = workspace / "ctm-assessment"
    record = json.loads((distribution / "resolved-repos.json").read_text())
    # Replace only extensions owned by this umbrella; preserve course extensions.
    for name in record["extension_sha256"]:
        installed = project_root / "_extensions" / name
        if installed.exists():
            shutil.rmtree(installed)
    run("quarto", "add", str(distribution), "--no-prompt", cwd=project_root)
    for name, files in record["extension_sha256"].items():
        for relative, expected in files.items():
            installed = project_root / "_extensions" / name / relative
            if not installed.is_file() or hashlib.sha256(installed.read_bytes()).hexdigest() != expected:
                sys.exit(f"ERROR: installed umbrella file differs: {name}/{relative}")
    shutil.copy2(distribution / "resolved-repos.json", project_root / ".private-extensions" / "resolved-repos.json")


def main() -> None:
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
    assessment_repo = clone_or_update_plugin(plugins[0], private_root)
    install_umbrella(assessment_repo, project_root)

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


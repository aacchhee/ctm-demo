"""Audit published HTML, same-site assets, fragments and leaked markup.

Requires beautifulsoup4. This checks static output, not browser execution or AI
provider responses. Repeat --site for each published site to include.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import unquote, urldefrag, urljoin, urlsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


def fetch(url):
    try:
        with urlopen(Request(url, headers={"User-Agent": "CTM-render-audit"}), timeout=45) as response:
            return {"status": response.status, "url": response.url,
                    "type": response.headers.get_content_type(), "body": response.read()}
    except Exception as error:
        return {"error": str(error)}


def audit(root):
    root = root.rstrip("/") + "/"
    pending, pages, assets, fragments, issues = {root}, {}, set(), [], []
    if root.startswith("file:"):
        directory = Path(unquote(urlsplit(root).path))
        pending = {path.as_uri() for path in directory.rglob("*.html")
                   if "site_libs" not in path.relative_to(directory).parts}
    with ThreadPoolExecutor(max_workers=8) as pool:
        while pending:
            batch = sorted(pending - pages.keys())
            pending = set()
            if not batch:
                break
            for url, response in zip(batch, pool.map(fetch, batch)):
                body = response.pop("body", b"")
                pages[url] = response
                if "error" in response:
                    issues.append({"page": url, "error": response["error"]})
                    continue
                response["sha256"] = hashlib.sha256(body).hexdigest()
                if response["type"] != "text/html":
                    continue
                soup = BeautifulSoup(body, "html.parser")
                response["title"] = soup.title.get_text() if soup.title else ""
                response["ids"] = {node["id"] for node in soup.select("[id]")}
                for node in soup.select("a[href], script[src], img[src], link[href], iframe[src]"):
                    raw = node.get("href", node.get("src", ""))
                    target, fragment = urldefrag(urljoin(response["url"], raw))
                    if target.startswith("file:") and Path(unquote(urlsplit(target).path)).is_dir():
                        target = target.rstrip("/") + "/index.html"
                    if not target.startswith(root) or "/previews/" in target:
                        continue
                    suffix = Path(urlsplit(target).path).suffix.lower()
                    if node.name == "a" and suffix in ("", ".html"):
                        pending.add(target)
                        if fragment:
                            fragments.append((url, target, unquote(fragment)))
                    elif node.name != "a" and not raw.startswith(("data:", "about:")):
                        assets.add(target)
                for node in soup.select("script, style, pre, code, textarea, template, .sourceCode"):
                    node.decompose()
                main = soup.select_one("main") or soup
                text = main.get_text("\n", strip=True)
                leaks = [line for line in text.splitlines()
                         if re.match(r"^(?:#{2,6}\s|:{3,}(?:\s|\{)|\{\{<)", line)]
                if leaks:
                    issues.append({"page": url, "markup": leaks[:12]})
                errors = [node.get_text(" ", strip=True) for node in main.select(".katex-error, mjx-merror, .math-error")]
                if errors:
                    issues.append({"page": url, "math_errors": errors})
        for source, target, fragment in fragments:
            if target in pages and "ids" in pages[target] and fragment not in pages[target]["ids"]:
                issues.append({"page": source, "missing_fragment": target + "#" + fragment})
        resources = {}
        for url, response in zip(sorted(assets), pool.map(fetch, sorted(assets))):
            body = response.pop("body", b"")
            response["sha256"] = hashlib.sha256(body).hexdigest()
            resources[url] = response
            if "error" in response:
                issues.append({"asset": url, "error": response["error"]})
    for page in pages.values():
        page.pop("ids", None)
    return {"root": root, "pages": pages, "assets": resources, "issues": issues}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", action="append", default=[])
    parser.add_argument("--directory", action="append", type=Path, default=[])
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    results = []
    sites = args.site + [directory.resolve().as_uri() for directory in args.directory]
    if not sites:
        parser.error("provide --site or --directory")
    for site in sites:
        result = audit(site)
        results.append(result)
        args.output.write_text(json.dumps(results, indent=2) + "\n")
        print(f'{site}: {len(result["pages"])} HTML URLs, {len(result["assets"])} assets, {len(result["issues"])} findings', flush=True)
    raise SystemExit(bool(any(result["issues"] for result in results)))


if __name__ == "__main__":
    main()

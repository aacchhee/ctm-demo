#!/usr/bin/env python3
"""Snapshot the canonical frozen package for the trusted variants workflows."""
import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parents[2]
COMPONENTS = ('ctm-assessment', 'ctm-checkers', 'ctm-libs', 'math-exercise')
REVIEW_TARGET = '_extensions/math-exercise/variants-review.py'
BOT_TARGET = '_extensions/ctm-checkers/native-authoring/ctm_variants/github_bot.py'
BOT_SOURCE = 'authoring/ctm_variants/github_bot.py'


def native_override(files, refs, source, commit, *, component, target, source_path):
    """Read one allowlisted native tool from an exact upstream Git commit."""
    if not isinstance(commit, str) or not re.fullmatch('[a-f0-9]{40}', commit):
        raise ValueError('Native review source requires a full immutable commit')
    if source.is_symlink():
        raise ValueError('Native review source must be a Git checkout')
    def git(*args):
        return subprocess.check_output(['git', '-C', str(source), *args])
    repository = 'Erasmus-CTM/' + component
    origin = git('remote', 'get-url', 'origin').decode().strip()
    if origin not in ('https://github.com/' + repository + '.git',
                      'https://github.com/' + repository,
                      'git@github.com:' + repository + '.git'):
        raise ValueError('Unexpected native review source repository')
    if git('rev-parse', '--verify', commit + '^{commit}').decode().strip() != commit:
        raise ValueError('Native review source is not the exact commit')
    subprocess.run(['git', '-C', str(source), 'merge-base', '--is-ancestor',
                    refs[component], commit], check=True)
    base = files[target]
    if (git('show', refs[component] + ':' + source_path) != base
            or git('show', commit + '^:' + source_path) != base):
        raise ValueError('Native tool does not patch the canonical base bytes')
    replacement = git('show', commit + ':' + source_path)
    if replacement == base:
        raise ValueError('Native tool override must change the file')
    blob = git('rev-parse', commit + ':' + source_path).decode().strip()
    if git('ls-tree', commit, '--', source_path).decode().strip() != '100644 blob ' + blob + '\t' + source_path:
        raise ValueError('Native tool must be an ordinary non-executable Git file')
    if blob != hashlib.sha1(b'blob ' + str(len(replacement)).encode() + b'\0' + replacement).hexdigest():
        raise ValueError('Native tool Git blob mismatch')
    files[target] = replacement
    return {'target': target, 'repository': repository,
            'commit': commit, 'sourcePath': source_path, 'gitBlob': blob,
            'baseCommit': refs[component],
            'baseSha256': hashlib.sha256(base).hexdigest(),
            'replacementSha256': hashlib.sha256(replacement).hexdigest()}


def build(package, root=ROOT, *, native_review_source=None, native_review_commit=None,
          native_bot_source=None, native_bot_commit=None):
    if bool(native_review_source) != bool(native_review_commit):
        raise ValueError('Native review override requires both source checkout and commit')
    if bool(native_bot_source) != bool(native_bot_commit):
        raise ValueError('Native bot override requires both source checkout and commit')
    if native_bot_source and not native_review_source:
        raise ValueError('Native bot correction must retain the reviewed exporter correction')
    record = json.loads((package / 'resolved-repos.json').read_text())
    refs = json.loads((root / '.github/merged-package-refs.json').read_text())
    for name, sha in refs.items():
        actual = record['repositories'][name]
        if actual['commit'] != sha or actual['dirty_files'] or actual['ref_override']:
            raise ValueError('Package does not match the frozen course tuple: ' + name)
    files = {}
    for component in COMPONENTS:
        folder = package / '_extensions' / component
        expected = record['extension_sha256'][component]
        actual = {p.relative_to(folder).as_posix(): p for p in folder.rglob('*') if p.is_file()}
        # The umbrella stores its package receipt beside its installed manifest.
        if component == 'ctm-assessment':
            actual.pop('resolved-repos.json', None)
        if set(actual) != set(expected):
            raise ValueError('Unexpected package file set: ' + component)
        for name, path in actual.items():
            if path.is_symlink():
                raise ValueError('Package symlinks are not supported')
            data = path.read_bytes()
            if hashlib.sha256(data).hexdigest() != expected[name]:
                raise ValueError('Package digest mismatch: ' + component + '/' + name)
            files['_extensions/' + component + '/' + name] = data
    files['_extensions/ctm-assessment/resolved-repos.json'] = (package / 'resolved-repos.json').read_bytes()
    files['LICENSE'] = (package / 'LICENSE').read_bytes()
    # Verify every canonical base byte before applying allowlisted native-only deltas.
    overrides = []
    if native_review_source:
        overrides.append(native_override(files, refs, native_review_source, native_review_commit,
            component='math-exercise', target=REVIEW_TARGET, source_path=REVIEW_TARGET))
    if native_bot_source:
        overrides.append(native_override(files, refs, native_bot_source, native_bot_commit,
            component='ctm-checkers', target=BOT_TARGET, source_path=BOT_SOURCE))
    output = root / '.github/variants-tooling'
    output.mkdir(parents=True, exist_ok=True)
    buffer = io.BytesIO()
    with gzip.GzipFile(fileobj=buffer, mode='wb', filename='', mtime=0) as zipped:
        with tarfile.open(fileobj=zipped, mode='w') as archive:
            for name, data in sorted(files.items()):
                entry = tarfile.TarInfo(name)
                entry.size, entry.mode, entry.mtime = len(data), 0o644, 0
                archive.addfile(entry, io.BytesIO(data))
    data = buffer.getvalue()
    (output / 'package.tar.gz').write_bytes(data)
    manifest = {'version': 3 if native_bot_source else 2 if overrides else 1, 'sources': refs,
                'archive': {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()},
                'files': {name: {'bytes': len(value), 'sha256': hashlib.sha256(value).hexdigest()}
                          for name, value in sorted(files.items())}}
    if overrides:
        manifest['nativeReviewOverrides'] = overrides
    (output / 'package.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--package', type=Path, required=True)
    parser.add_argument('--native-review-source', type=Path,
                        help='Local canonical math-exercise Git checkout; review tooling only')
    parser.add_argument('--native-review-commit',
                        help='Full reviewed immutable upstream exporter-fix commit; never a branch')
    parser.add_argument('--native-bot-source', type=Path, help='Canonical ctm-checkers Git checkout; native tooling only')
    parser.add_argument('--native-bot-commit', help='Full immutable upstream GitHub bot-fix commit')
    args = parser.parse_args()
    result = build(args.package, native_review_source=args.native_review_source,
                   native_review_commit=args.native_review_commit, native_bot_source=args.native_bot_source,
                   native_bot_commit=args.native_bot_commit)
    print(json.dumps({'files': len(result['files']), 'archive': result['archive']}))

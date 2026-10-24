#!/usr/bin/env python3
"""Snapshot the canonical frozen package for the trusted variants workflows."""
import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path
import tarfile

ROOT = Path(__file__).resolve().parents[2]
COMPONENTS = ('ctm-assessment', 'ctm-checkers', 'ctm-libs', 'math-exercise')


def build(package, root=ROOT):
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
    manifest = {'version': 1, 'sources': refs,
                'archive': {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()},
                'files': {name: {'bytes': len(value), 'sha256': hashlib.sha256(value).hexdigest()}
                          for name, value in sorted(files.items())}}
    (output / 'package.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--package', type=Path, required=True)
    result = build(parser.parse_args().package)
    print(json.dumps({'files': len(result['files']), 'archive': result['archive']}))

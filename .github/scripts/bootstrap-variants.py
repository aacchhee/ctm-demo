#!/usr/bin/env python3
"""Materialize only the default checkout's hash-bound native review package."""
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import tarfile

ROOT = Path(__file__).resolve().parents[2]
COMPONENTS = {'ctm-assessment', 'ctm-checkers', 'ctm-libs', 'math-exercise'}


def materialize(root=ROOT):
    bundle = root / '.github/variants-tooling'
    manifest = json.loads((bundle / 'package.json').read_text())
    refs = json.loads((root / '.github/merged-package-refs.json').read_text())
    if manifest['version'] != 1 or manifest['sources'] != refs:
        raise ValueError('Review tooling must match the frozen course tuple')
    archive = bundle / 'package.tar.gz'
    if archive.is_symlink() or archive.stat().st_size > 32 * 1024 * 1024:
        raise ValueError('Invalid tooling archive')
    data = archive.read_bytes()
    if manifest['archive'] != {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}:
        raise ValueError('Tooling archive digest mismatch')
    files = manifest['files']
    if not 1 <= len(files) <= 4096:
        raise ValueError('Invalid tooling inventory')
    verified = {}
    total = 0
    with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as source:
        for member in source:
            name = member.name
            parts = PurePosixPath(name).parts
            if (not member.isfile() or name in verified or name not in files
                    or '..' in parts or PurePosixPath(name).is_absolute()
                    or name != '/'.join(parts)
                    or (name != 'LICENSE' and (len(parts) < 3 or parts[0] != '_extensions'
                                               or parts[1] not in COMPONENTS))):
                raise ValueError('Unexpected tooling member: ' + name)
            total += member.size
            if member.size > 16 * 1024 * 1024 or total > 128 * 1024 * 1024:
                raise ValueError('Tooling archive exceeds its budget')
            value = source.extractfile(member).read(16 * 1024 * 1024 + 1)
            if files[name] != {'bytes': len(value), 'sha256': hashlib.sha256(value).hexdigest()}:
                raise ValueError('Tooling file digest mismatch: ' + name)
            verified[name] = value
    if set(verified) != set(files):
        raise ValueError('Tooling inventory is incomplete')
    # Validate the complete archive and all destinations before writing anything.
    for name in verified:
        if name == 'LICENSE':
            continue
        path = root / name
        if any(p.is_symlink() for p in (path, *path.parents)):
            raise ValueError('Tooling destination contains a symlink')
        if path.exists() and (not path.is_file() or path.read_bytes() != verified[name]):
            raise ValueError('Tooling destination already contains different bytes: ' + name)
    for name, value in verified.items():
        if name == 'LICENSE':
            continue  # The archive retains its licence without replacing the course licence.
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(value)
    return manifest


if __name__ == '__main__':
    result = materialize()
    print('Verified frozen review tooling:', len(result['files']), 'files')

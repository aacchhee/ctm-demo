#!/usr/bin/env python3
"""Materialize only the default checkout's hash-bound native review package."""
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import tarfile

ROOT = Path(__file__).resolve().parents[2]
COMPONENTS = {'ctm-assessment', 'ctm-checkers', 'ctm-libs', 'math-exercise'}
REVIEW_TARGET = '_extensions/math-exercise/variants-review.py'
REVIEW_REPOSITORY = 'Erasmus-CTM/math-exercise'


def validate_review_override(manifest, verified, refs):
    """A v2 archive is the complete canonical base plus one native review file."""
    if set(manifest) != {'version', 'sources', 'archive', 'files', 'nativeReviewOverrides'}:
        raise ValueError('Unexpected native review manifest schema')
    names = {'ctm-assessment', 'ctm-checkers', 'ctm-libs', 'math-exercise',
             'py-exercise', 'pyodide-interaktiv', 'jsxgraph'}
    if (set(refs) != names or not all(isinstance(value, str) and re.fullmatch('[a-f0-9]{40}', value)
                                     for value in refs.values())):
        raise ValueError('Native review requires the seven immutable base sources')
    overrides = manifest['nativeReviewOverrides']
    fields = {'target', 'repository', 'commit', 'sourcePath', 'gitBlob',
              'baseCommit', 'baseSha256', 'replacementSha256'}
    if not isinstance(overrides, list) or len(overrides) != 1 or not isinstance(overrides[0], dict) or set(overrides[0]) != fields:
        raise ValueError('Exactly one explicit native review override is required')
    override = overrides[0]
    if (override['target'] != REVIEW_TARGET or override['sourcePath'] != REVIEW_TARGET
            or override['repository'] != REVIEW_REPOSITORY
            or override['baseCommit'] != refs.get('math-exercise')
            or not all(isinstance(override[key], str) and re.fullmatch('[a-f0-9]{40}', override[key])
                       for key in ('commit', 'gitBlob', 'baseCommit'))
            or override['commit'] == override['baseCommit']
            or not all(isinstance(override[key], str) and re.fullmatch('[a-f0-9]{64}', override[key])
                       for key in ('baseSha256', 'replacementSha256'))):
        raise ValueError('Invalid immutable native review source provenance')
    receipt_name = '_extensions/ctm-assessment/resolved-repos.json'
    try:
        record = json.loads(verified[receipt_name])
        for name, sha in refs.items():
            actual = record['repositories'][name]
            if actual['commit'] != sha or actual['dirty_files'] or actual['ref_override']:
                raise ValueError('Native review base tuple mismatch: ' + name)
        expected = {receipt_name, 'LICENSE'}
        for component in COMPONENTS:
            for name, digest in record['extension_sha256'][component].items():
                target = '_extensions/' + component + '/' + name
                expected.add(target)
                if target == REVIEW_TARGET:
                    if digest != override['baseSha256']:
                        raise ValueError('Native review base digest mismatch')
                elif hashlib.sha256(verified[target]).hexdigest() != digest:
                    raise ValueError('Canonical native review base changed: ' + target)
        if expected != set(verified) or REVIEW_TARGET not in verified:
            raise ValueError('Native review base inventory mismatch')
    except (KeyError, TypeError, json.JSONDecodeError) as error:
        raise ValueError('Invalid canonical native review base receipt') from error
    replacement = verified[REVIEW_TARGET]
    blob = hashlib.sha1(b'blob ' + str(len(replacement)).encode() + b'\0' + replacement).hexdigest()
    if (hashlib.sha256(replacement).hexdigest() != override['replacementSha256']
            or blob != override['gitBlob'] or override['baseSha256'] == override['replacementSha256']):
        raise ValueError('Native review replacement source digest mismatch')


def materialize(root=ROOT):
    bundle = root / '.github/variants-tooling'
    manifest = json.loads((bundle / 'package.json').read_text())
    refs = json.loads((root / '.github/merged-package-refs.json').read_text())
    if manifest['version'] not in (1, 2) or manifest['sources'] != refs:
        raise ValueError('Review tooling must match the frozen course tuple')
    if manifest['version'] == 1 and 'nativeReviewOverrides' in manifest:
        raise ValueError('Native review overrides require manifest version 2')
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
    if manifest['version'] == 2:
        validate_review_override(manifest, verified, refs)
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

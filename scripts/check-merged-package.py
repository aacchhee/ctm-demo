"""Check the immutable ordinary package; this never selects component overrides."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re

import yaml

ROOT = Path(__file__).resolve().parents[1]
NAMES = {'ctm-assessment', 'ctm-libs', 'ctm-checkers', 'math-exercise', 'py-exercise', 'pyodide-interaktiv', 'jsxgraph'}


def check(record_path: Path | None = None) -> dict[str, str]:
    refs = json.loads((ROOT / '.github/merged-package-refs.json').read_text())
    assert set(refs) == NAMES and all(re.fullmatch('[0-9a-f]{40}', ref) for ref in refs.values()), 'Freeze exactly seven full immutable refs'
    plugins = yaml.safe_load((ROOT / 'quarto-extensions.yml').read_text())['plugins']
    assert plugins == [{'name': 'ctm-assessment', 'repo': 'https://github.com/Erasmus-CTM/ctm-assessment.git',
                        'ref': refs['ctm-assessment'], 'path': '_extensions/ctm-assessment'}], 'Install only the exact ordinary umbrella package'
    if record_path:
        record = json.loads(record_path.read_text())
        assert record['refresh'] is False and record['follow_branches'] is False
        assert set(record['repositories']) == NAMES
        for name, source in record['repositories'].items():
            assert source['commit'] == refs[name], (name, source['commit'], refs[name])
            assert source['ref_override'] is False and source['dirty_files'] == [], name
            assert source['local_override'] is (name == 'ctm-assessment'), name
            assert source['pinned'] is (name != 'ctm-assessment'), name
        files = record['extension_sha256']
        assert set(files) == NAMES, 'Every canonical extension must have a complete byte manifest'
        actual_files = set()
        for extension, hashes in files.items():
            for relative, expected in hashes.items():
                file = ROOT / '_extensions' / extension / relative
                assert file.is_file(), file
                assert hashlib.sha256(file.read_bytes()).hexdigest() == expected, file
                actual_files.add(file.relative_to(ROOT / '_extensions').as_posix())
        installed = {p.relative_to(ROOT / '_extensions').as_posix() for p in (ROOT / '_extensions').rglob('*') if p.is_file()}
        assert installed - actual_files == {'ctm-assessment/resolved-repos.json'}, installed - actual_files
        assert not actual_files - installed
        print(json.dumps({'refs': refs, 'verifiedExtensionLeaves': len(actual_files)}, sort_keys=True))
    return refs


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--record', type=Path)
    check(parser.parse_args().record)

"""Fail-closed controls for the ordinary package provenance and byte witness."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('merged_package', Path(__file__).with_name('check-merged-package.py'))
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class PackageProof(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / '.github').mkdir()
        self.refs = {name: str(index) * 40 for index, name in enumerate(sorted(MODULE.NAMES), 1)}
        (self.root / '.github/merged-package-refs.json').write_text(json.dumps(self.refs))
        (self.root / 'quarto-extensions.yml').write_text('plugins:\n- name: ctm-assessment\n  repo: https://github.com/Erasmus-CTM/ctm-assessment.git\n  ref: ' + json.dumps(self.refs['ctm-assessment']) + '\n  path: _extensions/ctm-assessment\n')
        self.record = {'refresh': False, 'follow_branches': False, 'repositories': {}, 'extension_sha256': {}}
        for name in sorted(MODULE.NAMES):
            folder = self.root / '_extensions' / name
            folder.mkdir(parents=True)
            (folder / 'source.txt').write_text(name)
            self.record['extension_sha256'][name] = {'source.txt': hashlib.sha256(name.encode()).hexdigest()}
            self.record['repositories'][name] = {'commit': self.refs[name], 'ref_override': False,
                'local_override': name == 'ctm-assessment', 'pinned': name != 'ctm-assessment', 'dirty_files': []}
        (self.root / '_extensions/ctm-assessment/resolved-repos.json').write_text('{}')

    def check(self, record=None):
        path = self.root / 'record.json'
        path.write_text(json.dumps(self.record if record is None else record))
        with patch.object(MODULE, 'ROOT', self.root):
            return MODULE.check(path)

    def test_exact_ordinary_package_and_complete_bytes_are_accepted(self):
        self.assertEqual(self.check(), self.refs)

    def test_stale_override_dirty_and_unpinned_sources_are_rejected(self):
        for field, value in [('commit', 'f' * 40), ('ref_override', True), ('local_override', True),
                             ('pinned', False), ('dirty_files', ['source.txt'])]:
            with self.subTest(field=field):
                record = copy.deepcopy(self.record)
                record['repositories']['ctm-libs'][field] = value
                with self.assertRaises(AssertionError):
                    self.check(record)

    def test_changed_bytes_and_unmanifested_files_are_rejected(self):
        file = self.root / '_extensions/ctm-libs/source.txt'
        file.write_text('changed')
        with self.assertRaises(AssertionError):
            self.check()
        file.write_text('ctm-libs')
        (file.parent / 'unexpected.js').write_text('unexpected')
        with self.assertRaises(AssertionError):
            self.check()

    def test_missing_extension_witness_and_branch_refresh_are_rejected(self):
        for mutation in ('missing', 'refresh', 'follow_branches'):
            with self.subTest(mutation=mutation):
                record = copy.deepcopy(self.record)
                if mutation == 'missing':
                    del record['extension_sha256']['ctm-libs']
                else:
                    record[mutation] = True
                with self.assertRaises(AssertionError):
                    self.check(record)


if __name__ == '__main__':
    unittest.main()

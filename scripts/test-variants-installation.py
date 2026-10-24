#!/usr/bin/env python3
"""Verify the course's archive trust boundary and complete executable inventory."""
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('bootstrap', ROOT / '.github/scripts/bootstrap-variants.py')
bootstrap = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bootstrap)


class Installation(unittest.TestCase):
    def fixture(self, root):
        destination = root / '.github/variants-tooling'
        destination.mkdir(parents=True)
        (root / '.github/merged-package-refs.json').write_text('{"component":"' + 'a' * 40 + '"}')
        data = b'original reviewed bytes\n'
        name = '_extensions/math-exercise/question-variants.py'
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode='w:gz') as source:
            item = tarfile.TarInfo(name)
            item.size = len(data)
            source.addfile(item, io.BytesIO(data))
        archive = stream.getvalue()
        manifest = {'version': 1, 'sources': {'component': 'a' * 40},
                    'archive': {'bytes': len(archive), 'sha256': hashlib.sha256(archive).hexdigest()},
                    'files': {name: {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}}}
        (destination / 'package.tar.gz').write_bytes(archive)
        (destination / 'package.json').write_text(json.dumps(manifest))
        return destination, manifest, root / name

    def test_digest_inventory_and_destination_fail_before_any_write(self):
        for fault in ('archive', 'member', 'missing', 'tuple', 'symlink', 'existing'):
            with self.subTest(fault=fault), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                bundle, manifest, target = self.fixture(root)
                if fault == 'archive':
                    with (bundle / 'package.tar.gz').open('ab') as stream:
                        stream.write(b'changed')
                elif fault == 'member':
                    manifest['files'][target.relative_to(root).as_posix()]['sha256'] = '0' * 64
                elif fault == 'missing':
                    manifest['files']['_extensions/math-exercise/absent.py'] = {'bytes': 1, 'sha256': '0' * 64}
                elif fault == 'tuple':
                    manifest['sources']['component'] = 'b' * 40
                elif fault == 'symlink':
                    (root / 'outside').mkdir()
                    (root / '_extensions').symlink_to(root / 'outside', target_is_directory=True)
                else:
                    target.parent.mkdir(parents=True)
                    target.write_bytes(b'unrelated bytes must survive')
                (bundle / 'package.json').write_text(json.dumps(manifest))
                with self.assertRaises(ValueError):
                    bootstrap.materialize(root)
                if fault == 'existing':
                    self.assertEqual(target.read_bytes(), b'unrelated bytes must survive')
                else:
                    self.assertFalse(target.exists())

    def test_real_package_roundtrip_and_complete_producer_closure(self):
        inventory = json.loads((ROOT / '.github/ctm-variants-producer.json').read_text())
        self.assertEqual(len(inventory), len(set(inventory)))
        required = {p.relative_to(ROOT).as_posix() for p in (ROOT / '.github/scripts').glob('*.py')}
        required |= {'.github/workflows/' + name for name in
                     ('variants.yml', 'variants-preview.yml', 'variants-decide.yml')}
        required |= {'.github/' + name for name in
                     ('ctm-variants.json', 'ctm-variants-producer.json', 'ctm-variants-requirements.txt',
                      'merged-package-refs.json', 'variants-tooling/package.json', 'variants-tooling/package.tar.gz')}
        self.assertEqual(set(inventory), required)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            shutil.copytree(ROOT / '.github/variants-tooling', root / '.github/variants-tooling')
            shutil.copy2(ROOT / '.github/merged-package-refs.json', root / '.github/merged-package-refs.json')
            manifest = bootstrap.materialize(root)
            for name, expected in manifest['files'].items():
                if name == 'LICENSE':
                    continue
                data = (root / name).read_bytes()
                self.assertEqual(expected, {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
            self.assertEqual(bootstrap.materialize(root), manifest, 'identical installation is repeatable')


if __name__ == '__main__':
    unittest.main()

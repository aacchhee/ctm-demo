#!/usr/bin/env python3
"""Verify the course's archive trust boundary and complete executable inventory."""
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('bootstrap', ROOT / '.github/scripts/bootstrap-variants.py')
bootstrap = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bootstrap)
spec = importlib.util.spec_from_file_location('tooling_builder', ROOT / '.github/scripts/build-variants-tooling.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


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
            # Exercise the real component entrypoint's nested source verification,
            # rather than accepting only the outer archive inventory.
            adapter_spec = importlib.util.spec_from_file_location(
                'installed_question_variants', root / '_extensions/math-exercise/question-variants.py')
            adapter = importlib.util.module_from_spec(adapter_spec)
            adapter_spec.loader.exec_module(adapter)
            native = root / '_extensions/ctm-checkers/native-authoring'
            self.assertEqual(adapter._verify_native(native), native.resolve())
            bot = native / 'ctm_variants/github_bot.py'
            bot.write_bytes(bot.read_bytes() + b'\n# unrecorded change\n')
            with self.assertRaisesRegex(ValueError, 'source differs from its manifest'):
                adapter._verify_native(native)


class NativeReviewOverride(unittest.TestCase):
    def fixture(self, root):
        source, package, course = root / 'source', root / 'package', root / 'course'
        source.mkdir()
        def git(*args):
            return subprocess.check_output(['git', '-C', str(source), *args], stderr=subprocess.DEVNULL).decode().strip()
        git('init', '-q')
        git('config', 'user.name', 'Fixture')
        git('config', 'user.email', 'fixture@example.invalid')
        git('remote', 'add', 'origin', 'https://github.com/Erasmus-CTM/math-exercise.git')
        target = source / builder.REVIEW_TARGET
        target.parent.mkdir(parents=True)
        base = b'# canonical native exporter\n'
        target.write_bytes(base)
        git('add', '.')
        git('commit', '-qm', 'Canonical fixture')
        base_commit = git('rev-parse', 'HEAD')
        target.write_bytes(b'# immutable fresh-source validation fix\n')
        git('commit', '-qam', 'Reviewed exporter fixture')
        commit = git('rev-parse', 'HEAD')
        refs = {name: ('a' * 40) for name in ('ctm-assessment', 'ctm-checkers', 'ctm-libs',
                'math-exercise', 'py-exercise', 'pyodide-interaktiv', 'jsxgraph')}
        refs['math-exercise'] = base_commit
        hashes = {}
        for component in builder.COMPONENTS:
            name = 'variants-review.py' if component == 'math-exercise' else 'canonical.txt'
            data = base if component == 'math-exercise' else component.encode()
            path = package / '_extensions' / component / name
            path.parent.mkdir(parents=True)
            path.write_bytes(data)
            hashes[component] = {name: hashlib.sha256(data).hexdigest()}
        record = {'repositories': {name: {'commit': sha, 'dirty_files': [], 'ref_override': False}
                                   for name, sha in refs.items()}, 'extension_sha256': hashes}
        (package / 'resolved-repos.json').write_text(json.dumps(record))
        (package / 'LICENSE').write_text('fixture license\n')
        (course / '.github').mkdir(parents=True)
        (course / '.github/merged-package-refs.json').write_text(json.dumps(refs))
        return source, package, course, commit

    def build(self, package, course, source, commit):
        return builder.build(package, course, native_review_source=source, native_review_commit=commit)

    def rewrite(self, course, manifest, transform=lambda files: None):
        bundle = course / '.github/variants-tooling'
        with tarfile.open(bundle / 'package.tar.gz', 'r:gz') as archive:
            files = {member.name: archive.extractfile(member).read() for member in archive}
        transform(files)
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode='w:gz') as archive:
            for name, data in sorted(files.items()):
                entry = tarfile.TarInfo(name)
                entry.size = len(data)
                archive.addfile(entry, io.BytesIO(data))
        data = stream.getvalue()
        (bundle / 'package.tar.gz').write_bytes(data)
        manifest['archive'] = {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
        manifest['files'] = {name: {'bytes': len(value), 'sha256': hashlib.sha256(value).hexdigest()}
                             for name, value in files.items()}
        (bundle / 'package.json').write_text(json.dumps(manifest))

    def test_exact_single_delta_deterministic_archive_and_complete_base(self):
        with tempfile.TemporaryDirectory() as temp:
            source, package, course, commit = self.fixture(Path(temp))
            baseline = builder.build(package, course)
            before = (course / '.github/variants-tooling/package.tar.gz').read_bytes()
            manifest = self.build(package, course, source, commit)
            after = (course / '.github/variants-tooling/package.tar.gz').read_bytes()
            self.assertEqual(manifest['version'], 2)
            changed = {name for name in manifest['files'] if manifest['files'][name] != baseline['files'][name]}
            self.assertEqual(changed, {builder.REVIEW_TARGET})
            self.assertNotEqual(before, after)
            self.assertEqual(self.build(package, course, source, commit), manifest)
            self.assertEqual((course / '.github/variants-tooling/package.tar.gz').read_bytes(), after)
            self.assertEqual(bootstrap.materialize(course), manifest)
            self.assertEqual(bootstrap.materialize(course), manifest)

    def test_schema_source_and_digest_tampering_rejected_before_writes(self):
        faults = ('target', 'sourcePath', 'repository', 'commit', 'gitBlob', 'baseCommit',
                  'baseSha256', 'replacementSha256', 'extra', 'missing', 'duplicate',
                  'canonical_payload', 'missing_payload', 'extra_payload')
        for fault in faults:
            with self.subTest(fault=fault), tempfile.TemporaryDirectory() as temp:
                source, package, course, commit = self.fixture(Path(temp))
                manifest = self.build(package, course, source, commit)
                override = manifest['nativeReviewOverrides'][0]
                if fault in override:
                    override[fault] = '0' * (64 if fault in ('baseSha256', 'replacementSha256') else 40) if fault in ('gitBlob', 'baseSha256', 'replacementSha256') else 'invalid'
                elif fault == 'extra':
                    override['untrustedPatch'] = True
                elif fault == 'missing':
                    del override['gitBlob']
                elif fault == 'duplicate':
                    manifest['nativeReviewOverrides'].append(dict(override))
                def transform(files):
                    if fault == 'canonical_payload':
                        files['_extensions/ctm-libs/canonical.txt'] = b'changed canonical runtime'
                    elif fault == 'missing_payload':
                        del files[builder.REVIEW_TARGET]
                    elif fault == 'extra_payload':
                        files['_extensions/math-exercise/unreviewed.py'] = b'pass\n'
                self.rewrite(course, manifest, transform)
                with self.assertRaises(ValueError):
                    bootstrap.materialize(course)
                self.assertFalse((course / '_extensions').exists())

    def test_v2_top_level_schema_and_tar_links_are_rejected(self):
        for fault in ('schema', 'version', 'downgrade', 'tar_link'):
            with self.subTest(fault=fault), tempfile.TemporaryDirectory() as temp:
                source, package, course, commit = self.fixture(Path(temp))
                manifest = self.build(package, course, source, commit)
                bundle = course / '.github/variants-tooling'
                if fault == 'schema':
                    manifest['patchFromPullRequest'] = True
                elif fault == 'version':
                    manifest['version'] = 3
                elif fault == 'downgrade':
                    manifest['version'] = 1
                else:
                    stream = io.BytesIO()
                    with tarfile.open(fileobj=stream, mode='w:gz') as archive:
                        entry = tarfile.TarInfo(builder.REVIEW_TARGET)
                        entry.type, entry.linkname = tarfile.SYMTYPE, '/tmp/untrusted'
                        archive.addfile(entry)
                    data = stream.getvalue()
                    (bundle / 'package.tar.gz').write_bytes(data)
                    manifest['archive'] = {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                (bundle / 'package.json').write_text(json.dumps(manifest))
                with self.assertRaises(ValueError):
                    bootstrap.materialize(course)
                self.assertFalse((course / '_extensions').exists())

    def test_builder_rejects_mutable_source_and_unverified_base(self):
        for fault in ('branch', 'wrong_origin', 'changed_base', 'extra_base', 'parent_changed', 'source_symlink'):
            with self.subTest(fault=fault), tempfile.TemporaryDirectory() as temp:
                source, package, course, commit = self.fixture(Path(temp))
                if fault == 'branch':
                    commit = 'HEAD'
                elif fault == 'wrong_origin':
                    subprocess.run(['git', '-C', str(source), 'remote', 'set-url', 'origin', 'https://example.invalid/fork'], check=True)
                elif fault == 'changed_base':
                    (package / builder.REVIEW_TARGET).write_bytes(b'bad base')
                elif fault == 'extra_base':
                    (package / '_extensions/math-exercise/untracked.py').write_bytes(b'pass')
                else:
                    if fault == 'source_symlink':
                        (source / builder.REVIEW_TARGET).unlink()
                        (source / builder.REVIEW_TARGET).symlink_to('/tmp/untrusted')
                        subprocess.run(['git', '-C', str(source), 'add', builder.REVIEW_TARGET], check=True)
                        # Amend keeps the direct canonical parent; only the mode is invalid.
                        subprocess.run(['git', '-C', str(source), 'commit', '--amend', '-qm', 'Invalid symlink source'], check=True)
                    else:
                        (source / builder.REVIEW_TARGET).write_bytes(b'a second exporter change')
                        subprocess.run(['git', '-C', str(source), 'commit', '-qam', 'Unreviewed second change'], check=True)
                    commit = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD']).decode().strip()
                with self.assertRaises(ValueError):
                    self.build(package, course, source, commit)
                self.assertFalse((course / '.github/variants-tooling').exists())


class NativeBotOverride(unittest.TestCase):
    def fixture(self, root):
        review, package, course, review_commit = NativeReviewOverride().fixture(root)
        source = root / 'bot-source'
        source.mkdir()
        def git(*args):
            return subprocess.check_output(['git', '-C', str(source), *args], stderr=subprocess.DEVNULL).decode().strip()
        git('init', '-q')
        git('config', 'user.name', 'Fixture')
        git('config', 'user.email', 'fixture@example.invalid')
        git('remote', 'add', 'origin', 'https://github.com/Erasmus-CTM/ctm-checkers.git')
        target = source / builder.BOT_SOURCE
        target.parent.mkdir(parents=True)
        base = b'# canonical GitHub bot\n'
        target.write_bytes(base)
        git('add', '.')
        git('commit', '-qm', 'Canonical bot fixture')
        base_commit = git('rev-parse', 'HEAD')
        target.write_bytes(b'# bounded post-CAS consistency correction\n')
        git('commit', '-qam', 'Reviewed bot fixture')
        commit = git('rev-parse', 'HEAD')
        refs_path = course / '.github/merged-package-refs.json'
        refs = json.loads(refs_path.read_text())
        refs['ctm-checkers'] = base_commit
        refs_path.write_text(json.dumps(refs))
        record_path = package / 'resolved-repos.json'
        record = json.loads(record_path.read_text())
        record['repositories']['ctm-checkers']['commit'] = base_commit
        relative = builder.BOT_TARGET.removeprefix('_extensions/ctm-checkers/')
        record['extension_sha256']['ctm-checkers'][relative] = hashlib.sha256(base).hexdigest()
        record_path.write_text(json.dumps(record))
        canonical = package / builder.BOT_TARGET
        canonical.parent.mkdir(parents=True)
        canonical.write_bytes(base)
        helper = b'# canonical unrelated native helper\n'
        helper_target = package / '_extensions/ctm-checkers/native-authoring/helper.py'
        helper_target.write_bytes(helper)
        record['extension_sha256']['ctm-checkers']['native-authoring/helper.py'] = hashlib.sha256(helper).hexdigest()
        native_receipt = {'version': 1, 'kind': 'native-authoring', 'files': {
            builder.BOT_MEMBER: {'bytes': len(base), 'sha256': hashlib.sha256(base).hexdigest()},
            'helper.py': {'bytes': len(helper), 'sha256': hashlib.sha256(helper).hexdigest()}}}
        data = (json.dumps(native_receipt, indent=2) + '\n').encode()
        (package / builder.NATIVE_RECEIPT).write_bytes(data)
        record['extension_sha256']['ctm-checkers']['native-authoring/native.json'] = hashlib.sha256(data).hexdigest()
        record_path.write_text(json.dumps(record))
        return package, course, dict(native_review_source=review, native_review_commit=review_commit,
                                    native_bot_source=source, native_bot_commit=commit)

    def test_v3_preserves_all_base_bytes_except_two_explicit_native_tools(self):
        with tempfile.TemporaryDirectory() as temp:
            package, course, options = self.fixture(Path(temp))
            baseline = builder.build(package, course)
            manifest = builder.build(package, course, **options)
            self.assertEqual(manifest['version'], 3)
            self.assertEqual(manifest['sources'], baseline['sources'])
            changed = {name for name in manifest['files'] if manifest['files'][name] != baseline['files'][name]}
            self.assertEqual(changed, {builder.REVIEW_TARGET, builder.BOT_TARGET, builder.NATIVE_RECEIPT})
            archive = (course / '.github/variants-tooling/package.tar.gz').read_bytes()
            self.assertEqual(builder.build(package, course, **options), manifest)
            self.assertEqual((course / '.github/variants-tooling/package.tar.gz').read_bytes(), archive)
            self.assertEqual(bootstrap.materialize(course), manifest)
            self.assertEqual(bootstrap.materialize(course), manifest)

    def test_v3_bot_provenance_and_complete_inventory_fail_closed(self):
        faults = ('target', 'sourcePath', 'repository', 'commit', 'gitBlob', 'baseCommit',
                  'baseSha256', 'replacementSha256', 'duplicate', 'missing_bot', 'missing_exporter',
                  'downgrade', 'canonical_payload', 'missing_payload', 'extra_payload', 'unlisted',
                  'baseBytes', 'base_bytes_changed', 'stale_native', 'native_extra_entry',
                  'native_wrong_entry', 'native_removed_entry', 'native_unrelated_consistent')
        for fault in faults:
            with self.subTest(fault=fault), tempfile.TemporaryDirectory() as temp:
                package, course, options = self.fixture(Path(temp))
                manifest = builder.build(package, course, **options)
                override = manifest['nativeReviewOverrides'][1]
                if fault in override:
                    override[fault] = '0' * (64 if fault in ('baseSha256', 'replacementSha256') else 40) if fault in ('gitBlob', 'baseSha256', 'replacementSha256') else 'invalid'
                elif fault == 'base_bytes_changed':
                    override['baseBytes'] += 1
                elif fault == 'duplicate':
                    manifest['nativeReviewOverrides'][0] = dict(override)
                elif fault == 'missing_bot':
                    manifest['nativeReviewOverrides'].pop()
                elif fault == 'missing_exporter':
                    manifest['nativeReviewOverrides'].pop(0)
                elif fault == 'downgrade':
                    manifest['version'] = 2
                elif fault == 'unlisted':
                    manifest['nativeReviewOverrides'].append(dict(override, target='_extensions/ctm-checkers/ctm-checkers.js'))
                def transform(files):
                    if fault == 'canonical_payload':
                        files['_extensions/ctm-checkers/canonical.txt'] = b'changed student runtime'
                    elif fault == 'missing_payload':
                        del files[builder.BOT_TARGET]
                    elif fault == 'extra_payload':
                        files['_extensions/ctm-checkers/native-authoring/unreviewed.py'] = b'pass\n'
                    elif fault.startswith('native_') or fault == 'stale_native':
                        native = json.loads(files[builder.NATIVE_RECEIPT])
                        if fault == 'stale_native':
                            native['files'][builder.BOT_MEMBER] = {
                                'bytes': override['baseBytes'], 'sha256': override['baseSha256']}
                        elif fault == 'native_extra_entry':
                            native['files']['unreviewed.py'] = {'bytes': 0, 'sha256': hashlib.sha256(b'').hexdigest()}
                        elif fault == 'native_wrong_entry':
                            native['files'][builder.BOT_MEMBER]['sha256'] = '0' * 64
                        elif fault == 'native_unrelated_consistent':
                            data = b'# self-consistent but unauthorized helper change\n'
                            files['_extensions/ctm-checkers/native-authoring/helper.py'] = data
                            native['files']['helper.py'] = {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                        else:
                            del native['files'][builder.BOT_MEMBER]
                        files[builder.NATIVE_RECEIPT] = (json.dumps(native, indent=2) + '\n').encode()
                NativeReviewOverride().rewrite(course, manifest, transform)
                with self.assertRaises(ValueError):
                    bootstrap.materialize(course)
                self.assertFalse((course / '_extensions').exists())

    def test_bot_builder_requires_immutable_canonical_source_and_exporter(self):
        for fault in ('missing_exporter', 'missing_commit', 'wrong_origin', 'branch', 'parent_changed'):
            with self.subTest(fault=fault), tempfile.TemporaryDirectory() as temp:
                package, course, options = self.fixture(Path(temp))
                source = options['native_bot_source']
                if fault == 'missing_exporter':
                    options.update(native_review_source=None, native_review_commit=None)
                elif fault == 'missing_commit':
                    options['native_bot_commit'] = None
                elif fault == 'wrong_origin':
                    subprocess.run(['git', '-C', str(source), 'remote', 'set-url', 'origin', 'https://example.invalid/fork'], check=True)
                elif fault == 'branch':
                    options['native_bot_commit'] = 'HEAD'
                else:
                    (source / builder.BOT_SOURCE).write_bytes(b'# unrelated second bot change\n')
                    subprocess.run(['git', '-C', str(source), 'commit', '-qam', 'Second bot change'], check=True)
                    options['native_bot_commit'] = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD']).decode().strip()
                with self.assertRaises(ValueError):
                    builder.build(package, course, **options)
                self.assertFalse((course / '.github/variants-tooling').exists())


if __name__ == '__main__':
    unittest.main()

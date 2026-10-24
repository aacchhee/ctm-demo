#!/usr/bin/env python3
"""Automatic native generation → bot checklist → approval → student publication.

Only a disposable synthetic question is approved. No GitHub credentials, live
comments or course manifests are used by this repeatable CI regression.
"""
import copy
import hashlib
from html.parser import HTMLParser
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
WRAPPER = ROOT / '_extensions/math-exercise/question-variants.py'
spec = importlib.util.spec_from_file_location('trusted_component', WRAPPER)
component = importlib.util.module_from_spec(spec)
spec.loader.exec_module(component)
component.install_imports()
from ctm_variants import bot, checklist, history, producer
from ctm_variants.model import VariantError
from ctm_variants.review import card_id


class VariantMarkup(HTMLParser):
    def __init__(self):
        super().__init__()
        self.payloads = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs).get('data-variants')
        if data:
            self.payloads.append(json.loads(data))


class Pipeline(unittest.TestCase):
    def test_variant_free_course_never_requires_approval(self):
        with tempfile.TemporaryDirectory(prefix='ctm-no-variants-') as temporary:
            project = Path(temporary)
            (project / 'ordinary.qmd').write_text(
                '```{math-exercise}\n#| label: ordinary\nCompute 1+1.\n_[2]\n```\n'
                '\n```{py-exercise}\n#| label: code\nprint("ordinary Python")\n```\n')
            definitions = producer.discover(project, ['**/*.qmd'], component.parse_source)
            self.assertEqual(definitions, [])
            context = dict(headSha='a' * 40, producerSha='b' * 40, event='pull_request',
                           expectedHead='a' * 40, runId=1, repositoryId=1, pullRequest=1)
            def unexpected_resolution(payload):
                self.fail('A variant-free project must not invoke native variant generation or approvals')
            envelope, pages = producer.produce(project, context,
                {'previewBase': 'https://example.invalid/previews/variants-{pullRequest}/review'},
                definitions=definitions, resolve=unexpected_resolution)
            self.assertEqual(envelope['questions'], [])
            self.assertEqual(pages, {})
            self.assertEqual(producer.check(envelope), [])
            self.assertFalse((project / '_variants').exists())
            print('Variant-free course: approval gate passes with no generator, manifests or decisions.', flush=True)

    def test_real_25_candidate_pipeline_and_approval_guards(self):
        with tempfile.TemporaryDirectory(prefix='ctm-variants-pipeline-') as temporary:
            project = Path(temporary)
            label = 'pipeline-fixture'
            manifest = project / '_variants' / (label + '.yml')
            metadata = {'format': {'html': {'theme': 'none'}}, 'filters': ['math-exercise'],
                        'ai-feedback': {'enabled': False}, 'math-exercise': {'feedback': False}}
            source = ('---\n' + json.dumps(metadata) + '\n---\n\n```{math-exercise}\n'
                      '#| label: ' + label + '\n#| field-labels: Answer\n#| variables: |\n'
                      '#|   x = pick(' + json.dumps(list(range(1, 81))) + ')\n'
                      '#| note: x={@x@}\n\nCompute $x+1$ for $x={@x@}$.\n'
                      '_[{@x@}+1]\n\n#| solution\nThe answer is ${@x+1@}$.\n```\n')
            (project / 'question.qmd').write_text(source)
            # Copy the same canonical package that production and review use.
            shutil.copytree(ROOT / '_extensions', project / '_extensions',
                            ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
            command = [sys.executable, '-I', str(WRAPPER), '--project', str(project),
                       '--file', 'question.qmd', '--label', label]

            def request(*arguments, success=True):
                print('Native pipeline step:', arguments[0], flush=True)
                result = subprocess.run(command + list(arguments), capture_output=True, text=True, timeout=330)
                if success:
                    self.assertEqual(result.returncode, 0, result.stderr)
                    return json.loads(result.stdout)
                self.assertNotEqual(result.returncode, 0, 'invalid request unexpectedly succeeded')
                return result

            generated = request('generate25more')
            self.assertEqual(len(generated['records']), 25)
            self.assertEqual(len(generated['manifest']['proposals']), 25)
            self.assertEqual(generated['manifest']['decisions'], [])
            self.assertEqual(len({r['id'] for r in generated['records']}), 25)
            self.assertTrue(all(r['tests']['passed'] is True for r in generated['records']))
            before = manifest.read_bytes()
            review_path = project / 'review.html'
            review = request('review', '--html', str(review_path))
            self.assertEqual(manifest.read_bytes(), before, 'review must be read-only')
            self.assertIn('Approve', review_path.read_text())

            neutral_keys = ('id', 'hash', 'note', 'snapshot', 'data', 'tests')
            records = [{k: r[k] for k in neutral_keys} for r in review['records']]
            envelope = {'questions': [{'label': label, 'manifest': review['manifest'], 'records': records}]}
            with self.assertRaisesRegex(VariantError, 'approved'):
                producer.check(envelope)
            quarto = os.environ.get('CTM_VARIANTS_QUARTO') or shutil.which('quarto')
            self.assertIsNotNone(quarto)
            blocked = subprocess.run([quarto, 'render', 'question.qmd'], cwd=project,
                                     capture_output=True, text=True, timeout=330)
            self.assertNotEqual(blocked.returncode, 0, 'zero approvals must block student rendering')
            self.assertIn('approved', blocked.stdout + blocked.stderr)

            cards = {r['id']: 'https://example.invalid/review/q.html#' + card_id(r['id']) for r in records}
            comment = checklist.render(label=label, records=records, decisions=[], cards=cards)['body']
            checked = comment.replace('- [ ] Approve all passing', '- [x] Approve all passing', 1)
            auth = dict(label=label, records=records, decisions=[], sender='automated-fixture',
                        permission='write', comment_author='github-actions[bot]',
                        bot_login='github-actions[bot]', head_repository_id=1, base_repository_id=1)
            planned = bot.plan(checked, **auth)
            self.assertEqual(len(planned['decisions']), 25)
            self.assertEqual(planned['notPassing'], [])
            # Bulk approval must exclude a failing verdict, and unauthenticated
            # actors or fork identities must not produce an approval batch.
            bad = copy.deepcopy(records)
            bad[0]['tests']['passed'] = False
            filtered = bot.plan(checked, **dict(auth, records=bad))
            self.assertEqual(len(filtered['decisions']), 24)
            self.assertEqual(len(filtered['notPassing']), 1)
            for fault in [dict(permission='read'), dict(comment_author='someone-else'),
                          dict(head_repository_id=2)]:
                with self.assertRaises(VariantError):
                    bot.plan(checked, **dict(auth, **fault))

            decision_file = project / 'decisions.json'
            decision_file.write_text(json.dumps({'version': 1, 'label': label, 'action': 'decide-many',
                'manifest': '_variants/' + label + '.yml', 'baseHash': review['baseHash'],
                'decisions': planned['decisions']}))
            approved = request('apply', str(decision_file))
            self.assertEqual(len(approved['manifest']['decisions']), 25)
            self.assertEqual([r['n'] for r in approved['manifest']['decisions']], list(range(1, 26)))
            self.assertTrue(all(r['status'] == 'approved' for r in approved['manifest']['decisions']))
            self.assertEqual(len(approved['deployableIds']), 25)
            envelope['questions'][0]['manifest'] = approved['manifest']
            self.assertEqual(producer.check(envelope), [])
            persisted = manifest.read_bytes()
            stale = request('apply', str(decision_file), success=False)
            self.assertRegex(stale.stderr.lower(), r'manifest.*changed|stale|reload')
            self.assertEqual(manifest.read_bytes(), persisted, 'a stale lease must not rewrite approvals')
            native = {r['id']: r['n'] for r in approved['manifest']['decisions']}
            rerender = subprocess.run([quarto, 'render', 'question.qmd'], cwd=project,
                                     capture_output=True, text=True, timeout=330)
            self.assertEqual(rerender.returncode, 0, rerender.stdout + rerender.stderr)
            markup = VariantMarkup()
            markup.feed((project / 'question.html').read_text())
            self.assertEqual(len(markup.payloads), 1)
            published = markup.payloads[0]['variants']
            self.assertEqual(len(published), 25)
            self.assertEqual({r['id']: r['n'] for r in published}, native)
            self.assertEqual(manifest.read_bytes(), persisted, 'publication must not record decisions')
            more = request('generate25more')
            self.assertEqual(len(more['manifest']['proposals']), 50)
            self.assertEqual(more['manifest']['decisions'], approved['manifest']['decisions'])
            self.assertEqual(more['manifest']['proposals'][:25], approved['manifest']['proposals'])
            selected = history.publication(more['manifest']['decisions'], more['records'],
                                           approval='required', render_mode='publish', target=25)
            self.assertEqual(len(selected['ids']), 25, 'new proposals must not inherit approval')
            print(json.dumps({'passed': True, 'generated': 25, 'approved': 25, 'published': 25,
                              'additionalUnapproved': 25, 'manualActions': 0,
                              'githubTransport': 'covered separately by the live exact-head gate',
                              'manifestSha256': hashlib.sha256(persisted).hexdigest()}))


if __name__ == '__main__':
    unittest.main()

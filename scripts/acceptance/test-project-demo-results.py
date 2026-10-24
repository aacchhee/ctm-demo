"""Focused publication-boundary controls; no browser campaign."""
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('projector', Path(__file__).with_name('project-demo-results.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PublicationBoundary(unittest.TestCase):
    def test_result_projection_keeps_failures_but_never_copies_traces(self):
        secret = 'RAW_TRACE_MUST_STAY_ON_RUNNER'
        report = {'passed': False, 'engine': 'webkit', 'error': secret,
                  'consoleErrors': [secret], 'responses': [secret],
                  'packets': [secret], 'events': [secret], 'pages': [{'trace': secret}],
                  'cases': [{'width': 390, 'passed': False, 'navigation': [secret],
                             'languages': [secret], 'issues': [secret],
                             'raw': {'pageErrors': [secret], 'events': [secret]}}]}
        result = module.project(report, 'navigation')
        self.assertNotIn(secret, json.dumps(result))
        self.assertFalse(result['passed'])
        self.assertTrue(result['failurePresent'])
        self.assertEqual(result['failureCounts']['consoleErrors'], 1)
        self.assertEqual(result['cases'][0]['failureCounts']['pageErrors'], 1)
        self.assertEqual(result['cases'][0]['issues'], 1)

    def test_workflow_is_manual_frozen_normal_install_and_uploads_no_raw_directories(self):
        source = (ROOT / '.github/workflows/combined-demo-acceptance.yml').read_text()
        self.assertNotIn('  push:', source)
        self.assertNotIn('  pull_request:', source)
        self.assertIn('test "$EVENT" = workflow_dispatch', source)
        self.assertIn("test \"$REF\" = 'refs/heads/consolidation/2026-10-merged-package-demo'", source)
        self.assertIn("test \"$CONFIRMATION\" = 'broad testing campaign'", source)
        self.assertIn('503c8688eaf556ff23af0fc629ca60f71833ea73', source)
        self.assertLess(source.index('pip install -r requirements.txt'), source.index('python scripts/check-merged-package.py'))
        self.assertLess(source.index('python scripts/check-merged-package.py'), source.index('python scripts/setup.py'))
        self.assertNotIn('--review-refs', source)
        self.assertIn('check-merged-package.py --record .private-extensions/resolved-repos.json', source)
        self.assertIn('            acceptance-build/source.json\n', source)
        self.assertNotIn('            acceptance-build\n', source)
        self.assertNotIn('          path: acceptance\n', source)
        self.assertIn('            acceptance-summary/*.json\n', source)
        self.assertNotIn('contents: write', source)
        self.assertNotIn('pages: write', source)


if __name__ == '__main__':
    unittest.main()

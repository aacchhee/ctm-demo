"""Focused evidence boundary checks; the real browser harness stays unchanged."""
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('projector', Path(__file__).with_name('project-first-visit-results.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PublicationBoundary(unittest.TestCase):
    def test_projection_retains_results_counts_hashes_and_omits_all_diagnostic_streams(self):
        secret = 'RAW_TRACE_MUST_NOT_BE_UPLOADED'
        report = {'passed': False, 'functionalPassed': True, 'rawPassed': False,
                  'engine': 'firefox', 'browser': '150.0', 'intentionalFault': 'none',
                  'error': secret, 'consoleErrors': [secret], 'requestEvents': [secret],
                  'documentEvents': [secret], 'responses': [secret], 'resultEvents': [secret],
                  'failureState': {'body': secret}, 'harnessSha256': 'a' * 64,
                  'pendingBeforeTeardown': {'active': [secret], 'retired': [secret]},
                  'rawCountsByPhase': {'teardown': {'consoleErrors': 1, 'extra': secret},
                                       'ordinary-checks-after-fault': {'failedRequests': 2}},
                  'rawServed': [{'path': 'file.js', 'sha256': 'b' * 64, 'bytes': 5,
                                 'url': secret, 'headers': secret, 'phase': secret}]}
        result = module.project(report)
        self.assertNotIn(secret, json.dumps(result))
        self.assertFalse(result['passed'])
        self.assertTrue(result['functionalPassed'])
        self.assertFalse(result['rawPassed'])
        self.assertEqual(result['pendingCounts'], {'active': 1, 'retired': 1})
        self.assertEqual(result['rawCountsByPhase']['teardown'], {'consoleErrors': 1})
        self.assertEqual(result['rawCountsByPhase']['ordinary-checks-after-fault'], {'failedRequests': 2})
        self.assertEqual(result['servedFiles'], [{'path': 'file.js', 'sha256': 'b' * 64, 'bytes': 5}])

    def test_focused_workflow_never_uploads_raw_report_directory(self):
        workflow = (ROOT / '.github/workflows/saving-quiz-candidate.yml').read_text()
        self.assertNotIn('          path: merged-package-browser\n', workflow)
        self.assertIn('            merged-package-summary/*.json\n', workflow)
        self.assertIn('            merged-package-browser/*-failure.png\n', workflow)
        self.assertIn('project-first-visit-results.py --input merged-package-browser', workflow)


if __name__ == '__main__':
    unittest.main()

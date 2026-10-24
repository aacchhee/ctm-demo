"""Publish result counts and provenance; keep browser diagnostics runner-local."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

REPORTS = ('grading-1280', 'grading-390', 'store', 'navigation')
FAILURES = ('pageErrors', 'windowErrors', 'unhandledRejections', 'observerErrors',
            'consoleErrors', 'failedRequests', 'badResponses')


def count(value):
    return len(value) if isinstance(value, (list, dict)) else 0


def project(report, name):
    # Explicit fields, never a recursive copy/redaction of diagnostic objects.
    result = {'version': 1, 'case': name, 'passed': report.get('passed') is True,
              'failurePresent': bool(report.get('error')),
              'failureCounts': {key: count(report.get(key)) for key in FAILURES},
              'pendingAtTeardown': count(report.get('pendingBeforeTeardown'))}
    for key in ('engine', 'browser', 'browserVersion', 'width', 'sourceSha256',
                'pageSha256', 'authoredLinksSha256'):
        value = report.get(key)
        if isinstance(value, (str, int)) and not isinstance(value, bool):
            result[key] = value
    result['completedCounts'] = {key: count(report.get(key)) for key in
                                ('results', 'restores', 'steps', 'checkpoints', 'pages')}
    if name == 'navigation':
        result['cases'] = [{'width': case.get('width') if isinstance(case.get('width'), int) else None,
                            'passed': case.get('passed') is True,
                            'links': count(case.get('navigation')),
                            'languages': count(case.get('languages')),
                            'issues': count(case.get('issues')),
                            'failureCounts': {key: count(case.get('raw', {}).get(key))
                                              for key in FAILURES}}
                           for case in report.get('cases', [])]
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for name in REPORTS:
        path = args.input / (name + '.json')
        if path.is_file():
            data = path.read_bytes()
            result = project(json.loads(data), name)
            result['runnerLocalReportSha256'] = hashlib.sha256(data).hexdigest()
            result['reportPresent'] = True
        else:
            result = {'version': 1, 'case': name, 'passed': False, 'reportPresent': False}
        (args.output / (name + '.json')).write_text(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()

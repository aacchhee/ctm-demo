"""Upload first-visit outcomes and byte provenance, never diagnostic streams."""
import argparse
import hashlib
import json
from pathlib import Path
import re

CASES = ('baseline', 'missing-jsxgraph', 'missing-speech')
FLAGS = ('passed', 'functionalBaselinePassed', 'functionalPassed', 'rawPassed',
         'strictAllRequestLifecyclesObserved', 'allRequestsFinished',
         'faultIsolationPassed', 'activeRequestsSettled')
RAW = ('pageErrors', 'webErrors', 'windowErrors', 'unhandledRejections',
       'consoleErrors', 'failedRequests', 'badResponses')


def project(report):
    result = {'version': 1, **{key: report.get(key) is True for key in FLAGS},
              'failurePresent': any(bool(report.get(key)) for key in
                                    ('error', 'teardownError', 'setupTeardownError'))}
    if report.get('engine') in ('chromium', 'firefox', 'webkit'):
        result['engine'] = report['engine']
    if isinstance(report.get('browser'), str) and re.fullmatch(r'[\d.]+', report['browser']):
        result['browser'] = report['browser']
    if isinstance(report.get('width'), int):
        result['width'] = report['width']
    if report.get('intentionalFault') in ('none', 'jsxgraph', 'speech'):
        result['intentionalFault'] = report['intentionalFault']
    for key in ('harnessSha256', 'pageSha256', 'serviceWorkerSha256'):
        if re.fullmatch('[0-9a-f]{64}', str(report.get(key, ''))):
            result[key] = report[key]
    pending = report.get('pendingBeforeTeardown', {})
    result['pendingCounts'] = {key: len(pending.get(key, [])) for key in ('active', 'retired')}
    result['rawCountsByPhase'] = {phase: {key: counts[key] for key in RAW
                                        if type(counts.get(key)) is int and counts[key] >= 0}
                                  for phase, counts in report.get('rawCountsByPhase', {}).items()
                                  if phase in ('setup', 'initial-document', 'service-worker-reload', 'setup-before-run',
                                               'ide-run', 'opaque-board', 'ordinary-checks-after-fault',
                                               'setup-after-run', 'setup-before-teardown',
                                               'final-settle', 'teardown', 'unknown')}
    # Deduplicate source identity; omit request URLs, headers, phases and times.
    files = {(row['path'], row['sha256'], row['bytes']) for row in report.get('rawServed', [])
             if isinstance(row.get('path'), str) and not row['path'].startswith(('/', '../'))
             and re.fullmatch('[0-9a-f]{64}', str(row.get('sha256', '')))
             and type(row.get('bytes')) is int and row['bytes'] >= 0}
    result['servedFiles'] = [{'path': path, 'sha256': sha, 'bytes': size}
                             for path, sha, size in sorted(files)]
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for case in CASES:
        path = args.input / (case + '.json')
        if path.is_file():
            data = path.read_bytes()
            result = project(json.loads(data))
            result.update(reportPresent=True, runnerLocalReportSha256=hashlib.sha256(data).hexdigest())
        else:
            result = {'version': 1, 'passed': False, 'reportPresent': False}
        result['case'] = case
        (args.output / (case + '.json')).write_text(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()

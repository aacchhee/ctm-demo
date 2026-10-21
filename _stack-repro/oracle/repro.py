"""The STACK reproductions: writes the questions and checks them against a STACK checkout.

SPDX-License-Identifier: AGPL-3.0-or-later (this script). The questions are CC BY-SA 4.0.

    python repro.py write                       # questions/*.xml from CASES below
    python repro.py check --stack DIR [--commit SHA] [--image DIR] [--out DIR]

`check` runs every question through STACK's own PHP code and Maxima, the way the
STACK API's /grade and /test routes do (grade.php), and compares each attempt with
the result recorded in CASES ("seen"). Needs PHP 8 and a STACK checkout whose
api/vendor is installed (`composer install --no-dev` in DIR/api). Maxima: plain
`maxima` (STACK's libraries are loaded from DIR at every call; slow), or with
--image a GCL image with STACK's libraries preloaded, as built by ctm-checkers'
tools/stack_native/native_image.py for that same STACK commit (fast).
"""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
from qgen import node, qtest, question  # noqa: E402

NUMBER = {'type': 'algebraic'}

# Each case: the question, attempts with the result we expect ("expected", in words) and
# the result STACK gives ("seen": input status and PRT scores, checked by `check`).
CASES = [
    dict(
        id='feedback-variable',
        title='Feedback variable typed as an answer',
        qvars='f: x^3+2*x; ta: diff(f,x);',
        text=('<p>Differentiate \\(f(x)={@f@}\\) with respect to \\(x\\).</p>'
              '<p>\\(f\'(x)=\\) [[input:ans1]] [[validation:ans1]]</p>[[feedback:prt1]]'),
        inputs=[('ans1', 'ta', 'algebraic', {})],
        prts=[('prt1', 'd: diff(f,x);\nerr: expand(ans1-d);',
               [node('0', 'AlgEquiv', 'ans1', 'ta', ffb='Your answer differs from the derivative by {@err@}.')])],
        qtests=[qtest(1, {'ans1': 'ta'}, {'prt1': (1, 0, 'prt1-1-T')}, 'The correct derivative.'),
                qtest(2, {'ans1': 'd'}, {'prt1': (None, None, 'NULL')},
                      'The name of the feedback variable d: should be invalid, as a question variable name is.')],
        attempts=[
            ({'ans1': '3*x^2+2'}, 'valid, score 1', {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': 'd'}, 'invalid ("Forbidden variable or constant: d."), or valid with score 0',
             {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': '3*x^2'}, 'valid, score 0', {'ans1': 'valid'}, {'prt1': 0}),
            ({'ans1': 'ta'}, 'invalid: "Forbidden variable or constant: ta."', {'ans1': 'invalid'}, {'prt1': None}),
        ]),
    dict(
        id='abs-product',
        title='AlgEquiv: absolute value of a product',
        qvars='ta: abs(x^2-1);',
        text=('<p>Write \\(\\sqrt{(x^2-1)^2}\\) without a square root.</p>'
              '<p>[[input:ans1]] [[validation:ans1]]</p>[[feedback:prt1]]'),
        inputs=[('ans1', 'ta', 'algebraic', {})],
        prts=[('prt1', '', [node('0', 'AlgEquiv', 'ans1', 'ta')])],
        qtests=[qtest(1, {'ans1': 'abs(x^2-1)'}, {'prt1': (1, 0, 'prt1-1-T')}),
                qtest(2, {'ans1': 'abs((x-1)*(x+1))'}, {'prt1': (1, 0, 'prt1-1-T')},
                      'The same expression with the inside factored.'),
                qtest(3, {'ans1': 'abs(x-1)*abs(x+1)'}, {'prt1': (1, 0, 'prt1-1-T')})],
        attempts=[
            ({'ans1': 'abs(x^2-1)'}, 'score 1', {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': 'abs(1-x^2)'}, 'score 1', {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': 'abs((x-1)*(x+1))'}, 'score 1', {'ans1': 'valid'}, {'prt1': 0}),
            ({'ans1': 'abs(x-1)*abs(x+1)'}, 'score 1', {'ans1': 'valid'}, {'prt1': 0}),
            ({'ans1': 'x^2-1'}, 'score 0', {'ans1': 'valid'}, {'prt1': 0}),
        ]),
    dict(
        id='int-partial-fractions',
        title='Int: partial fractions against integrate()',
        qvars='f: 2*x/(x^2-1); ta: integrate(f,x)+c;',
        text=('<p>Find \\(\\displaystyle\\int {@f@}\\,\\mathrm{d}x\\). Use \\(c\\) for the constant of integration.</p>'
              '<p>[[input:ans1]] [[validation:ans1]]</p>[[feedback:prt1]]'),
        inputs=[('ans1', 'ta', 'algebraic', {})],
        prts=[('prt1', '', [node('0', 'Int', 'ans1', 'ta', opts='x')])],
        qtests=[qtest(1, {'ans1': 'log(abs(x^2-1))+c'}, {'prt1': (1, 0, 'prt1-1-T')}),
                qtest(2, {'ans1': 'log(abs(x-1))+log(abs(x+1))+c'}, {'prt1': (1, 0, 'prt1-1-T')},
                      'Partial fractions, with absolute values in every logarithm.')],
        attempts=[
            ({'ans1': 'log(abs(x^2-1))+c'}, 'score 1', {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': 'log(abs(x-1))+log(abs(x+1))+c'}, 'score 1', {'ans1': 'valid'}, {'prt1': 0}),
            ({'ans1': 'log(abs((x-1)*(x+1)))+c'}, 'score 1', {'ans1': 'valid'}, {'prt1': 0}),
            ({'ans1': 'log(abs(x^2+1))+c'}, 'score 0', {'ans1': 'valid'}, {'prt1': 0}),
        ]),
    dict(
        id='log-square',
        title='AlgEquiv: log(x^2) and 2*log(abs(x))',
        qvars='ta: log(x^2);',
        text=('<p>Simplify \\(\\ln(x^2)\\) for \\(x\\neq 0\\).</p>'
              '<p>[[input:ans1]] [[validation:ans1]]</p>[[feedback:prt1]]'),
        inputs=[('ans1', 'ta', 'algebraic', {})],
        prts=[('prt1', '', [node('0', 'AlgEquiv', 'ans1', 'ta')])],
        qtests=[qtest(1, {'ans1': '2*log(abs(x))'}, {'prt1': (1, 0, 'prt1-1-T')},
                      'Equal to log(x^2) for every real x other than 0.')],
        attempts=[
            ({'ans1': '2*log(abs(x))'}, 'score 1', {'ans1': 'valid'}, {'prt1': 0}),
            ({'ans1': 'log(abs(x)^2)'}, 'score 1', {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': '2*log(x)'}, 'score 0, or at least not more than 2*log(abs(x))',
             {'ans1': 'valid'}, {'prt1': 1}),
            ({'ans1': 'log(x)'}, 'score 0', {'ans1': 'valid'}, {'prt1': 0}),
        ]),
    dict(
        id='decimal-tie-binary',
        title='NumDecPlaces and NumSigFigs: 1.015 rounded',
        qvars='a: 1.015;',
        text=('<p>Round \\({@a@}\\) to two decimal places: [[input:ans1]] [[validation:ans1]] [[feedback:prt1]]</p>'
              '<p>Round \\({@a@}\\) to three significant figures: [[input:ans2]] [[validation:ans2]] [[feedback:prt2]]</p>'),
        inputs=[('ans1', 'decimalplaces(a,2)', 'algebraic', {}), ('ans2', 'significantfigures(a,3)', 'algebraic', {})],
        prts=[('prt1', '', [node('0', 'NumDecPlaces', 'ans1', 'a', opts='2')]),
              ('prt2', '', [node('0', 'NumSigFigs', 'ans2', 'a', opts='3')])],
        qtests=[qtest(1, {'ans1': '1.02', 'ans2': '1.02'}, {'prt1': (1, 0, 'prt1-1-T'), 'prt2': (1, 0, 'prt2-1-T')},
                      '1.015 rounded half up, or half to even, is 1.02.')],
        attempts=[
            ({'ans1': '1.02', 'ans2': '1.02'}, 'score 1 in both', {'ans1': 'valid', 'ans2': 'valid'},
             {'prt1': 0, 'prt2': 0}),
            ({'ans1': '1.01', 'ans2': '1.01'}, 'score 0 in both', {'ans1': 'valid', 'ans2': 'valid'},
             {'prt1': 1, 'prt2': 1}),
        ]),
    dict(
        id='decimal-tie-rule',
        title='NumDecPlaces and NumSigFigs: 0.125 rounded',
        qvars='a: 0.125;',
        text=('<p>Round \\({@a@}\\) to two decimal places: [[input:ans1]] [[validation:ans1]] [[feedback:prt1]]</p>'
              '<p>Round \\({@a@}\\) to two significant figures: [[input:ans2]] [[validation:ans2]] [[feedback:prt2]]</p>'),
        inputs=[('ans1', 'decimalplaces(a,2)', 'algebraic', {}), ('ans2', 'significantfigures(a,2)', 'algebraic', {})],
        prts=[('prt1', '', [node('0', 'NumDecPlaces', 'ans1', 'a', opts='2')]),
              ('prt2', '', [node('0', 'NumSigFigs', 'ans2', 'a', opts='2')])],
        qtests=[qtest(1, {'ans1': '0.13', 'ans2': '0.13'}, {'prt1': (1, 0, 'prt1-1-T'), 'prt2': (1, 0, 'prt2-1-T')},
                      'The same rounding rule in both tests (here: half up, as significantfigures).')],
        attempts=[
            ({'ans1': '0.13', 'ans2': '0.13'}, 'the same score in both', {'ans1': 'valid', 'ans2': 'valid'},
             {'prt1': 0, 'prt2': 1}),
            ({'ans1': '0.12', 'ans2': '0.12'}, 'the same score in both', {'ans1': 'valid', 'ans2': 'valid'},
             {'prt1': 1, 'prt2': 0}),
        ]),
]


def xml(case):
    return question(case['title'], case['qvars'], case['text'], case['inputs'], case['prts'], case['qtests'])


def write():
    target = ROOT / 'questions'
    target.mkdir(exist_ok=True)
    for case in CASES:
        (target / f'{case["id"]}.xml').write_text(xml(case), encoding='utf-8')
        print(target / f'{case["id"]}.xml')


def setup(tmp, stack, image):
    config = (Path(stack) / 'api/config_sample.txt').read_text(encoding='utf-8')
    data = Path(tmp) / 'data'
    data.mkdir()
    subs = {'dirroot': repr(str(Path(stack).resolve() / 'api')), 'dataroot': repr(str(data)),
            'platform': repr('linux-optimised' if image else 'linux'), 'maximaversion': repr('5.46.0'),
            'maximacommand': repr('maxima --very-quiet'), 'castimeout': '120'}
    if image:
        image = Path(image).resolve()
        wrapper = Path(tmp) / 'maxima-image.sh'
        home = image / 'build-home'
        wrapper.write_text('#!/bin/sh\n'
                           'export GCL_GC_PAGE_THRESH=0.2 GCL_GC_ALLOC_MIN=0.01 GCL_GC_PAGE_MAX=0.05 GCL_MEM_MULTIPLE=0.2\n'
                           f'export MAXIMA_USERDIR={home} MAXIMA_TEMPDIR={home}/tmp MAXIMA_OBJDIR={home}/obj\n'
                           f"exec {image}/stack-gcl -eval '(cl-user::run)' -f -- --very-quiet\n")
        wrapper.chmod(0o755)
        subs['maximacommandopt'] = repr(str(wrapper))
    for key, value in subs.items():
        config, n = re.subn(rf'^\$CFG->{key}\s*=.*$', lambda m: f'$CFG->{key} = {value};', config, flags=re.M)
        if n != 1:
            raise SystemExit(f'config_sample.txt: no single $CFG->{key} line')
    (Path(tmp) / 'config.php').write_text(config, encoding='utf-8')
    run = Path(tmp) / 'run'
    run.mkdir()
    shutil.copy(HERE / 'grade.php', run / 'grade.php')
    return run


def php(run, stack, qfile, arg, env):
    p = subprocess.run(['php', 'grade.php', str(Path(stack).resolve()), str(qfile), '1', arg], cwd=run,
                       capture_output=True, text=True, timeout=3600, env=env)
    out = p.stdout[p.stdout.find('{'):]
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        raise SystemExit(f'grade.php failed for {qfile}:\n{p.stdout[-3000:]}\n{p.stderr[-3000:]}')


def check(args):
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ)
    if args.commit:
        env['STACK_COMMIT'] = args.commit
    problems = 0
    with tempfile.TemporaryDirectory() as tmp:
        run = setup(tmp, args.stack, args.image)
        for case in CASES:
            qfile = Path(tmp) / f'{case["id"]}.xml'
            qfile.write_text(xml(case), encoding='utf-8')
            afile = Path(tmp) / f'{case["id"]}.json'
            afile.write_text(json.dumps([a[0] for a in case['attempts']]))
            graded = php(run, args.stack, qfile, str(afile), env)
            tests = php(run, args.stack, qfile, '--tests', env)
            graded['question'] = f'questions/{case["id"]}.xml'
            graded['questiontests'] = tests
            for attempt, (answers, expected, inputs, scores) in zip(graded['attempts'], case['attempts']):
                attempt['expected'] = expected
                got_inputs = {k: v['status'] for k, v in attempt['inputs'].items()}
                got_scores = {k: v['score'] for k, v in attempt['prts'].items()}
                same = got_inputs == inputs and got_scores == scores
                problems += not same
                print(f'{case["id"]:22s} {json.dumps(answers):46s} {json.dumps(got_inputs):34s} '
                      f'{json.dumps(got_scores):28s} {"as recorded" if same else "DIFFERS from " + json.dumps([inputs, scores])}')
            (out / f'{case["id"]}.json').write_text(json.dumps(graded, indent=1, ensure_ascii=False) + '\n',
                                                     encoding='utf-8')
    print('all attempts as recorded' if not problems else f'{problems} attempt(s) differ from the record')
    return 1 if problems else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('write')
    c = sub.add_parser('check')
    c.add_argument('--stack', required=True, help='STACK checkout (moodle-qtype_stack) with api/vendor installed')
    c.add_argument('--commit', help='the checkout\'s commit, if it is not a git working tree')
    c.add_argument('--image', help='GCL Maxima image with this STACK\'s libraries (optional)')
    c.add_argument('--out', default=str(ROOT / 'evidence'))
    args = parser.parse_args()
    sys.exit(write() if args.command == 'write' else check(args))


if __name__ == '__main__':
    main()

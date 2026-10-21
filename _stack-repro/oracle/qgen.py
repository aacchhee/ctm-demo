"""Write minimal Moodle-XML STACK questions (one question per file).

SPDX-License-Identifier: AGPL-3.0-or-later (this script). The questions it
writes are CC BY-SA 4.0 (Andrey Chesnokov, 2026).
"""
from xml.sax.saxutils import escape

STACKVERSION = '2026080600'   # STACK 4.13.1, the version the questions were checked with


def node(name, test, sans, tans, opts='', tscore=1, fscore=0, tnote=None, fnote=None,
         tfb='', ffb='', tnext=-1, fnext=-1, quiet=0):
    return dict(name=name, test=test, sans=sans, tans=tans, opts=opts, tscore=tscore, fscore=fscore,
                tnote=tnote, fnote=fnote, tfb=tfb, ffb=ffb, tnext=tnext, fnext=fnext, quiet=quiet)


def qtest(n, answers, expected, description=''):
    """expected: {prt: (score, penalty, note)}; score None = PRT not evaluated (note 'NULL')."""
    return dict(n=n, answers=answers, expected=expected, description=description)


def _t(tag, value, indent='    '):
    return f'{indent}<{tag}>{escape(str(value))}</{tag}>\n'


def question(title, qvars, text, inputs, prts, qtests=(), note=''):
    """inputs: [(name, tans, type, {option: value})]; prts: [(name, feedbackvariables, [node, ...])]."""
    x = ['<?xml version="1.0" encoding="UTF-8"?>\n',
         f'<!-- {escape(title)}: a minimal reproduction for the STACK question type (moodle-qtype_stack). -->\n',
         '<!-- Andrey Chesnokov, 2026. Licence: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). -->\n',
         '<quiz>\n<question type="stack">\n']
    x.append(f'  <name><text>{escape(title)}</text></name>\n')
    x.append(f'  <questiontext format="html"><text><![CDATA[{text}]]></text></questiontext>\n')
    x.append('  <generalfeedback format="html"><text></text></generalfeedback>\n')
    x.append('  <defaultgrade>1</defaultgrade>\n  <penalty>0.1</penalty>\n  <hidden>0</hidden>\n  <idnumber></idnumber>\n')
    x.append(f'  <stackversion><text>{STACKVERSION}</text></stackversion>\n')
    x.append(f'  <questionvariables><text>{escape(qvars)}</text></questionvariables>\n')
    x.append('  <specificfeedback format="html"><text></text></specificfeedback>\n')
    x.append(f'  <questionnote format="html"><text>{escape(note)}</text></questionnote>\n')
    x.append('  <questionsimplify>1</questionsimplify>\n  <assumepositive>0</assumepositive>\n  <assumereal>0</assumereal>\n')
    for name, tans, typ, extra in inputs:
        x.append('  <input>\n' + _t('name', name) + _t('type', typ) + _t('tans', tans))
        opts = {'boxsize': 20, 'strictsyntax': 1, 'insertstars': 0, 'syntaxhint': '', 'syntaxattribute': 0,
                'forbidwords': '', 'allowwords': '', 'forbidfloat': 0, 'requirelowestterms': 0,
                'checkanswertype': 0, 'mustverify': 1, 'showvalidation': 1, 'options': ''}
        opts.update(extra)
        x.extend(_t(k, v) for k, v in opts.items())
        x.append('  </input>\n')
    for pname, fv, nodes in prts:
        x.append('  <prt>\n' + _t('name', pname) + _t('value', '1.0000000') + _t('autosimplify', 1) + _t('feedbackstyle', 1))
        x.append(f'    <feedbackvariables><text>{escape(fv)}</text></feedbackvariables>\n')
        for n in nodes:
            tnote = n['tnote'] or f'{pname}-{int(n["name"]) + 1}-T'
            fnote = n['fnote'] or f'{pname}-{int(n["name"]) + 1}-F'
            x.append('    <node>\n' + _t('name', n['name'], '      ') + _t('answertest', n['test'], '      ')
                     + _t('sans', n['sans'], '      ') + _t('tans', n['tans'], '      ')
                     + _t('testoptions', n['opts'], '      ') + _t('quiet', n['quiet'], '      ')
                     + _t('truescoremode', '=', '      ') + _t('truescore', n['tscore'], '      ')
                     + _t('truepenalty', '', '      ') + _t('truenextnode', n['tnext'], '      ')
                     + _t('trueanswernote', tnote, '      ')
                     + f'      <truefeedback format="html"><text>{escape(n["tfb"])}</text></truefeedback>\n'
                     + _t('falsescoremode', '=', '      ') + _t('falsescore', n['fscore'], '      ')
                     + _t('falsepenalty', '', '      ') + _t('falsenextnode', n['fnext'], '      ')
                     + _t('falseanswernote', fnote, '      ')
                     + f'      <falsefeedback format="html"><text>{escape(n["ffb"])}</text></falsefeedback>\n'
                     + '    </node>\n')
        x.append('  </prt>\n')
    for t in qtests:
        x.append('  <qtest>\n' + _t('testcase', t['n']))
        x.append(f'    <description>{escape(t["description"])}</description>\n')
        for name, value in t['answers'].items():
            x.append('    <testinput>\n' + _t('name', name, '      ') + _t('value', value, '      ') + '    </testinput>\n')
        for prt, (score, penalty, note) in t['expected'].items():
            x.append('    <expected>\n' + _t('name', prt, '      ')
                     + _t('expectedscore', '' if score is None else score, '      ')
                     + _t('expectedpenalty', '' if penalty is None else penalty, '      ')
                     + _t('expectedanswernote', note, '      ') + '    </expected>\n')
        x.append('  </qtest>\n')
    x.append('</question>\n</quiz>\n')
    return ''.join(x)

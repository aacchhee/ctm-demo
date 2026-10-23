"""Small source contracts; this does not render or claim browser acceptance."""
import json
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
BRANCH = 'consolidation/2026-10-saving-quiz-candidate'


class CandidateSource(unittest.TestCase):
    def text(self, path):
        return (ROOT / path).read_text(encoding='utf-8')

    def test_existing_save_labels_and_three_language_pages_stay_available(self):
        autosave = self.text('_includes/step4-ui/autosave.md')
        self.assertEqual(re.findall(r'^#\| label: (.+)$', autosave, re.M),
                         ['step4-ui-autosave', 'step4-ui-autosave-math'])
        for language in ['nb', 'nn', 'de']:
            page = self.text(f'pages/step4-ui-{language}.qmd')
            self.assertIn(f'lang: {language}\n', page)
            self.assertIn('../_includes/step4-ui/defaults.md', page)

    def test_quiz_uses_two_real_labelled_exercises_and_original_authored_syntax(self):
        quiz = self.text('_includes/step4-ui/quiz.md')
        self.assertEqual(re.findall(r'^#\| label: (.+)$', quiz, re.M),
                         ['step4-ui-quiz-math', 'step4-ui-quiz-python'])
        self.assertIn('```{math-exercise}', quiz)
        self.assertIn('```{py-exercise}', quiz)
        self.assertIn('_[7]', quiz)
        self.assertIn('## TESTS ##\nassert quiz_sum(2, 3) == 5', quiz)
        self.assertIn('assert quiz_sum(-2, 5) == 3', quiz)
        self.assertNotRegex(quiz, r'#\| (pool|variants|parameters):')
        self.assertIn('quiz=step4-ui-quiz', self.text('pages/step4-ui.qmd'))
        links = self.text('_includes/step4-ui/links-other.md')
        for target in ['ui-quiz-math-answer', 'ui-quiz-python-answer']:
            self.assertIn('{#' + target + '}', quiz)
            self.assertIn('step4-ui.qmd#' + target, links)

    def test_the_profile_has_only_existing_ui_pages_and_a_stable_course_key(self):
        profile = self.text('_quarto-saving-quiz.yml')
        rendered = re.findall(r'^    - (pages/[^\n]+\.qmd)$', profile, re.M)
        self.assertEqual(rendered, ['pages/step4-ui.qmd', 'pages/step4-ui-links.qmd',
                                  'pages/step4-ui-nb.qmd', 'pages/step4-ui-nn.qmd',
                                  'pages/step4-ui-de.qmd'])
        self.assertIn('  progress: true\n', profile)
        self.assertIn('  storage-key: ctm-demo-saving-quiz-candidate\n', profile)
        base = re.findall(r'^    - ([^\n]+\.qmd)$', self.text('_quarto.yml'), re.M)
        excluded = re.findall(r'^    - "!([^\n]+\.qmd)"$', profile, re.M)
        self.assertEqual(set(base) - set(rendered), set(excluded))
        self.assertIn('  sidebar: false\n', profile)
        self.assertIn('    title: false\n', profile)
        self.assertEqual(set(re.findall(r'^      - href: (pages/[^\n]+\.qmd)$', profile, re.M)),
                         set(rendered))
        self.assertNotIn('review', profile.lower())

    def test_candidate_automatic_checks_cannot_start_the_old_stack_build_or_deploy(self):
        original = self.text('.github/workflows/quarto.yml')
        self.assertIn("github.head_ref != '" + BRANCH + "'", original)
        self.assertIn('Render optional STACK review', original)  # still manually available
        workflow = self.text('.github/workflows/saving-quiz-candidate.yml')
        self.assertIn("if: github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/" + BRANCH + "'", workflow)
        self.assertIn('  contents: read\n', workflow)
        self.assertNotRegex(workflow, r'contents: write|pages: write|gh-pages|deploy-pages|--profile review')
        self.assertNotIn('_stack-audit/requirements.txt', workflow)
        self.assertNotIn('check-stack-variants.py', workflow)
        self.assertLess(workflow.index('Require the frozen reviewed dependency tuple'),
                        workflow.index('quarto-dev/quarto-actions/setup'))
        self.assertIn('python scripts/setup.py --review-refs "$CTM_REVIEW_REFS"', workflow)
        self.assertIn('.private-extensions/resolved-repos.json', workflow)

    def test_both_pending_tuple_values_fail_closed_before_any_install(self):
        workflow = self.text('.github/workflows/saving-quiz-candidate.yml')
        # These controlled env scalars may be quoted when root freezes the JSON.
        def scalar(name):
            value = re.search(r'^      ' + name + r': (.+)$', workflow, re.M)[1]
            return value[1:-1] if value[:1] in ["'", '"'] and value[-1:] == value[:1] else value
        umbrella = scalar('CTM_UMBRELLA_REF')
        components = scalar('CTM_COMPONENT_REVIEW_REFS')
        if umbrella == 'PENDING_ROOT_FINAL_TUPLE':
            self.assertEqual(components, 'PENDING_ROOT_FINAL_TUPLE')
            self.assertIsNone(re.fullmatch(r'[0-9a-f]{40}', umbrella))
        else:
            self.assertRegex(umbrella, r'^[0-9a-f]{40}$')
            refs = json.loads(components)
            self.assertIsInstance(refs, dict)
            self.assertNotIn('ctm-assessment', refs)
            for ref in refs.values():
                self.assertRegex(ref, r'^[0-9a-f]{40}$')

    def test_authored_python_tests_reject_the_starter_and_accept_the_small_fix(self):
        quiz = self.text('_includes/step4-ui/quiz.md')
        body = re.search(r'```\{py-exercise\}\n(.*?)\n```', quiz, re.S)[1]
        starter, tests = body.split('## TESTS ##', 1)
        namespace = {}
        exec(starter, namespace)
        with self.assertRaises(AssertionError):
            exec(tests, namespace)
        exec(starter.replace('return a - b', 'return a + b'), namespace)
        exec(tests, namespace)

    def test_real_mathjax_board_is_hidden_initially_and_outside_the_two_member_quiz(self):
        page = self.text('pages/step4-ui.qmd')
        start = page.index('## MathJax board in a reading step {#ui-board}')
        self.assertGreater(start, page.index('quiz=step4-ui-quiz'))
        board = page[start:page.index('## Also new,', start)]
        self.assertIn('::: {.reading-step', board)
        self.assertIn('```{.jsxgraph #ui-mathjax-board width="480" height="280" unit="px"}', board)
        self.assertIn('JXG.JSXGraph.initBoard(BOARDID', board)
        self.assertIn('x^2+1', board)
        self.assertIn('useMathJax: true', board)
        self.assertIn("window.addEventListener('load', function () { MathJax.startup.promise.then", board)
        self.assertIn('label.needsUpdate = true; board.update();', board)
        self.assertNotIn('src_mjx', self.text('_quarto-saving-quiz.yml'))


if __name__ == '__main__':
    unittest.main(verbosity=2)

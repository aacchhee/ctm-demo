"""Keep unapproved native authoring out of ordinary navigation and rendering."""
import json
from pathlib import Path
import re
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
NATIVE = 'pages/stack-oppgaver.qmd'
NORMAL = ['index.qmd', 'pages/experiments.qmd', 'pages/gaussian-elimination.qmd',
          'pages/physics.qmd', 'pages/fysikk-forkurs.qmd', 'pages/bevegelse-ii.qmd',
          'pages/help.qmd', 'pages/step4-ui.qmd', 'pages/step4-ui-links.qmd',
          'pages/step4-ui-nb.qmd', 'pages/step4-ui-nn.qmd', 'pages/step4-ui-de.qmd']
CANDIDATE = ['pages/step4-ui.qmd', 'pages/step4-ui-links.qmd',
             'pages/step4-ui-nb.qmd', 'pages/step4-ui-nn.qmd', 'pages/step4-ui-de.qmd']


class NativeReviewBoundary(unittest.TestCase):
    def test_normal_twelve_and_candidate_five_render_targets_are_preserved(self):
        base = yaml.safe_load((ROOT / '_quarto.yml').read_text())
        self.assertEqual(base['project']['render'], NORMAL)
        profile = yaml.safe_load((ROOT / '_quarto-saving-quiz.yml').read_text())
        entries = profile['project']['render']
        selected = set(NORMAL) | {value for value in entries if not value.startswith('!')}
        selected -= {value[1:] for value in entries if value.startswith('!')}
        self.assertEqual(selected, set(CANDIDATE))
        self.assertNotIn(NATIVE, selected)
        self.assertEqual([item['file'] for item in base['website']['sidebar']['contents']], NORMAL[:7])

    def test_no_ordinary_content_or_navigation_links_to_the_review_only_page(self):
        files = [ROOT / page for page in NORMAL]
        files += [p for p in (ROOT / '_includes').rglob('*') if p.suffix in ('.qmd', '.md') and 'stack' not in p.relative_to(ROOT / '_includes').parts]
        link = re.compile(r'(?:\]\([^)]*|href\s*=\s*[\'\"][^\'\"]*)stack-oppgaver\.(?:qmd|html)', re.I)
        for file in files:
            self.assertNotRegex(file.read_text(), link, str(file))

    def test_review_command_and_required_approval_boundary_remain_explicit(self):
        profile = yaml.safe_load((ROOT / '_quarto-variants-review.yml').read_text())
        self.assertEqual(profile, {'project': {'output-dir': '_variants-review-site', 'render': [NATIVE]}})
        workflow = (ROOT / '.github/workflows/quarto.yml').read_text()
        self.assertIn('CTM_VARIANTS: review', workflow)
        self.assertIn('quarto render ' + NATIVE + ' --profile variants-review', workflow)
        self.assertIn('python scripts/check-stack-native-authoring.py _variants-review-site/pages/stack-oppgaver.html', workflow)
        self.assertNotIn('CTM_VARIANTS: optional', workflow)
        counts = {'triangles': 24, 'values': 25, 'angle': 25, 'tangent': 25}
        for kind, count in counts.items():
            manifest = json.loads((ROOT / '_variants' / ('stack-' + kind + '.yml')).read_text())
            self.assertEqual(len(manifest['proposals']), count)
            self.assertEqual(manifest['decisions'], [])
            self.assertEqual(manifest['events'], [])


if __name__ == '__main__':
    unittest.main()

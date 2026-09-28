"""Check real Quarto outputs for the student/review variant-mode boundary."""
from html.parser import HTMLParser
import json
from pathlib import Path

class Exercises(HTMLParser):
    def __init__(self):
        super().__init__(); self.records = {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'data-variants' in attrs:
            self.records[attrs['data-label']] = json.loads(attrs['data-variants'])

def load(path):
    parser = Exercises(); parser.feed(Path(path).read_text()); return parser.records

student = load('_site/pages/stack-oppgaver.html')
review = load('_review-site/pages/stack-oppgaver.html')
expected = {'stack-triangles':24, 'stack-values':71, 'stack-angle':71, 'stack-tangent':159}
assert set(student) == set(review) == set(expected)
for label, count in expected.items():
    normal, author = student[label], review[label]
    assert not normal['review'] and author['review'], label
    assert len(author['variants']) == count, label
    assert {v['id'] for v in normal['variants']} == {v['id'] for v in author['variants'] if v['included']}, label
    for variant in author['variants']:
        assert '{{' not in variant['question'] and '{{' not in variant['solution'], label
        assert variant['tests'], label
print('Student/review outputs verified: four exercises, 325 candidates, resolved templates and authored tests.')

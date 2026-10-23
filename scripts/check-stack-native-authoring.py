"""Check the explicit nonstudent STACK render; this grants no approvals."""
from html.parser import HTMLParser
import json
from pathlib import Path
import sys

EXPECTED = {'stack-triangles': 24, 'stack-values': 25, 'stack-angle': 25, 'stack-tangent': 25}
class Exercises(HTMLParser):
    def __init__(self):
        super().__init__(); self.records = {}; self.ids = set(); self.frames = {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'): self.ids.add(attrs['id'])
        if tag == 'iframe' and attrs.get('id'): self.frames[attrs['id']] = attrs
        if 'data-variants' in attrs:
            label = attrs['data-label']
            assert label not in self.records, label
            self.records[label] = json.loads(attrs['data-variants'])
parser = Exercises()
parser.feed(Path(sys.argv[1]).read_text())
assert set(parser.records) == set(EXPECTED)
for label, count in EXPECTED.items():
    data = parser.records[label]
    assert data['native'] is True and data['renderMode'] == 'review', label
    rows = data['variants']
    assert len(rows) == count, (label, len(rows))
    assert len({row['id'] for row in rows}) == count, label
    assert all(row['n'] is None and row['proposal'] for row in rows), label
    assert all(row['status'] != 'approved' for row in rows), label
    assert all('{@' not in row['question'] and '{#' not in row['question'] for row in rows), label
    assert label + '-question' in parser.ids, label
    assert label + '-board' in parser.frames, label
print('Explicit review render: 99 distinct undecided proposals, four live question contexts and board iframes. No student clearance.')

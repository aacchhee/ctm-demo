"""Require all maintained undecided native proposals and real teacher fields."""
import json
from pathlib import Path
import sys

EXPECTED = {'triangles': (24, 1), 'values': (25, 8), 'angle': (25, 1), 'tangent': (25, 4)}


def check(directory: Path) -> None:
    total_records = total_fields = 0
    for kind, (count, field_count) in EXPECTED.items():
        envelope = json.loads((directory / (kind + '.json')).read_text())
        assert envelope['version'] == 1
        records = envelope['records']
        assert len(records) == len({row['id'] for row in records}) == count, kind
        assert envelope['counters'] == {'replayed': count, 'gone': 0}, kind
        for row in records:
            assert row['status'] == 'undecided' and row['n'] is None, (kind, row['id'])
            tests = row['tests']
            assert tests['passed'] is True and tests['teacher']['passed'] is True, (kind, row['id'])
            actual = tests['teacher']['actual']
            assert actual['status'] == 'correct' and actual['score'] == 1, (kind, row['id'])
            fields = actual['fields']
            assert set(fields) == set(row['teacherInputs']) and len(fields) == field_count, kind
            assert all(field['status'] == 'correct' and field['score'] == 1 for field in fields.values()), (kind, row['id'])
            total_fields += len(fields)
        total_records += len(records)
    assert (total_records, total_fields) == (99, 349)
    print('Native authoring: 99 distinct undecided proposals, 349 real teacher fields correct; no decisions changed.')


if __name__ == '__main__':
    check(Path(sys.argv[1]))

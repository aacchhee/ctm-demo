"""Check verdict partitioning, deduplication and conservative evidence handling."""
import unittest
from stack_audit_statistics import analyze

def fixture():
    records = [dict(path="samplequestions/stacklibrary/Topics/a.xml", ordinal=1, type="stack", prt_count=1),
               dict(path="samplequestions/stacklibrary/Topics/b.xml", ordinal=1, type="description", prt_count=0),
               dict(path="samplequestions/stacklibrary/Topics/c.xml", ordinal=1, type="stack", prt_count=1)]
    backup = dict(archive="samplequestions/example.mbz", ordinal=140, type="stack")
    def code(id, disposition, classes, prt, refs):
        return dict(id=id, disposition=disposition, classes=classes, prt_classes=prt, records=refs)
    ref = dict(path=records[0]["path"], ordinal=1)
    coding = [code("A-01", "confirmed", ["PRT_LOGIC"], ["binding_target"], [ref]),
              code("A-02", "confirmed", ["MATH_KEY"], [], [ref, dict(archive=backup["archive"], ordinal=140)]),
              code("A-03", "runtime_candidate", ["SOURCE_CODE"], [], [dict(path=records[1]["path"], ordinal=1)])]
    return records, [backup], [dict(id=f["id"]) for f in coding], dict(source_sha="test", correct_records=[], findings=coding)

class StatisticsTests(unittest.TestCase):
    def test_overlap_and_candidate_are_not_extra_incorrect_questions(self):
        r, b, f, c = fixture(); s = analyze(r, b, f, c)
        self.assertEqual(s["standalone"], dict(total=3, incorrect=1, correct=0, undecided=2))
        self.assertEqual(s["backups"]["incorrect"], 1)
        self.assertEqual(s["combined_occurrences"]["incorrect"], 2)
        self.assertEqual(s["prt"]["confirmed_affected_standalone_records"], 1)
        self.assertEqual(s["prt"]["eligible_standalone_records"], 2)
        self.assertEqual(r[1]["audit_verdict"], "undecided")
        self.assertEqual(r[2]["audit_verdict"], "undecided")

    def test_correct_requires_an_explicit_positive_verdict(self):
        r, b, f, c = fixture(); c["correct_records"] = [dict(path=r[2]["path"], ordinal=1)]
        s = analyze(r, b, f, c)
        self.assertEqual(s["standalone"], dict(total=3, incorrect=1, correct=1, undecided=1))

    def test_contradictory_positive_verdict_is_rejected(self):
        r, b, f, c = fixture(); c["correct_records"] = [dict(path=r[0]["path"], ordinal=1)]
        with self.assertRaises(AssertionError): analyze(r, b, f, c)

    def test_missing_classification_or_unknown_record_is_rejected(self):
        for mode in ("missing", "unknown"):
            r, b, f, c = fixture()
            if mode == "missing": c["findings"].pop()
            else: c["findings"][0]["records"][0]["ordinal"] = 99
            with self.assertRaises(AssertionError): analyze(r, b, f, c)

    def test_prt_numerator_requires_a_prt_record_and_matching_tag(self):
        for mode in ("no_tree", "no_tag"):
            r, b, f, c = fixture()
            if mode == "no_tree": r[0]["prt_count"] = 0
            else: c["findings"][0]["classes"] = ["MATH_KEY"]
            with self.assertRaises(AssertionError): analyze(r, b, f, c)

if __name__ == "__main__": unittest.main()

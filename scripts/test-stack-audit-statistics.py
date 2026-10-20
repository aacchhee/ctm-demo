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

class NodeStatisticsTests(unittest.TestCase):
    def data(self):
        from copy import deepcopy
        a="samplequestions/stacklibrary/Topics/a.xml"
        b="samplequestions/stacklibrary/Topics/b.xml"
        inv=[dict(path=a,ordinal=1,prt="p1",nodes=1),dict(path=a,ordinal=1,prt="p2",nodes=3),dict(path=b,ordinal=1,prt="p1",nodes=2)]
        refs=[dict(path=a,ordinal=1),dict(path=a,ordinal=1),dict(path=b,ordinal=1)]
        classes=dict(findings=[dict(id=f"N-{i}",disposition="confirmed",classes=["PRT_LOGIC"],records=[r]) for i,r in enumerate(refs)])
        maps=[dict(finding_id=f"N-{i}",**r,prts=[dict(name="p1",node_count=1 if i<2 else 2,attribution="direct" if i<2 else "joint",note="test")]) for i,r in enumerate(refs)]
        return inv,dict(source_sha="test",mappings=maps),classes

    def test_tree_deduplication_and_joint_defects_are_separate(self):
        from prt_node_statistics import analyze_nodes
        inv,a,c=self.data();s,rows=analyze_nodes(inv,a,c)
        self.assertEqual(s["standalone"]["prts"],3)
        self.assertEqual(s["standalone"]["direct_defects"],1)
        self.assertEqual(s["standalone"]["joint_only"],1)
        self.assertEqual(s["multiple_nodes"]["direct_defects"],0)

    def test_ladder_is_nested_and_questions_are_deduplicated(self):
        from prt_node_statistics import analyze_nodes
        inv,a,c=self.data();s,_=analyze_nodes(inv,a,c)
        self.assertEqual([r["prts"] for r in s["cumulative_ladder"]],[3,2,1])
        self.assertEqual([r["questions"] for r in s["cumulative_ladder"]],[2,2,1])
        self.assertEqual(s["two_nodes"]["prts"],1)
        self.assertEqual(s["three_or_more_nodes"]["prts"],1)

    def test_unmatched_tree_missing_attribution_and_wrong_counts_fail(self):
        from prt_node_statistics import analyze_nodes
        for mode in ("name","count","missing"):
            inv,a,c=self.data()
            if mode=="name":a["mappings"][0]["prts"][0]["name"]="absent"
            elif mode=="count":a["mappings"][0]["prts"][0]["node_count"]=99
            else:a["mappings"].pop()
            with self.assertRaises(AssertionError):analyze_nodes(inv,a,c)

if __name__ == "__main__": unittest.main()


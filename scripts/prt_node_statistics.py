"""Describe detected PRT defects by actual XML node count, with explicit attribution."""
import csv
import json
from collections import Counter
from stack_audit_statistics import pack_for, table

def identity(r):
    return ("backup" if "archive" in r else "standalone",
            r.get("archive", r.get("path")), int(r["ordinal"]))

def tree_key(r, name=None):
    return (*identity(r), r.get("prt") if name is None else name)

def summarize(rows):
    n = len(rows)
    direct = sum(r["attribution"] == "direct" for r in rows)
    joint = sum(r["attribution"] == "joint_only" for r in rows)
    return dict(prts=n, direct_defects=direct, joint_only=joint,
                any_affected=direct+joint,
                direct_percent=100*direct/n if n else None)

def analyze_nodes(inventory, attribution, classifications):
    by_key = {tree_key(r): dict(r) for r in inventory}
    assert len(by_key) == len(inventory), "Duplicate PRT identities"
    confirmed = [f for f in classifications["findings"]
                 if f["disposition"] == "confirmed" and "PRT_LOGIC" in f["classes"]]
    expected = {(f["id"], identity(r)) for f in confirmed for r in f["records"]}
    actual = [(m["finding_id"], identity(m)) for m in attribution["mappings"]]
    assert len(actual) == len(set(actual)) and set(actual) == expected, "Incomplete finding-to-tree attribution"
    direct, joint = set(), set()
    finding_ids = {k: set() for k in by_key}
    notes = {k: [] for k in by_key}
    for m in attribution["mappings"]:
        assert m["prts"], m["finding_id"]
        assert len({t["name"] for t in m["prts"]}) == len(m["prts"])
        for t in m["prts"]:
            k = tree_key(m, t["name"])
            assert k in by_key, (m["finding_id"], "Unknown PRT", k)
            assert by_key[k]["nodes"] == t["node_count"], (m["finding_id"], "Node count mismatch", k)
            assert t["attribution"] in {"direct", "joint"}
            (direct if t["attribution"] == "direct" else joint).add(k)
            finding_ids[k].add(m["finding_id"])
            notes[k].append(t["note"])
    joint -= direct
    for k, r in by_key.items():
        r.update(attribution="direct" if k in direct else "joint_only" if k in joint else "no_recorded_defect",
                 finding_ids=";".join(sorted(finding_ids[k])), notes=" | ".join(notes[k]))
    rows = list(by_key.values())
    standalone = [r for r in rows if "path" in r]
    backups = [r for r in rows if "archive" in r]
    assert all(r["nodes"] >= 0 for r in rows)
    exact = [dict(nodes=n, **summarize([r for r in standalone if r["nodes"] == n]))
             for n in sorted({r["nodes"] for r in standalone})]
    ladder=[]
    for n in range(1, max((r["nodes"] for r in standalone), default=0)+1):
        eligible=[r for r in standalone if r["nodes"] >= n]
        ladder.append(dict(minimum_nodes=n, **summarize(eligible),
                           questions=len({identity(r) for r in eligible}),
                           questions_with_direct_defect=len({identity(r) for r in eligible if r["attribution"] == "direct"})))
    one = summarize([r for r in standalone if r["nodes"] == 1])
    multi = summarize([r for r in standalone if r["nodes"] > 1])
    two = summarize([r for r in standalone if r["nodes"] == 2])
    three_plus = summarize([r for r in standalone if r["nodes"] >= 3])
    ratio = multi["direct_percent"]/one["direct_percent"] if one["direct_percent"] and multi["direct_percent"] is not None else None
    ratio_three_two = three_plus["direct_percent"]/two["direct_percent"] if two["direct_percent"] and three_plus["direct_percent"] is not None else None
    bands = [dict(label=str(n), **summarize([r for r in standalone if r["nodes"] == n])) for n in range(1,5)]
    bands.append(dict(label="5+", **summarize([r for r in standalone if r["nodes"] >= 5])))
    packs = []
    for p in sorted({pack_for(r["path"]) for r in standalone}):
        rs = [r for r in standalone if pack_for(r["path"]) == p]
        packs.append(dict(pack=p, one=summarize([r for r in rs if r["nodes"] == 1]),
                          two=summarize([r for r in rs if r["nodes"] == 2]),
                          three_plus=summarize([r for r in rs if r["nodes"] >= 3]),
                          multi=summarize([r for r in rs if r["nodes"] > 1])))
    result = dict(source_sha=attribution["source_sha"],
                  unit="A PRT definition identified by source record ordinal and PRT name. Counts are actual XML node elements.",
                  standalone_prts=len(standalone), standalone_nodes=sum(r["nodes"] for r in standalone),
                  empty_prts=sum(r["nodes"] == 0 for r in standalone),
                  standalone=summarize(standalone), backups=summarize(backups),
                  one_node=one, multiple_nodes=multi, direct_detected_proportion_ratio=ratio,
                  two_nodes=two, three_or_more_nodes=three_plus, three_plus_vs_two_direct_proportion_ratio=ratio_three_two,
                  node_bands=bands, exact_node_counts=exact, cumulative_ladder=ladder, packs=packs,
                  interpretation=["Direct means a confirmed defect located within that PRT. Joint-only means participation in a missing cross-PRT consistency condition, without separately attributing an intrinsic error to each participating tree.",
                                  "No recorded defect is undecided, not a correct verdict. Ordinary wrong model keys and runtime candidates are not included.",
                                  "Main comparisons use standalone definitions only. Backup copies have separate counts and are not used as independent observations.",
                                  "This is a descriptive association in detected source defects, not a causal effect or an unbiased estimate of actual error probability.",
                                  "Screening depth, mathematical complexity, pack/authorship and multiple correlated trees per question can confound the association. Longer trees also offer more opportunities for a defect; this does not establish a higher error risk per node.",
                                  "No inferential p-values or confidence intervals are assigned to this selectively ascertained defect set."])
    assert sum(x["prts"] for x in exact) == len(standalone)
    assert sum(x["direct_defects"] for x in exact) == result["standalone"]["direct_defects"]
    return result, rows

def pct(v):
    return "n/a" if v is None else f"{v:.2f}%"

def render_node_overview(s):
    one, multi = s["one_node"], s["multiple_nodes"]
    md = "#### PRT defects by number of nodes {#prt-node-count}\n\n"
    md += (f"The standalone bank contains **{s['standalone_prts']:,} PRT definitions and {s['standalone_nodes']:,} nodes**. "
           "The unit here is an individual PRT, not a whole question. Nodes are actual XML node elements, not the largest numeric node label. "
           f"There are {s['empty_prts']} empty PRTs; empty definitions are excluded from the one-versus-multiple comparison.\n\n")
    md += ("**Direct defect** means a confirmed problem inside the named PRT. **Joint-only** means that a tree participates in a missing consistency check between separate PRTs; "
           "its local marginal test need not be wrong. Joint-only trees are shown separately and excluded from the direct-defect percentage. Each tree is counted once even if several findings affect it.\n\n")
    md += "![Bank size and recorded direct-defect proportions for one-, two-, three-, four- and five-plus-node PRTs. Counts and exact numerators are labelled.](data/prt-node-bands.svg)\n\n[Download this plot as PNG](data/prt-node-bands.png).\n\n"
    md += table(["Nodes per PRT", "All PRTs", "Direct defects", "Direct / all", "Additional joint-only"],
                [[label, r["prts"], r["direct_defects"], pct(r["direct_percent"]), r["joint_only"]]
                 for label, r in [("1",one),("2 or more",multi)]])
    if s["direct_detected_proportion_ratio"] is not None:
        md += (f"The recorded direct-defect proportion is **{s['direct_detected_proportion_ratio']:.1f} times as high** for multi-node PRTs. "
               "This is an association in the recorded defects; it does not establish causation or estimate the true population error-rate ratio.\n\n")
    if s["three_plus_vs_two_direct_proportion_ratio"] is not None:
        two, larger = s["two_nodes"], s["three_or_more_nodes"]
        md += (f"For **2 nodes versus 3 or more**, the corresponding counts are **{two['direct_defects']} / {two['prts']} ({pct(two['direct_percent'])})** "
               f"and **{larger['direct_defects']} / {larger['prts']} ({pct(larger['direct_percent'])})**, "
               f"a **{s['three_plus_vs_two_direct_proportion_ratio']:.1f}-fold** difference in recorded direct-defect proportions.\n\n")
    md += table(["Nodes per PRT", "All PRTs", "Direct defects", "Direct / all", "Additional joint-only"],
                [[r["label"],r["prts"],r["direct_defects"],pct(r["direct_percent"]),r["joint_only"]] for r in s["node_bands"]])
    md += "**Cumulative ladder.** Each step keeps every tree with at least the stated number of nodes. The question column counts distinct source question records containing such a tree. These nested groups overlap and must not be added or treated as independent comparisons.\n\n"
    md += "![Cumulative ladder of remaining PRTs, distinct questions and recorded direct defects at each minimum node count, on a logarithmic count scale. The sparse tail is shaded.](data/prt-node-ladder.svg)\n\n[Download this plot as PNG](data/prt-node-ladder.png).\n\n"
    md += table(["At least this many nodes", "PRTs remaining", "Distinct questions", "Direct defects", "Direct / all"],
                [[r["minimum_nodes"],r["prts"],r["questions"],r["direct_defects"],pct(r["direct_percent"])] for r in s["cumulative_ladder"]])
    md += "The top step contains just one PRT. Its recorded defect is one case, not a stable estimate of reliability for long trees generally. Large percentages at the sparse end of this ladder should not be read as strong evidence.\n\n"
    md += ("**Interpretation:** more nodes also mean more opportunities for an error. Mathematical complexity, pack/authorship and unequal screening depth may explain part of the association. "
           "Trees in the same question are correlated. These descriptive counts do not demonstrate a higher error probability per node or a smooth increase with every added node. "
           "No error recorded means undecided, not proven correct. No significance test is used for this selectively detected set.\n\n")
    md += "<details>\n<summary>Exact node counts and comparison within packs</summary>\n\n"
    md += table(["Nodes", "All PRTs", "Direct defects", "Joint-only"],
                [[r["nodes"],r["prts"],r["direct_defects"],r["joint_only"]] for r in s["exact_node_counts"]])
    md += table(["Pack", "1 node: direct / all", "2 nodes: direct / all", "3+ nodes: direct / all"],
                [[p["pack"],f"{p['one']['direct_defects']} / {p['one']['prts']} ({pct(p['one']['direct_percent'])})",
                  f"{p['two']['direct_defects']} / {p['two']['prts']} ({pct(p['two']['direct_percent'])})",
                  f"{p['three_plus']['direct_defects']} / {p['three_plus']['prts']} ({pct(p['three_plus']['direct_percent'])})"] for p in s["packs"]])
    md += "</details>\n\n"
    b = s["backups"]
    md += (f"The three separately reviewed legacy PRT findings map to **{b['direct_defects']} directly affected backup trees**. "
           "They are excluded from the main association calculation because backups contain copies and received different review depth.\n\n")
    md += "**Assessment of the hypothesis: partial evidence for a narrower authoring claim; the full hypothesis is not established.**\n\n"
    md += table(["Claim", "What this audit supports"], [
        ["Multi-node PRTs have more authoring errors", "A higher proportion of confirmed direct defects was recorded in multi-node trees. Unequal detection and task complexity prevent an unbiased actual error-rate comparison."],
        ["Every extra node increases the error rate", "Not supported by the observed bands: 5+ nodes have a lower recorded proportion than 3 or 4. Sparse groups limit interpretation."],
        ["PRTs are pedagogically effective", "Not tested: no learner outcomes, teaching comparison or pedagogical effect sizes were measured."],
        ["PRT authoring is a disaster compared with alternatives", "Not established: no matched comparison with alternative authoring systems, author effort or production error rates was made."],
    ])
    md += ("The confirmed mechanisms concern coordinating mathematical conditions, answer bindings, routes, scores and cross-input dependencies. "
           "They identify concrete authoring failures. They do not by themselves establish pedagogical benefit, a causal effect of tree length, or the reliability of PRT authoring relative to alternatives.\n\n")
    md += ("Downloads: [node-count statistics](data/prt-node-statistics.json), [per-PRT node/verdict ledger](data/prt-node-ledger.csv), "
           "and [explicit affected-tree attribution](data/prt-attribution.json).\n\n")
    return md

def export_node_statistics(src, classifications):
    data = src / "data"
    attribution = json.loads((src/"prt-attribution.json").read_text(encoding="utf8"))
    assert attribution["source_sha"] == classifications["source_sha"]
    inventory = json.loads((data/"prt-inventory.json").read_text(encoding="utf8"))
    result, rows = analyze_nodes(inventory, attribution, classifications)
    assert result["standalone_prts"] == 5489 and result["standalone_nodes"] == 7872, "Pinned PRT inventory changed"
    from prt_node_plots import make_plots
    make_plots(result,data)
    (data/"prt-node-statistics.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
    (data/"prt-attribution.json").write_text(json.dumps(attribution,ensure_ascii=False,indent=2),encoding="utf8")
    fields=["path","archive","ordinal","prt","nodes","attribution","finding_ids","notes"]
    with (data/"prt-node-ledger.csv").open("w",newline="",encoding="utf8") as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
    path=src/"_statistics.md"
    with path.open("a",encoding="utf8") as f:f.write(render_node_overview(result))
    return result

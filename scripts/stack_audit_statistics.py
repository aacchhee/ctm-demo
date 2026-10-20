"""Conservative, record-level audit statistics from explicit finding classifications.

A grouped finding is not a question. Multiple findings can affect one record,
and one finding can affect several records. No finding is a positive verdict.
"""
from collections import Counter
from pathlib import Path
import csv
import json

ERROR_CLASSES = {
    "MATH_KEY": ("Wrong mathematical target/result", "An incorrect model answer, formula, numerical result or claimed result."),
    "MATH_TEXT": ("Incorrect worked mathematics", "A false identity, derivation or explanation in teaching text or worked feedback."),
    "GENERATION": ("Invalid random instance", "Allowed parameters can create undefined, inconsistent, degenerate or otherwise unsuitable instances."),
    "PROMPT_KEY": ("Prompt/data/key mismatch", "The displayed problem, generated data, model or feedback uses different definitions or parameters."),
    "DOMAIN_WORDING": ("Domain/completeness/instruction defect", "The stated domain, required family, convention or presentation requirement is missing or incompatible with grading."),
    "PRT_LOGIC": ("PRT grading logic", "A defective answer-test choice, operand binding, condition, acceptance route or scoring rule; ordinary wrong teacher keys alone are excluded."),
    "SOURCE_CODE": ("CAS syntax/name/evaluation defect", "An erroneous identifier, syntax or evaluation dependency, beyond a purely mathematical target error."),
}
PRT_CLASSES = {
    "binding_target": ("Wrong input or test operand", "Self-comparison, grading another input, or testing teacher expressions instead of student expressions."),
    "routing_scoring": ("Routing or scoring", "Bypassed correctness gates, retained credit on failure, wrong weights or score saturation."),
    "missing_condition": ("Missing mathematical condition", "Missing orthogonality, independence, nontriviality, coverage, interval or ODE-residual requirement."),
    "joint_answers": ("Joint-answer/set handling", "Duplicate solutions or independently accepted coordinates/equations fail to represent the required collection."),
    "answer_test": ("Answer-test or form restriction", "An inappropriate test or an unstated form/constant convention rejects valid answers or accepts the wrong form."),
    "wrong_alternative": ("Incorrect full-credit alternative", "An explicitly accepted extra target is mathematically wrong; distinct from a wrong ordinary model key."),
    "sampled_property": ("Insufficient property heuristic", "Finite-point, coefficient or symbol-count checks do not establish the requested global property."),
}
PACKS = [
    "Algebra refresher", "Calculus refresher", "Topics",
    "Introductory Mathematics: weeks 1–3", "Introductory Mathematics: weeks 4–5",
    "Introductory Mathematics: weeks 6–10", "HELM: chapters 1–13 and numerical Course",
    "HELM: chapters 14–23", "HELM: chapters 25+", "Demos, features, docs and templates",
]

def pack_for(path):
    import re
    if "/Algebra-Refresher/" in path:
        return PACKS[0]
    if "/Calculus-Refresher/" in path:
        return PACKS[1]
    if "/Topics/" in path:
        return PACKS[2]
    if "/Introductory-Mathematics/" in path:
        m = re.search(r"/Week-(\d+)", path)
        assert m, path
        week = int(m.group(1))
        assert 1 <= week <= 10, path
        return PACKS[3 if week <= 3 else 4 if week <= 5 else 5]
    if "/HELM/" in path:
        if "/Course/" in path:
            return PACKS[6]
        m = re.search(r"/Course_quiz_(\d+)", path)
        assert m, path
        chapter = int(m.group(1))
        assert chapter <= 23 or chapter >= 25, path
        return PACKS[6 if chapter <= 13 else 7 if chapter <= 23 else 8]
    return PACKS[9]

def key(record):
    return ("backup" if "archive" in record else "standalone",
            record.get("archive", record.get("path")), int(record["ordinal"]))

def totals(records, verdicts):
    result = dict(total=len(records), incorrect=0, correct=0, undecided=0)
    for record in records:
        result[verdicts[key(record)]] += 1
    assert result["incorrect"] + result["correct"] + result["undecided"] == result["total"]
    return result

def analyze(records, backups, findings, classification):
    all_records = records + backups
    by_key = {key(r): r for r in all_records}
    assert len(by_key) == len(all_records), "Duplicate record identities"
    by_finding = {f["id"]: f for f in findings}
    coding = classification["findings"]
    assert len({f["id"] for f in coding}) == len(coding), "Duplicate classifications"
    assert {f["id"] for f in coding} == set(by_finding), "Every finding needs an explicit classification"
    incorrect = set()
    prt_records = set()
    linked = {k: [] for k in by_key}
    refs_by_finding = {}
    for f in coding:
        assert f["disposition"] in {"confirmed", "clarification", "runtime_candidate"}, f["id"]
        assert f["classes"] and set(f["classes"]) <= ERROR_CLASSES.keys(), f["id"]
        assert set(f["prt_classes"]) <= PRT_CLASSES.keys(), f["id"]
        assert bool(f["prt_classes"]) == ("PRT_LOGIC" in f["classes"]), f["id"]
        refs = {key(r) for r in f["records"]}
        assert refs and refs <= by_key.keys(), (f["id"], refs - by_key.keys())
        refs_by_finding[f["id"]] = refs
        for k in refs:
            linked[k].append(f["id"])
        if f["disposition"] == "confirmed":
            incorrect.update(refs)
            if f["prt_classes"]:
                assert all(by_key[k]["type"] == "stack" for k in refs), f["id"]
                prt_records.update(refs)
    correct = {key(r) for r in classification["correct_records"]}
    assert correct <= by_key.keys() and not (correct & incorrect), "Conflicting correctness verdicts"
    verdicts = {k: "incorrect" if k in incorrect else "correct" if k in correct else "undecided" for k in by_key}
    confirmed = [f for f in coding if f["disposition"] == "confirmed"]

    def class_counts(vocabulary, field):
        result = []
        for code, (label, definition) in vocabulary.items():
            fs = [f for f in confirmed if code in f[field]]
            refs = set().union(*(refs_by_finding[f["id"]] for f in fs))
            result.append(dict(code=code, label=label, definition=definition,
                               findings=len(fs), finding_ids=[f["id"] for f in fs],
                               standalone_records=sum(k[0] == "standalone" for k in refs),
                               backup_records=sum(k[0] == "backup" for k in refs)))
        return result

    standalone_stack = [r for r in records if r["type"] == "stack"]
    with_prt = [r for r in standalone_stack if int(r["prt_count"]) > 0]
    prt_xml = {k for k in prt_records if k[0] == "standalone"}
    assert prt_xml <= {key(r) for r in with_prt}, "PRT defect mapped to record without a PRT"
    bad_stack = {key(r) for r in standalone_stack if verdicts[key(r)] == "incorrect"}
    packs = []
    for pack in PACKS:
        rs = [r for r in records if pack_for(r["path"]) == pack]
        stack = [r for r in rs if r["type"] == "stack"]
        eligible = [r for r in stack if int(r["prt_count"]) > 0]
        packs.append(dict(pack=pack, **totals(rs, verdicts), stack_total=len(stack),
                          stack_incorrect=sum(key(r) in bad_stack for r in stack),
                          stack_correct=sum(verdicts[key(r)] == "correct" for r in stack),
                          stack_undecided=sum(verdicts[key(r)] == "undecided" for r in stack),
                          prt_eligible=len(eligible), prt_incorrect=sum(key(r) in prt_xml for r in eligible)))
    archives = [dict(archive=p, **totals([r for r in backups if r["archive"] == p], verdicts))
                for p in sorted({r["archive"] for r in backups})]
    result = dict(source_sha=classification["source_sha"],
                  finding_dispositions=dict(Counter(f["disposition"] for f in coding)),
                  standalone=totals(records, verdicts), standalone_stack=totals(standalone_stack, verdicts),
                  backups=totals(backups, verdicts), combined_occurrences=totals(all_records, verdicts),
                  packs=packs, archives=archives,
                  error_classes=class_counts(ERROR_CLASSES, "classes"),
                  prt_classes=class_counts(PRT_CLASSES, "prt_classes"),
                  prt=dict(eligible_standalone_records=len(with_prt),
                           confirmed_affected_standalone_records=len(prt_xml),
                           confirmed_affected_backup_records=sum(k[0] == "backup" for k in prt_records),
                           confirmed_grouped_findings=sum(bool(f["prt_classes"]) for f in confirmed),
                           standalone_incorrect_stack_records=len(bad_stack),
                           standalone_incorrect_stack_without_confirmed_prt=len(bad_stack - prt_xml)),
                  notes=["Incorrect means at least one confirmed source defect, not a native execution result.",
                         "Correct requires an explicit whole-record positive verdict; none was recorded in this audit.",
                         "Undecided includes no finding, clarification-only and runtime-candidate-only records.",
                         "Class labels overlap. Records are deduplicated within each row.",
                         "Archive verdicts use explicitly identified archive records only; no inference from core duplicates.",
                         "Combined counts include copies and are record occurrences, not distinct question designs.",
                         "Observed defect counts are lower bounds from unequal-depth source review, not estimated error rates."])
    assert sum(p["total"] for p in packs) == len(records)
    assert sum(p["incorrect"] for p in packs) == result["standalone"]["incorrect"]
    assert sum(a["total"] for a in archives) == len(backups)
    for r in all_records:
        r.update(audit_pack=Path(r["archive"]).name if "archive" in r else pack_for(r["path"]),
                 audit_verdict=verdicts[key(r)], finding_ids=";".join(sorted(linked[key(r)])))
    return result

def table(headers, rows):
    return "| " + " | ".join(headers) + " |\n|" + "|".join("---" for _ in headers) + "|\n" + "".join("| " + " | ".join(map(str, row)) + " |\n" for row in rows) + "\n"

def render_overview(stats):
    s = stats
    t = s["standalone"]
    md = "## Overview statistics {#overview-statistics}\n\n"
    md += (f"**{t['incorrect']:,} of {t['total']:,} standalone records have at least one confirmed source defect. "
           f"{t['correct']:,} have an explicit whole-record correct verdict; {t['undecided']:,} remain undecided.** "
           "These are distinct question records, including explanatory descriptions and other Moodle types. "
           "One grouped finding can affect several records; several findings can affect the same record.\n\n")
    md += ("::: {.callout-important title=\"What these verdicts mean\"}\n"
           "**Incorrect:** at least one confirmed mathematical, formulation, generator, code or PRT defect in the pinned source. "
           "**Correct:** an explicit whole-record positive verdict. No such verdict was recorded, so zero correct does **not** mean that no questions are correct. "
           "**Undecided:** no confirmed defect is recorded; this includes unflagged records, clarification-only cases and runtime-dependent candidates. "
           "A clean static screen is not a correctness certificate. A defective definition may fail only for some allowed random draws or responses; these are not student-attempt failure counts. Native STACK/Maxima runs remain at zero.\n:::\n\n")
    md += "### Question packs: standalone records\n\nPacks follow the review partitions; the two refresher packs are separated. Categories are excluded. Counts include all question types.\n\n"
    rows = [[p["pack"], p["total"], p["incorrect"], p["correct"], p["undecided"]] for p in s["packs"]]
    rows.append(["**Total standalone**", t["total"], t["incorrect"], t["correct"], t["undecided"]])
    md += table(["Pack", "Records", "Incorrect", "Correct", "Undecided"], rows)
    st = s["standalone_stack"]
    md += (f"For **STACK questions alone**, the corresponding totals are **{st['total']:,} records: {st['incorrect']:,} incorrect, "
           f"{st['correct']:,} correct and {st['undecided']:,} undecided**. The per-record downloads identify question type, verdict and finding IDs.\n\n")
    md += "<details>\n<summary>STACK-only verdicts by pack</summary>\n\n"
    rows = [[p["pack"], p["stack_total"], p["stack_incorrect"], p["stack_correct"], p["stack_undecided"]] for p in s["packs"]]
    rows.append(["**Total STACK**", st["total"], st["incorrect"], st["correct"], st["undecided"]])
    md += table(["Pack", "STACK records", "Incorrect", "Correct", "Undecided"], rows) + "</details>\n\n"
    md += "### Backup packs and overall total\n\nThese counts use the six explicitly identified legacy records. Defects are not automatically propagated to core-field duplicates. Backups include copies of standalone questions.\n\n"
    rows = [[Path(a["archive"]).name, a["total"], a["incorrect"], a["correct"], a["undecided"]] for a in s["archives"]]
    for label, k in [("**Total backup occurrences**", "backups"), ("**Overall, including copies**", "combined_occurrences")]:
        a = s[k]; rows.append([label, a["total"], a["incorrect"], a["correct"], a["undecided"]])
    md += table(["Pack", "Occurrences", "Incorrect", "Correct", "Undecided"], rows)
    d = s["finding_dispositions"]
    md += (f"The **{sum(d.values())} grouped findings** comprise **{d.get('confirmed',0)} confirmed**, "
           f"**{d.get('clarification',0)} clarifications** and **{d.get('runtime_candidate',0)} runtime-dependent candidates**. "
           "Only confirmed findings enter the incorrect counts below.\n\n")
    md += "### Confirmed errors by class\n\nClasses are **multi-label**: totals across rows must not be added. Record counts are deduplicated within each class. Worked text is separated from mathematical targets and PRT logic.\n\n"
    md += table(["Error class", "Grouped findings", "Standalone records", "Backup occurrences"],
                [[c["label"], c["findings"], c["standalone_records"], c["backup_records"]] for c in s["error_classes"]])
    md += "### Are PRTs especially error-prone? {#prt-statistics}\n\n"
    p = s["prt"]
    pct = 100 * p["confirmed_affected_standalone_records"] / p["eligible_standalone_records"]
    share = 100 * p["confirmed_affected_standalone_records"] / p["standalone_incorrect_stack_records"]
    md += (f"**{p['confirmed_grouped_findings']} confirmed grouped findings concern PRT logic**, affecting "
           f"**{p['confirmed_affected_standalone_records']} standalone STACK records** and **{p['confirmed_affected_backup_records']} explicitly identified backup occurrences**. "
           f"Among the **{p['eligible_standalone_records']:,} standalone STACK records containing a PRT definition**, "
           f"the observed affected fraction is **{pct:.1f}%**. Among the **{p['standalone_incorrect_stack_records']} standalone STACK records with any confirmed defect**, "
           f"**{share:.1f}%** have a confirmed PRT logic defect. These are question-level counts, not counts of faulty trees or nodes.\n\n")
    md += ("**The audit demonstrates recurring PRT failure mechanisms, but does not establish that PRTs are more error-prone than other components.** "
           "The screen was not a uniform, exhaustive component-by-component review, and no representative native test campaign was run. "
           "Wrong ordinary model answers, invalid random instances and incorrect MCQ keys are not relabelled as PRT logic errors merely because they affect grading. "
           "A fair comparison needs matched questions, explicit review of each component, comparable testing and independently checked positive cases. "
           f"The **{pct:.1f}%** is an observed lower bound on the fraction of eligible standalone records affected by PRT defects, not an estimate of the true error rate. "
           f"The **{share:.1f}%** is a descriptive share among currently identified incorrect STACK records; it can move in either direction as additional defects are found.\n\n")
    md += table(["Pack", "STACK with PRT", "Confirmed PRT-affected", "STACK with any confirmed defect"],
                [[x["pack"], x["prt_eligible"], x["prt_incorrect"], x["stack_incorrect"]] for x in s["packs"]])
    md += "PRT classes also overlap. The table counts confirmed mechanisms only; runtime-dependent inversion behaviour in HL-14 is excluded from the PRT numerator.\n\n"
    md += table(["PRT error class", "Grouped findings", "Standalone records", "Backup occurrences"],
                [[c["label"], c["findings"], c["standalone_records"], c["backup_records"]] for c in s["prt_classes"]])
    md += ("Download the [statistics and definitions](data/statistics.json), [explicit finding-to-record classifications](data/classifications.json), "
           "[standalone verdict ledger](data/coverage.csv) and [backup verdict ledger](data/archive-coverage.json). "
           "Class definitions and exact contributing finding IDs are included in the statistics JSON; classifications are editorial coding of the existing evidence, not additional native runs.\n\n")
    return md

def export_statistics(src, findings):
    data = src / "data"
    with (data / "coverage.csv").open(newline="", encoding="utf8") as f:
        records = list(csv.DictReader(f))
    backups = json.loads((data / "archive-coverage.json").read_text(encoding="utf8"))
    classification = json.loads((src / "classifications.json").read_text(encoding="utf8"))
    assert classification["source_sha"] == json.loads((data / "source-manifest.json").read_text())["commit"]
    stats = analyze(records, backups, findings, classification)
    with (data / "coverage.csv").open("w", newline="", encoding="utf8") as f:
        w = csv.DictWriter(f, fieldnames=list(records[0])); w.writeheader(); w.writerows(records)
    (data / "archive-coverage.json").write_text(json.dumps(backups, ensure_ascii=False, indent=2), encoding="utf8")
    (data / "statistics.json").write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf8")
    (data / "classifications.json").write_text(json.dumps(classification, ensure_ascii=False, indent=2), encoding="utf8")
    (src / "_statistics.md").write_text(render_overview(stats), encoding="utf8")
    for finding in findings:
        finding["classification"] = next(c for c in classification["findings"] if c["id"] == finding["id"])
    (data / "findings.json").write_text(json.dumps(dict(source_sha=classification["source_sha"], findings=findings), ensure_ascii=False, indent=2), encoding="utf8")
    return stats

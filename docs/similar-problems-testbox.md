# Similar problems combined testbox

`pages/similar-problems.qmd` contains a symbolic derivative, fixed matrix inverse,
and trusted independence checker with a hard five-coordinate limit. Progress is
enabled so the combined Settings and question-navigation UI can be reviewed.
Optional variant approval is explicit and confined to this testbox.

Package pin: `d55a37a0f204a62ce8a752998c10345e5efc4d2f`.
Components: ctm-libs `b7c8e50`, math-exercise `0f8291d`, ctm-checkers `16de388`.
G2 is based directly on ctm-libs PR48 head `53579c8`; this preview includes its
complete saved-answer Settings panel and compact navigator. PR46 targets PR48's
branch, keeping its diff focused. AC merges PR48 before G2; then retarget/rebaseline
and compare the resulting tree to the tested head before merging the next PR.

The dedicated GitHub Actions workflow installs the exact package pin with the
normal installer, builds this page with Quarto 1.8.27, and publishes only the
`similar-problems-pr-28` subtree. Existing course pages are preserved. Provenance
is published as `similar-problems-build.json`. No feature branch is merged and no
tag is created by this workflow. AC explicitly authorized public publication.

The actual combined sources pass all 33 practice browser tests, including real
Pyodide, checking/feedback, restore without AI/Python, cancel, reports/disputes,
copy/export, keyboard/mobile controls, and exam/AI-off gates. New combined-page
cases verify that saved-answer controls are inside shared Settings, practice saves
preserve original navigation credit, and practice-only work leaves the original
unattempted after reload. The shared Settings Chromium fixture and DOM/store suites
also pass. The key/notation/hostile native suite has 96 passing checks.

For manual use, configure Direct API and the two fetched-model dropdowns through
Settings. Open Similar problem, choose a direction, check an answer and request
feedback. More contains “I think the expected answer is wrong” and Remove.
Reports are local; creating another problem retains the reported one. Generated
practice follows the original grading rules and does not count toward its score.

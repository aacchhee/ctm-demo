# Review and approve variants in GitHub

You do not need a terminal. On a pull request that changes a question, the
**Variants** workflow generates and tests review records. A bot comment for each
question links to its review page and lists the candidates with their test results.

- Open **Preview card** to inspect the question, worked solution and teacher
  answer. The student preview includes the normal Check controls.
- Tick individual candidates in the bot's comment, or tick **Approve all passing
  variants of this question**. GitHub repository write access is required.
- The bot records decisions on the same pull-request branch and explicitly starts
  checks for that new commit. Wait for **variants / check** on the new head.
- To reject a numbered candidate, edit the same bot comment and add
  `/variants reject 3 "reason"`. For a new candidate, the review page can export
  the complete manifest through **Copy file** and **Open in GitHub editor**.
- **Generate 25 more** opens GitHub's Actions form with the exact branch, pull
  request, head and question inputs to use. New candidates need their own approval.

**Until the approval workflow is reworked (AC, 26 October), decisions can be
lost.** Avoid it as follows:

- Only ticks in the bot's comment on an **open** pull request record
  decisions. The review page previews and exports; it records nothing. Ticks
  on a merged or closed pull request are refused ("recording requires an open
  same-repository PR"), so questions still waiting for decisions get fresh
  checklists on the next open pull request.
- Tick one checklist at a time. Ticks in quick succession share one queue, and
  a queued decision can be cancelled while the boxes stay ticked: after each
  tick, wait for the bot's recording commit and a green **variants / check**
  on that new head.
- Merge only after the last recording commit is on the branch and its
  **variants / check** is green. Merging earlier loses the decisions.
- The checklists appear only when the pull request changes a `.qmd` file or
  `_variants/`; otherwise start the **Variants** workflow by hand for the
  exact head.

Approvals apply only to the exact tested candidate and content hash. Changing a
question may require another review; existing approvals are retained when their
mathematics and rendered content stay current. Unapproved questions block student
publication, while their review pages remain available separately.

## Automated regression

[Variants automated approval regression](https://github.com/aacchhee/ctm-demo/actions/workflows/variants-integration.yml)
runs on pull requests and main. It generates 25 actually tested candidates for a
disposable question, processes the bot's bulk-approval format, records all 25,
renders the approved student payload, rejects stale or unauthenticated decisions,
and generates another batch without changing the existing approvals. It needs
no manual approvals and does not edit the course's manifests.

A course with no native variant questions has no approval requirement. The
regression also discovers a variant-free course with ordinary mathematics and
Python exercises and verifies that generation is never called, no manifest is
created and the approval check passes. This keeps ordinary Ingmat3a CI independent
of the variants authoring flow.

The repeatable regression uses the real native generator, checklist planner,
leased writer, approval gate and Quarto renderer. It does not call GitHub to make
teaching decisions. Live comment recording and exact-head workflow dispatch are
verified separately during installation.

## Tooling provenance

The three bot workflows use the reviewed templates from
[ctm-checkers](https://github.com/Erasmus-CTM/ctm-checkers/tree/cf6570b13f92d17a437fe5a61cd103c84adf7f1e/templates).
The trusted package is a deterministic snapshot of the four required extensions
from the course's existing seven immutable component refs. Its archive and every
member have recorded SHA-256 digests, and the upstream AGPL licence is retained.
The package does not change the course's dependency tuple or checker wheels.

The producer inventory binds that complete archive, its receipt, configuration,
workflow and bootstrap scripts to the default branch. Privileged jobs use only
that checkout and validate the exact PR head and artifact digest. They do not
run pull-request code. Preview and main publishing share a repository-wide Pages
lock and preserve existing preview directories.

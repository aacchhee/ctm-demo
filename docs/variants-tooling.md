# Trusted variants tooling

Moved from the README (19 November 2026); the state described is that of 24 October 2026.

The trusted variants package is a native review tool, separately inventoried in
`.github/variants-tooling/package.json`. Its `sources` always retain the seven
frozen student-package commits. Version 1 contains that canonical package;
version 2 may replace only `math-exercise/variants-review.py` for a reviewed
native exporter correction. Version 3 retains that exporter correction and adds
only `ctm-checkers/native-authoring/ctm_variants/github_bot.py` for the bot's
post-commit head-readiness check, plus the mechanically derived `native.json`
inventory entry for that file. `nativeReviewOverrides` records each immutable
upstream commit, Git blob, source path, canonical base commit/digest and replacement
digest. The bot override also records its canonical base byte length. The
bootstrap reconstructs the original native inventory using the base length and
digest, checks its hash against the canonical receipt, and verifies the complete
native source closure before installation. The embedded resolved record
describes the canonical **base**, with the
explicit native overrides recorded separately; it does not describe a full
component upgrade. Runtime files, wheels and ordinary site pins stay unchanged.

Rebuilding version 2 requires `build-variants-tooling.py --package BASE_PACKAGE
--native-review-source MATH_GIT_CHECKOUT --native-review-commit FULL_REVIEWED_SHA`.
Version 3 additionally requires `--native-bot-source CHECKERS_GIT_CHECKOUT
--native-bot-commit FULL_REVIEWED_SHA`. The builder verifies the complete base
before reading the exact upstream commits; the bootstrap verifies the complete
final inventory and exactly the allowlisted overrides before writing any file.
Merge the reviewed course change before running the default-branch trusted
producer. Do not load tooling from an authored PR, edit
saved proposals/history, or treat generated review output as teaching approval.
The trusted default-branch producer fingerprint is the security anchor: archive
schema checks reject inconsistent metadata, rather than authenticating arbitrary
replacement manifests supplied by an attacker.

24 October: native tooling retains the exporter correction from
[math-exercise PR35](https://github.com/Erasmus-CTM/math-exercise/pull/35), immutable
commit `c2ad38ea9fd26e03dc21c57f9f56a1a9305b9466`, and adds the post-commit readiness
correction from [ctm-checkers PR33](https://github.com/Erasmus-CTM/ctm-checkers/pull/33),
immutable commit `efab7ad96bedb405ed3a71862018b0bc9cda628f`. The bot retries only a
brief stale PR-head projection after its atomic commit, then requires the exact
new branch ref before dispatching validation. Relative to the exporter-only
package, exactly two of the 112 archived files change: the bot and its derived
native inventory. The other 110 files,
all seven base pins and saved course records remain unchanged. These native-tool
corrections do not upgrade student package `503c868` or grant teaching approvals.

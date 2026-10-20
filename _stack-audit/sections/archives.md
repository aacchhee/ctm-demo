## Legacy Moodle backup records

Four MBZ archives contain 753 record occurrences, including 682 STACK records. Core-field comparison identified 485 STACK occurrences matching standalone definitions and 197 additional or changed legacy occurrences. The latter received compact source screening and candidate review; the 71 non-STACK records were inventoried only. Core equality covers prompt, variables and PRT fields, not every input and feedback field. These are archive occurrences, not necessarily unique designs. The findings identify internal questions.xml ordinals, IDs and extracted line numbers; those line numbers are not GitHub anchors. Native imports and grading remain to be run.

### ARC-01: Circle area uses diameter as radius {#arc-01}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [STACK-demo.mbz](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/STACK-demo.mbz)

**Problem and witness.** Internal questions.xml record 140, ID 29389, Diagnostic_GEO-CRC_1 (extracted line 34705) asks for the area of a circle of diameter n but targets pi*n^2. At n=2 the area is pi, while the key is 4*pi.

**Proposed repair.** Target pi*n^2/4.

**Regression cases to add.** Accept pi and reject 4*pi at diameter 2; retain equivalent exact forms.

### ARC-02: Signed integral is labelled geometric area {#arc-02}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [STACK-demo.mbz](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/STACK-demo.mbz)

**Problem and witness.** Record 145, ID 29394, Diagnostic_INT-AUC_1 (line 35961) grades a signed integral as area without ensuring nonnegativity. Allowed a=1,b=2,c=2,d=-3,m=2,n=3 gives p(x)=2*x^2-3*x^3, negative on [1,2]. Its integral is -79/12; geometric area is 79/12.

**Proposed repair.** Ask for signed integral, constrain the generator, or integrate the absolute value after splitting at roots.

**Regression cases to add.** Test negative, positive and sign-changing functions and verify area is nonnegative.

### ARC-03: Rearrangement key belongs to another equation {#arc-03}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [STACK-demo.mbz](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/STACK-demo.mbz)

**Problem and witness.** Record 486, ID 29727, AlgMap-11.6 (line 121971) presents a=b+x/c but targets (a-c)/(d+b). The correct rearrangement is x=c*(a-b), for c nonzero. At a=5,b=1,c=2 it is 8; the key contains unrelated d.

**Proposed repair.** Derive the target from the displayed equation and state c nonzero.

**Regression cases to add.** Substitute correct and old targets into the original relation; accept equivalent forms.

### ARC-04: Zero coefficients count as evidence of linear dependence {#arc-04}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [STACK-demo.mbz](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/STACK-demo.mbz)

**Problem and witness.** Record 691, ID 29931, Evidence for linear dependence (line 171780) checks only that a coefficient-weighted vector sum is zero. All-zero coefficients pass, although dependence requires a nontrivial relation.

**Proposed repair.** Require at least one nonzero coefficient before credit.

**Regression cases to add.** Reject all zeros; accept the constructed nontrivial relation (n1,n2,-1).

### ARC-05: Nonlinear sequences pass arithmetic-sequence tests {#arc-05}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [STACK-demo.mbz](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/STACK-demo.mbz)

**Problem and witness.** Record 709, ID 29948, 9.2.1 Give examples properties (line 176366) inspects coefficients of n and the constant term without requiring an affine sequence. Consequently n+n^2 passes as increasing arithmetic and n^2-n passes as decreasing arithmetic.

**Proposed repair.** Require an affine reconstruction or a constant first difference, then check its sign.

**Regression cases to add.** Reject both nonlinear examples and accept genuine arithmetic sequences of each requested direction.

### ARC-06: Distant sign samples do not prove an inflection {#arc-06}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [STACK-demo.mbz](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/STACK-demo.mbz)

**Problem and witness.** Record 701, GiveExamples, PRT3 checks a zero second derivative and opposite signs at fixed offsets 0.1. Put h=x-pt2 and g=h^4*(h+1/20). Then g''=h^2*(20*h+3/5) is positive on both sides sufficiently near h=0, so there is no inflection there. At h=-0.1 and +0.1 it is -7/500 and 13/500, satisfying the sampled test and earning full PRT credit.

**Proposed repair.** Use local sign analysis, or restrict the response class and test the relevant odd multiplicity.

**Regression cases to add.** Reject this g and h^4; accept h^3. Check the local neighbourhood rather than only two distant samples.


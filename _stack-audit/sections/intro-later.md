## Introductory Mathematics, weeks 6–10

**Pinned source:** `maths/moodle-qtype_stack` at `33383047af39c204bf4442802a058f8b918b2b1b`.

**Actual coverage and depth:** 551 noncategory XML questions received a static source-summary screen of question formulations, question variables and PRT definitions: week 6: 100; week 7: 106; week 8: 118; week 9: 101; week 10: 126. These comprise 398 STACK questions, 149 descriptions and 4 ordinary multiple-choice questions. The 19 primary findings below received closer source review and explicit mathematical witnesses; five further findings group 23 concrete text corrections by week. The screen is not a proof that every remaining question, variant, feedback sentence or accepted expression is correct.

**Execution limits:** No Moodle import, STACK/Maxima execution, deployed-seed replay or interactive question rendering was performed by this worker. Embedded base64 images were omitted from the text extraction. Allowed variable assignments below are mathematical fixtures, not seed numbers that were executed. Expected PRT paths are deductions from source; native response traces remain proposed regressions. Coverage gaps caused by loss of the original host were closed using pinned GitHub source reads before reporting this scope.

### IL-01 — Intersection coordinates are graded independently {#il-01}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [6-1-14-(Find-intersection-points-of-circle-and-line).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-1-14-(Find-intersection-points-of-circle-and-line).xml>).

**What is wrong:** Each of four PRTs accepts either sign of its coordinate. No check preserves the pairing of x and y, or requires both intersections.

**Witness:** For y=3x and x²+y²=20, submit (sqrt(2),-3*sqrt(2)) and (-sqrt(2),3*sqrt(2)). Every coordinate comparison passes, although neither pair lies on the line. Repeating (sqrt(2),3*sqrt(2)) twice also passes.

**Repair:** Compare the unordered set of ordered pairs with the true set, or check both equations for each pair and enforce distinctness when there are two intersections.

**Proposed native regression:** At the fixed variables already in this question, accept the two true points in either order; reject mixed signs and duplicate points. Record validation and all four PRT outcomes.

### IL-02 — A fixed point receives full credit as a circle parametrization {#il-02}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [6-3-9-(Parametrize-circle).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-3-9-(Parametrize-circle).xml>); [PT-6-10-(Parametrize-circle).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/PT-6-10-(Parametrize-circle).xml>).

**What is wrong:** The full-credit test checks only (ans1-p)²+(ans2-q)²=r². This establishes circle membership, not that the image covers the circle.

**Witness:** ans1=p+r and ans2=q satisfy the identity while tracing only one point.

**Repair:** Either change the task to finding expressions that satisfy the circle equation, or specify a manageable parametrization family and verify full-circle coverage. Nonconstancy alone is insufficient because a proper arc also satisfies the identity.

**Proposed native regression:** For an explicit centre/radius fixture, accept the usual sine/cosine parametrization and reversed orientation. Reject the constant point and a parametrization whose image is a proper arc.

### IL-03 — Chord generator admits impossible geometry {#il-03}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [6-2-11-(Find-length-of-a-chord).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-2-11-(Find-length-of-a-chord).xml>); [6-2-12-(Find-length-of-a-chord-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-2-12-(Find-length-of-a-chord-2).xml>).

**What is wrong:** Diameter dd and AB are sampled independently, then a chord half-length is computed as sqrt(rr²-(rr-AB)²).

**Witness:** dd=1, rr=1/2, AB=2 are allowed and give radicand -2. There is no real chord length.

**Repair:** Generate a positive radius and 0<AB<rr if A lies between B and C as shown; derive the diameter. In feedback, label the computed square root AF rather than the radius CF.

**Proposed native regression:** Reject the displayed draw. Check edge draws satisfy the diagram, have a positive real chord, and give EF<=dd. Verify that initialization never attempts a negative square root.

### IL-04 — Two requested equations can be replaced by the same equation twice {#il-04}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [7-0-13-(Two-linear-sim-eqns-worded).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-13-(Two-linear-sim-eqns-worded).xml>); [7-0-14-(Two-linear-sim-eqns-worded-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-14-(Two-linear-sim-eqns-worded-2).xml>); [7-0-3-(Encoding-info-in-simultaneous-equations).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-3-(Encoding-info-in-simultaneous-equations).xml>); [7-0-4-(Encoding-info-in-simultaneous-equations-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-4-(Encoding-info-in-simultaneous-equations-2).xml>); [7-0-5-(Encoding-info-in-simultaneous-equations-3).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-5-(Encoding-info-in-simultaneous-equations-3).xml>).

**What is wrong:** Each equation field independently accepts either target equation; nothing requires the pair to represent both pieces of information.

**Witness:** Enter eqn1 into both answer fields. Each equation PRT accepts it, even though the second condition is missing.

**Repair:** Grade the unordered pair collectively, preserve the intended variable meanings, and require both distinct conditions.

**Proposed native regression:** Accept either ordering of the two true equations. Reject a duplicated equation. Include one-correct/one-incorrect input and verify the intended partial-credit policy.

### IL-05 — Word-problem generation does not guarantee a positive unique solution {#il-05}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [7-0-13-(Two-linear-sim-eqns-worded).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-13-(Two-linear-sim-eqns-worded).xml>); [7-0-14-(Two-linear-sim-eqns-worded-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-14-(Two-linear-sim-eqns-worded-2).xml>).

**What is wrong:** All four play/cable counts and both totals are independent. The source indexes solve(...)[1] without checking existence or positivity.

**Witness:** ww1=ww2=ss1=ss2=1, tt1=30, tt2=20 gives x+y=30 and x+y=20, an inconsistent system.

**Repair:** Generate positive durations or lengths first, choose a nonsingular count matrix, and derive the totals.

**Proposed native regression:** Reject the inconsistent fixture; assert nonzero determinant and positive solved quantities across generation. Replay a valid fixture through all PRTs.

### IL-06 — A nonintersection pair earns full solution credit {#il-06}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [7-1-16-(One-cubic-one-linear-sim-eqn-).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-1-16-(One-cubic-one-linear-sim-eqn-).xml>).

**What is wrong:** The x and y coordinates of a requested single solution are independently compared against the three true intersections.

**Witness:** Targets are (-3,-9),(-1,1),(2,16). Enter x=-3,y=16: both coordinates appear in their respective lists, so the PRT adds both halves although the pair is not an intersection.

**Repair:** Grade the ordered pair against the set of true pairs. Also require the two graph-equation fields to contain both graph definitions.

**Proposed native regression:** Accept each true pair; reject (-3,16),(-1,-9),(2,1). Check duplicated graph equations do not earn full equation credit.

### IL-07 — Linear programming uses infeasible vertices and ignores unboundedness {#il-07}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [7-2-4-(Linear-programming-1).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-2-4-(Linear-programming-1).xml>); [7-2-5-(Linear-programming-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-2-5-(Linear-programming-2).xml>); [7-2-6-(Linear-programming-3).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-2-6-(Linear-programming-3).xml>); [PT-7-10-(Linear-programming-1).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/PT-7-10-(Linear-programming-1).xml>).

**What is wrong:** Every boundary pair is solved and objective values are sorted without checking the other inequalities, boundedness, or parallel boundaries.

**Witness:** Allowed coefficients give objective x+y with x+y<=6, x-2y>=1, 2x-y<=1. Pairwise objective values are 6,6,0, so the source chooses maximum 6 and minimum 0. Actual maximum is 0 at (1/3,-1/3); feasible (-t,-t), t>=1 makes the objective tend to minus infinity. Both objective-6 vertices are infeasible.

**Repair:** Construct bounded nonempty feasible polygons deliberately, or implement feasibility and unboundedness checks before producing model answers. Handle coincident or parallel boundaries.

**Proposed native regression:** Replay these coefficients and confirm no finite minimum, maximum 0. Add a bounded triangle. Check every candidate vertex against every constraint before grading.

### IL-08 — Incompatible matrix products have no none-answer branch {#il-08}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [7-3-18-(Multiplying-matrices).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-18-(Multiplying-matrices).xml>).

**What is wrong:** The prompt says to enter none when multiplication is impossible, but mat1 and mat2 are sampled independently and ta1 is set to mat1.mat2 unconditionally.

**Witness:** Choose aa, a 4×3 matrix, for both operands. The product 4×3 times 4×3 is undefined. No branch sets the promised model answer none. Actual Maxima initialization behavior has not been run.

**Repair:** Check inner dimensions before multiplying; set ta1:none for incompatible shapes and permit that token in the input.

**Proposed native regression:** Test every pair of available shapes. Accept none for 4×3 times 4×3 and the calculated result for 3×4 times 4×3; capture initialization errors as well as response scores.

### IL-09 — Random inverse questions include singular matrices {#il-09}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [7-3-21-(Inverse-of-2-by-2-matrix).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-21-(Inverse-of-2-by-2-matrix).xml>); [7-3-22-(Inverse-of-2-by-2-matrix-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-22-(Inverse-of-2-by-2-matrix-2).xml>); [7-3-23-(Inverse-of-2-by-2-matrix-3).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-23-(Inverse-of-2-by-2-matrix-3).xml>).

**What is wrong:** The four entries are sampled independently and invert is called without checking the determinant.

**Witness:** All four entries equal to 1 is allowed. The resulting matrix has determinant zero and no inverse. Actual runtime exception wording is unverified.

**Repair:** Use a nonsingular generator or resample determinant-zero draws. Alternatively ask learners to identify and grade singular cases explicitly.

**Proposed native regression:** Reject the all-ones draw if an inverse is required; for valid draws verify both identity products and replay the model answer.

### IL-10 — n+c/n is incorrectly labelled increasing {#il-10}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [8-0-15-(Given-sequence,-decide-its-properties-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/8-0-15-(Given-sequence,-decide-its-properties-2).xml>).

**What is wrong:** The generator selects c in 2..5 and always labels n+c/n Increasing, under a preceding strict-increase definition.

**Witness:** For c=4 the first terms are 5,4,13/3: the sequence first decreases, then increases. For c=2, u1=u2=3, so it is not strictly increasing either.

**Repair:** Correct the label or change the coefficient range or starting index, explicitly stating the index convention.

**Proposed native regression:** For c=2 test the initial equality; for c=3,4,5 test the initial decrease and later increase. Require the intended classification, not eventual monotonicity.

### IL-11 — Arithmetic-sequence PRTs ignore higher powers {#il-11}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [8-0-18-(Give-examples-with-properties).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/8-0-18-(Give-examples-with-properties).xml>); [PT-8-11-(Give-examples-with-properties).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/PT-8-11-(Give-examples-with-properties).xml>).

**What is wrong:** The form check tests only whether coefficients of n^0 and n^1 are constant. It does not test that the answer equals an affine reconstruction.

**Witness:** n+n² passes the increasing arithmetic field: its extracted linear coefficient is 1. n²-n passes both decreasing and bounded-above arithmetic fields: its extracted linear coefficient is -1. These are not arithmetic sequences, and the latter is not decreasing or bounded above.

**Repair:** First establish that the response equals a+d(n-1) for constants a,d, or prove its first difference is constant; only then test the sign of d.

**Proposed native regression:** Accept n,-n,1 in the appropriate fields; reject n+n²,n²-n,1/n. Test all subparts independently through native input validation and PRT scoring.

### IL-12 — Divergent geometric series has a finite model sum {#il-12}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [8-3-11-(Which-geo-series-have-a-sum-).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/8-3-11-(Which-geo-series-have-a-sum-).xml>).

**What is wrong:** When a1=1 the generator deliberately chooses r1 from 2,3,4,5, but tasum1 remains a1/(1-r1).

**Witness:** a1=1,r1=2 displays 1+2+4+... . The model sum is -1, although the terms do not tend to zero and the requested answer should be none.

**Repair:** Set tasum1:none when abs(r1)>=1; apply the geometric sum formula only when abs(r1)<1.

**Proposed native regression:** Accept none for r1=2..5, reject -1 for r1=2, and retain finite-sum tests for a1=2..5. Check both ratio and sum response trees.

### IL-13 — Recurrence divergence is asserted without initial data {#il-13}

**Priority:** Medium. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [8-3-6-(Does-limit-exist-limit-from-recurrence-relation-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/8-3-6-(Does-limit-exist-limit-from-recurrence-relation-2).xml>).

**What is wrong:** The source samples aa>=1,bb>0 and sets none for the limit but does not provide an initial value.

**Witness:** Allowed aa=3/2,bb=1 with u0=-2 produces u_n=-2 for every n, so a limit exists.

**Repair:** Specify an initial value, such as u0=0, or assume nonnegative initial data. Alternatively handle the exact fixed-point exception explicitly.

**Proposed native regression:** Compare a nonfixed start with bb/(1-aa) for aa>1, and test aa=1 separately. Ensure the prompt and model agree on the initial-data assumption.

### IL-14 — MATHEMATICS permutations count repeated letters as distinct {#il-14}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [9-1-8-(Permutations-of-mathematics).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-09---The-Binomial-theorem/9-1-8-(Permutations-of-mathematics).xml>); [9-1-10-(Restricted-permutations-of-mathematics).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-09---The-Binomial-theorem/9-1-10-(Restricted-permutations-of-mathematics).xml>).

**What is wrong:** The models use falling factorials, but the question counts letter words and MATHEMATICS has M,A,T twice each.

**Witness:** One-letter words are graded as 11, although there are only 8 distinct letters. Three-letter words beginning M and ending S are graded as 9, although only 7 different middle letters remain after the fixed letters are removed.

**Repair:** Count multiset words, or replace MATHEMATICS by a word with distinct letters and state that repetition is forbidden.

**Proposed native regression:** Check rr=1 gives 8, restricted rr=3 gives 7, and a full-word rearrangement gives 11!/(2!2!2!).

### IL-15 — Constant-speed model answer is ten times too large {#il-15}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [10-0-2-(Constant-rate-of-change).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-0-2-(Constant-rate-of-change).xml>).

**What is wrong:** The table increases distance by 90 metres in 30 seconds. ta:30 is used for both gradient and speed.

**Witness:** Times 0,30,60,90,120 correspond to distances 0,90,180,270,360. The slope is 3 m/s. Correct response 3 is rejected and 30 is accepted. Feedback writes (180-90)/30=ta.

**Repair:** Change ta to 3, update expected outcomes, and correct the stray jogger/car wording.

**Proposed native regression:** Both fields equal to 3 must receive full credit; both equal to 30 must receive zero.

### IL-16 — Limit instruction and displayed limit have opposite signs {#il-16}

**Priority:** Medium. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [10-0-12-(Finding-limits-quadratic-over-linear).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-0-12-(Finding-limits-quadratic-over-linear).xml>).

**What is wrong:** Prose asks x approaching -bb, while the answer line and model use x approaching bb.

**Witness:** With aa=1,bb=2, f=(x+1)(x-2)/(x-2). The prose answer is -1; the displayed-limit answer and model are 3.

**Repair:** Use bb consistently if the intended aim is cancellation at the removable singularity, or change the model and notation to -bb.

**Proposed native regression:** Check prose, displayed limit and model evaluation refer to the same point for every draw.

### IL-17 — ODE coefficient generator can make a coefficient nonunique {#il-17}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [10-2-5-(ODE).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-2-5-(ODE).xml>); [10-2-6-(ODE-2).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-2-6-(ODE-2).xml>); [PT-10-10-(ODE).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/PT-10-10-(ODE).xml>).

**What is wrong:** The gamma exclusion uses -2*(a+b), whereas the factor that must remain nonzero is 2*alpha+2*beta+gamma. The PRT compares against only the randomly chosen a.

**Witness:** Allowed a=1,b=1,c=2,alpha=-3,beta=2,gamma=2 gives RHS 4x+4 and zero multiplier on the quadratic coefficient. Both f=x²+x+2 and f=2x²+x+2 satisfy the ODE, but the latter a is rejected. The feedback divides 0 by 0.

**Repair:** Generate gamma excluding -2*(alpha+beta), or grade the substituted ODE identity and explicitly permit nonuniqueness.

**Proposed native regression:** For this fixture accept every a with b=1,c=2, or reject the draw if uniqueness is required. Assert all coefficient denominators are nonzero for unique-answer variants.

### IL-18 — Stationary-point parameter can require division by zero {#il-18}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [10-2-26-(Solve-for-cubic-coeff-given-stat-point).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-2-26-(Solve-for-cubic-coeff-given-stat-point).xml>); [PT-10-11-(Solve-for-cubic-coeff-given-stat-point).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/PT-10-11-(Solve-for-cubic-coeff-given-stat-point).xml>).

**What is wrong:** The model divides by 2*B*p+C without excluding zero.

**Witness:** Allowed A=2,B=-1,C=2,p=1 makes the derivative at 1 equal to 6 for every a. No solution exists, but the source computes -6/0.

**Repair:** Generate parameters with 2*B*p+C!=0, or supply and grade a no-solution option.

**Proposed native regression:** Reject this draw for a finite-answer exercise. For each valid draw verify f'(p)=0 after substituting the model parameter.

### IL-19 — Counterexample witness may lie outside the required interval {#il-19}

**Priority:** High. **Status:** source-confirmed mathematical or PRT defect; native execution remains proposed.

**Source:** [10-3-35-(Give-example-of-fn-with-nonneg-integral).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-3-35-(Give-example-of-fn-with-nonneg-integral).xml>).

**What is wrong:** The PRT checks f(ans3)<0 without constraining ans3 to [0,1].

**Witness:** ans1=x, ans2=1/2, ans3=-1 satisfies the full-credit path, although x is never negative on [0,1] and hence is not the requested counterexample.

**Repair:** Require 0<=ans3<=1 before accepting the negative-value witness; also ensure the proposed function is defined and integrable on the interval.

**Proposed native regression:** Reject (x,1/2,-1); accept (-x+3/4,1/4,7/8). Include endpoints and an interior valid witness.

### IL-20 — Week 6 formulation and worked-solution corrections {#il-20}

**Priority:** Medium. **Status:** source-confirmed textual mathematical defects, with arithmetic/algebraic witnesses below; no native render was executed.

**Source, witness and repair:**

- [6-0-1-(What-is-a-circle-).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-0-1-(What-is-a-circle-).xml>): Defines pi as circumference divided by radius. Replace by circumference divided by diameter: C/(2r)=pi, whereas C/r=2pi.
- [6-1-1-(Centre-and-radius-of-circles).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-1-1-(Centre-and-radius-of-circles).xml>): The expanded equation contains 2fxy instead of 2fy+c. Correct to x²+y²+2gx+2fy+c=0 before deriving the centre/radius formula.
- [6-1-16-(Finding-equation-of-tangents-to-circles).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-1-16-(Finding-equation-of-tangents-to-circles).xml>): From y-1=(x+2)/4 the solution concludes 4y-x=6. Correct to 4y-x=2; the contact point (-2,1) fails the printed final equation.
- [6-3-1-(Introduction-to-parametric-curves).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-3-1-(Introduction-to-parametric-curves).xml>): Calls x²+y²=9 a two-variable function z=f(x,y). Distinguish the level set from the function f(x,y)=x²+y².
- [6-4-4-(Application---Circular-motion-in-physics).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/6-4-4-(Application---Circular-motion-in-physics).xml>): Uniform circular motion is described as zero acceleration, and F=m+v²/R is printed. Correct to inward a=v²/R and F=m*v²/R. Remove the claim that an outward force cancels an inward force in this inertial-frame account.
- [PT-6-1-(Point-on-a-circle).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-06---The-Circle/PT-6-1-(Point-on-a-circle).xml>): Feedback says 4+36=26<30 then concludes outside. Correct the calculation to 40>30, hence outside. The selected conclusion is correct; the supporting arithmetic is not.

**Proposed native regression:** After correcting the source, render each affected question and its general feedback at fixed variables. Check the displayed formula, substituted arithmetic, final conclusion and diagram against an independently calculated result. Where a PRT shares the same model expression, add explicit correct/incorrect STACK question tests; text-only description questions require rendered review rather than a score assertion.

### IL-21 — Week 7 formulation and worked-solution corrections {#il-21}

**Priority:** Medium. **Status:** source-confirmed textual mathematical defects, with arithmetic/algebraic witnesses below; no native render was executed.

**Source, witness and repair:**

- [7-0-1-(What-are-simultaneous-equations-).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-1-(What-are-simultaneous-equations-).xml>): Claims a full circle can be rearranged as y=sqrt(r²-x²). This is only the upper semicircle; use two branches y=±sqrt(r²-x²) or retain the implicit relation.
- [7-0-16-(Example-of-solving-sim-eqns-with-one-lin-one-qud-).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-0-16-(Example-of-solving-sim-eqns-with-one-lin-one-qud-).xml>): The first worked example changes x²+2x+3 to x²-2x+3. Correct intersections with y=3x+9 are (3,18),(-2,3), not (6,27),(-1,6). In the second example, correct roots are 2,-3/2 and points (2,5),(-3/2,-2); the text changes 2 to -2 and gives inconsistent y values.
- [7-2-2-(Example-of-linear-programming-question).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-2-2-(Example-of-linear-programming-question).xml>): The final sentence calls the minimum 15 although the preceding calculation gives -15 at (-1,-3). Correct the sign.
- [7-3-15-(Commutativity-of-multiplication).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-15-(Commutativity-of-multiplication).xml>): The reverse matrix product has (1,1)=59. Row [7,8] times column [1,4] gives 39. Correct the displayed product to [[39,54,69],[49,68,87],[59,82,105]].
- [7-3-19-(Matrix-inverses).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-19-(Matrix-inverses).xml>): Calls determinant-zero matrices singular or invertible. Replace invertible by noninvertible.
- [7-3-25-(Solve-sim-eqns-with-matrix-inverse).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-07---Simultaneous-Equations/7-3-25-(Solve-sim-eqns-with-matrix-inverse).xml>): For A=[[3,2],[5,-1]], the inverse top-left entry is printed -1/13. Correct to +1/13: the full inverse is [[1,2],[5,-3]]/13 and yields the stated solution (1,2).

**Proposed native regression:** After correcting the source, render each affected question and its general feedback at fixed variables. Check the displayed formula, substituted arithmetic, final conclusion and diagram against an independently calculated result. Where a PRT shares the same model expression, add explicit correct/incorrect STACK question tests; text-only description questions require rendered review rather than a score assertion.

### IL-22 — Week 8 formulation and worked-solution corrections {#il-22}

**Priority:** Medium. **Status:** source-confirmed textual mathematical defects, with arithmetic/algebraic witnesses below; no native render was executed.

**Source, witness and repair:**

- [8-2-4-(Sigma-notation).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/8-2-4-(Sigma-notation).xml>): The stated sum 4+8+12+16+24 omits 20, but is represented by sum(4n,n=1..6), including 20. Add 20 to the original sum or change the sigma expression and total.
- [8-3-8-(Infinite-series).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-08---Arithmetic-and-geometric-sequences/8-3-8-(Infinite-series).xml>): The regrouping of 1-1+1-1+... is rewritten as 1-(1+1)-(1+1)-..., changing signs rather than grouping the same terms. Use 1+(-1+1)+(-1+1)+... for the intended contrasting grouping.

**Proposed native regression:** After correcting the source, render each affected question and its general feedback at fixed variables. Check the displayed formula, substituted arithmetic, final conclusion and diagram against an independently calculated result. Where a PRT shares the same model expression, add explicit correct/incorrect STACK question tests; text-only description questions require rendered review rather than a score assertion.

### IL-23 — Week 9 formulation and worked-solution corrections {#il-23}

**Priority:** Medium. **Status:** source-confirmed textual mathematical defects, with arithmetic/algebraic witnesses below; no native render was executed.

**Source, witness and repair:**

- [9-1-11-(Combinations).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-09---The-Binomial-theorem/9-1-11-(Combinations).xml>): The combination formula has n! in the denominator instead of r!. Correct to n!/[r!(n-r)!].
- [9-1-16-(Formal-counting).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-09---The-Binomial-theorem/9-1-16-(Formal-counting).xml>): Two-digit even numbers with distinct digits from 1..9 are counted as 4*9=36. Once the even units digit is selected, only 8 different tens digits remain: correct count 32.
- [9-4-5-(Example-of-calculating-binomial-probability).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-09---The-Binomial-theorem/9-4-5-(Example-of-calculating-binomial-probability).xml>): The intermediate calculation uses 0.1³=0.0001. Correct to 0.001. The final probability 0.0081 is correct.

**Proposed native regression:** After correcting the source, render each affected question and its general feedback at fixed variables. Check the displayed formula, substituted arithmetic, final conclusion and diagram against an independently calculated result. Where a PRT shares the same model expression, add explicit correct/incorrect STACK question tests; text-only description questions require rendered review rather than a score assertion.

### IL-24 — Week 10 formulation and worked-solution corrections {#il-24}

**Priority:** Medium. **Status:** source-confirmed textual mathematical defects, with arithmetic/algebraic witnesses below; no native render was executed.

**Source, witness and repair:**

- [10-0-6-(Limits).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-0-6-(Limits).xml>): The limit definition says f(x) becomes close to a rather than b, and the alternate notation uses x->0 rather than x->a. Align both with limit(x->a)f(x)=b.
- [10-2-14-(Normal-to-a-curve).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-2-14-(Normal-to-a-curve).xml>): The displayed normal equation uses -1/f(a) instead of -1/f'(a). Correct to y=-(x-a)/f'(a)+f(a); separately handle a horizontal tangent with vertical normal x=a.
- [10-3-3-(Understanding-Riemann-sums-(x^2+1-on-[0,1])).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-3-3-(Understanding-Riemann-sums-(x^2+1-on-[0,1])).xml>): finalans sums sampled heights but omits rectangle width Rend/n, although the displayed calculation includes that width. Multiply the height sum by Rend/n.
- [10-3-12-(Example-of-calculating-a-definite-integral).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-3-12-(Example-of-calculating-a-definite-integral).xml>): The explanation of differentiating a power says to subtract one and multiply by the new power. Multiplication is by the original power; correct the explanation.
- [10-4-4-(Example-of-solving-force-problem).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/10-4-4-(Example-of-solving-force-problem).xml>): The question asks force at t=1 but the solution uses t=3 and reports 216 N. With x=4t³-2t,m=3, the requested force is 72 N.
- [PT-10-8-(Given-enclosed-area,-find-coeff-(quadratic)).xml](<https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-10---Calculus-Concepts/PT-10-8-(Given-enclosed-area,-find-coeff-(quadratic)).xml>): The JSXGraph curve -x*(x-4) and integral range [0,4] are hard-coded, while root r1 is randomized in {2,3,4}. Draw the selected root and range; explain the vertical scaling if the figure is schematic because k is unknown.

**Proposed native regression:** After correcting the source, render each affected question and its general feedback at fixed variables. Check the displayed formula, substituted arithmetic, final conclusion and diagram against an independently calculated result. Where a PRT shares the same model expression, add explicit correct/incorrect STACK question tests; text-only description questions require rendered review rather than a score assertion.


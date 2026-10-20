## Introductory Mathematics: weeks 1–3

All 249 records in weeks 1–3 (81, 98 and 70 respectively) received compact source screening, followed by full-source checks of candidate defects. This includes explanatory mathematical text. Embedded images were omitted from the compact screen. Diagram accuracy, Maxima evaluation, input validation and native scores remain untested. The 25 entries group related files; generator tuples are allowed assignments, not recorded Moodle seeds.

### IW1-01: A quadratic generator can lose its quadratic term {#iw1-01}

**Status:** Source-proven missing generator invariant; native failure handling untested. Native execution has not been performed.

**Source:** [1-0-3-(Write-quadratic-in-standard-form-1).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-0-3-%28Write-quadratic-in-standard-form-1%29.xml), [1-0-4-(Write-quadratic-in-standard-form-2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-0-4-%28Write-quadratic-in-standard-form-2%29.xml), [PT-1-1-(Write-quadratic-in-standard-form-2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/PT-1-1-%28Write-quadratic-in-standard-form-2%29.xml)

**Problem and witness.** The leading coefficient is aa1-aa2, which can be zero: both can be 2. The resulting equation can be linear or a nonzero constant equation, despite the quadratic premise. In the first file bb is strictly positive, so cancellation leaves a linear equation. In the second file the linear coefficient can also cancel, but cc1+cc2 remains strictly positive: this produces an inconsistent constant equation, not an identity.

**Proposed repair.** Require a nonzero leading coefficient, or explicitly branch on the degree.

**Regression cases to add.** Force equal leading coefficients; retain genuine quadratics and check the degree in every generated instance.

### IW1-02: Discriminant root counts include nonquadratic draws {#iw1-02}

**Status:** Source-proven missing generator invariant; native failure handling untested. Native execution has not been performed.

**Source:** [1-0-7-(Discriminant-Negative).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-0-7-%28Discriminant-Negative%29.xml)

**Problem and witness.** aa=rand(10) can be zero. With aa=0,bb=1,cc=5 the equation is x+5=0 and has one root, while the discriminant-based label says two; aa=bb=0,cc=5 has no root although the discriminant is zero. Feedback also refers to unrelated a,b,c.

**Proposed repair.** Require aa nonzero and use the actual generated coefficient names in feedback.

**Regression cases to add.** Exercise zero leading coefficient, zero discriminant and both signs of nonzero discriminants.

### IW1-03: Factorisation tasks accept the unfactored expression {#iw1-03}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [1-1-8-(Factorising-coefficient-1-negative-roots).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-8-%28Factorising-coefficient-1-negative-roots%29.xml), [1-1-9-(Factorising-coefficient-1-positive-roots).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-9-%28Factorising-coefficient-1-positive-roots%29.xml), [1-1-13-(Factorising-coefficient-not-1-positive-roots).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-13-%28Factorising-coefficient-not-1-positive-roots%29.xml), [1-1-14-(Factorising-coefficient-not-1-negative-roots).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-14-%28Factorising-coefficient-not-1-negative-roots%29.xml), [PT-1-4-(Factorising-coefficient-not-1-negative-roots).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/PT-1-4-%28Factorising-coefficient-not-1-negative-roots%29.xml)

**Problem and witness.** The PRT uses algebraic equivalence without enforcing factor form. An unchanged expanded expression such as x^2+2*x+1 is equivalent to (x+1)^2 and can satisfy the test, without doing the requested factorisation.

**Proposed repair.** Use the appropriate factor-form answer test, with the intended coefficient domain.

**Regression cases to add.** Reject the unchanged expanded polynomial; accept equivalent reordered factors and repeated factors.

### IW1-04: Any one correct coefficient can give full coefficient-PRT credit {#iw1-04}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [1-2-14-(Solve-by-quadratic-formula-x).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-2-14-%28Solve-by-quadratic-formula-x%29.xml), [1-2-15-(Solve-by-quadratic-formula-y).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-2-15-%28Solve-by-quadratic-formula-y%29.xml)

**Problem and witness.** The coefficient PRT assigns 1 for a correct a and adds 1 for correct b and c, with zero deductions for failures. Any single correct coefficient reaches a raw PRT score of 1; all three produce a raw score of 3. The pinned [PRT implementation](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/stack/prt.class.php#L521-L525) clamps the result to [0,1], so these cases have the same full PRT score under that source logic. This concerns the coefficient tree, not all separately graded root inputs.

**Proposed repair.** Use three one-third contributions or an all-correct gate, consistent with the intended partial-credit policy.

**Regression cases to add.** Test all eight correct/incorrect patterns and assert both partial and full scores.

### IW1-05: Graph reconstruction generators admit contradictory or degenerate data {#iw1-05}

**Status:** Source-proven missing generator invariant; native failure handling untested. Native execution has not been performed.

**Source:** [1-3-14-(Equation-from-parabola-with-roots-given-evaluate-not-at-0).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-3-14-%28Equation-from-parabola-with-roots-given-evaluate-not-at-0%29.xml), [1-3-15-(Equation-from-parabola-with-vertex-given).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-3-15-%28Equation-from-parabola-with-vertex-given%29.xml), [PT-1-10-(Equation-from-parabola-with-vertex-given).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/PT-1-10-%28Equation-from-parabola-with-vertex-given%29.xml)

**Problem and witness.** In the roots-and-point task, dd=gg=hh=1 can demand both (1,0) and (1,1). In the vertex tasks, ee=ff=1 can force the leading coefficient to zero and produce a constant rather than a parabola.

**Proposed repair.** Keep the extra point away from the roots, require compatible values, and ensure a nonzero leading coefficient in the vertex construction.

**Regression cases to add.** Test coincident x-values, equal heights and the generator boundaries; substitute the resulting curve into every stated datum.

### IW1-06: Quadratic teaching text contains several false identities {#iw1-06}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [1-0-9-(Expanding-brackets).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-0-9-%28Expanding-brackets%29.xml), [1-1-1-(Factorising-Quadratics).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-1-%28Factorising-Quadratics%29.xml), [1-1-15-(Inspection).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-15-%28Inspection%29.xml), [1-1-5-(Difference-of-two-squares).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-1-5-%28Difference-of-two-squares%29.xml), [1-2-12-(Quadratic-Formula).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-2-12-%28Quadratic-Formula%29.xml), [1-3-9-(Graphs-and-completing-the-square).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-3-9-%28Graphs-and-completing-the-square%29.xml)

**Problem and witness.** Examples include (x+1)(x-2)(x+3), printed as x^3+2*x^2-7*x instead of x^3+2*x^2-5*x-6; roots -3,-2 instead of -3,2 for x^2+x-6; x(x+3) instead of x(x-3) for x^2-3*x; an extra x in the inspection factor; and lost powers in the difference-of-squares expansion. The quadratic formula needs a!=0, not a!=1. Finally x^2+8*x+25=(x+4)^2+9 cannot equal zero over the reals.

**Proposed repair.** Correct each displayed equality, coefficient restriction and real-root conclusion. Preserve any intentionally incorrect learner options, but distinguish them from teaching text.

**Regression cases to add.** Expand each proposed factorisation and completed square; substitute claimed roots and verify the quadratic-formula derivation.

### IW1-07: A-paper aspect ratio is identified with the golden ratio {#iw1-07}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [1-4-3-(Application---golden-ratio).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-4-3-%28Application---golden-ratio%29.xml)

**Problem and witness.** The similar-halves construction for A-series paper gives r=2/r and therefore r=sqrt(2), not the golden ratio.

**Proposed repair.** Separate the A-paper construction from a genuine golden-ratio construction.

**Regression cases to add.** Derive both defining equations and check that the numerical ratios differ.

### IW1-08: Stopping-distance explanation contradicts square-law scaling {#iw1-08}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [1-4-8-(Stopping-distance-proportional-to-speed-squared).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-01---Quadratic-functions-and-their-graphs/1-4-8-%28Stopping-distance-proportional-to-speed-squared%29.xml)

**Problem and witness.** The prose calls the change from speed 5 to 10 a doubling of distance, then a quadrupling, and drops the proportionality constant. If s(5)=15 and s=c*v^2, then s(10)=60, not 30.

**Proposed repair.** Retain the same proportionality constant and explain the factor of four.

**Regression cases to add.** Substitute both speeds into the same formula and compare their ratio.

### IW2-01: Quartic factorisation omits a factor {#iw2-01}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [2-2-7-(Sketching-quartics).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-2-7-%28Sketching-quartics%29.xml)

**Problem and witness.** For x^4-4*x^3-x^2+16*x-12 the explanation omits (x-2). The complete factorisation is (x+2)(x-1)(x-2)(x-3).

**Proposed repair.** Restore the missing factor and all corresponding roots in the explanation.

**Regression cases to add.** Expand the product and verify each of the four roots.

### IW2-02: Domain/range explanation confuses set operations and square-root convention {#iw2-02}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [2-3-11-(Domain-and-range).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-3-11-%28Domain-and-range%29.xml)

**Problem and witness.** Union and intersection symbols are reversed in parts of the explanation. The square-root discussion permits negative outputs of the principal square-root function and contains an example identifying sqrt(5) with signed values rather than its nonnegative principal value.

**Proposed repair.** Use union for either-set membership and intersection for both-set membership. Distinguish y=sqrt(x) from the two-valued relation y^2=x.

**Regression cases to add.** Check the set examples element by element and verify square-root domain/range examples.

### IW2-03: A nominally valid domain option can be a denominator pole {#iw2-03}

**Status:** Source-proven missing generator invariant; native failure handling untested. Native execution has not been performed.

**Source:** [2-3-14-(Find-the-point-in-the-domain-1).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-3-14-%28Find-the-point-in-the-domain-1%29.xml), [2-3-15-(Find-the-point-in-the-domain-2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-3-15-%28Find-the-point-in-the-domain-2%29.xml)

**Problem and witness.** For f(x)=sqrt(a*x-b)/(x^2-c^2), the correct-option pool [b/a,k+1,k+2+rand(10)] is not filtered against poles. The allowed tuple a=2,k=1,b=2,c=3,rand(10)=0 puts 3 in the correct pool, although x=3 is excluded. The helper independently selects options without removing overlap between correct and incorrect pools. No native seed reproducer has been run.

**Proposed repair.** Generate options by evaluating the complete domain predicate, and make the correct and incorrect pools disjoint.

**Regression cases to add.** Force this tuple and both poles; verify nonnegative radicand and nonzero denominator for every option labelled correct.

### IW2-04: Quartic-from-graph generator can become the zero polynomial {#iw2-04}

**Status:** Source-proven missing generator invariant; native failure handling untested. Native execution has not been performed.

**Source:** [2-2-11-(Find-quartic-from-graph-(scaffolded)).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-2-11-%28Find-quartic-from-graph-%28scaffolded%29%29.xml)

**Problem and witness.** The intercept parameter y0 can be zero while the roots are nonzero. This forces the scale k to zero, collapsing the intended quartic and its derivative-based turning-point construction.

**Proposed repair.** Exclude zero y0 and assert degree four before constructing graph bounds and turning points.

**Regression cases to add.** Force y0=0 in a negative generator test and check valid draws retain degree four and real graph bounds.

### IW2-05: One correct endpoint earns full domain/range-PRT credit {#iw2-05}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [2-3-23-(Scaled-domain-and-range).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-3-23-%28Scaled-domain-and-range%29.xml), [PT-2-11-(Scaled-domain-and-range).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/PT-2-11-%28Scaled-domain-and-range%29.xml)

**Problem and witness.** For each endpoint pair, one correct input assigns or adds 1; an incorrect companion subtracts zero. A single correct endpoint therefore reaches a raw PRT score of 1, while both correct endpoints reach 2. The pinned [PRT implementation](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/stack/prt.class.php#L521-L525) clamps the result to [0,1], making these cases indistinguishable at full PRT credit under that source logic.

**Proposed repair.** Give each endpoint one-half credit or require both before awarding full credit.

**Regression cases to add.** Test all four correct/incorrect endpoint patterns independently for domain and range.

### IW2-06: Box cut-out can exceed half a side {#iw2-06}

**Status:** Source-proven missing generator invariant; native failure handling untested. Native execution has not been performed.

**Source:** [2-4-5-(Volume-of-a-box-for-given-cut-out).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-4-5-%28Volume-of-a-box-for-given-cut-out%29.xml)

**Problem and witness.** The allowed dimensions aa=20,bb=10,cc=8 give base sides 4 and -6 and target volume -192. This is not a physical open box.

**Proposed repair.** Require 0<cc<min(aa,bb)/2, or explicitly ask about feasibility before a volume.

**Regression cases to add.** Test both half-side boundaries and all generated physical dimensions; require positive lengths and volume.

### IW2-07: Valid factored box-volume expressions are rejected without a stated form requirement {#iw2-07}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [2-4-4-(Volume-of-a-box).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-4-4-%28Volume-of-a-box%29.xml), [2-4-5-(Volume-of-a-box-for-given-cut-out).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-4-5-%28Volume-of-a-box-for-given-cut-out%29.xml)

**Problem and witness.** The prompt asks for an equation/formula but the target is an expression and the EqualComAss/expanded-form path can reject the natural product x*(aa-2*x)*(bb-2*x). There is no explicit requirement to expand.

**Proposed repair.** Accept algebraically equivalent forms and provide a V= input cue, or explicitly require expanded form and explain the form feedback.

**Regression cases to add.** Test factored, expanded and reordered equivalents in native STACK; verify that validation and form checks match the prompt.

### IW2-08: Crossed-ladders quartic has the wrong sign {#iw2-08}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [2-4-6-(Application---Crossed-Ladders-Problem).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-4-6-%28Application---Crossed-Ladders-Problem%29.xml)

**Problem and witness.** The displayed A equation uses A^4-2*h*A^3+(h-A)^2*(a^2-b^2)=0, where the last sign must be minus. Feasible A=6,B=3,width=4 gives a^2=52,b^2=25,h=2. The printed left side is 864, while the corrected one is zero.

**Proposed repair.** Correct the corresponding A and B equations consistently.

**Regression cases to add.** Substitute this feasible geometric configuration and additional independently constructed ladder pairs.

### IW2-09: Polynomial-approximation claim omits necessary hypotheses {#iw2-09}

**Status:** Clarification of wording, domain or convention. Native execution has not been performed.

**Source:** [2-4-1-(Application-of-Polynomials-Intro).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-02---Polynomials%2C-functions%2C-graphs-and-their-inverses/2-4-1-%28Application-of-Polynomials-Intro%29.xml)

**Problem and witness.** The text promises arbitrary-accuracy polynomial approximation for any function, without continuity, a compact interval or a norm. A step discontinuity cannot be uniformly approximated with error less than 1/2 by continuous polynomials.

**Proposed repair.** State the intended Weierstrass theorem for continuous functions on a compact interval, using uniform error, or qualify a different approximation claim precisely.

**Regression cases to add.** Check the revised claim against a continuous example and the discontinuous step counterexample.

### IW3-01: Not prime is incorrectly equated with composite over all integers {#iw3-01}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-1-4-(Negation-of-statements).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-1-4-%28Negation-of-statements%29.xml)

**Problem and witness.** Over the stated integer domain, the negation of prime is keyed as composite. Integers 1,0 and negative integers are neither prime nor composite under the usual definitions.

**Proposed repair.** Use not prime, or explicitly restrict the domain to integers greater than 1.

**Regression cases to add.** Test 1,0,-1,2 and 4 under the stated domain.

### IW3-02: A single failed instance is said to disprove an existential statement {#iw3-02}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-1-17-(Quantifiers).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-1-17-%28Quantifiers%29.xml)

**Problem and witness.** The explanation says one counterexample suffices to disprove existence. Although x=0 fails x^2=1, x=1 establishes that a solution exists. A single counterexample disproves a universal statement.

**Proposed repair.** Correct the quantifier rule: not exists x P(x) means for every x, not P(x).

**Regression cases to add.** Contrast existential and universal claims using x^2=1 and explicit finite-domain examples.

### IW3-03: An equivalent rational-number definition is marked wrong {#iw3-03}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-2-2-(Pick-best-definition-of-rational).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-2-2-%28Pick-best-definition-of-rational%29.xml)

**Problem and witness.** The integer-fraction definition receives full credit, but the same definition with coprime numerator and denominator is given zero. Every rational admits a lowest-terms representation, so this is an equivalent definition, with nonzero denominator understood.

**Proposed repair.** Accept both equivalent definitions, or replace the second with a genuinely incorrect distractor.

**Regression cases to add.** Check 0, negative rationals and reducible fractions against both formulations.

### IW3-04: Repeated alternatives can omit a necessary branch of an equivalence {#iw3-04}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-2-9-(Maintain-Equivalence).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-2-9-%28Maintain-Equivalence%29.xml)

**Problem and witness.** For a conclusion a=ans3 OR a=ans4, the two inputs independently accept b or -b. Entering b,b can earn full credit while omitting -b. At b=1,a=-1 the original relation holds but the repeated-branch conclusion is false.

**Proposed repair.** Grade the alternatives collectively as the required unordered pair, including any zero/repeated-root convention.

**Regression cases to add.** Reject b,b and -b,-b when b is nonzero; accept either ordering of b,-b.

### IW3-05: Odd-integer proof changes both the expression and parity conclusion {#iw3-05}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-2-6-(Direct-proof---sum-of-odd-integers).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-2-6-%28Direct-proof---sum-of-odd-integers%29.xml)

**Problem and witness.** Step 3 refers to ab having form 2*x and concludes a+b is odd, while the intended result and key are that the sum is even. With a=b=1 the sum is 2.

**Proposed repair.** Write that a+b has form 2*x and hence is even.

**Regression cases to add.** Check the symbolic proof for arbitrary a=2*m+1,b=2*n+1 and render the corrected step.

### IW3-06: The proposition used to illustrate circular proof is itself false {#iw3-06}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-3-10-(Hypothesis-vs-Conclusion).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-3-10-%28Hypothesis-vs-Conclusion%29.xml)

**Problem and witness.** The example proposition says that positive integers x,y imply an even sum. The counterexample 1+2=3 refutes the proposition itself, independently of the deliberately circular argument. After diagnosing circularity, the text labels the same hypotheses and conclusion A and B and presents A implies B as the structure of a correct proof; it does not actually supply a replacement proof. The deliberately circular argument is an instructional feature, but relabelling does not repair its false target.

**Proposed repair.** Supply the missing same-parity hypothesis, or choose another true proposition for the corrected proof.

**Regression cases to add.** Test opposite and equal parity examples and distinguish the flawed proof from the corrected one.

### IW3-07: Sum-of-odd-integers caption states a different false identity {#iw3-07}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [3-4-2-(History-of-proof).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-4-2-%28History-of-proof%29.xml)

**Problem and witness.** The caption says the first 2*n-1 positive integers sum to n^2; the intended statement is the first n odd positive integers. At n=2, 1+2+3=6, not 4.

**Proposed repair.** Correct the caption to the first n odd positive integers.

**Regression cases to add.** Verify small n and agreement between the diagram caption and algebraic identity.

### IW3-08: Boolean and dropdown variable names contain source typos {#iw3-08}

**Status:** Source defect; runtime-dependent candidate. Native execution has not been performed.

**Source:** [3-2-4-(Direct-proof---multiplying-odd-integers).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-2-4-%28Direct-proof---multiplying-odd-integers%29.xml), [3-4-5-(Monty-Hall-problem).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-03---Reasoning-and-writing-mathematical-arguments/3-4-5-%28Monty-Hall-problem%29.xml)

**Problem and witness.** One source uses falsee in place of false. The Monty Hall source defines tac3 but calls dropdown_correct(tac1). These are source-level name mismatches; their exact initialisation and rendering effects have not been observed in native STACK.

**Proposed repair.** Correct the Boolean and use the defined dropdown variable.

**Regression cases to add.** Import and initialise both questions in STACK, render the dropdowns, and run their existing and corrected question tests.


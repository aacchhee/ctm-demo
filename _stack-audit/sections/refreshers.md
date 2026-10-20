## Algebra and calculus refreshers

All 148 noncategory Algebra-Refresher questions and 213 noncategory Calculus-Refresher questions were screened at pinned upstream revision `33383047af39c204bf4442802a058f8b918b2b1b`: 361 questions total. Review covered mathematical statements, random-variable construction, PRT comparisons/reachable score paths, and worked feedback. Related defects are grouped below.

These are static source findings with mathematical counterexamples. Selected finite-support enumeration, arithmetic and symbolic differentiation were independently checked with Python/SymPy 1.14. No native Moodle/STACK/Maxima import, seed deployment or rendered-feedback run was completed; proposed native regressions remain to be executed. CR-09 is explicitly a scope-dependent candidate. PRT roots were determined from incoming edges, not assumed to be node0.

### AR-01: An incorrect fraction reaches a full-credit terminal {#ar-01}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-14-4.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/14-Algebraic-fractions-involving-factorising/AlgMap-14-4.xml).

**Problem:** Both outcomes of the SingleFrac check at unique root node 0 lead to node 1, which assigns score 1 when lowesttermsp(ans) is true. The equivalence failure is therefore bypassed. SingleFrac itself checks equivalence.

**Witness:** An unrelated lowest-terms expression such as 1 fails the original comparison but follows the false branch to a true lowesttermsp check.

**Fix:** Terminate the false SingleFrac edge with zero; reach the form check only after equivalence succeeds.

**Proposed native regression:** Submit the correct simplified fraction, an equivalent unsimplified form, and unrelated answers 1 and 1/(a+b); assert unrelated answers score 0.

### AR-02: Completed-square target has the wrong shift sign {#ar-02}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-15-8.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-8.xml).

**Problem:** The target uses a negative shift for a polynomial with linear coefficient +b.

**Witness:** a=2, b=8, c=1 gives 2v²+8v+1=2(v+2)²−7, whereas the target 2(v−2)²−7 has linear coefficient−8. The target-minus-original difference is−2bv.

**Fix:** Use shift+b/(2a) and derive the constant from the same identity.

**Proposed native regression:** Expand targets for all coefficient tuples; accept the correct shift and reject its opposite. Selected symbolic checking used SymPy, not native STACK.

### AR-03: Linear-equation generator can divide by zero {#ar-03}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-9-5.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/09-Linear-equations/AlgMap-9-5.xml).

**Problem:** The target divides by b1*cf1+b2*cf2 without excluding zero.

**Witness:** Allowed cf1=1,cf2=2,b1=−2,b2=1,k1=−1,k2=1 gives 3=0 and target calculation−3/0. Independent support enumeration found 29 coefficient tuples supporting a zero denominator.

**Fix:** Exclude zero resulting coefficients, or explicitly grade no-solution and infinite-solution cases.

**Proposed native regression:** Enumerate coefficient support; assert a nonzero divisor for every ordinary instance and instantiate the exhibited tuple.

### AR-04: Simultaneous-equation generator permits nonunique solutions {#ar-04}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-12-1.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/12-Simultaneous-linear-equations/AlgMap-12-1.xml).

**Problem:** Random coefficient matrices need not be nonsingular, but one constructed pair is graded as though unique.

**Witness:** With every matrix entry 2 and constructed solution [1,1], the RHS is [4,4]; [2,0] is another solution. Independent enumeration found 4 singular matrices among 24 possibilities.

**Fix:** Require nonzero determinant or grade the complete solution relation.

**Proposed native regression:** Enumerate matrix support and assert det(A)≠0; verify both exhibited solution pairs.

### AR-05: Partial-fraction coefficients can divide by zero {#ar-05}

**Status:** Confirmed by static analysis.

**Source:** [Diagnostic_ALG-SPF_2.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/Partial-Fractions/Diagnostic_ALG-SPF_2.xml).

**Problem:** The coefficient formula divides by a*b−c, which may vanish and create repeated poles.

**Witness:** Allowed a=2, b=2, c=4 gives a*b−c=0.

**Fix:** Exclude equality or implement a repeated-factor decomposition.

**Proposed native regression:** Enumerate parameter support; assert distinct poles and finite coefficients, including the exhibited tuple.

### AR-06: Exponent-law feedback confuses sum and product {#ar-06}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-1-5.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/01-Combinations-of-arithmetic-operations/AlgMap-1-5.xml); [AlgMap-6-4.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/06-Simplifying-algebraic-expressions/AlgMap-6-4.xml).

**Problem:** Feedback states c^a+c^b=c^(a+b).

**Witness:** c=2, a=2, b=3 gives 12 on the left and 32 on the right.

**Fix:** Write c^a*c^b=c^(a+b) and align the explanation with the actual operation.

**Proposed native regression:** Check unequal positive exponents and compare each worked equality symbolically.

### AR-07: Hidden positivity changes a power identity {#ar-07}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-6-5.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/06-Simplifying-algebraic-expressions/AlgMap-6-5.xml).

**Problem:** The PRT assumes c>0 but the prompt does not state that domain. The target simplification is invalid for arbitrary real c.

**Witness:** c=−1, multiplier coefficient 1, y=2, z=1/2 gives sqrt((−1)²)=1 but (−1)^(2*1/2)=−1.

**Fix:** State positive-real assumptions or preserve absolute values for the broader real domain.

**Proposed native regression:** Test positive and negative bases and fractional exponents; align stated domain and PRT assumptions.

### AR-08: LCM explanation loses prime multiplicities {#ar-08}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-2-4.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/02-Factorisation-of-whole-numbers/AlgMap-2-4.xml).

**Problem:** The explanation takes each distinct prime only once rather than taking the maximum exponent in either factorisation.

**Witness:** Allowed pair 4,18 has LCM 36=2²*3²; multiplying distinct primes gives 6. An earlier illustrative pair 4,8 was outside generator support and is not the regression witness.

**Fix:** Use maximum prime exponents from both numbers.

**Proposed native regression:** Test supported pair [4,18], coprime pairs and repeated prime factors; verify both LCM and explanation.

### AR-09: Worked fraction expansion drops an outer constant {#ar-09}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-8-23.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/08-Algebraic-fractions/AlgMap-8-23.xml).

**Problem:** Feedback transforms (v−1/v)²+2 into an intermediate expression ending−2, dropping the outer+2. The final target is correct.

**Witness:** At v=1 the original is 2 and erroneous intermediate is 0. Correct expansion is v²+1/v².

**Fix:** Retain the outer+2 until it cancels the−2 from the square.

**Proposed native regression:** Compare adjacent displayed expressions for v≠0 and test v=1.

### AR-10: Completed-square explanations contain false identities {#ar-10}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-13-13.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/13-Factorising-algebraic-expressions/AlgMap-13-13.xml); [AlgMap-15-2.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-2.xml); [AlgMap-15-3.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-3.xml); [AlgMap-15-4.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-4.xml); [AlgMap-15-5.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-5.xml); [AlgMap-15-7.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-7.xml); [AlgMap-15-8.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/15-Quadratic-equations/AlgMap-15-8.xml).

**Problem:** 13-13 uses a²=x,b²=4y instead of a=x,b=4y. 15-2 changes constant b to c. 15-3/4/5/8 use (c/a)*x instead of c/a when factoring out a. 15-7 gives x²+2ax+b=(x−a)²−a²+b. Bracket delimiters in15-3/8 also need repair.

**Witness:** The15-7 right side expands to x²−2ax+b, differing by−4ax. Multiplying c/a by x changes a constant term into a linear term.

**Fix:** Use av²+bv+c=a[(v+b/(2a))²+c/a−b²/(4a²)], a≠0, with consistent names and balanced delimiters.

**Proposed native regression:** Expand every adjacent worked step for generated coefficients; render the repaired mathematics.

### AR-11: Worked algebra changes variables, signs and quotient roles {#ar-11}

**Status:** Confirmed by static analysis.

**Source:** [AlgMap-7-8.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/07-Removing-brackets/AlgMap-7-8.xml); [AlgMap-9-3.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/09-Linear-equations/AlgMap-9-3.xml); [Diagnostic_ALG-IPF_1.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/Partial-Fractions/Diagnostic_ALG-IPF_1.xml); [Diagnostic_ALG-IPF_2.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Algebra-Refresher/Partial-Fractions/Diagnostic_ALG-IPF_2.xml).

**Problem:** 7-8 omits y from the second factor;9-3 changes−k1 to+k1. IPF_1 gives x coefficient h+m+g*l² rather than2*l*h+m+g*l². IPF_2 swaps quotient/remainder names and values, displaying f=p/den+q where a polynomial quotient plus proper fraction is needed.

**Witness:** In IPF_1 expansion contributes cross term2*l*h. In IPF_2 the constructed quotient is gval*x+hval and remainder mval*x+nval; swapping their denominator roles changes the rational function.

**Fix:** Restore the variable/sign; derive coefficients by expansion; consistently write f=p+q/den.

**Proposed native regression:** Expand/recombine every worked expression and compare with the original using unequal nonzero coefficients.

### CR-01: Implicit-differentiation question has no real curve {#cr-01}

**Status:** Confirmed by static analysis.

**Source:** [CR-Diff-07-implicit-2-e.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_07/CR-Diff-07-implicit-2-e.xml).

**Problem:** Equation x+exp(y)−ln(x)−ln(y)=0 has no real points.

**Witness:** Logs require x,y>0. x−ln(x)≥1; exp(y)≥1+y and y−ln(y)≥1 imply exp(y)−ln(y)≥2, so the left side is at least 3.

**Fix:** Use a nonempty level set, e.g. RHS 1+e, which contains (1,1), and state the domain.

**Proposed native regression:** Verify a real point satisfies the equation and Fy≠0 there before checking its local implicit derivative.

### CR-02: Integral PRTs fix the arbitrary constant symbol {#cr-02}

**Status:** Confirmed by static analysis.

**Source:** [CR-Int-11-linearity-3-e.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_11/CR-Int-11-linearity-3-e.xml); [CR-Int-11-linearity-3-f.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_11/CR-Int-11-linearity-3-f.xml); [CR-Int-17-misc-12.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_17/CR-Int-17-misc-12.xml).

**Problem:** AlgEquiv(ans1,int(p,v)+c) treats the integration constant as an ordinary fixed symbol.

**Witness:** F(v)+K and F(v)+C have the same derivative as F(v)+c but differ algebraically. Upstream doc/en/AbInitio/Authoring_quick_start_3.md lines12–18 documents this same issue and the Int repair.

**Fix:** Use Int with variable v; define whether an arbitrary constant is required.

**Proposed native regression:** Accept F+K and F+C, reject incorrect derivatives, and check the chosen missing-constant policy.

### CR-03: Trigonometric substitution is reversed incorrectly {#cr-03}

**Status:** Confirmed by static analysis.

**Source:** [CR-Int-17-misc-11.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_17/CR-Int-17-misc-11.xml).

**Problem:** After x=sin(u), feedback substitutes u=a*sin(x), not u=asin(x). The PRT integral target itself is correct.

**Witness:** Intermediate primitive is u/2+sin(2u)/4. At a=1, x=0.5 the wrong back-substitution derivative≈0.690859669, versus integrand sqrt(1−x²)≈0.8660254. Independent SymPy differentiation confirmed the discrepancy.

**Fix:** Use (asin(x)+x*sqrt(1−x²))/2; specify u∈[−π/2,π/2] when simplifying sqrt(cos²u).

**Proposed native regression:** Differentiate the worked primitive on(−1,1); check forward and inverse substitutions on the stated branch.

### CR-04: Derivative simplification changes a denominator sign {#cr-04}

**Status:** Confirmed by static analysis.

**Source:** [CR-Diff-07-implicit-1-b.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_07/CR-Diff-07-implicit-1-b.xml).

**Problem:** Feedback rewrites1/(2y−1/y²) as y²/(2y³+1), although its PRT target is correct.

**Witness:** At y=1 the original is 1 and claimed simplified value is 1/3.

**Fix:** Use denominator2y³−1.

**Proposed native regression:** Check symbolic equivalence away from singularities and test y=1.

### CR-05: Worked derivatives and primitives lose signs or coefficients {#cr-05}

**Status:** Confirmed by static analysis.

**Source:** [CR-Diff-02-linearity-1-d.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_02/CR-Diff-02-linearity-1-d.xml); [CR-Diff-02-linearity-2-d.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_02/CR-Diff-02-linearity-2-d.xml); [CR-Int-10-basic-2-c.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_10/CR-Int-10-basic-2-c.xml); [CR-Int-10-basic-2-l.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_10/CR-Int-10-basic-2-l.xml); [CR-Int-11-linearity-1-c.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_11/CR-Int-11-linearity-1-c.xml); [CR-Int-11-linearity-2-l.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_11/CR-Int-11-linearity-2-l.xml).

**Problem:** Respectively: adds pp1+pp2 when p=pp1−pp2; subtracts for a sum; gives−sin as primitive of sin instead of−cos; negates final primitive; uses a difference of integrals for a sum; drops coefficient rdm2 from second term.

**Witness:** The claimed primitive−sin(v) differentiates to−cos(v), not sin(v). Other affected lines fail linearity for nonzero terms/coefficients.

**Fix:** Preserve every operation, sign and random coefficient from the original function.

**Proposed native regression:** Compare displayed derivatives with diff(p,v), and differentiate displayed primitives for unequal nonzero coefficients.

### CR-06: Partial-fraction feedback uses wrong random coefficients {#cr-06}

**Status:** Confirmed by static analysis.

**Source:** [CR-Int-15-partialfrac-5.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_15/CR-Int-15-partialfrac-5.xml); [CR-Int-15-partialfrac-10.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_15/CR-Int-15-partialfrac-10.xml).

**Problem:** In−5 all three construction coefficients use rdm3, but first two final-feedback terms use rdm2. In−10 feedback says A=rdm3,B=rdm4 while construction requires rdm2,rdm3.

**Witness:** Unequal rdm2 and rdm3 make the displayed partial fractions fail to reconstruct the integrand.

**Fix:** Use construction coefficients consistently.

**Proposed native regression:** Recombine partial fractions and differentiate the final primitive using deliberately unequal coefficients.

### CR-07: Final definite-integral feedback reverses limits {#cr-07}

**Status:** Confirmed by static analysis.

**Source:** [CR-Int-13-parts-4-a.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_13/CR-Int-13-parts-4-a.xml).

**Problem:** Question and PRT use int(p,v,rdm3,rdm2); final feedback uses int(p,v,rdm2,rdm3).

**Witness:** Allowed lower limit 0, upper limit π/2, p=x²*cos(x) gives π²/4−2≈0.4674011; reversed feedback gives its negative. Independently computed with SymPy.

**Fix:** Keep the same lower/upper order throughout.

**Proposed native regression:** Test this positive-integrand instance and compare the displayed result against the PRT target.

### CR-08: Composite-function feedback differentiates wrong factors {#cr-08}

**Status:** Confirmed by static analysis.

**Source:** [CR-Diff-09-misc-2-b.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_09/CR-Diff-09-misc-2-b.xml); [CR-Diff-09-misc-2-c.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_09/CR-Diff-09-misc-2-c.xml); [CR-Diff-09-misc-3-d.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Diff_09/CR-Diff-09-misc-3-d.xml).

**Problem:** In−2-b p=p1/p3, p3=v*ln(v), but quotient-rule feedback uses p2=ln(v). In−2-c cos(rdm1) should be cos(rdm1*v). In−3-d i(v)=p2 is defined instead of p1=cos(v), and the inner product rule is called chain rule.

**Witness:** The−2-b displayed derivative belongs to exp(v)/ln(v), not exp(v)/(v*ln(v)). Other decompositions omit or misidentify factors.

**Fix:** Use the actual denominator/inner factors, preserve the trig variable and name the product rule correctly.

**Proposed native regression:** Differentiate each displayed decomposition and compare with the original at nonsingular points.

### CR-09: Primitive name is reused for a PRT distractor {#cr-09}

**Status:** Needs native runtime confirmation.

**Source:** [CR-Int-12-definite-1-f.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Calculus-Refresher/CR_Int_12/CR-Int-12-definite-1-f.xml).

**Problem:** Question variables set q=int(p,v); PRT feedback variables rebind q=v^rdm1 as distractor; general feedback uses q as primitive.

**Witness:** The naming collision is definite. Whether general feedback sees the rebound q depends on native feedback-variable scope; no wrong rendered value has been confirmed.

**Fix:** Rename distractor qwrong and keep the primitive name unique.

**Proposed native regression:** Render general feedback before/after PRT evaluation and assert its primitive differentiates to p; do not count a confirmed rendered error before running this check.


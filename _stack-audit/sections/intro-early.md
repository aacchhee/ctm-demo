## Introductory Mathematics: weeks 4–5

The source snapshot is `33383047af39c204bf4442802a058f8b918b2b1b`. All **217 noncategory XML paths** in weeks 4–5 received static screening of question variables, question text, general feedback, and PRT answer-test summaries. This includes description and non-STACK questions. Candidates below received closer source inspection. The oversized `5-3-2-(Trig-functions-are-waves).xml` description was recovered through the Git blobs API and included.

**Depth and limitations:** this was a broad static screen with targeted mathematical and PRT analysis, not an exhaustive proof of every question. Embedded image geometry and external GeoGebra applets were not rendered. No native STACK/Maxima question tests were executed for this partition. A file without a finding is not certified correct. The counterexamples are parameter assignments permitted by the source, not claims about specific deployed random seeds. All native regressions below are **proposed runs**.

### IM45-01: Every generated inverse-sine periodic equation has no real solution {#im45-01}

**Status:** confirmed mathematical/key defect by static proof. **Severity:** high.

**Source:** [5-3-22-(Arctrig-periodic-equation).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-3-22-%28Arctrig-periodic-equation%29.xml)

The prompt asks to solve `arcsin(x)+360*k=rhs` in degrees, where `k` is 1–4 and `rhs` lies between −150 and 150. The left side is at least 270 degrees because the principal real inverse sine lies in [−90,90]. Every generated equation therefore has no real solution. Nevertheless, the key assigns `ta1:sind(rhs)` and the PRT compares the input with that number. Taking sine discards the principal-branch restriction and supplies only a necessary condition.

**Witness:** for `k=1,rhs=30`, the keyed `x=1/2` gives 30+360=390, not 30.

**Fix:** either generate `rhs=360*k+alpha` with `alpha` in [−90,90] and key `sind(alpha)`, or change the task to the intended sine equation. Alternatively, retain the equation and support an explicit no-real-solution response.

**Proposed native regression:** for the current witness reject `1/2` and accept no real solution; enumerate all generated `rhs,k` choices and check the principal-range condition before deploying them. After repair, test both principal-range endpoints and values outside the range.

### IM45-02: Arccosine range upper bounds are halved in two answer keys {#im45-02}

**Status:** confirmed mathematical/key defect. **Severity:** high.

**Sources:** [5-3-20-(Arctrig-range-based-on-MNS-L3-2-Q2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-3-20-%28Arctrig-range-based-on-MNS-L3-2-Q2%29.xml); [PT-5-3-(Arctrig-domain-and-range-based-on-MNS-L3-2-Q2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/PT-5-3-%28Arctrig-domain-and-range-based-on-MNS-L3-2-Q2%29.xml)

The lists of upper bounds use `a*90` for both the inverse-sine and inverse-cosine branches. The explanation itself correctly gives the range of `a*arccos(x)` as [0,`a*180`] degrees, contradicting the key. The practice-test copy has the same defect.

**Witness:** with `a=2`, `2*arccos(-1)=360` degrees, while the keyed upper bound is 180. Input scaling in the practice version does not alter this range.

**Fix:** change the relevant upper-bound lists to `[a*90,a*180]` and update teacher-answer tests.

**Proposed native regression:** force both function branches. For `a=2`, verify the inverse-sine range [−180,180] and inverse-cosine range [0,360]; reject the upper bound 180 in the inverse-cosine branch.

### IM45-03: Sine generators allow unattainable values and incorrect root counts {#im45-03}

**Status:** confirmed generator/key defects. **Severity:** high.

**Sources:** [5-2-6-(Find-solutions-of-sine-equation-not-exact-positive).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-2-6-%28Find-solutions-of-sine-equation-not-exact-positive%29.xml); [5-2-8-(Sin-squared-equation-not-exact).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-2-8-%28Sin-squared-equation-not-exact%29.xml)

The positive integers `aa` and `ang` are drawn independently. Both generators permit `ang>aa`, so the displayed equations have no real solutions although inverse-sine roots are constructed. The squared-sine question also hardcodes `ta1:4`; at `ang=aa` there are only two roots in the stated open interval (0,360 degrees).

**Witnesses:** `aa=1,ang=2` gives either `sin(x)=2` or `sin(x)^2=2`, neither of which has a real solution. With `aa=ang=1`, the squared equation has roots 90 and 270 degrees, not four.

**Fix:** if all variants should have the advertised two/four roots, enforce `0<ang<aa`. Otherwise branch the solution-count and response handling at ratios equal to 1 and greater than 1.

**Proposed native regression:** test ratios below, equal to, and above 1. The squared equation should have four distinct roots only for a ratio strictly between 0 and 1, two at equality, and none above 1. Ensure invalid inverse-sine evaluations are never used to construct teacher answers.

### IM45-04: Duplicate sine roots earn full credit {#im45-04}

**Status:** confirmed PRT logic defect by static branch trace; native execution pending. **Severity:** high.

**Source:** [5-2-6-(Find-solutions-of-sine-equation-not-exact-positive).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-2-6-%28Find-solutions-of-sine-equation-not-exact-positive%29.xml)

The four-node PRT credits `ans1` if it matches either root and independently credits `ans2` if it matches either root. It never checks that both distinct roots are represented.

**Witness:** for the valid variant `aa=2,ang=1`, the roots are 30 and 150 degrees. Inputs `(30,30)` follow the branch outcomes true, false, false, true: the first true node assigns 0.5 and the last adds 0.5, producing 1. Inputs `(150,150)` also receive full credit. Only one distinct root was supplied.

**Fix:** compare `{ans1,ans2}` with `{ta1,ta2}`, or award credit according to the distinct expected roots found across both inputs. Handle the single-root boundary explicitly if retained.

**Proposed native regression:** `(30,150)` and `(150,30)` must score 1; `(30,30)` and `(150,150)` must not score 1; one correct plus one wrong should receive only partial credit. This report does not claim those submissions were executed in STACK.

### IM45-05: Cosine-rule draws include impossible and degenerate triangles {#im45-05}

**Status:** confirmed generator defect. **Severity:** high.

**Source:** [5-1-20-(Cosine-rule-find-angle).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-1-20-%28Cosine-rule-find-angle%29.xml)

The independent draws `AC:10+rand(10)`, `BC:5+rand(5)`, and `AB:7+rand(7)` do not enforce triangle inequalities before evaluating inverse cosine.

**Witness:** `AC=19,BC=5,AB=7` violates `19<5+7`. The cosine expression is `(25+361-49)/(2*5*19)=337/190>1`. The permitted combination `AC=12,BC=5,AB=7` is degenerate.

**Fix:** construct a nondegenerate triangle from two sides and an included angle and derive the third, or reject every draw that fails strict triangle inequalities.

**Proposed native regression:** enumerate the finite side combinations and assert strict triangle inequalities and a cosine argument strictly between −1 and 1. Include the two witnesses above as generator rejection cases.

### IM45-06: Base-one variants invalidate exponential and logarithmic tasks {#im45-06}

**Status:** confirmed generator/key defects. **Severity:** high.

**Sources:** [4-1-3-(Exponentials-algebraically).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-1-3-%28Exponentials-algebraically%29.xml); [4-1-4-(Exponentials-algebraically-2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-1-4-%28Exponentials-algebraically-2%29.xml); [4-3-5-(Find-range-of-exponential).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-3-5-%28Find-range-of-exponential%29.xml); [4-3-12-(Find-range-of-log).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-3-12-%28Find-range-of-log%29.xml)

The equation generators draw bases using `1+rand(5)`; the range exercises use `1+rand(10)`. Base 1 makes the exponential equations identities, makes the exponential range a singleton, and makes a logarithm with that base undefined. The keys assume the corresponding nonconstant functions.

**Witnesses:** `1^x=1^p1` holds for every real `x`, but the PRT expects only `p1`. For `cc=2,bb=3,aa=1`, `cc*aa^x+bb` has range `{5}`, not `y>3`. In the logarithm-range task, `bb=1` produces an undefined base.

**Fix:** draw bases greater than 1, or explicitly support the exceptional branches. The explanatory injectivity rule also needs a positive base different from 1.

**Proposed native regression:** assert that base 1 is excluded, test the smallest allowed base, and check the repaired question statements, teacher answers, and range feedback together.

### IM45-07: Triangle-area task silently rounds its teacher answer {#im45-07}

**Status:** confirmed mismatch between prompt and key. **Severity:** medium.

**Source:** [5-1-2-(Find-area-of-triangle).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-1-2-%28Find-area-of-triangle%29.xml)

The prompt asks for the area without any rounding instruction, but the key is `round(aa*cc*sind(tt)/2)` and the PRT uses `AlgEquiv`. Feedback also labels area in cm instead of square centimetres.

**Witness:** the allowed draw `aa=3,cc=1,tt=30` has exact area `3/4` square centimetre; the key is 1.

**Fix:** explicitly request rounding and use a compatible numeric test, or retain the exact area as teacher answer. Correct the units to square centimetres.

**Proposed native regression:** accept `3/4` if an exact answer is requested; accept 1 only when nearest square centimetre is explicitly requested. Verify the displayed units.

### IM45-08: Cosine-scale PRT rejects valid sign choices {#im45-08}

**Status:** confirmed under-specified task and overly restrictive key. **Severity:** medium.

**Source:** [5-3-15-(Solve-to-scale-trig).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-3-15-%28Solve-to-scale-trig%29.xml)

The task asks for `a,b,c` in `a+b*cos(c*x)` with a given range and period. It does not require `b>0,c>0`. The key accepts only `b=B,c=2/C`, although negative `b` and either sign of `c` satisfy those conditions too.

**Witness:** for `A=0,B=2,C=4`, the values `a=2,b=-2,c=-1/2` give range [0,4] and fundamental period 720 degrees, satisfying the prompt while failing two key tests.

**Fix:** require positive `b,c` and specify fundamental period, or compare the absolute values of the unrestricted coefficients.

**Proposed native regression:** test all four sign combinations. Accept all under unrestricted wording; with positivity explicitly required, accept only the positive choices.

### IM45-09: Principal square-root power is incorrectly written as plus-or-minus {#im45-09}

**Status:** confirmed mathematical teaching error. **Severity:** medium.

**Source:** [4-0-6-(Fractional-indices).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-0-6-%28Fractional-indices%29.xml)

The text explicitly writes `16^(1/2)=±4`, then identifies `a^(1/2)` with the principal square root.

**Witness:** `16^(1/2)=4`. The number −4 is a solution of `u^2=16`, not the value of the principal power.

**Fix:** distinguish the two solutions of the square equation from the single nonnegative value of the square-root expression.

**Proposed regression:** an editorial/math check must distinguish the value `sqrt(16)=4` from the solution set `{−4,4}` of `u^2=16`.

### IM45-10: Index-law example ends with an incorrect exponent {#im45-10}

**Status:** confirmed mathematical teaching error. **Severity:** medium.

**Source:** [4-0-8-(Index-Laws).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-0-8-%28Index-Laws%29.xml)

The worked example for the reciprocal of the square of the fourth root of 5 ends with `5^(-2/4)=5^(-1/4)`. The quotient-power rule also states the condition `a!=0` rather than the needed nonzero denominator condition for `(a/b)^n`.

**Witness:** `-2/4=-1/2`, not `-1/4`. With `a=1,b=0`, the quotient is undefined despite satisfying the printed `a!=0` condition.

**Fix:** replace the final exponent by −1/2. State appropriate nonzero conditions for integer powers and positivity assumptions when extending unrestricted laws to real fractional powers.

**Proposed regression:** check all adjacent equalities in the numerical example and include denominator-zero and negative-base fractional-power edge cases in the editorial review.

### IM45-11: Surd explanation contains several false intermediate equalities {#im45-11}

**Status:** confirmed mathematical teaching errors. **Severity:** medium.

**Source:** [4-0-3-(Surds-and-radicals).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-0-3-%28Surds-and-radicals%29.xml)

The text claims a nonnegative real square root for every real radicand, instructs the reader to rationalise `a/sqrt(b)` with `sqrt(a)/sqrt(a)`, writes an extra square in the expansion of `(5-sqrt(2))^2`, and uses `5*(3-sqrt(2))` after multiplying by the positive conjugate. The final example answer is correct, but those intervening equalities are not.

**Witnesses:** for `a=1,b=2`, the suggested multiplier is 1 and leaves the denominator irrational. Multiplying `5/(3-sqrt(2))` by `(3+sqrt(2))/(3+sqrt(2))` yields numerator `5*(3+sqrt(2))`, not the printed minus sign.

**Fix:** restrict the real square-root inequality to nonnegative radicands; use `sqrt(b)/sqrt(b)` with `b>0`; remove the extra square; correct both intermediate numerator signs.

**Proposed regression:** verify each adjacent equality algebraically and ensure the generic rationalisation instruction states the conditions under which its multiplier is defined.

### IM45-12: Graph descriptions give incorrect range, domain, or asymptote {#im45-12}

**Status:** confirmed mathematical teaching errors. **Severity:** medium.

**Sources:** [4-3-2-(Plotting-exponential-example).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-3-2-%28Plotting-exponential-example%29.xml); [4-3-8-(Plotting-log-example).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-3-8-%28Plotting-log-example%29.xml)

For `y=2^(-x)-3`, the conclusion gives range `y>3`, although the asymptote is correctly −3. The logarithm page ends by naming the unshifted `log_a(x)` but giving domain `x>1` and asymptote `x=1`, copied from the preceding shifted example.

**Witnesses:** the exponential takes value −2 at `x=0`, contradicting `y>3`. For the unshifted logarithm, `x=1/2` belongs to its domain and the asymptote is `x=0`.

**Fix:** use `y>-3` for the exponential. Either label the final logarithm summary with the shifted function, or use domain `x>0` and asymptote `x=0` for the unshifted function.

**Proposed regression:** substitute representative values and check the stated asymptotes against the function actually named in each summary.

### IM45-13: Log-scale examples exponentiate the transformed line coefficients {#im45-13}

**Status:** confirmed mathematical feedback errors; the original parameter keys need not change. **Severity:** medium.

**Sources:** [4-4-9-(Log-Scale-Example).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-4-9-%28Log-Scale-Example%29.xml); [4-4-10-(Log-scales-from-graph-info).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-4-10-%28Log-scales-from-graph-info%29.xml); [4-4-11-(Log-scales-from-graph-info-2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-4-11-%28Log-scales-from-graph-info-2%29.xml)

After deriving `Y=ln(b)*x+ln(a)`, the fixed example concludes `Y=exp(2/7)*x+exp(3)`. The generated copies likewise conclude `Y=ta2*x+ta1`, where `ta1=a=exp(py1)` and `ta2=b=exp(grad)`. Those are the original exponential parameters, not the transformed line coefficients.

**Witness:** the supplied point `(0,3)` lies on `Y=(2/7)*x+3`; the printed final line instead gives `Y(0)=exp(3)`.

**Fix:** give the transformed line as `Y=grad*x+py1` and, separately, the original curve as `y=exp(py1)*exp(grad)^x`.

**Proposed regression:** substitute both supplied graph points into the final line and separately verify the recovery of `a,b`.

### IM45-14: Compound-interest derivation has invalid arithmetic and indexing {#im45-14}

**Status:** confirmed mathematical teaching errors. **Severity:** medium.

**Source:** [4-4-3-(Application---exponential-growth-(finance)).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-4-3-%28Application---exponential-growth-%28finance%29%29.xml)

Although `A_n` is defined after `n` years, `A_0` is set to 105 rather than the initial 100. A subsequent row writes `110+0.05*110.25=115.76`. The later derivation uses powers of 0.05 added to unrelated balances instead of powers of the growth factor 1.05.

**Witnesses:** `110+0.05*110.25=115.5125`, not 115.76; `110+0.05^3*100=110.0125`, not 115.76.

**Fix:** start at `A_0=100`, use `A_(n+1)=1.05*A_n`, and derive `A_n=100*1.05^n`. Use the same time origin for simple interest.

**Proposed regression:** before rounding, check years 0–3: compound balances 100,105,110.25,115.7625; simple-interest balances 100,105,110,115.

### IM45-15: Trig teaching includes incorrect quadrant, identity, and triangle calculations {#im45-15}

**Status:** confirmed mathematical teaching errors. **Severity:** medium.

**Sources:** [5-0-4-(Signs-of-trig-and-quadrants).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-0-4-%28Signs-of-trig-and-quadrants%29.xml); [5-2-1-(Basic-trig-equations).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-2-1-%28Basic-trig-equations%29.xml); [5-2-17-(Double-angle-formulas).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-2-17-%28Double-angle-formulas%29.xml); [5-1-7-(Sine-rule-example).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-1-7-%28Sine-rule-example%29.xml); [5-1-14-(Cosine-rule-example).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-1-14-%28Cosine-rule-example%29.xml)

Both CAST descriptions put the tangent-only and cosine-only positive cases in the second quadrant, instead of the third and fourth. The double-angle summary writes `cos(2*x)=2*cos(x)-1`, missing the square. The sine-rule example states `C=78` degrees but uses 37 degrees in the calculation. The cosine-rule example drops `cos` in an intermediate expression, labels a squared length in cm, and never takes the final square root.

**Witnesses:** at 180 degrees the incorrect double-angle identity gives `1=-3`. With `AB=23,A=48,C=78` degrees, `BC=23*sin(48)/sin(78)` is approximately 17.47 cm, not 28.4 cm. With sides 5 and 3 and included angle 50 degrees, the remaining side is `sqrt(34-30*cos(50))`, approximately 3.84 cm.

**Fix:** correct the quadrant names; use `2*cos(x)^2-1`; use the stated triangle angles consistently; retain the cosine and take a final square root with correct length units.

**Proposed regression:** check the identity at 0,90,180 degrees and independently substitute the stated triangle data into sine/cosine-rule calculations. Check the source diagrams when rendering is available.

### IM45-16: Temperature feedback uses a rate 100 times too large {#im45-16}

**Status:** confirmed feedback/key inconsistency. **Severity:** medium.

**Source:** [4-3-18-(Find-temperature-natural-log-2).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-3-18-%28Find-temperature-natural-log-2%29.xml)

The prompt and key use `b2=b1/100`, but the feedback equations use `b1` in the exponent and reciprocal coefficient. Their algebra does not produce the displayed numeric teacher answer.

**Witness:** for `aa=70,cc=140,b1=2`, the correct time is `50*ln(2)`, whereas the feedback formula gives `ln(2)/2`.

**Fix:** replace `b1` by `b2` throughout the feedback derivation; retain the correctly calculated key.

**Proposed regression:** substitute the witness into the rendered feedback and verify that both symbolic and numeric steps use the same rate.

### IM45-17: Logarithm feedback introduces an extra logarithm {#im45-17}

**Status:** confirmed mathematical feedback error. **Severity:** medium.

**Source:** [4-2-15-(Simplify-natural-logs).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-2-15-%28Simplify-natural-logs%29.xml)

The original expression is `m*log(x)+log(y)-n*log(z)`. Its worked feedback introduces `log(log(z^n))` and another line `logcontract(x^m)`. The correct key `logcontract(p)` does not validate those intermediate equalities.

**Witness:** at `x=y=1,z=e`, the original expression is `-n`, but the line `log(x^m)+log(y)-log(log(z^n))` is `-log(n)`.

**Fix:** use `log(x^m)+log(y)-log(z^n)` and then `log(x^m*y/z^n)`, stating positive-variable assumptions.

**Proposed regression:** substitute `x=y=1,z=e` for a permitted `n` into every displayed equality and check that each value agrees.

### IM45-18: Practice-test prompt omits the equation to solve {#im45-18}

**Status:** confirmed formulation omission. **Severity:** medium.

**Source:** [PT-4-7-(Quadratic-exponentials).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/PT-4-7-%28Quadratic-exponentials%29.xml)

The prompt says to solve an equation but displays only `quad1` followed by the answer field. The `=0` present in the teaching version and feedback is absent. An expression by itself has no solution set; the key corresponds specifically to `quad1=0`.

**Fix:** append `=0` to the displayed expression.

**Proposed regression:** render the learner prompt and verify that it contains the complete equation; retain and check the existing valid solution for that equation.

### IM45-19: Exponential-law inference needs a positive-base assumption {#im45-19}

**Status:** confirmed under-specified mathematical task. **Severity:** medium.

**Source:** [4-1-9-(Simple-exp-laws).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-04---Exponential-and-logarithmic-functions/4-1-9-%28Simple-exp-laws%29.xml)

The question infers `x^(a/2)=sqrt(A)` from `x^a=A>0` without requiring `x>0`. For a negative base and even integral `a`, the claimed conclusion need not hold.

**Witness:** the permitted value `A=9` allows `x=-3,a=2`. Then `x^a=9`, but `x^(a/2)=-3`, while the key gives 3.

**Fix:** state `x>0` with real exponents, or impose suitable alternative restrictions that justify the laws being applied.

**Proposed regression:** verify that the witness is excluded by the repaired hypotheses; the corresponding positive-base case `x=3,a=2` gives the intended answer 3.

### IM45-20: Period definitions omit positivity and conflate cycloid repetition {#im45-20}

**Status:** confirmed definition issue; cycloid wording needs clarification. **Severity:** low.

**Sources:** [5-3-1-(Periodicity).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-3-1-%28Periodicity%29.xml); [5-3-5-(Periodic-and-odd-even-again).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Introductory-Mathematics/Week-05---Trigonometric-functions/5-3-5-%28Periodic-and-odd-even-again%29.xml)

The descriptions define a period as the smallest number `p` satisfying `f(x+p)=f(x)`, without requiring positivity. The first also calls a rolling-circle cycloid a periodic function, conflating repetition of its shape under horizontal translation with a periodic parametrized curve.

**Witnesses:** `p=0` satisfies the equation for every function; negative multiples of a genuine period have no smallest value. For a standard cycloid, the horizontal coordinate satisfies `x(t+2*pi)=x(t)+2*pi*r`, so the full parametrized position does not repeat.

**Fix:** say 'least positive period, when one exists'. Distinguish a periodically repeating height/shape from a periodic parametrized position, and name the intended representation of the cycloid.

**Proposed regression:** the definition should give sine the least positive period 360 degrees, exclude 0, and acknowledge that a constant function has no least positive period.

### Runs still needed for this partition

Execute the proposed cases in native STACK/Maxima, including distinct-root grading, generator boundaries, and repaired feedback. Inspect embedded figures and external applets in the Moodle renderer, particularly degree/radian interpretation and graph-identification tasks. Check PRT score normalization separately in multi-bound range questions: some node scores sum to 2, and native behavior must be established before treating that observation as a grading defect. This additional concern is **not** counted as a confirmed finding above.

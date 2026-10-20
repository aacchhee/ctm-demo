## HELM chapters 1–13 and numerical Course collection

Source revision: `33383047af39c204bf4442802a058f8b918b2b1b` of maths/moodle-qtype_stack.

**Scope and actual review depth**

The partition contains 1,240 XML files: 706 STACK, 407 descriptions, 81 category records, 15 essay, 14 gapselect, 12 multichoice, 3 ddwtos and 2 matching. It covers HELM Course_quiz chapter numbers 1–13 inclusive and HELM/Course (numerical chapters 30–33).

All files were parsed and inventoried. All 706 STACK definitions received structural screening and batch review of compact mathematical/PRT summaries. Candidate findings were checked against full XML, inputs, targets and complete relevant PRT paths. All 453 description/non-STACK records additionally received a compact mathematical claim/formula screen; the five supplemental candidates below were read in full extracted text and source XML.

This is a screening audit, not exhaustive mathematical certification. Long formula blocks were condensed in the broad pass; embedded figures were not visually inspected; all non-STACK grading weights/alternatives were not validated. No Moodle/STACK/Maxima runtime was available. Sixteen arithmetic witness assertions passed locally, but these are not executed native STACK regressions. Native tests proposed below remain to be run.

**Source-proven** means source logic plus a mathematical counterexample. PRT score predictions are static path traces, pending native reproduction. **Clarification** records an explicit convention or wording decision rather than a confirmed mathematical defect. There are 27 entries: 26 source-proven findings and one clarification. No runtime-only candidates are included.


### HE1-01 Sine calculator answer is compared with itself {#he1-01}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_4_1-right---angled-triangles/top/Default-for-4-1/4-1-1-6-Task-sin,-cos,-tan-using-calculator.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_4_1-right---angled-triangles/top/Default-for-4-1/4-1-1-6-Task-sin%2C-cos%2C-tan-using-calculator.xml).

**Problem:** PRT prt1 uses NumDecPlaces(ans1,ans1,4), comparing the response with itself instead of the sine target ta1.

**Concrete witness:** For th1=1.9 degrees, correct four-place answer is 0.0332; a wrong four-place answer such as 0.5000 satisfies the self-comparison.

**Repair:** Change tans from ans1 to ta1.

**Proposed native regression:** At th1=1.9 accept 0.0332; reject 0.5000 and another wrong four-place value.


### HE1-02 Power-law exercise accepts incorrect exponent operations {#he1-02}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_1_2-indices/top/Default-for-1-2/1-2-5-6-Simplify-indices.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_1_2-indices/top/Default-for-1-2/1-2-5-6-Simplify-indices.xml).

**Problem:** Full-credit alternate targets ta2n and ta3n multiply/divide exponents instead of adding/subtracting them.

**Concrete witness:** For b1=1/4,b2=1/2, the product requires x^(3/4), but x^(1/8) is accepted. The quotient requires x^(1/4), but x^2 is accepted. At x=16 the quotient is 2, not 256.

**Repair:** Remove the false alternatives or construct algebraically equivalent keys using the correct exponent laws.

**Proposed native regression:** Accept x^(3/4) and reject x^(1/8) for the product; accept x^(1/4) and reject x^2 for the quotient.


### HE1-03 Natural-spline PRT tests teacher continuity {#he1-03}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course/top/30-33-Questions-not-in-quizzes/31-1-Polynomial-Approximations/HELM-31-1-E4-Natural-Spline.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course/top/30-33-Questions-not-in-quizzes/31-1-Polynomial-Approximations/HELM-31-1-E4-Natural-Spline.xml).

**Problem:** Internal-knot derivative comparisons use teacher functions s1,s2,s3 rather than student S_s1,S_s2,S_s3.

**Concrete witness:** For X=[2,4,5,7], Y=[1.34,1.84,1.12,0.02], submit 1.34+0.25*(x-2), 1.84-0.72*(x-4), 1.12-0.55*(x-5). They interpolate and have zero endpoint second derivatives, but slopes jump. The teacher continuity checks leave score 1.

**Repair:** Use student expressions in every internal first- and second-derivative continuity comparison.

**Proposed native regression:** Reject these three segments; reject independent C1/C2 failures; accept the teacher natural cubic spline.


### HE1-04 Logarithmic-integral prompts and randomized keys disagree {#he1-04}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_13_5-substitution-and-partial-fractions/top/Default-for-13-5/13-5-3-2-T-Find-Integrals.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_13_5-substitution-and-partial-fractions/top/Default-for-13-5/13-5-3-2-T-Find-Integrals.xml).

**Problem:** Displayed integrands have fixed constants 1,8,3, while targets use randomized a1,a2,a3.

**Concrete witness:** At a1=2,a2=9,a3=4, keys log(x+2), log(x^2+9), log(x-4) differentiate to different functions from displayed 1/(x+1), 2*x/(x^2+8), 1/(x-3).

**Repair:** Interpolate the generated constants in the prompt, or fix generation to the displayed constants.

**Proposed native regression:** Use a nondefault variant; correct displayed antiderivatives must pass and mismatching randomized keys must fail.


### HE1-05 Fourth circle displays the wrong centre coordinate {#he1-05}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_2_6-the-circle/top/Default-for-2-6/2-6-3-2-Find-eq-of-circles.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_2_6-the-circle/top/Default-for-2-6/2-6-3-2-Find-eq-of-circles.xml).

**Problem:** Fourth prompt uses C(x3,y4), whereas ta4 and prt4 use C(x4,y4). Here x3 is positive and x4 negative.

**Concrete witness:** For x3=3,x4=-1,y4=-1,r4=4, displayed circle is (x-3)^2+(y+1)^2=16, but the target is (x+1)^2+(y+1)^2=16.

**Repair:** Change the fourth displayed coordinate from x3 to x4.

**Proposed native regression:** Accept the circle with the displayed centre and reject the other centre.


### HE1-06 Third simultaneous system mixes coefficient matrices {#he1-06}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_3_4-solving-simultaneus-linear-equations/top/Default-for-3-4/3-4-1-5-Solve-simultaneous.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_3_4-solving-simultaneus-linear-equations/top/Default-for-3-4/3-4-1-5-Solve-simultaneous.xml); [samplequestions/stacklibrary/HELM/Course_quiz_3_4-solving-simultaneus-linear-equations/top/Default-for-3-4/NOT_IN_QUIZ-Use-a-graph-to-solve-simultaneous.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_3_4-solving-simultaneus-linear-equations/top/Default-for-3-4/NOT_IN_QUIZ-Use-a-graph-to-solve-simultaneous.xml).

**Problem:** sysl3 uses A1.B1, while sysr3 and ta3 use A3.

**Concrete witness:** In 3.4.1.5, all matrix rand outputs zero give A1=[[2,-5],[2,2]], A3=[[2,2],[2,2]], ta3=[-25,2], RHS=[-46,-46]. A1*ta3=[-60,-46]; the correct displayed solution is [-23,0].

**Repair:** Set sysl3:A3.B3 and separately guard singular draws when unique solvability is intended.

**Proposed native regression:** Check the explicit variant: every accepted pair must satisfy both displayed equations.


### HE1-07 Quartic exercise reverses the sign of a root {#he1-07}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_3_3-solving-polynomial-equations/top/Default-for-3-3-Solving-Polynomial-Equations/3-3-7-3-Solve-cubic-given-a-root-III-(NOT-IN-QUIZ).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_3_3-solving-polynomial-equations/top/Default-for-3-3-Solving-Polynomial-Equations/3-3-7-3-Solve-cubic-given-a-root-III-%28NOT-IN-QUIZ%29.xml).

**Problem:** Generated polynomial factors as (x-dd)*(x-aa)*((x+bb)^2-cc), but x1=-aa is claimed and keyed as a root.

**Concrete witness:** For aa=-1,bb=1,cc=5,dd=4, polynomial x^4-x^3-14*x^2+4*x+16 has root -1; claimed +1 gives residual 6.

**Repair:** Set x1:aa or generate the polynomial directly from the intended roots.

**Proposed native regression:** Substitute all claimed roots; accept {-1,-1+sqrt(5),-1-sqrt(5),4}, and reject a set containing +1.


### HE1-08 Linear-equation exercise has two prompt/key drifts {#he1-08}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_3_1-solving-linear-equations/top/Default-for-3-1/3-1-2-14-Solve-a-linear-equation_10.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_3_1-solving-linear-equations/top/Default-for-3-1/3-1-2-14-Solve-a-linear-equation_10.xml).

**Problem:** Part (c) displays d3*x-7 but keys d3*x-e3; part (d) displays denominator x-1 but keys x+1.

**Concrete witness:** For b3=2,d3=1,e3=4, correct (c) solution is 105/4 but key is 15. For a5=c5=2, correct (d) solution is 1/2 but key is 3/2.

**Repair:** Use one equation definition to generate both presentation and targets.

**Proposed native regression:** Accept 105/4 and 1/2 in these explicit variants; reject the mismatching keys.


### HE1-09 Exponential equation uses the wrong logarithm {#he1-09}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_6_4-the-logarithmic-function/top/Default-for-6-4/6-4-4-4-Exercises.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_6_4-the-logarithmic-function/top/Default-for-6-4/6-4-4-4-Exercises.xml).

**Problem:** For 1/(c1-pi^x)=c2, target uses log10(c1-1/c2-pi), rather than log(c1-1/c2)/log(pi).

**Concrete witness:** For c1=17,c2=4, correct x is approximately 2.462064; the stored expression gives approximately 1.133807.

**Repair:** Use the change-of-base formula after isolating pi^x.

**Proposed native regression:** Substitute accepted roots into the original equation; reject the stored wrong expression.


### HE1-10 Spring phase has the wrong sine sign {#he1-10}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_4_5-applications-of-trigonometry-to-waves/top/Default-for-4-5/4-5-4-9-Exercise-Weight-on-spring-(NOT-IN-QUIZ).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_4_5-applications-of-trigonometry-to-waves/top/Default-for-4-5/4-5-4-9-Exercise-Weight-on-spring-%28NOT-IN-QUIZ%29.xml).

**Problem:** Representation of A*cos(w*t)-B*sin(w*t) as a positive-amplitude sine uses first-quadrant atan(A/B), appropriate to a plus-sine coefficient.

**Concrete witness:** For A=B=1, phase pi/4 gives cos(w*t)+sin(w*t), whereas the required phase is 3*pi/4.

**Repair:** Use alpha=pi-atan(A/B), allowing equivalent phases.

**Proposed native regression:** Expand accepted shifted sine expressions and compare both cosine and sine coefficients.


### HE1-11 Trigonometric worked feedback contains false identities {#he1-11}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_13_6-integration-of-trigonometric-functions/top/Default-for-13-6/13-6-1-4-T-Integrate-after-trigonometric-indentity.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_13_6-integration-of-trigonometric-functions/top/Default-for-13-6/13-6-1-4-T-Integrate-after-trigonometric-indentity.xml); [samplequestions/stacklibrary/HELM/Course_quiz_13_6-integration-of-trigonometric-functions/top/Default-for-13-6/13-6-3-4-T-Wallis-s-formula.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_13_6-integration-of-trigonometric-functions/top/Default-for-13-6/13-6-3-4-T-Wallis-s-formula.xml).

**Problem:** Feedback writes sin(theta)^2=(1-cos(theta))/2, missing the double angle. The Wallis discussion also defines I_n using sin^2 instead of sin^n.

**Concrete witness:** At theta=pi/2 the printed identity gives 1=1/2.

**Repair:** Use cos(2*theta) and correct the I_n integrand exponent.

**Proposed native regression:** Check the identity at pi/2; verify recurrence notation for n=3.


### HE1-12 Complex quotient generation permits undefined cases {#he1-12}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_10_2-the-argand-diagram-and-polar-form/top/Default-for-10-2/10-2-3-6-Division-(NOT-IN-QUIZ).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_10_2-the-argand-diagram-and-polar-form/top/Default-for-10-2/10-2-3-6-Division-%28NOT-IN-QUIZ%29.xml).

**Problem:** For w=(z+i)/(z-i), allowed radius 1 and argument plus/minus pi/2 yield division by zero or zero with undefined argument.

**Concrete witness:** At z=i the denominator is zero. At z=-i, w=0, so arg(w) is undefined.

**Repair:** Exclude these draws or explicitly assess undefined cases.

**Proposed native regression:** Exercise both z=i and z=-i and require explicit undefined handling.


### HE1-13 Line classifier can generate a line labelled Other {#he1-13}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_2_5-the-straight-line/top/Default-for-2-5/2-5-1-8-Classify-as-line-or-other.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_2_5-the-straight-line/top/Default-for-2-5/2-5-1-8-Classify-as-line-or-other.xml).

**Problem:** The second generated function is y=x to a random ratio power. Overlapping numerator/denominator ranges allow exponent 1 while the key remains Other.

**Concrete witness:** Equal draws of 1 give y=x, a straight line.

**Repair:** Exclude exponent 1 or derive classification from the generated expression.

**Proposed native regression:** Use equal exponent draws and classify the result as a line.


### HE1-14 Gravity interpretation PRT grades the preceding answer {#he1-14}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_5-1-the-modelling-cycle-and-functions/top/Default-for-5-1/5-1-1-6.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_5-1-the-modelling-cycle-and-functions/top/Default-for-5-1/5-1-1-6.xml).

**Problem:** prt7 belongs to qualitative choice ans7 but compares ans6 with ta6, duplicating the previous formula assessment.

**Concrete witness:** Correct lunar-velocity ans6 with incorrect ans7 still follows the final success path; wrong ans6 with correct interpretation fails.

**Repair:** Grade ans7 against ta7.

**Proposed native regression:** Vary ans6 and ans7 independently; final interpretation score must depend on ans7.


### HE1-15 Wave-equation prompts disagree with randomized parameters {#he1-15}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course/top/30-33-Questions-not-in-quizzes/32-5-Hyperbolic-PDEs/HELM-32-5-E1-Wave-Equation,-Single-Time-Step.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course/top/30-33-Questions-not-in-quizzes/32-5-Hyperbolic-PDEs/HELM-32-5-E1-Wave-Equation%2C-Single-Time-Step.xml); [samplequestions/stacklibrary/HELM/Course/top/30-33-Questions-not-in-quizzes/32-5-Hyperbolic-PDEs/HELM-32-5-E2-Wave-equation,-Two-first-timesteps.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course/top/30-33-Questions-not-in-quizzes/32-5-Hyperbolic-PDEs/HELM-32-5-E2-Wave-equation%2C-Two-first-timesteps.xml).

**Problem:** E1 displays speed 1.4 while generation allows 1.3,1.4,1.5. E2 varies L over 0.8,1,1.2 while the boundary remains u(1,t)=0.

**Concrete witness:** For c=1.3 in E1, the stencil coefficient uses c^2=1.69 rather than the displayed 1.96. For L=0.8 in E2, the generated right endpoint differs from displayed 1.

**Repair:** Interpolate c and L consistently, or fix generation to displayed values.

**Proposed native regression:** Check nondefault speed and length variants against displayed data and the finite-difference stencil.


### HE1-16 Inverse-matrix generators permit singular matrices {#he1-16}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_8_2-solution-by-inverse-matrix-method/top/Default-for-8-2/8-2-1-5-Exercise-1-2x2-linear-system-inverse-matrix-method.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_8_2-solution-by-inverse-matrix-method/top/Default-for-8-2/8-2-1-5-Exercise-1-2x2-linear-system-inverse-matrix-method.xml); [samplequestions/stacklibrary/HELM/Course_quiz_7_4-the-inverse-of-a-matrix/top/Default-for-7-4/7-4-2-3-Which-2-x-2-matrix-has-an-inverse-.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_7_4-the-inverse-of-a-matrix/top/Default-for-7-4/7-4-2-3-Which-2-x-2-matrix-has-an-inverse-.xml).

**Problem:** One question computes invert(A) without rejecting singular draws. Another always labels randomized D invertible though allowed entries can make it singular.

**Concrete witness:** A with all entries 2 and RHS=[1,2] is inconsistent and cannot be solved by inversion. D with all entries 1 has determinant zero.

**Repair:** Reject determinant-zero draws where inversion is intended; derive invertibility classifications from determinants.

**Proposed native regression:** Exercise both singular witnesses; require no invalid inverse or fixed Invertible label.


### HE1-17 Infinitely-many-solutions generator can be inconsistent {#he1-17}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_8_2-solution-by-inverse-matrix-method/top/Default-for-8-2/8-2-3-4-Exercise-3x3-linear-system-infinitely-many-solutions.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_8_2-solution-by-inverse-matrix-method/top/Default-for-8-2/8-2-3-4-Exercise-3x3-linear-system-infinitely-many-solutions.xml).

**Problem:** The first two equations can share coefficients but have unequal right sides; a dependent third equation does not ensure consistency.

**Concrete witness:** a1=a2=b1=b2=1,c1=c2=-1,d1=1,d2=3 requires x+y-z to equal both 1 and 3.

**Repair:** Generate the right side from a chosen solution and a coefficient matrix of intended rank.

**Proposed native regression:** Reject the inconsistent witness; verify rank(A)=rank([A|b])<3 for intended infinitely-many variants.


### HE1-18 Plane-distance question keys only one offset sign {#he1-18}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_9_5-lines-and-planes/top/Default-for-9-5/9-5-4-5-Vector-and-Cartesian-equation-of-a-plane,-Exercise.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_9_5-lines-and-planes/top/Default-for-9-5/9-5-4-5-Vector-and-Cartesian-equation-of-a-plane%2C-Exercise.xml).

**Problem:** Specified normal direction and distance 1 from the origin permit two offset signs, but only one is keyed.

**Concrete witness:** For n=[4,0,10], both n dot r=+sqrt(116) and n dot r=-sqrt(116) have distance 1 from the origin.

**Repair:** Accept both signs or specify the required side/orientation.

**Proposed native regression:** Accept both planes without a side restriction; reject offsets of the wrong magnitude.


### HE1-19 Water-level data do not determine oscillation direction {#he1-19}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_5_3-oscillating-functions-and-modelling/top/Default-for-5-3/5-3-2-6-Water-level.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_5_3-oscillating-functions-and-modelling/top/Default-for-5-3/5-3-2-6-Water-level.xml).

**Problem:** Mean level, amplitude, period and starting at the mean allow both sine signs, but only positive sine is keyed.

**Concrete witness:** m+A*sin(2*pi*t/T) and m-A*sin(2*pi*t/T) satisfy the stated data and differ at t=T/4.

**Repair:** Specify initially rising/falling or accept both phases.

**Proposed native regression:** Accept both models under existing wording; test the chosen direction after clarification.


### HE1-20 Exponential exercise uses an unrelated random exponent {#he1-20}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_6_1-the-exponential-function/top/Default-for-6-1/6-1-5-1-Exercises-(NOT-IN-QUIZ).xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_6_1-the-exponential-function/top/Default-for-6-1/6-1-5-1-Exercises-%28NOT-IN-QUIZ%29.xml).

**Problem:** Part (g) displays e^(q51*pi) but grades e^(q72*pi), from different random draws and ranges.

**Concrete witness:** For q51=2,q72=1/2, displayed value is approximately 535.492; keyed value is approximately 4.810.

**Repair:** Use the same parameter in the prompt and key.

**Proposed native regression:** Exercise unequal q51,q72 and check the numerical value of the displayed expression.


### HE1-21 Pole keys include removable singularities {#he1-21}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_2_7-some-common-functions/top/Default-for-2-7/2-7-2-6-The-poles-of-rational-functions.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_2_7-some-common-functions/top/Default-for-2-7/2-7-2-6-The-poles-of-rational-functions.xml).

**Problem:** Keys classify denominator zeros as poles even when the numerator cancels the corresponding factor.

**Concrete witness:** At rand9=1, (x-1)/(x^2-1) has a removable singularity at +1 and a pole only at -1, whereas the key lists both. Another allowed case is (t-1)/(t-1).

**Repair:** Cancel common factors before identifying poles or distinguish removable singularities explicitly.

**Proposed native regression:** At rand9=1 accept only {-1} as poles and classify +1 as removable.


### HE1-22 Clarify the zero-polynomial degree convention {#he1-22}

**Status:** clarification.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_2_7-some-common-functions/top/Default-for-2-7/2-7-1-3-Polynomial-degree-or-not-poly.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_2_7-some-common-functions/top/Default-for-2-7/2-7-1-3-Polynomial-degree-or-not-poly.xml); [samplequestions/stacklibrary/HELM/Course_quiz_2_7-some-common-functions/top/Default-for-2-7/2-7-1-7-is-p(z)-constant-with-variable-z.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_2_7-some-common-functions/top/Default-for-2-7/2-7-1-7-is-p%28z%29-constant-with-variable-z.xml).

**Problem:** These questions assign degree 0 to the zero polynomial. Other conventions leave it undefined or use minus infinity. That convention difference alone does not establish a defect.

**Concrete witness:** A zero-polynomial variant can conflict with a response following the undefined/minus-infinity convention. No explicit contradictory local course definition was established.

**Repair:** State the course convention and align feedback and allowed responses.

**Proposed native regression:** Exercise a zero-polynomial variant and verify the stated convention is applied consistently.


### HE1-S01 Decimal-place examples change the integer and precision {#he1-s01}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_1_1-mathematical-notation-and-symbols/top/Default-for-1-1/1-1-3-1-Rounding-to-n-Decimal-Places.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_1_1-mathematical-notation-and-symbols/top/Default-for-1-1/1-1-3-1-Rounding-to-n-Decimal-Places.xml).

**Problem:** The table states 2136=2000.000 to three decimal places and 36.8=37 to one decimal place.

**Concrete witness:** Correct rounded outputs are 2136.000 and 36.8.

**Repair:** Replace both table outputs.

**Proposed native regression:** Check all table entries at their stated precision.


### HE1-S02 Circle expansion uses x in place of y {#he1-s02}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_2_6-the-circle/top/Default-for-2-6/2-6-1-8-Expanded-equation-of-the-circle.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_2_6-the-circle/top/Default-for-2-6/2-6-1-8-Expanded-equation-of-the-circle.xml).

**Problem:** Expansion of (x-3)^2+(y-4)^2=4 uses -8x twice and calls the result a valid equation for that circle.

**Concrete witness:** The original circle contains (3,6); claimed x^2-6x+y^2-8x+21 evaluates to 24 there.

**Repair:** Replace both -8x terms with -8y.

**Proposed native regression:** Expand symbolically and verify equivalence with the original circle.


### HE1-S03 Double-root definition reverses the second-derivative condition {#he1-s03}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_12_3-the-newton–raphson-method/top/Default-for-12-3/12-3-1-1-The-Newton-Raphson-Method.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_12_3-the-newton%E2%80%93raphson-method/top/Default-for-12-3/12-3-1-1-The-Newton-Raphson-Method.xml).

**Problem:** The printed double-root definition requires f(x0)=f'(x0)=f''(x0)=0. Multiplicity exactly two instead requires the second derivative to be nonzero.

**Concrete witness:** x^2 has a double root at zero and second derivative 2. x^3 satisfies the printed conditions but has a triple root.

**Repair:** Change the final =0 to nonzero, with the needed differentiability assumptions.

**Proposed native regression:** Apply the definition to x^2 and x^3 at zero.


### HE1-S04 Elimination examples report incorrect signs {#he1-s04}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_3_4-solving-simultaneus-linear-equations/top/Default-for-3-4/3-4-1-2-Introduction-elimination.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_3_4-solving-simultaneus-linear-equations/top/Default-for-3-4/3-4-1-2-Introduction-elimination.xml).

**Problem:** The second example says -2y=-6 gives y=-3, though its next substitution uses +3. The third derives x=-16 but finally reports x=16.

**Concrete witness:** Reported third pair (16,2) gives 86 in 5x+3y=-74; correct (-16,2) satisfies both equations.

**Repair:** Use y=3 throughout the second example and x=-16 in the third final solution.

**Proposed native regression:** Substitute each reported pair into both original equations.


### HE1-S05 Gradient lesson gives a wrong model and reciprocal slope {#he1-s05}

**Status:** source-proven.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_5-1-the-modelling-cycle-and-functions/top/Default-for-5-1/5-1-1-16-Methods-for-calculating-gradient.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_5-1-the-modelling-cycle-and-functions/top/Default-for-5-1/5-1-1-16-Methods-for-calculating-gradient.xml).

**Problem:** After finding slope 2.4 through (4,15),(9,27), the lesson substitutes 2.5 and reports intercept 5. The concluding general slope formula is inverted.

**Concrete witness:** v=2.4t+5 gives 14.6 and 26.6 at the supplied times; correct intercept is 5.4. Through (0,0),(2,6), slope is 3 while the printed reciprocal gives 1/3.

**Repair:** Use b=5.4 and update the model/extrapolation. State slope (q-s)/(p-r), substitute y=q at x=p and y=s at x=r. Correct the earlier sentence claiming v=0 at t=12.

**Proposed native regression:** Check both supplied data points and a general two-point example.


**Precision checks and exclusions**

HE1-01, HE1-02, HE1-03, HE1-04 and HE1-06 were rechecked against input declarations and full relevant PRT paths. Preliminary concerns about cross-product signs and partial-fraction alternatives were withdrawn after tracing helper signs and terminating branches; they are not findings. HE1-22 intentionally remains a convention clarification.

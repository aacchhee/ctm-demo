## HELM chapters 14–23

**Source revision:** `33383047af39c204bf4442802a058f8b918b2b1b`.

This partition contains **524 noncategory XML files**: 279 STACK questions, 235 descriptions and 10 ordinary multiple-choice questions. All 524 were retrieved; six large chapter 18.3 files were recovered by exact blob SHA after the contents reader failed. Prompts, variables and 1,156 PRT nodes were extracted for broad static triage. The 18 findings below received detailed source inspection and mathematical or branch-score witnesses.

**Depth and limitations:** static audit, without exhaustive mathematical proof for each unflagged question or every random variant. Some broad-triage summaries were shortened; image-only statements and interactive graph behavior were not visually validated. No Moodle/STACK/Maxima execution was completed. Proposed native tests remain **runs needed**. Score statements describe source paths rather than observed native-engine runs.

### HL-01: Surface area uses the wrong lower limit {#hl-01}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[14-4-2-3-Exercise-2.xml, line 37](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_14_4-lengths-of-curves-and-surfaces-of-revolution/top/Default-for-14-4/14-4-2-3-Exercise-2.xml#L37)

**What is wrong.** The prompt specifies $a\le x\le b$, with all generated lower limits positive, but the teacher answer integrates from zero to $b$.

**Witness.** For permitted `[m,a,b]=[1,1,2]`, the surface integrand is $\pi\sqrt{4x+1}$. The required answer is $\pi(27-5\sqrt5)/6$; the stored answer is $13\pi/3$, including the extra surface over $[0,1]$.

**Repair.** Use `integrate(2*pi*y*sqrt(1+dy^2),x,a,b)` and correct the worked solution.

**Proposed native tests.** For every tuple in `VL`, accept the integral from `a` to `b` and reject the old integral from zero.

### HL-02: Integral PRTs give full credit for an upper limit alone {#hl-02}

**Priority:** High. **Status:** static PRT finding; native runtime pending.

[14-4-2-1-Area-of-surface.xml, line 243](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_14_4-lengths-of-curves-and-surfaces-of-revolution/top/Default-for-14-4/14-4-2-1-Area-of-surface.xml#L243)

**What is wrong.** `prt1` checks `ans1up`, then incorrectly checks `ans2dn` and `ans2int`. It never checks `ans1dn` or `ans1int`. Both `prt1` and `prt2` assign score 1 at the first upper-limit node and make only zero-score changes afterwards.

**Witness.** With `ans1up=4`, `ans1dn=99`, `ans1int=0`, and all second-integral inputs populated, `prt1` reaches score 1 irrespective of the incorrect first lower limit and integrand. `ans2up=2305` similarly gives score 1 in `prt2` despite wrong remaining components.

**Repair.** Use `ans1dn/ta1dn` and `ans1int/ta1int` in `prt1`. Award explicit component credit or reset scores on failing branches; keep each PRT's dependencies local to its integral.

**Proposed native tests.** Make each component wrong independently; no incorrect integral should earn full credit. Evaluate the first integral before filling the second.

### HL-03: Part (b) expansion PRT tests part (a)'s input {#hl-03}

**Priority:** High. **Status:** static PRT finding; native runtime pending.

[16-3-1-2-Using-binomial-theorem-obtain.xml, line 205](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_16_3-the-binomial-series/top/Default-for-16-3/16-3-1-2-Using-binomial-theorem-obtain.xml#L205)

**What is wrong.** After checking `ans2` against `ta2`, the `Expanded` node in `prt2` uses `ans1/ta1`, making part (b)'s credit depend on an unrelated answer.

**Witness.** Give part (a) equivalent unexpanded `(aa+x)^ai` and part (b) its fully expanded correct polynomial. Part (b)'s expansion check instead examines unexpanded part (a). Conversely, expanded part (a) permits equivalent unexpanded part (b).

**Repair.** Change the second node's arguments to `ans2/ta2`.

**Proposed native tests.** Cross expanded/unexpanded forms independently. Varying only `ans1` must not change part (b)'s grade.

### HL-04: Binomial model has an incorrect linear coefficient {#hl-04}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[16-3-1-5-End-exercises.xml, line 50](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_16_3-the-binomial-series/top/Default-for-16-3/16-3-1-5-End-exercises.xml#L50)

**What is wrong.** For $(1-x)^c$, `ta3` starts $1+x/c$ instead of $1-cx$.

**Witness.** For `cc=1/3`, the correct polynomial is $1-x/3-x^2/9-5x^3/81$. The model is $1+3x-x^2/9-5x^3/81$.

**Repair.** Generate `ta3` using `taylor((1-x)^cc,x,0,3)`.

**Proposed native tests.** For every permitted `cc`, compare coefficients against derivatives at zero; accept the corrected polynomial and reject the old one.

### HL-05: Documented all alias earns zero {#hl-05}

**Priority:** Medium. **Status:** static branch-score finding; native runtime pending.

[16-2-5-3-Convergence-with-a-parameter.xml, line 284](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_16_2-infinite-series-and-convergence-tests/top/Default-for-16-2/16-2-5-3-Convergence-with-a-parameter.xml#L284)

**What is wrong.** The hint accepts `R` or `all` for an everywhere convergent series. `prt4` awards 1 for `R`, but the branch matching `all` adds zero after the initial failure assigned zero.

**Witness.** `ans4=all` matches the second node and finishes at score 0; `ans4=R` finishes at score 1.

**Repair.** Make the alias branch assign score 1, or normalize aliases before comparison.

**Proposed native tests.** Both aliases should earn 1; incorrect bounded domains should earn zero.

### HL-06: Separable ODE solution misses a factor {#hl-06}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[19-2-2-4-Separation-of-Variables-Ex2.xml, line 40](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_2-first-order-differential-equations/top/Default-for-19-2/19-2-2-4-Separation-of-Variables-Ex2.xml#L40)

**What is wrong.** Model is `log(aa*bb*x^(nn+1)/(nn+1)+exp(bb))`, although $y'=aa\,x^{nn}e^{-bb y}$ and $y(0)=1$. Separation gives the same logarithm divided by `bb`.

**Witness.** At zero the stored model gives $y(0)=bb\ge2$, contradicting the initial condition for every instance.

**Repair.** Divide the logarithm by `bb`; update feedback.

**Proposed native tests.** Check the initial condition and differential residual across all permitted coefficients; reject the old model.

### HL-07: Second ODE part is not graded {#hl-07}

**Priority:** High. **Status:** static PRT finding; native runtime pending.

[19-2-2-5-Separation-of-Variables-Ex3.xml, line 154](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_2-first-order-differential-equations/top/Default-for-19-2/19-2-2-5-Separation-of-Variables-Ex3.xml#L154)

**What is wrong.** `prt2` repeats `ans1/ta1` instead of checking `ans2/ta2`.

**Witness.** `ans1=a1*x`, `ans2=0` gives part (b) full credit despite the required particular term $-a2\cos x$. Changing `ans2` cannot change the PRT result.

**Repair.** Use `ans2/ta2` in `prt2`.

**Proposed native tests.** Grade correct/incorrect part (b) differently with part (a) fixed. Varying part (a) must not affect part (b)'s grade.

### HL-08: Exact-equation prompt omits the dependent variable {#hl-08}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[19-2-5-6-Solving-an-Exact-Equation-Ex3.xml, line 9](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_2-first-order-differential-equations/top/Default-for-19-2/19-2-5-6-Solving-an-Exact-Equation-Ex3.xml#L9)

**What is wrong.** Displayed equation is $e^{bx}y'+b e^{bx}=ax^2$. The expected exact form and solution instead solve $e^{bx}y'+b e^{bx}y=ax^2$.

**Witness.** At zero, the model particular solution with integration constant zero has derivative zero. The displayed left side is then $b$, while its right side is zero.

**Repair.** Insert missing $y$ after the second exponential, or rederive all answers for the equation as displayed.

**Proposed native tests.** Differentiate the exact form and compare every term to the displayed equation; require zero solution residual.

### HL-09: Quadratic root multiplies by L instead of dividing {#hl-09}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[19-3-2-9-Complementary-Func-Ex2.xml, line 32](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_3-second-order-differential-equations/top/Default-for-19-3/19-3-2-9-Complementary-Func-Ex2.xml#L32)

**What is wrong.** Negative-root model uses `(1/2*L)`, meaning $L/2$, rather than `1/(2*L)`.

**Witness.** For $L=2,R=5,C=1$, correct roots are $(-5\pm\sqrt{17})/4$. Stored negative root is $-5-\sqrt{17}$, not a root of $2k^2+5k+1$.

**Repair.** Replace `(1/2*L)` by `1/(2*L)`.

**Proposed native tests.** For nonunit $L$, substitute both roots into $Lk^2+Rk+1/C$; require zero and accept either ordering.

### HL-10: Inverse Laplace sine has the wrong argument {#hl-10}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[20-2-3-5-The-first-shift-theorem.xml, line 39](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_20_2-the-transform-and-its-inverse/top/Default-for-20-2/20-2-3-5-The-first-shift-theorem.xml#L39)

**What is wrong.** Model for $3/((s-2)^2+2)$ is $(3/\sqrt2)e^{2t}\sin\sqrt{2t}\,u(t)$. Sine argument should be $\sqrt2\,t$.

**Witness.** Correct inverse behaves as $3t$ near zero from the right; the stored model behaves as $3\sqrt t$, with unbounded right derivative.

**Repair.** Change `sin((2*t)^(1/2))` to `sin(sqrt(2)*t)`.

**Proposed native tests.** Accept the standard inverse and reject the old model; verify its forward Laplace transform.

### HL-11: Sixth Fourier harmonic is cosine instead of sine {#hl-11}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[23-2-6-1-fs-ex1-(new-question-version).xml, line 64](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_23_2-representing-periodic-functions/top/Default-for-23-2/23-2-6-1-fs-ex1-%28new-question-version%29.xml#L64)

**What is wrong.** For the $2\pi$-periodic pulse 1 on $(0,\pi/2)$ and zero elsewhere, the model ends with $\cos(6t)/(3\pi)$. Its sixth cosine coefficient is zero and sine coefficient $1/(3\pi)$.

**Witness.** Integration gives $a_6=\sin(3\pi)/(6\pi)=0$, $b_6=(1-\cos(3\pi))/(6\pi)=1/(3\pi)$.

**Repair.** Replace the final `cos(6*t)` by `sin(6*t)`.

**Proposed native tests.** Derive coefficients for $n=1,\ldots,6$ from defining integrals; accept corrected sum and reject the old one.

### HL-12: Smoothness does not imply equality with the Taylor series {#hl-12}

**Priority:** Medium. **Status:** mathematical counterexample; editorial correction.

[16-5-4-1-The-Taylor-series.xml, line 12](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_16_5-maclaurin-and-taylor-series/top/Default-for-16-5/16-5-4-1-The-Taylor-series.xml#L12)

**What is wrong.** Key point says arbitrarily differentiable $f$ equals its infinite Taylor series. Smoothness alone is insufficient.

**Witness.** Set $f(0)=0$, $f(x)=e^{-1/x^2}$ for nonzero $x$. All derivatives at zero vanish, so its Taylor series is zero, while $f(x)>0$ off zero.

**Repair.** State finite Taylor formula with remainder, or require analyticity or vanishing Taylor remainder.

**Proposed native tests.** Editorial regression against this counterexample; distinguish formal series from representation of the function.

### HL-13: Repeated same eigenvalue receives full credit {#hl-13}

**Priority:** High. **Status:** static PRT finding; native runtime pending.

[22-3-2-4-Complex-conjugate-2x2-eigentask.xml, line 91](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_22_3-repeated-eigenvalues-and-symmetric-matrices/top/Default-for-22-3/22-3-2-4-Complex-conjugate-2x2-eigentask.xml#L91)

**What is wrong.** Each entry is tested only for membership in the correct eigenvalue list; both distinct eigenvalues need not be supplied.

**Witness.** For every instance, `matrix([%i*imp,%i*imp])` passes both tests and scores $0.5+0.5=1$, omitting the negative imaginary eigenvalue.

**Repair.** Compare unordered multisets, or test that each correct distinct eigenvalue occurs in the answer.

**Proposed native tests.** Accept both orderings of the conjugate pair. Duplicating just one eigenvalue must receive at most partial credit.

### HL-14: Modal-matrix generation and feedback invert singular matrices {#hl-14}

**Priority:** High. **Status:** static generator/evaluation-order finding; native failure mode pending.

[22-2-1-6-Finding-modal-matrices.xml, line 34](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_22_2-applications-of-eigenvalues-and-eigenvectors/top/Default-for-22-2/22-2-1-6-Finding-modal-matrices.xml#L34)

**What is wrong.** Random two-column generator does not enforce independence before `invert(p1)`. Feedback variables also evaluate `invert(ans1)` and `invert(ans2)` before determinant branches can diagnose singular student matrices.

**Witness.** Allowed columns $(1,1)^T$ and $(1,1)^T$ give determinant zero. A student zero matrix similarly makes feedback-variable inversion undefined before branching. The precise native exception handling has not been run.

**Repair.** Construct invertible bases or resample until determinant is nonzero; guard inverses in feedback variables and give singular submissions explanatory zero-score feedback.

**Proposed native tests.** Force equal-column generation and require regeneration. Submit singular $2\times2$/$3\times3$ matrices; expect normal zero-score feedback without inversion exception.

### HL-15: Missing assignment can label a symmetric matrix incorrect {#hl-15}

**Priority:** High. **Status:** static Maxima-syntax finding; native runtime pending.

[22-3-2-2-Pick-symmetric-matrices.xml, line 48](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_22_3-repeated-eigenvalues-and-symmetric-matrices/top/Default-for-22-3/22-3-2-2-Pick-symmetric-matrices.xml#L48)

**What is wrong.** Intended off-diagonal modification uses equality `=` instead of assignment `:`. `a6[1,2]` stays unchanged, although the model unconditionally labels `a6` false.

**Witness.** Initial `a6` may have both off-diagonal entries zero. After diagonal entries are made equal it is symmetric. Equality expression does not overwrite the upper-right entry, but selecting this matrix is graded against false.

**Repair.** Use `a6[1,2] : rand_with_prohib(...,[a6[2,1]])` and terminate the statement explicitly.

**Proposed native tests.** Force equal initial off-diagonals; require final asymmetry. Independently verify each multiple-choice label against equality to its transpose.

### HL-16: Conic repair loops do not rebuild their determinants {#hl-16}

**Priority:** High. **Status:** static generator finding; native failure mode pending.

[17-1-1-13-Classifying-conic-sections.xml, line 66](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_17-1-conic-sections/top/Default-for-17-1/17-1-1-13-Classifying-conic-sections.xml#L66)

**What is wrong.** Repair loops mutate coefficient lists without rebuilding polynomials/determinants. Circle/ellipse loops also access index 5 of three-entry lists. Generated equations can have empty real loci, so the intended classification convention should be stated.

**Witness.** Allowed `cir=[2,4,5]`, `c1=1` gives $(x+1)^2+(y+2)^2=0$ and determinant zero. The loop accesses `cir[5]` and never rebuilds `MC`, so cannot establish a nonzero determinant. `cir=[1,2,3]`, `c1=1` gives $(x+1/2)^2+(y+1)^2=-7/4$, an imaginary circle if that convention is intended.

**Repair.** Generate real nondegenerate geometric conics when intended; otherwise define imaginary-conic convention. Every retry needs valid indices and recomputed dependent expressions.

**Proposed native tests.** Force the degenerate witness and require terminating, nondegenerate generation. If restricting to real conics, verify nonempty real loci. Native error or loop behavior remains to be established.

### HL-17: Complementary-function models omit the independent variable {#hl-17}

**Priority:** High. **Status:** static mathematical finding; native runtime pending.

[19-3-2-6-Complex-Roots-of-Aux.xml, line 63](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_3-second-order-differential-equations/top/Default-for-19-3/19-3-2-6-Complex-Roots-of-Aux.xml#L63)

Related: [19-3-2-10-Complementary-Func-Ex3.xml, line 1](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_3-second-order-differential-equations/top/Default-for-19-3/19-3-2-10-Complementary-Func-Ex3.xml#L1) [19-3-2-8-Complementary-Func-Ex1.xml, line 1](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_19_3-second-order-differential-equations/top/Default-for-19-3/19-3-2-8-Complementary-Func-Ex1.xml#L1)

**What is wrong.** Complete factors are modelled as `exp(-bb/2)`, `cos(beta)`, `sin(beta)`, constants rather than functions of the independent variable. Related questions repeat this; part (c) of `19-3-2-8` also has the wrong exponential sign for its negative first-derivative coefficient.

**Witness.** `bb=2`, `cc=4` requires $e^{-x}(A\cos(\sqrt3\,x)+B\sin(\sqrt3\,x))$. The stored product is constant and cannot solve $y''+2y'+4y=0$ except when zero. The generator also permits `bb=4`, `cc=4`, repeated roots although the prompt asks complex roots.

**Repair.** Include the chosen independent variable in every factor; derive the exponential sign from the ODE. Generate genuinely complex roots or explicitly handle all root cases.

**Proposed native tests.** Both proposed basis functions need zero ODE residual and a nonzero Wronskian. Force the repeated-root case; exclude it or use the repeated-root basis.

### HL-18: Worked stationary-point example solves a different function {#hl-18}

**Priority:** High. **Status:** static differentiation finding; editorial correction.

[18-3-2-3-Location-of-stationary-points.xml, line 51](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_18_3-stationary-points/top/Default-for-18-3/18-3-2-3-Location-of-stationary-points.xml#L51)

**What is wrong.** Third example repeats $f(x,y)=x^4+y^4-36xy$, but uses derivatives $3x^2-3$ and $2y-6$, concluding stationary points $(\pm1,3)$. These derivatives belong to another function.

**Witness.** At $(1,3)$, the displayed function has $f_x=4-108=-104$, not zero. Actual stationary points are $(0,0)$, $(3,3)$, $(-3,-3)$, correctly derived in the preceding example.

**Repair.** Replace the third prompt function with $x^3-3x+y^2-6y$ plus any constant, matching its solution, or rewrite the derivatives/points for the stated quartic.

**Proposed native tests.** Differentiate every worked-example prompt; require both derivatives zero at every claimed stationary point.

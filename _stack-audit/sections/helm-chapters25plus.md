## HELM chapters 25 and later

Pinned upstream revision: `33383047af39c204bf4442802a058f8b918b2b1b`.

The broad static screen covered **494 XML records**, using compact stem excerpts, question-variable summaries (tails for long records), multiple-choice choices, and PRT summaries for the first 175 records. Follow-up inspected mathematical variables and PRT summaries of **27 selected full records**, including the related prism volume exercise. Description excerpts were generally 150–400 characters; STACK stem excerpts were generally 450–900 characters. This was an excerpt screen, not complete mathematical certification of all 494 records. Unseen long passages and embedded diagrams may conceal additional defects.

No native Moodle/STACK import, Maxima execution, seed sweep or diagram rendering was performed for this section. “Confirmed” means the mathematical/source counterexample follows from static inspection. Proposed native tests remain to be run. PRT acceptance/rejection statements describe inspected target comparisons and should also be checked end to end in native STACK. The remaining records are not certified correct.

### H25-01 Oscillatory answer targets the opposite ODE sign {#h25-01}

**Status:** Confirmed mathematical defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_25_1-partial-differential-equations/top/Default-for-25-1/25-1-1-5-Auxiliary-equation-Exercise-2.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_25_1-partial-differential-equations/top/Default-for-25-1/25-1-1-5-Auxiliary-equation-Exercise-2.xml#L8-L20); lines 8–20, 33–39, 149–150, 183–184, 219–270.

**Problem:** The stem asks for $y\prime\prime-k^2y=0$, but the auxiliary equation, roots and solution PRT use $m^2+k^2=0$, $\pm ki$ and $A\cos(kx)+B\sin(kx)$, which solve the plus-sign equation.

**Counterexample:** For $k=2$, $y=\cos(2x)$ has residual $-8\cos(2x)$. The valid roots $\pm2$ are rejected in favour of $\pm2i$.

**Fix:** Change the stem sign to plus, or replace the auxiliary equation, roots, solution, PRT feedback variables and worked feedback consistently for the minus equation.

**Proposed native tests:** Use $k=2,4$. If the minus equation remains, accept roots $\pm k$ and the exponential general solution; reject $\pm ki$. Verify the model solution residual is zero.

### H25-02 Claimed heat-equation solution fails for randomized exponents {#h25-02}

**Status:** Confirmed mathematical defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_25_1-partial-differential-equations/top/Default-for-25-1/25-1-2-2-PDE-Solution-Testing.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_25_1-partial-differential-equations/top/Default-for-25-1/25-1-2-2-PDE-Solution-Testing.xml#L8-L14); lines 8–14, 28–34, 126–195.

**Problem:** The generator sets $a\in\{2,3,4,5\}$ and $u=e^{-a\pi^a t}\sin(\pi x)$, then asks students to show $u_{xx}=u_t/a$. Only $a=2$ satisfies the identity. The derivative PRTs correctly differentiate the generated expression, exposing the false claim.

**Counterexample:** At $a=3$, $u_{xx}=-\pi^2u$ but $u_t/3=-\pi^3u$.

**Fix:** Use exponent $-a\pi^2t$ and update feedback. Check the displayed parameter interpolation in the denominator as well.

**Proposed native tests:** For every $a=2,3,4,5$, check $u_{xx}-u_t/a=0$ and accept all three correct derivatives.

### H25-03 Fourier strip solution decays in the wrong coordinate and doubles its zero mode {#h25-03}

**Status:** Confirmed mathematical defect in description; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_25_4-solution-using-fourier-series/top/Default-for-25-4/25-4-1-7.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_25_4-solution-using-fourier-series/top/Default-for-25-4/25-4-1-7.xml#L8-L41); lines 8–41.

**Problem:** The final expression uses $\sum_{n=0}^\infty F_n\cos(n\pi x)e^{-n\pi x}$ rather than decay in $y$. It defines $F_0/2=\int_0^1f(x)\,dx$ but uses $F_0$ as the constant term.

**Counterexample:** For $f=1$, it gives $u=2$, violating the bottom boundary. For $f=\cos(\pi x)$, an unwanted factor $e^{-\pi x}$ remains at $y=0$.

**Fix:** Write $u=F_0/2+\sum_{n=1}^\infty F_n\cos(n\pi x)e^{-n\pi y}$. Preserve the mean mode when the far-field condition is boundedness.

**Proposed native tests:** Check the description with $f=1$ and $f=\cos(\pi x)$: obtain $u=1$ and $e^{-\pi y}\cos(\pi x)$ and verify the PDE and boundary conditions.

### H25-04 Jacobian notation obscures whether a signed or absolute determinant is required {#h25-04}

**Status:** Conditional notation clarification; medium priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_27_4-changing-coordinates/top/Default-for-27-4/27-4-2-4-Task-Transformation.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_27_4-changing-coordinates/top/Default-for-27-4/27-4-2-4-Task-Transformation.xml#L8-L33); lines 8–33, 106–125, 394–395.

**Problem:** For $u=x+y,v=x-y$, the prompt prints $|J|$, while `ta3` is the signed inverse-map determinant $-1/2$. The transformed integral uses a positive factor. Vertical bars may mean the determinant of a Jacobian matrix or the absolute value of a scalar Jacobian, so this is a notation issue unless the course convention explicitly requires absolute value.

**Counterexample:** The signed determinant is $-1/2$ and the absolute area factor is $1/2$. The PRT accepts only the former, while a student reading the bars as absolute value supplies the latter and is rejected.

**Fix:** Explicitly ask for the signed determinant, with suitable notation, or ask for the absolute area factor and target $1/2$. Explain the passage from signed determinant to positive area factor.

**Proposed native tests:** If $|J|$ remains, accept `1/2`, reject `-1/2`, and retain the positive transformed-area factor.

### H25-05 Jacobian stem repeats the x map for all three coordinates {#h25-05}

**Status:** Confirmed formulation/target mismatch; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_27_4-changing-coordinates/top/Default-for-27-4/27-4-3-4-jacobian-transformation-task.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_27_4-changing-coordinates/top/Default-for-27-4/27-4-3-4-jacobian-transformation-task.xml#L8-L10); lines 8–10, 45–77, 133–134.

**Problem:** The stem prints `x={@xexp@}, y={@xexp@}, z={@xexp@}`, giving three identical coordinate functions and determinant zero. The target differentiates distinct internal maps.

**Counterexample:** For all relevant parameters one, the printed map has determinant zero, but the internal map $(u+v-w,v-w,u+w)$ has determinant $3$.

**Fix:** Print `y={@yexp@}` and `z={@zexp@}`.

**Proposed native tests:** Set all parameters to one, inspect the rendered map and accept `3`. Verify displayed and differentiated coordinate functions coincide for all variants.

### H25-06 Randomized cone map contradicts the stated base and apex {#h25-06}

**Status:** Confirmed generator defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_27_4-changing-coordinates/top/Default-for-27-4/27-4-4-2-Integral-over-Cone.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_27_4-changing-coordinates/top/Default-for-27-4/27-4-4-2-Integral-over-Cone.xml#L8-L13); lines 8–13, 136–179.

**Problem:** The stated base is $x^2/4+y^2=1$ and apex height $h\in\{3,4,5\}$. The map uses $x=a(1-w/5)\tau\cos\theta,y=(1-w/5)\tau\sin\theta$ with $a\in\{2,3\}$. At $a=3$ it has the wrong base; at $h=3,4$ the top does not collapse. The transformed integrand also hardcodes $4\cos^2\theta$ instead of $a^2\cos^2\theta$.

**Counterexample:** At $a=3,h=3$, the base x semiaxis is $3$, not $2$, and the top x semiaxis remains $1.2$.

**Fix:** Fix $a=2$ or parameterize the stated base. Replace $5$ by $h$. The parameterized integrand should be $a(1-w/h)^4\tau^3(a^2\cos^2\theta+\sin^2\theta)$.

**Proposed native tests:** For all six parameter pairs, verify the mapped base/apex and that the integrand equals $(x^2+y^2)|J|$ after substitution; test Jacobian and final integral.

### H25-07 Vector-derivative identity retains a constant from one variant {#h25-07}

**Status:** Confirmed mathematical target defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_1-background-to-vector-calculus/top/Default-for-28-1/28-1-2-6-Unknown-scalar-in-vector-calculus-equation.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_1-background-to-vector-calculus/top/Default-for-28-1/28-1-2-6-Unknown-scalar-in-vector-calculus-equation.xml#L8-L10); lines 8–10, 34–37, 93–94.

**Problem:** For $r=(\sin(2bt),\cos(2bt),bt^2)$, $b=1,2,3$, the identity $(1+t^2)|r\prime\prime|^2=c|r\prime|^2$ requires $c=4b^2+1$, but the target is always $5$.

**Counterexample:** $|r\prime|^2=4b^2(1+t^2)$ and $|r\prime\prime|^2=4b^2(4b^2+1)$. Thus $b=2,3$ require $17,37$.

**Fix:** Use `ta1:4*bb^2+1` and update feedback.

**Proposed native tests:** For `bb=1,2,3`, accept `5,17,37` respectively and reject stale `5` in the last two variants.

### H25-08 Curl sign errors produce nonzero divergence of a curl {#h25-08}

**Status:** Confirmed mathematical target defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-6-21-task-on-various-vector-field-calculations.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-6-21-task-on-various-vector-field-calculations.xml#L8-L16); lines 8–16, 68–84.

**Problem:** For $F=(x^ay,-bxz,cyz)$, `ta2k` is $bz+x^a$ rather than $-bz-x^a$. The divergence-of-curl target `ta4:2*bb` should be zero. The curl-of-curl j target subtracts $c$ instead of adding it.

**Counterexample:** At $a=b=c=1$, correct curl is $(z+x,0,-z-x)$, its divergence is zero, and its curl is $(0,2,0)$. The stored targets instead give a positive k component, divergence $2$, and zero j component in the last result.

**Fix:** Set `ta2k:-bb*z-x^aa`, `ta4:0`, `ta5j:aa*x^(aa-1)+cc`; update worked feedback.

**Proposed native tests:** Test all three stages in the all-one variant. Symbolically verify `div(curl(F))=0` across generated parameters.

### H25-09 Curl target contains literal 8 characters in intended products {#h25-09}

**Status:** Confirmed source defect; native compilation impact untested.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-3-15-Curl-of-3-d-vector-fields.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-3-15-Curl-of-3-d-vector-fields.xml#L45-L72); lines 45–72, especially 60.

**Problem:** The target contains `ta1i:3*dd*x*y^(dd-1)8z^ee - 2*cc*x8y8z^(cc-1);`. Three literal `8` characters replace intended multiplication signs. Both general and point targets depend on it.

**Counterexample:** When relevant powers are one, the intended i component is $3xz-2xy$; the source tokens do not encode it. No Maxima compilation was run here.

**Fix:** Replace the three `8` characters by `*`. Include gamma in the later three-dimensional point labels.

**Proposed native tests:** Import/compile in STACK, accept `3*x*z-2*x*y` in the all-one case, and check the substituted-point value.

### H25-10 Cylindrical divergence drops a coefficient and the outer scale factor {#h25-10}

**Status:** Confirmed mathematical/grading defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_3-orthogonal-curvilinear-coordinates/top/Default-for-28-3/28-3-3-6-div-in-cylindrical-polar-coordinates.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_3-orthogonal-curvilinear-coordinates/top/Default-for-28-3/28-3-3-6-div-in-cylindrical-polar-coordinates.xml#L8-L22); lines 8–22, 43–50, 210–211, 244–270.

**Problem:** For $F=(a\rho\cos\phi,-\rho\sin\phi,b\rho z)$, $\partial_z(\rho F_z)=b\rho^2$, but `ta3` omits $b$. The divergence is $(2a-1)\cos\phi+b\rho$, while `ta4` has an extra factor $\rho$. The follow-through branch offers only partial credit for a correct final expression.

**Counterexample:** At $a=b=2$, correct divergence is $3\cos\phi+2\rho$, giving $7$ at $(\rho,\phi)=(2,0)$; the target gives $14$.

**Fix:** Set `ta3:bb*rho^2`, `ta4:(2*aa-1)*cos(phi)+bb*rho`; update feedback.

**Proposed native tests:** Supply all correct intermediate inputs and final symbolic divergence, expecting full credit; include the numerical witness.

### H25-11 Spherical gradient drops the exponent multiplier {#h25-11}

**Status:** Confirmed mathematical target defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_3-orthogonal-curvilinear-coordinates/top/Default-for-28-3/28-3-4-11-spherical-polar-coordinates-grad-questions.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_3-orthogonal-curvilinear-coordinates/top/Default-for-28-3/28-3-4-11-spherical-polar-coordinates-grad-questions.xml#L8-L20); lines 8–20, 61–75, 275–276.

**Problem:** For $f=r^a$, $a=3,\ldots,7$, `ta1r:r^(aa-1)` omits $a$.

**Counterexample:** At $a=3$, correct $3r^2$ is rejected and $r^2$ accepted.

**Fix:** Use `ta1r:aa*r^(aa-1)` and correct feedback.

**Proposed native tests:** For each exponent 3–7, accept the correct radial derivative and zero angular components; reject the coefficient-free expression.

### H25-12 Spherical curl theta component uses the wrong angular variable {#h25-12}

**Status:** Confirmed mathematical target defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_3-orthogonal-curvilinear-coordinates/top/Default-for-28-3/28-3-4-12-Spherical-polar-coordinates-div-and-curl-first-exercise.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_3-orthogonal-curvilinear-coordinates/top/Default-for-28-3/28-3-4-12-Spherical-polar-coordinates-div-and-curl-first-exercise.xml#L8-L13); lines 8–13, 61–69, 240–241.

**Problem:** $F_\phi=br\sin\phi$ requires curl theta component $-(1/r)\partial_r(rF_\phi)=-2b\sin\phi$. The target uses $-2b\sin\theta$.

**Counterexample:** At $\theta=\pi/2,\phi=0$, the correct component is zero, while the target is $-2b$.

**Fix:** Use `ta2theta:-2*bb*sin(phi)` and update feedback.

**Proposed native tests:** Accept `sin(phi)` in this component and reject `sin(theta)`, with correct other components.

### H25-13 Curve endpoints and line-length targets are inconsistent {#h25-13}

**Status:** Confirmed generator/mathematical defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_29_1-line-integrals-involving-vectors/top/Default-for-29-1/29-1-1-3-line-integral-with-constant-scalar-field.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_29_1-line-integrals-involving-vectors/top/Default-for-29-1/29-1-1-3-line-integral-with-constant-scalar-field.xml#L8-L19); lines 8–19, 57–64, 190–225.

**Problem:** The curve $y=x^2/2-\log x/4$ runs from x coordinate $a$ to $a+1$, but endpoint y values remain $1/2$ and $2-\log(b)/4$, with unrelated $b$ possibly negative. The dy target omits the logarithm. The length target $1+1/[4(a+1)]-1/(4a)$ is less than the horizontal extent one.

**Counterexample:** At $a=1,b=2$, endpoints are valid, but target length is $7/8<1$. Correct length is $3/2+\log(2)/4$, and dy integral $3/2-\log(2)/4$.

**Fix:** Derive endpoints and dy from $a$, remove $b$, and use length $a+1/2+\log((a+1)/a)/4$, since the arc-length integrand is $x+1/(4x)$ for $x>0$.

**Proposed native tests:** Check all four $a$ values give real endpoints on the curve and length at least one. Test the exact $a=1$ length and dy integral above.

### H25-14 Gradient and curl line integrals have targets from a different calculation {#h25-14}

**Status:** Confirmed mathematical target defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_29_1-line-integrals-involving-vectors/top/Default-for-29-1/29-1-2-12-line-integrals-of-grad-and-curl-of-a-field.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_29_1-line-integrals-involving-vectors/top/Default-for-29-1/29-1-2-12-line-integrals-of-grad-and-curl-of-a-field.xml#L8-L15); lines 8–15, 61–66, 140–175.

**Problem:** Along $y=ax$ from $(0,0)$ to $(2,2a)$, the integral of $\nabla(x^2y)$ is $8a$, rather than $32/3+(2a)^3/12$. For $F=\nabla\times(\tfrac12x^2y^2k)=(x^2y,-xy^2,0)$, $F\cdot dr=a(1-a^2)x^3\,dx$, so the second integral is $4a(1-a^2)$, rather than $8-(2a)^4/8$.

**Counterexample:** At $a=2$, both targets happen to match $(16,-24)$. At $a=3$, the correct pair is $(24,-96)$ but the stored pair is $(86/3,-154)$.

**Fix:** Use `ta1:8*aa`, `ta2:4*aa*(1-aa^2)` and derive feedback consistently.

**Proposed native tests:** Include $a=2$ with `(16,-24)` and $a=3$ with `(24,-96)`, so the accidentally correct variant cannot conceal the defect.

### H25-15 Cuboid Gauss exercise retains face fluxes from the unit-cube example {#h25-15}

**Status:** Confirmed mathematical target defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_29_3-integral-vector-theorems/top/Default-for-29-3/29-3-2-4-Gauss-Theorem-for-a-cuboid.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_29_3-integral-vector-theorems/top/Default-for-29-3/29-3-2-4-Gauss-Theorem-for-a-cuboid.xml#L8-L118); lines 8–118, 119–175, 1200, 1468, 1736.

**Problem:** For $F=(axz,-y^2,yz)$ on $[0,b]\times[0,c]\times[0,d]$, nonzero face-flux targets remain `1`, `-aa`, `bb` from a different unit-cube problem. The volume-divergence stage is parameterized correctly.

**Counterexample:** At $(a,b,c,d)=(2,1,2,3)$, correct fluxes on $x=b,y=c,z=d$ are $18,-12,6$, summing to $12$. Stored fluxes $1,-2,1$ sum to zero, while the volume stage gives $12$.

**Fix:** Use `ta4int:aa*bb*cc*dd^2/2`, `ta6int:-bb*cc^2*dd`, `ta8int:bb*cc^2*dd/2`; update feedback.

**Proposed native tests:** Test the witness variant and assert the six target face fluxes sum to the volume-divergence target for every generated variant.

### H25-16 Independent-components statement contradicts the supplied joint probability {#h25-16}

**Status:** Confirmed inconsistent formulation; medium priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_35_3-addition-and-multiplication-laws-of-probability/top/Default-for-35-3/35-3-1-5-Circuits-using-probability.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_35_3-addition-and-multiplication-laws-of-probability/top/Default-for-35-3/35-3-1-5-Circuits-using-probability.xml#L8-L9); lines 8–9, 21–31.

**Problem:** The stem states independence but generates the joint probability as `1-(max(aa,bb)+1)/100` rather than the product of marginals. The inclusion-exclusion target follows the joint data, conflicting with independence.

**Counterexample:** At `aa=bb=3`, marginals are $0.97$ and joint $0.96$; independence requires $0.9409$. The two interpretations give union $0.98$ and $0.9991$ respectively.

**Fix:** Remove independence, or generate the joint as the product and update answer precision.

**Proposed native tests:** If independence remains, validate the product identity for every variant and accept the matching union probability under an explicit rounding convention.

### H25-17 First-defect posterior uses the wrong likelihood and is not normalized {#h25-17}

**Status:** Confirmed Bayesian target defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_37_2-the-binomial-distribution/top/Default-for-37-2/37-2-3-10-A-machine-is-built-to-make-mass-produced-items.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_37_2-the-binomial-distribution/top/Default-for-37-2/37-2-3-10-A-machine-is-built-to-make-mass-produced-items.xml#L8-L43); lines 8–43, 88–109, 255–426.

**Problem:** Conditioning on first defect at item $n$, with $n=8,\ldots,15$, requires likelihood $(j/100)(1-j/100)^{n-1}$. The code uses `pdf_binomial(1,15,j/100)`, ignores $n$, computes normalized `anslist` but sets all six targets from unnormalized `L`.

**Counterexample:** The unrounded stored entries sum to approximately $1.35474100096$, not one, and do not change between $n=8$ and $n=15$, though the posterior should change.

**Fix:** Compute geometric likelihoods at the generated index, normalize across the equally likely prior states, then round `anslist` entries. Retain zero posterior for $j=0$ after an observed defect.

**Proposed native tests:** For $n=8,15$, validate unrounded sum one, distinct posterior vectors, and all six correctly rounded native input answers.

### H25-18 Regression fallback swaps slope and intercept {#h25-18}

**Status:** Confirmed false-positive grading; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_43_1-regression/top/Default-for-43-1/43-1-2-6-predict-elasticity.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_43_1-regression/top/Default-for-43-1/43-1-2-6-predict-elasticity.xml#L165-L199); lines 165–199, 505–540.

**Problem:** `ta9` is rounded slope and `ta10` rounded intercept, but the full-credit fallback is `ta9+var*ta10` rather than `ta10+var*ta9`. The second node in `prt11` accepts it.

**Counterexample:** Fixed data give slope $4.659300184\ldots$ and intercept $10.338858195\ldots$. At `var=6`, correct forecast is $38.3$ to three significant figures, but fallback accepts $66.5$.

**Fix:** Use `alternateta11:significantfigures(ta10+var*ta9,3)`.

**Proposed native tests:** At `var=6`, accept `38.3` and reject `66.5`. Retain an appropriate case testing the intended rounded-coefficient tolerance policy.

### H25-19 Two-sided Pearson test marks a one-sided critical value correct {#h25-19}

**Status:** Confirmed statistical target defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_43_2-correlation/top/Default-for-43-2/43-2-1-2-Pearson-r.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_43_2-correlation/top/Default-for-43-2/43-2-1-2-Pearson-r.xml#L61-L76); lines 61–76, 199–243, 464–465.

**Problem:** The explicitly two-sided 5% t test has $n=12$, hence 10 degrees of freedom. The MC target marks $1.812$ correct and $2.228$ incorrect. Required two-sided critical value is approximately $2.228$; $1.812$ is the one-sided value.

**Counterexample:** Correct choice `2.228` is rejected; `1.812` receives full credit.

**Fix:** Mark `2.228` true and `1.812` false; correct feedback and any dependent decision.

**Proposed native tests:** Accept option `2.228`, reject `1.812`, and verify the generated significance conclusion uses the intended two-sided threshold.

### H25-20 Spearman generator makes impossible class ranks and uses the untied formula {#h25-20}

**Status:** Confirmed statistical generator defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_43_2-correlation/top/Default-for-43-2/43-2-1-3-Spearman-R.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_43_2-correlation/top/Default-for-43-2/43-2-1-3-Spearman-R.xml#L8-L82); lines 8–82, 183–229.

**Problem:** Ten students are placed in class order, yet the second rank list can contain 11, duplicates and missing ranks. The target uses $1-6\sum d_i^2/[n(n^2-1)]$, which in this form requires untied rank permutations.

**Counterexample:** Allowed list `(3,5,7,9,11,2,6,8,4,1)` contains rank 11 and omits 10. Other choices repeat ranks.

**Fix:** Generate permutations of 1–10, or generate scores and compute valid average ranks and Pearson correlation of ranks. Recompute the significance decision from generated data and specify the approximation.

**Proposed native tests:** Validate every untied rank list is a permutation of 1–10. If ties are supported, compare with independently computed midrank correlation and the intended significance procedure.

### H25-21 Normal-to-sphere PRT rejects the opposite unit normal {#h25-21}

**Status:** Confirmed false-negative grading; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-1-6-unit-vector-normal-to-sphere.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-1-6-unit-vector-normal-to-sphere.xml#L8-L10); lines 8–10, 26–47.

**Problem:** The stem asks for a unit normal without specifying outward orientation. Only $(a,b,c)/\sqrt{a^2+b^2+c^2}$ is accepted, although its negative is equally valid.

**Counterexample:** Allowed `(aa,bb,cc)=(1,0,0)` gives valid normals `i` and `-i`; the latter is rejected.

**Fix:** Ask explicitly for the outward normal, or accept both consistent whole-vector orientations. Do not allow independent component signs.

**Proposed native tests:** With the current stem, accept both opposite normals. For a general vector, reject changing only some nonzero component signs.

### H25-22 Supplementary-angle target mixes degrees and radians {#h25-22}

**Status:** Confirmed mathematical/grading defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-1-7-Angle-between-curves-by-normal-vector.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_28_2-differential-vector-calculus/top/Default-for-28-2/28-2-1-7-Angle-between-curves-by-normal-vector.xml#L32-L46); lines 32–46.

**Problem:** The alternative full-credit target computes $(180-\arccos(c))180/\pi$ instead of $180-\arccos(c)180/\pi$, allowing an angle over ten thousand degrees and rejecting the acute angle.

**Counterexample:** At `aa=2`, intersection is $(1,1)$, with acute angle about $71.565^\circ$ and obtuse supplement $108.435^\circ$. The bad alternative is about $10204.8^\circ$.

**Fix:** Set `ta2:180-ta1`. Specify the acute angle, or intentionally accept the legitimate supplementary pair.

**Proposed native tests:** At `aa=2`, accept `71.6` to three significant figures under the acute convention and reject the five-digit degree value. Test the rounded obtuse answer too if both conventions remain allowed.

### H25-23 Prism randomization produces negative mass and mixes moment bounds {#h25-23}

**Status:** Confirmed generator defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_27_3-volume-integrals/top/Default-for-27-3/27-3-4-9-Quarter-Cylinder-MoI-and-CoM-exercise.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_27_3-volume-integrals/top/Default-for-27-3/27-3-4-9-Quarter-Cylinder-MoI-and-CoM-exercise.xml#L35-L102); lines 35–102. Related [samplequestions/stacklibrary/HELM/Course_quiz_27_3-volume-integrals/top/Default-for-27-3/27-3-2-11-volume-of-quarter-cylinder-exercise.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_27_3-volume-integrals/top/Default-for-27-3/27-3-2-11-volume-of-quarter-cylinder-exercise.xml), lines 29–39.

**Problem:** Mass integrates over $z:0\ldots6$, $y:0\ldots4-x^2$, $x:0\ldots a$ with $a=2,3,4$. For $x>2$, y bounds reverse. The x first moment additionally hardcodes upper bound 2 while mass and other moments use $a$. The embedded diagram was not rendered.

**Counterexample:** At $a=4$, nominal unit-density mass is $6(4a-a^3/3)=-32$. The hardcoded x first moment is 24, giving centre-of-mass x coordinate $-3/4$ outside the nonnegative x region. The related volume exercise allows $a=3$, also reversing the bounds.

**Fix:** Constrain $a\le2$ or redesign the region consistently, for example with boundary $y=a^2-x^2$. Derive every moment from exactly the same physical region and review the diagram.

**Proposed native tests:** Require positive mass and centre of mass within the region for every variant; check all moment bounds agree and verify alternative orders of integration over the physical region.

### H25-24 Vector line-integral targets retain one parameter value {#h25-24}

**Status:** Confirmed mathematical target defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_29_1-line-integrals-involving-vectors/top/Default-for-29-1/29-1-4-20-vector-line-integral-exercise.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_29_1-line-integrals-involving-vectors/top/Default-for-29-1/29-1-4-20-vector-line-integral-exercise.xml#L8-L19); lines 8–19, 41–48.

**Problem:** Divergence is $1+x$ and $r(t)=(at,t^2,b-t)$ for $0\le t\le1$, giving vector integral $(a+a^2/2,1+2a/3,-1-a/2)$. Stored target $(2a,7/3,-2)$ agrees only at $a=2$.

**Counterexample:** At $a=3$, correct vector is $(15/2,3,-5/2)$; target is $(6,7/3,-2)$.

**Fix:** Derive components from the generated path and divergence. Repair displayed `xy2` to the intended exponent notation.

**Proposed native tests:** Test all components at $a=2,3$. Verify changing `bb` does not affect the result.

### H25-25 Triangle vector surface integral has an extra scale factor {#h25-25}

**Status:** Confirmed mathematical target defects; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_29_2-surface-and-volume-integrals/top/Default-for-29-2/29-2-1-3-triangle-surface-integral.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_29_2-surface-and-volume-integrals/top/Default-for-29-2/29-2-1-3-triangle-surface-integral.xml#L8-L12); lines 8–12, 55–67.

**Problem:** Vertices $(0,0,4b),(0,2b,0),(b,0,0)$ lie on $z=4b-4x-2y$, giving vector area element $\pm(4,2,1)dx\,dy$, independent of $b$. Targets multiply the projected integral of $axy$ by $b(4,2,1)$, adding an extra factor. Both orientation branches use the wrong scale.

**Counterexample:** At $a=1,b=2$, projected integral is $8/3$ and correct vector $\pm(32/3,16/3,8/3)$; targets are twice these vectors.

**Fix:** Remove `bb` from `tai,taj,tak` and use vector-area notation in the stem.

**Proposed native tests:** Check $b=1,2,3$ and both consistent orientations if allowed. At $a=1,b=2$, accept the correct vector and reject the doubled vector.

### H25-26 At-least-four breakdown probability is graded as at-least-five {#h25-26}

**Status:** Confirmed mathematical target defect; high priority.

**Source:** [samplequestions/stacklibrary/HELM/Course_quiz_37_3-the-poisson-distribution/top/Default-for-37-3/(not-in-quiz)-37-3-3-7-The-Poisson-Process-Machine-breakdowns.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/HELM/Course_quiz_37_3-the-poisson-distribution/top/Default-for-37-3/%28not-in-quiz%29-37-3-3-7-The-Poisson-Process-Machine-breakdowns.xml#L8-L16); lines 8–16, 33–41.

**Problem:** The third target is $P(N<5)$ under the Poisson approximation. The fourth is one minus that rounded target, hence $P(N\ge5)$, while the prompt asks for at least four.

**Counterexample:** Allowed $p=0.002,m=500$ gives $\lambda=1$. Correct Poisson $P(N\ge4)\approx0.01899$; target $P(N\ge5)\approx0.00366$.

**Fix:** Use `1-cdf_poisson(3,lambda)` and round only at the end. Explicitly state the Poisson approximation if the exact binomial model is not intended.

**Proposed native tests:** Under that convention, accept `0.01899` and reject `0.00366` in the witness variant. Check the threshold identity $P(N\ge4)=1-P(N\le3)$.

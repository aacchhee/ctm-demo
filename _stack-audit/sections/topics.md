## Topics collection

All 174 records received static source screening of mathematical content, variables, targets and PRTs, with full relevant paths inspected for candidate defects. Diagrams and native STACK/Maxima grading were not executed. TOP-04 was withdrawn after checking actual graph-root semantics; IDs are deliberately not renumbered. TOP-08 and TOP-09 are conditional domain clarifications rather than confirmed rejection claims.

### TOP-01: Circle target uses x for both coordinates {#top-01}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [Conics-1-find-circle-given-centre-and-a-point.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Conics/Conics-1-find-circle-given-centre-and-a-point.xml)

**Problem and witness.** The target at line 29 is (x-a)^2+(x-b)^2=25. Its second coordinate should be y. For centre (2,-1), the required circle is (x-2)^2+(y+1)^2=25, not the one-variable keyed relation.

**Proposed repair.** Replace the second x by y and derive the radius from the same displayed data.

**Regression cases to add.** Accept the corrected circle and its expanded equivalent; reject the old target.

### TOP-02: Initial conditions are graded without an ODE residual {#top-02}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [2nd-Order-ODE-3-real-repeated-BC.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/2nd-Order-Differential-Equations/2nd-Order-ODE-3-real-repeated-BC.xml)

**Problem and witness.** The relevant Result2 path (line 185) awards 0.5 for each initial condition. For the allowed assignment n1=2,n2=2,AA=2,BB=2, the correct solution is (2+2*t)*exp(2*t), and the initial data are y(0)=2,y'(0)=6. The wrong tangent line 2+6*t satisfies both and can earn full PRT credit. For the normalized equation y''-4*y'+4*y=0 its residual is -16+24*t; for the displayed equation with n1=2 it is -32+48*t.

**Proposed repair.** Require the differential equation residual to vanish as well as both initial conditions.

**Regression cases to add.** Reject 2+6*t; accept (2+2*t)*exp(2*t) and equivalent forms. Test each failed condition separately.

### TOP-03: Orthogonal diagonalisation does not require an orthogonal matrix {#top-03}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [Eigenvalues-vectors-PDPT.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/LinearAlgebra/EigenVectVal/Eigenvalues-vectors-PDPT.xml)

**Problem and witness.** The prt2 path near line 361 gives 0.8 for P^T*A*P=D and 0.2 for diagonal D, without requiring P^T*P=I. Entering zero 3×3 matrices for P and D satisfies both algebraic conditions; the matrix inputs impose the required size but no nonsingularity or orthogonality gate. If U is a genuine orthogonal eigenbasis, P=2*U,D=4*D0 also satisfies the congruence identity with diagonal D but is not an orthogonal diagonalisation. This concerns that PRT, not all independently graded earlier parts.

**Proposed repair.** Make orthogonality a necessary gate, then check the diagonalisation and eigenvalue correspondence.

**Regression cases to add.** Reject zero matrices and scaled nonorthogonal bases; accept reordered orthonormal eigenvectors with matching D.

### TOP-05: Two directions in a plane need not span it {#top-05}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [Find-vector-parametric-equation-for-plane-given-three-points.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/LinearAlgebra/Vector-Spaces/Find-vector-parametric-equation-for-plane-given-three-points.xml)

**Problem and witness.** The PRT near line 86 checks membership of two directions without enforcing independence. With d=p2-p1, p1+t*d+s*d stays on the plane but covers only a line, not the required plane.

**Proposed repair.** Require rank two of the direction matrix, along with membership and a valid base point.

**Regression cases to add.** Reject directions d,d and d,2*d; accept any independent pair spanning the same plane.

### TOP-06: Empty set is incorrectly excluded as a proper subset {#top-06}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [Subset_1.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Sets/Subset_1.xml)

**Problem and witness.** The prompt asks for a proper subset of a nonempty set A, but the PRT at line 81 excludes the empty set. The empty set is a proper subset of every nonempty A.

**Proposed repair.** Accept the empty set, or explicitly ask for a nonempty proper subset.

**Regression cases to add.** Accept {} under the current wording, reject A itself, and test other genuine proper subsets.

### TOP-07: A valid antiderivative is rejected as an unstated form violation {#top-07}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [Int_Quotient_1.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/Integration/Int_Quotient_1.xml)

**Problem and witness.** The tree near line 89 routes an EqualComAss match to terminal zero with wrong-form feedback before reaching the integration test. The stored correctanswer2=intf+c is a valid antiderivative, yet the prompt does not impose that form restriction.

**Proposed repair.** Remove the rejection or state the pedagogical form requirement explicitly and distinguish it from mathematical correctness.

**Regression cases to add.** Test the literal stored primitive, its expanded equivalent, and an actually incorrect derivative in native STACK.

### TOP-08: Separable-ODE family needs an explicit constant domain {#top-08}

**Status:** Clarification of wording, domain or convention. Native execution has not been performed.

**Source:** [1st-Order-ODE-2-sep.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/First-Order-ODE/1st-Order-ODE-2-sep.xml)

**Problem and witness.** The primary model is already `c*exp(-sqrt(n1-x^2))-n2`, which covers positive, negative and zero coefficients for real c. It must not be described as omitting those real branches. The alternative model `exp(c-sqrt(n1-x^2))-n2` covers only positive coefficients when c is real. Worked feedback moves between the additive constant in the exponent and the multiplicative constant using the same letter, without explaining that reparameterisation or the missing sign/zero cases in the exponential-only representation. With n1=4,n2=2, `-exp(-sqrt(4-x^2))-2` is a real branch, and `y=-2` is an equilibrium; both are already represented by the primary model. The source uses `assumereal:0`, so complex constants further affect interpretation. This is a clarification of the worked derivation, not a confirmed model-completeness or grading defect.

**Proposed repair.** Distinguish the additive integration constant from the arbitrary real multiplier C; include C=0, and state the real interval `|x|<sqrt(n1)` on which separation is performed. Retain the existing primary model.

**Regression cases to add.** Test positive, negative and zero coefficients with the actual native PRT, including feedback-variable evaluation for the equilibrium. Verify the explanation distinguishes the two constant conventions. No runtime outcome is asserted.

### TOP-09: Tanh ODE model leaves real solution branches implicit {#top-09}

**Status:** Clarification of wording, domain or convention. Native execution has not been performed.

**Source:** [Differential_Equation_3.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/First-Order-ODE/Differential_Equation_3.xml)

**Problem and witness.** For y'=(n2+x^2)*(n1-y^2), a real-constant tanh family covers the interior branch but not the real coth branches or equilibria ±sqrt(n1). For n1=4,n2=2, y=2*coth(2*(2*x+x^3/3+c)) is a real solution on intervals away from its poles. Complex shifts relate the hyperbolic forms, and a residual fallback may accept these responses. No unconditional grading rejection is asserted.

**Proposed repair.** State the real solution domain and constant convention; list equilibrium and other branches, or explain the wider complex-parameter representation.

**Regression cases to add.** Check tanh, coth and both equilibria on valid intervals, using the actual native PRT and input assumptions.

### TOP-10: Two symbol names do not establish two independent arbitrary constants {#top-10}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [ODE_2nd_order_linear.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/2nd-Order-Differential-Equations/ODE_2nd_order_linear.xml), [2nd-Order-ODE-1-real-distinct.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/2nd-Order-Differential-Equations/2nd-Order-ODE-1-real-distinct.xml), [2nd-Order-ODE-3-real-repeated-BC.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/2nd-Order-Differential-Equations/2nd-Order-ODE-3-real-repeated-BC.xml), [2nd-Order-ODE-2-undamped-complex.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Calculus/2nd-Order-Differential-Equations/2nd-Order-ODE-2-undamped-complex.xml)

**Problem and witness.** Counting two symbols and obtaining symbolic initial values does not prove the family is general. If u,v form a fundamental solution pair, (A+B)*u+(A+B)^2*v solves the ODE but has only one effective parameter: its coefficients lie on beta=alpha^2. In the undamped tree, the extra gate adds zero on both branches, preserving prior credit even for (A+B)*cos(n2*t). Relevant gates are near lines 83,84,99,87 respectively.

**Proposed repair.** Check that the parameter family covers independent initial data, with appropriate handling of equivalent parameterisations. Rank two of the parameter-to-initial-data map is a useful local independence check, but alone does not prove global coverage of all intended real initial data. Avoid equating two symbol names with two independent constants.

**Regression cases to add.** Accept A*u+B*v and invertible changes of constants; reject the one-effective-parameter family and the one-mode cosine example.

### TOP-11: Different matrix pair is interpreted as both factors individually different {#top-11}

**Status:** Clarification of wording, domain or convention. Native execution has not been performed.

**Source:** [Matrix-Algebra-give-examples.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/LinearAlgebra/Matrix-Calculations/Matrix-Algebra-give-examples.xml)

**Problem and witness.** The prompt asks for a different pair C,D, but the gate at line 328 rejects C=A OR D=B. If A=diag(1,0),B=diag(0,1), then C=A,D=2*B is a different pair and retains zero product, but is rejected solely because C=A.

**Proposed repair.** Reject only the identical ordered pair, or explicitly require each corresponding factor to change.

**Regression cases to add.** Test a valid changed pair sharing its first factor, a pair sharing its second factor, and the original pair.

### TOP-12: Logarithm simplification silently assumes a positive base variable {#top-12}

**Status:** Source-proven mathematical or grading mismatch. Native execution has not been performed.

**Source:** [Logs_1.xml](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Topics/Logs-and-Exponentials/Logs_1.xml)

**Problem and witness.** The target at line 27 uses n*ln(x)/a for the logarithm of x^n, without stating x>0. For even n, negative x may be permitted by the original expression: n=2,x=-1 gives original value 0, while ln(-1) is not real. No positive-variable assumption supplies the missing restriction.

**Proposed repair.** State x>0, or use ln(abs(x)) on the applicable real domain and handle the parameterised base correctly.

**Regression cases to add.** Test positive x, a negative x with even n, and zero/domain exclusions under the stated assumptions.


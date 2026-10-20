## Demonstrations, documentation and input examples

Static screen of all 166 non-category records outside the principal mathematical collections. Prompts, variables, answer definitions and PRTs were screened; candidate full source was inspected. Technical browser behavior and external Meclib dependencies were not executed. Deliberate UI demonstrations and manual-marking fields are not treated as broken merely because they lack mathematical automatic grading.

### GEN-01: Non-square matrix exercise retains full credit for wrong square matrices {#gen-01}

*source-proven; native execution not performed.*

Node 0 assigns score 1 when the first matrix IS square, despite the non-square requirement. Later product-failure feedback subtracts zero, leaving that credit in place.

**Counterexample/evidence.** Enter a 2x2 identity matrix as ans1 and a 2x2 all-zero matrix as ans2. The unique-root path is T,T,T,F, with score updates =1,+0,+0,-0. The product is zero, not the required identity. Input shape/type options do not prevent this. Existing qtest 2 also expects full credit for the square pair I,I.

**Proposed repair.** Make both non-square conditions mandatory gates and award credit only after the compatible product equals I.

**Regression cases to add.** Reject I,0 and square I,I; accept the supplied rectangular 2x4 and 4x2 factors.

[Pinned source: samplequestions/stacklibrary/Features/input-type-sample-questions/Matrix_varmatrix.xml:96](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Features/input-type-sample-questions/Matrix_varmatrix.xml#L96)

### GEN-02: Other-reason option earns credit before the answer or reason is checked {#gen-02}

*source-proven; native execution not performed.*

Choosing the other-reason option in prt5 adds 1 and jumps to node 3, bypassing the convergence choice ans5. A failed reason at node 3 subtracts zero.

**Counterexample/evidence.** Choose Yes (the divergent series converges), select some other reason, and enter banana. Node 0 adds 1; node 3 fails and subtracts 0. This is full credit for the convergence/reason PRT, not the whole multipart question.

**Proposed repair.** Gate every reason route on the correct convergence choice; add reason credit only when a reason passes. Avoid presenting keyword matching as verification of a mathematical proof.

**Regression cases to add.** Yes + other + banana must receive 0; No + valid reason should receive intended credit; No + banana must not receive full credit.

[Pinned source: samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/Free-text-input/Free-text_with_regex.xml:420](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/Free-text-input/Free-text_with_regex.xml#L420)

### GEN-03: Manually graded proof prompt is incomplete and its model contains a false equality {#gen-03}

*source-proven; native execution not performed.*

Part (b) ends after the words sum of the squares of any two consecutive odd, omitting the proposition. The model also writes 8*n^2+2=2*(n^2+1).

**Counterexample/evidence.** At n=1 the two sides are 10 and 4. The correct factorisation is 2*(4*n^2+1).

**Proposed repair.** Complete the claim with numbers is even and fix the model factorisation.

**Regression cases to add.** Render the full prompt and check every equality in the proof.

[Pinned source: samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/Free-text-input/Free-text_manually_graded_with_equiv.xml:14](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/Free-text-input/Free-text_manually_graded_with_equiv.xml#L14)

### GEN-04: Free-text calculus model declares the wrong substitution {#gen-04}

*source-proven; native execution not performed.*

The model sets u=x^2+1, then writes du/dx=4x and replaces sqrt(2*x^2+1) by sqrt(u). The intended substitution is u=2*x^2+1.

**Counterexample/evidence.** d(x^2+1)/dx=2x, not 4x. At x=1 the declared square root is sqrt(2), while the original denominator is sqrt(3). The final primitive 4*sqrt(2*x^2+1)+1 is correct.

**Proposed repair.** Change the declaration to u=2*x^2+1.

**Regression cases to add.** Check du/dx=4x and the transformed denominator, while preserving the correct final primitive.

[Pinned source: samplequestions/stacklibrary/Features/input-type-sample-questions/Free-text_final_answer.xml:34](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Features/input-type-sample-questions/Free-text_final_answer.xml#L34)

### GEN-05: Logic prompt says nor while the operator gate permits not {#gen-05}

*source-proven; native execution not performed.*

Both prompt and failure feedback allow and, or and nor. The whitelist is nounnot,nounor,nounand, which permits NOT, OR and AND.

**Counterexample/evidence.** The model for A implies B uses not A or B, but not is absent from the stated permitted operations.

**Proposed repair.** Replace nor by not in the prompt and feedback, or explicitly implement and document NOR syntax consistently.

**Regression cases to add.** Make the instruction, model and whitelist agree.

[Pinned source: samplequestions/stackdemo/60_logic.xml:15](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stackdemo/60_logic.xml#L15)

### GEN-06: Logarithm syntax feedback asserts an equivalence without its domain restriction {#gen-06}

*source-proven; native execution not performed.*

Feedback calls 2*ln(x-1) equivalent to ln((x-1)^2) without stating x>1.

**Counterexample/evidence.** At x=0, ln((x-1)^2)=0 but ln(x-1) is not real. The identity is also not unconditional for complex principal logarithms.

**Proposed repair.** Use 2*ln(abs(x-1)) for real x!=1, or explicitly restrict x>1.

**Regression cases to add.** Review x=0 and x=2 and preserve the original domain.

[Pinned source: samplequestions/stacklibrary/Syntax_practice/Syntax-Logarithms.xml:12](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Syntax_practice/Syntax-Logarithms.xml#L12)

### GEN-07: Units example asks for a force but grades an acceleration {#gen-07}

*source-proven; native execution not performed.*

The prompt asks for the force of gravity, but its target is 9.81*m*s^-2 and no mass is supplied.

**Counterexample/evidence.** Force has dimensions kg*m/s^2. A 2 kg body near Earth has weight about 19.62 N, while 9.81 m/s^2 is acceleration.

**Proposed repair.** Ask for gravitational acceleration near Earth, or supply a mass and grade mg in newtons.

**Regression cases to add.** Match the dimensions in the prompt, model and units test.

[Pinned source: samplequestions/stacklibrary/Features/input-type-sample-questions/Units.xml:8](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Features/input-type-sample-questions/Units.xml#L8)

### GEN-08: Induction feedback was copied from a different sequence {#gen-08}

*source-proven; native execution not performed.*

The problem proves the sum-of-cubes formula, but diagnostic strings tell the learner to substitute s_k=k*2^k and target (k+1)*2^(k+1).

**Counterexample/evidence.** At k=2 the sum of cubes is 9, while k*2^k is 8.

**Proposed repair.** Use the sum-of-cubes induction hypothesis and k+1 statement in both feedback strings; reconcile the step_setup key with the actual intro_k key.

**Regression cases to add.** Trigger the missing-previous-line diagnostics and check that formulas concern the current theorem.

[Pinned source: samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/ParsonsProof/Parsons-3-builder.xml:79](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/ParsonsProof/Parsons-3-builder.xml#L79)

### GEN-09: DAG proof failure feedback misspells the proof-step variable {#gen-09}

*source-proven; native execution not performed.*

The failure branch calls proof_dag_problem_display(saprob,poof_steps), while the defined dictionary is proof_steps.

**Counterexample/evidence.** An answer violating a DAG dependency reaches feedback with the unbound symbol poof_steps. The variable mismatch is definite; its native diagnostic consequence still needs testing.

**Proposed repair.** Correct the variable name and exercise a failure path.

**Regression cases to add.** A premature conclusion should produce readable feedback without an evaluation error.

[Pinned source: samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/ParsonsProof/Parsons-4-DAG-Proof.xml:127](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/ParsonsProof/Parsons-4-DAG-Proof.xml#L127)

### GEN-10: Polar-ellipse explanation equates the negative x vertex with r {#gen-10}

*source-proven; native execution not performed.*

The explanation says r=x at both vertices. At theta=pi one has x=-r. The stored vertex coordinates use the correct negative sign.

**Counterexample/evidence.** For e=1/2,d=4, the pi vertex has r=4/3 and x=-4/3.

**Proposed repair.** Use x=r*cos(theta), with the correct signs at 0 and pi.

**Regression cases to add.** Check both vertices in the worked explanation.

[Pinned source: samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/JSXgraphs/JSXGraph-examples/Conics-and-Polar-Coordinates/Ellipse_polar_form-ellipsis_vertices.xml:21](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/JSXgraphs/JSXGraph-examples/Conics-and-Polar-Coordinates/Ellipse_polar_form-ellipsis_vertices.xml#L21)

### GEN-11: Draggable slope example divides by zero on the y-axis {#gen-11}

*runtime check needed; native execution not performed.*

Feedback variables immediately evaluate ans1[2]/ans1[1], with no guard when the draggable point has x=0.

**Counterexample/evidence.** A=[0,1] forms 1/0; A=[0,0] forms 0/0. This is a source-level runtime-risk candidate; the exact STACK response has not been observed.

**Proposed repair.** Require a nonzero point and compare yA=slope*xA without division; explain that A=O does not define a line.

**Regression cases to add.** Both y-axis cases should yield normal incorrect feedback; [2,2*slope] should pass.

[Pinned source: samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/JSXgraphs/Author_quickstart_Line_parallel_to_graph.xml:99](https://github.com/maths/moodle-qtype_stack/blob/33383047af39c204bf4442802a058f8b918b2b1b/samplequestions/stacklibrary/Doc-Examples/Specialist-Tools-Docs/JSXgraphs/Author_quickstart_Line_parallel_to_graph.xml#L99)



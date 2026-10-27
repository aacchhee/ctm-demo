```{math-exercise}
#| label: lund-eigenvectors
#| caption: Two eigenvalues with corresponding eigenvectors
#| mode: custom
#| field-labels: larger eigenvalue λ₁, first coordinate of v₁, second coordinate of v₁, smaller eigenvalue λ₂, first coordinate of v₂, second coordinate of v₂
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 6:
#|           return {"score": 0, "feedback": "Enter two eigenvalues and two coordinates for each eigenvector."}
#|       if any(z.free_symbols or z.is_real is not True or z.is_finite is not True for z in values):
#|           return {"score": 0, "feedback": "Use specific, finite real numbers."}
#|       A = Matrix([[2, 1], [1, 2]])
#|       checks = []
#|       messages = []
#|       for i, target in enumerate((3, 1)):
#|           lam = values[3*i]
#|           v = Matrix(values[3*i+1:3*i+3])
#|           eigenvalue_ok = simplify(lam-target) == 0
#|           nonzero = any(simplify(z) != 0 for z in v)
#|           eigenvector_ok = nonzero and all(simplify(z) == 0 for z in A*v-lam*v)
#|           checks.extend([eigenvalue_ok, eigenvalue_ok and eigenvector_ok])
#|           if not eigenvalue_ok:
#|               messages.append(f"Pair {i+1}: check the eigenvalue and decreasing order.")
#|           elif not nonzero:
#|               messages.append(f"Pair {i+1}: the zero vector is not an eigenvector.")
#|           elif not eigenvector_ok:
#|               messages.append(f"Pair {i+1}: check that Av = λv for your eigenvalue and vector.")
#|           else:
#|               messages.append(f"Pair {i+1}: the eigenvalue and eigenvector are correct.")
#|       return {"score": sum(checks)/4, "show_score": False, "feedback": " ".join(messages)}

For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, enter $\lambda_1>\lambda_2$
and nonzero vectors satisfying $Av_i=\lambda_i v_i$.

Larger eigenvalue: $\lambda_1=$ __[3]

A corresponding eigenvector: $v_1=$ vec[1,1]

Smaller eigenvalue: $\lambda_2=$ __[1]

A corresponding eigenvector: $v_2=$ vec[1,-1]
```
